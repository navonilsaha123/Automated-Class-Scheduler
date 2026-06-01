package com.scheduler.college.dto.request;

import com.scheduler.college.entity.enums.SubjectType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotNull(message = "Subject type is required (THEORY or LAB)")
    private SubjectType type;

    @Min(value = 1, message = "Periods per week must be at least 1")
    private int periodsPerWeek;
}
