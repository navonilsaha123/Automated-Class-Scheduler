package com.scheduler.college.service;

import com.scheduler.college.dto.request.SubjectRequest;
import com.scheduler.college.dto.response.SubjectResponse;
import com.scheduler.college.entity.enums.SubjectType;

import java.util.List;

public interface SubjectService {
    SubjectResponse create(Long departmentId, SubjectRequest request);
    List<SubjectResponse> getAllByDepartment(Long departmentId);
    List<SubjectResponse> getAllByDepartmentAndType(Long departmentId, SubjectType type);
    SubjectResponse getById(Long subjectId);
    SubjectResponse update(Long subjectId, SubjectRequest request);
    void delete(Long subjectId);
}
