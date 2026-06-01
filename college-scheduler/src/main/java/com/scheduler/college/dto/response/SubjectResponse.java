package com.scheduler.college.dto.response;

import com.scheduler.college.entity.enums.SubjectType;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {
    private Long id;
    private String name;
    private SubjectType type;
    private int periodsPerWeek;
    private int periodDuration;
    private Long departmentId;
    private String departmentName;
    private LocalDateTime createdAt;
}
