package com.scheduler.college.service.impl;

import com.scheduler.college.dto.request.SubjectRequest;
import com.scheduler.college.dto.response.SubjectResponse;
import com.scheduler.college.entity.Department;
import com.scheduler.college.entity.Subject;
import com.scheduler.college.entity.enums.SubjectType;
import com.scheduler.college.exception.ResourceNotFoundException;
import com.scheduler.college.repository.DepartmentRepository;
import com.scheduler.college.repository.SubjectRepository;
import com.scheduler.college.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public SubjectResponse create(Long departmentId, SubjectRequest req) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        // Auto-set period duration: LAB = 2 consecutive periods, THEORY = 1
        int duration = (req.getType() == SubjectType.LAB) ? 2 : 1;

        Subject saved = subjectRepository.save(Subject.builder()
                .name(req.getName())
                .type(req.getType())
                .periodsPerWeek(req.getPeriodsPerWeek())
                .periodDuration(duration)
                .department(department)
                .build());

        return toResponse(saved);
    }

    @Override
    public List<SubjectResponse> getAllByDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId))
            throw new ResourceNotFoundException("Department not found");

        return subjectRepository.findAllByDepartmentId(departmentId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<SubjectResponse> getAllByDepartmentAndType(Long departmentId, SubjectType type) {
        if (!departmentRepository.existsById(departmentId))
            throw new ResourceNotFoundException("Department not found");

        return subjectRepository.findAllByDepartmentIdAndType(departmentId, type)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public SubjectResponse getById(Long subjectId) {
        return toResponse(findOrThrow(subjectId));
    }

    @Override
    public SubjectResponse update(Long subjectId, SubjectRequest req) {
        Subject subject = findOrThrow(subjectId);
        subject.setName(req.getName());
        subject.setType(req.getType());
        subject.setPeriodsPerWeek(req.getPeriodsPerWeek());
        subject.setPeriodDuration((req.getType() == SubjectType.LAB) ? 2 : 1);
        return toResponse(subjectRepository.save(subject));
    }

    @Override
    public void delete(Long subjectId) {
        findOrThrow(subjectId);
        subjectRepository.deleteById(subjectId);
    }

    private Subject findOrThrow(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
    }

    private SubjectResponse toResponse(Subject s) {
        return SubjectResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .type(s.getType())
                .periodsPerWeek(s.getPeriodsPerWeek())
                .periodDuration(s.getPeriodDuration())
                .departmentId(s.getDepartment().getId())
                .departmentName(s.getDepartment().getName())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
