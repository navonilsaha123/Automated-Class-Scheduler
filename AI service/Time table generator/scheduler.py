from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass

from constants import DAYS, FREE_LABEL, TIME_SLOTS
from models import DepartmentInput, DepartmentPreview, SlotPreview, TimetableRequest


class ScheduleValidationError(ValueError):
    pass


@dataclass(frozen=True)
class SubjectJob:
    id: int | None
    name: str
    type: str
    periods_per_week: int


def build_department_previews(request: TimetableRequest) -> list[DepartmentPreview]:
    previews: list[DepartmentPreview] = []

    if not request.departments:
        raise ScheduleValidationError("At least one department is required to generate a timetable.")

    for department in request.departments:
        previews.append(_build_department_preview(department))

    return previews


def _build_department_preview(department: DepartmentInput) -> DepartmentPreview:
    jobs = [
        SubjectJob(
            id=subject.id,
            name=subject.name,
            type=subject.type,
            periods_per_week=subject.periodsPerWeek,
        )
        for subject in department.subjects
    ]

    if not jobs:
        raise ScheduleValidationError(
            f"Department '{department.name}' has no subjects. Add subjects before generating a timetable."
        )

    total_periods = sum(job.periods_per_week for job in jobs)
    if total_periods > len(DAYS) * len(TIME_SLOTS):
        raise ScheduleValidationError(
            f"Department '{department.name}' needs {total_periods} periods per week, which exceeds the 40 available slots."
        )

    for job in jobs:
        if job.type == "LAB" and job.periods_per_week % 2 != 0:
            raise ScheduleValidationError(
                f"Lab subject '{job.name}' in department '{department.name}' must have an even number of periods per week."
            )

    grid: list[list[str | None]] = [[None for _ in TIME_SLOTS] for _ in DAYS]

    _place_labs(grid, jobs, department.name)
    _place_theory(grid, jobs, department.name)
    _fill_free_slots(grid)

    summary = {
        "totalSubjects": len(jobs),
        "theorySubjects": sum(1 for job in jobs if job.type == "THEORY"),
        "labSubjects": sum(1 for job in jobs if job.type == "LAB"),
        "scheduledPeriods": total_periods,
        "freePeriods": (len(DAYS) * len(TIME_SLOTS)) - total_periods,
    }

    slots = []
    for slot in TIME_SLOTS:
        entries = {
            DAYS[day_index]: grid[day_index][slot["index"]] or FREE_LABEL
            for day_index in range(len(DAYS))
        }
        slots.append(
            SlotPreview(
                slotCode=slot["code"],
                time=slot["time"],
                entries=entries,
            )
        )

    return DepartmentPreview(
        departmentId=department.id,
        departmentName=department.name,
        slots=slots,
        summary=summary,
    )


def _place_labs(grid: list[list[str | None]], jobs: list[SubjectJob], department_name: str) -> None:
    lab_jobs = sorted(
        (job for job in jobs if job.type == "LAB"),
        key=lambda item: (-item.periods_per_week, item.name.lower()),
    )

    valid_starts = [0, 1, 2, 4, 5, 6]

    for job in lab_jobs:
        block_count = job.periods_per_week // 2

        for _ in range(block_count):
            candidate = None
            candidate_score = None

            for day_index in range(len(DAYS)):
                if _day_has_subject(grid, day_index, job.name):
                    continue

                for start_index in valid_starts:
                    if not _can_place_lab_block(grid, day_index, start_index):
                        continue

                    score = (
                        _day_load(grid, day_index),
                        _day_lab_count(grid, day_index),
                        start_index,
                    )
                    if candidate is None or score < candidate_score:
                        candidate = (day_index, start_index)
                        candidate_score = score

            if candidate is None:
                raise ScheduleValidationError(
                    f"Could not place lab subject '{job.name}' for department '{department_name}' without breaking the timetable rules."
                )

            day_index, start_index = candidate
            grid[day_index][start_index] = job.name
            grid[day_index][start_index + 1] = job.name


def _place_theory(grid: list[list[str | None]], jobs: list[SubjectJob], department_name: str) -> None:
    theory_jobs = sorted(
        (job for job in jobs if job.type == "THEORY"),
        key=lambda item: (-item.periods_per_week, item.name.lower()),
    )

    remaining = {job.name: job.periods_per_week for job in theory_jobs}

    while any(count > 0 for count in remaining.values()):
        progress_made = False

        for job in theory_jobs:
            if remaining[job.name] <= 0:
                continue

            candidate = _best_theory_slot(grid, job)
            if candidate is None:
                candidate = _best_theory_slot(grid, job, relaxed=True)

            if candidate is None:
                raise ScheduleValidationError(
                    f"Could not place theory subject '{job.name}' for department '{department_name}'. Try reducing periods per week."
                )

            day_index, slot_index = candidate
            grid[day_index][slot_index] = job.name
            remaining[job.name] -= 1
            progress_made = True

        if not progress_made:
            break


def _best_theory_slot(
    grid: list[list[str | None]], job: SubjectJob, relaxed: bool = False
) -> tuple[int, int] | None:
    candidate = None
    candidate_score = None

    for day_index in range(len(DAYS)):
        subject_day_count = _day_subject_count(grid, day_index, job.name)
        if not relaxed and subject_day_count >= 2:
            continue
        if relaxed and subject_day_count >= 3:
            continue

        for slot_index in range(len(TIME_SLOTS)):
            if grid[day_index][slot_index] is not None:
                continue
            if not _can_place_theory(grid, day_index, slot_index, job.name, relaxed):
                continue

            score = (
                subject_day_count,
                _day_load(grid, day_index),
                _adjacency_penalty(grid, day_index, slot_index, job.name),
                slot_index,
            )

            if candidate is None or score < candidate_score:
                candidate = (day_index, slot_index)
                candidate_score = score

    return candidate


def _can_place_lab_block(grid: list[list[str | None]], day_index: int, start_index: int) -> bool:
    end_index = start_index + 1
    if end_index >= len(TIME_SLOTS):
        return False
    if TIME_SLOTS[start_index]["half"] != TIME_SLOTS[end_index]["half"]:
        return False
    if grid[day_index][start_index] is not None or grid[day_index][end_index] is not None:
        return False
    return True


def _can_place_theory(
    grid: list[list[str | None]],
    day_index: int,
    slot_index: int,
    subject_name: str,
    relaxed: bool,
) -> bool:
    previous_value = grid[day_index][slot_index - 1] if slot_index > 0 else None
    next_value = grid[day_index][slot_index + 1] if slot_index < len(TIME_SLOTS) - 1 else None

    if previous_value == subject_name and next_value == subject_name:
        return False

    if not relaxed:
        if previous_value == subject_name:
            before_previous = grid[day_index][slot_index - 2] if slot_index > 1 else None
            if before_previous == subject_name:
                return False
        if next_value == subject_name:
            after_next = grid[day_index][slot_index + 2] if slot_index < len(TIME_SLOTS) - 2 else None
            if after_next == subject_name:
                return False

    return True


def _fill_free_slots(grid: list[list[str | None]]) -> None:
    for day_index in range(len(DAYS)):
        for slot_index in range(len(TIME_SLOTS)):
            if grid[day_index][slot_index] is None:
                grid[day_index][slot_index] = FREE_LABEL


def _day_load(grid: list[list[str | None]], day_index: int) -> int:
    return sum(1 for value in grid[day_index] if value is not None)


def _day_lab_count(grid: list[list[str | None]], day_index: int) -> int:
    labels = [value for value in grid[day_index] if value is not None]
    counts = defaultdict(int)
    for value in labels:
        counts[value] += 1
    return sum(1 for count in counts.values() if count >= 2)


def _day_subject_count(grid: list[list[str | None]], day_index: int, subject_name: str) -> int:
    return sum(1 for value in grid[day_index] if value == subject_name)


def _day_has_subject(grid: list[list[str | None]], day_index: int, subject_name: str) -> bool:
    return any(value == subject_name for value in grid[day_index])


def _adjacency_penalty(
    grid: list[list[str | None]], day_index: int, slot_index: int, subject_name: str
) -> int:
    penalty = 0
    if slot_index > 0 and grid[day_index][slot_index - 1] == subject_name:
        penalty += 1
    if slot_index < len(TIME_SLOTS) - 1 and grid[day_index][slot_index + 1] == subject_name:
        penalty += 1
    return penalty

