from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from excel_export import export_timetable_workbook
from models import DepartmentPreview, TimetablePreview


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "outputs"


def create_generation(
    institute_id: int | None,
    institute_name: str,
    departments: list[DepartmentPreview],
) -> TimetablePreview:
    generation_id = uuid4().hex
    generation_dir = OUTPUT_DIR / generation_id
    generation_dir.mkdir(parents=True, exist_ok=True)

    created_at = datetime.now(timezone.utc)
    excel_path = generation_dir / "timetable.xlsx"
    export_timetable_workbook(excel_path, institute_name, departments)

    preview = TimetablePreview(
        generationId=generation_id,
        instituteId=institute_id,
        instituteName=institute_name,
        createdAt=created_at,
        departments=departments,
        excelDownloadUrl=f"/api/timetables/{generation_id}/download",
    )

    preview_path = generation_dir / "preview.json"
    preview_path.write_text(preview.model_dump_json(indent=2), encoding="utf-8")
    return preview


def load_generation(generation_id: str) -> TimetablePreview | None:
    preview_path = OUTPUT_DIR / generation_id / "preview.json"
    if not preview_path.exists():
        return None

    data = json.loads(preview_path.read_text(encoding="utf-8"))
    return TimetablePreview.model_validate(data)


def generation_excel_path(generation_id: str) -> Path:
    return OUTPUT_DIR / generation_id / "timetable.xlsx"

