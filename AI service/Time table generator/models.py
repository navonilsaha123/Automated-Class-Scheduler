from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class SubjectInput(BaseModel):
    id: int | None = None
    name: str = Field(min_length=1)
    type: Literal["THEORY", "LAB"]
    periodsPerWeek: int = Field(ge=1)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return value.strip()


class DepartmentInput(BaseModel):
    id: int | None = None
    name: str = Field(min_length=1)
    subjects: list[SubjectInput] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return value.strip()


class TimetableRequest(BaseModel):
    instituteId: int | None = None
    instituteName: str = Field(min_length=1)
    departments: list[DepartmentInput] = Field(default_factory=list)

    @field_validator("instituteName")
    @classmethod
    def normalize_institute_name(cls, value: str) -> str:
        return value.strip()


class SlotPreview(BaseModel):
    slotCode: str
    time: str
    entries: dict[str, str]


class DepartmentPreview(BaseModel):
    departmentId: int | None = None
    departmentName: str
    slots: list[SlotPreview]
    summary: dict[str, int]


class TimetablePreview(BaseModel):
    generationId: str
    instituteId: int | None = None
    instituteName: str
    createdAt: datetime
    departments: list[DepartmentPreview]
    excelDownloadUrl: str


class TimetableGenerateResponse(TimetablePreview):
    pass

