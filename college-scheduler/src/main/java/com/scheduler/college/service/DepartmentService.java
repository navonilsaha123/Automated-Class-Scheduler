package com.scheduler.college.service;

import com.scheduler.college.dto.request.DepartmentRequest;
import com.scheduler.college.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse create(Long instituteId, DepartmentRequest request);
    List<DepartmentResponse> getAllByInstitute(Long instituteId);
    DepartmentResponse getById(Long instituteId, Long departmentId);
    DepartmentResponse update(Long instituteId, Long departmentId, DepartmentRequest request);
    void delete(Long instituteId, Long departmentId);
}
