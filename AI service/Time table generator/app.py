from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from models import TimetableGenerateResponse, TimetablePreview, TimetableRequest
from scheduler import ScheduleValidationError, build_department_previews
from storage import create_generation, generation_excel_path, load_generation


app = FastAPI(title="Timetable Generator Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/timetables/generate", response_model=TimetableGenerateResponse)
def generate_timetable(payload: TimetableRequest) -> TimetableGenerateResponse:
    try:
        department_previews = build_department_previews(payload)
        preview = create_generation(
            institute_id=payload.instituteId,
            institute_name=payload.instituteName,
            departments=department_previews,
        )
        return TimetableGenerateResponse(**preview.model_dump())
    except ScheduleValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/timetables/{generation_id}/preview", response_model=TimetablePreview)
def get_preview(generation_id: str) -> TimetablePreview:
    preview = load_generation(generation_id)
    if preview is None:
        raise HTTPException(status_code=404, detail="Timetable generation not found.")
    return preview


@app.get("/api/timetables/{generation_id}/download")
def download_timetable(generation_id: str) -> FileResponse:
    excel_path = generation_excel_path(generation_id)
    if not excel_path.exists():
        raise HTTPException(status_code=404, detail="Timetable file not found.")

    return FileResponse(
        path=excel_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"timetable-{generation_id}.xlsx",
    )
