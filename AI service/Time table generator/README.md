# Time Table Generator

FastAPI service that:

- receives institute, department, and subject data
- generates a weekly timetable for each department
- returns preview JSON for the frontend
- exports the generated timetable as `.xlsx`

## Run

From `AI service`:

```bash
python -m uvicorn "Time table generator.app:app" --reload --port 8000
```

## API

- `GET /health`
- `POST /api/timetables/generate`
- `GET /api/timetables/{generationId}/preview`
- `GET /api/timetables/{generationId}/download`

## Notes

- Labs are scheduled in 2 consecutive periods.
- Labs cannot cross lunch.
- The service validates that lab `periodsPerWeek` values are even.
- Unused periods are marked as `Free / Self Study`.
