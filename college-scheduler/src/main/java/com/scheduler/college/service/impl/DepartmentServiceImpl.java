package com.scheduler.college.service.impl;

import com.scheduler.college.dto.request.DepartmentRequest;
import com.scheduler.college.dto.response.DepartmentResponse;
import com.scheduler.college.entity.Department;
import com.scheduler.college.entity.Institute;
import com.scheduler.college.exception.ResourceNotFoundException;
import com.scheduler.college.repository.DepartmentRepository;
import com.scheduler.college.repository.InstituteRepository;
import com.scheduler.college.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final InstituteRepository instituteRepository;

    @Override
    public DepartmentResponse create(Long instituteId, DepartmentRequest req) {
        Institute institute = instituteRepository.findById(instituteId)
                .orElseThrow(() -> new ResourceNotFoundException("Institute not found"));

        if (departmentRepository.existsByNameAndInstituteId(req.getName(), instituteId))
            throw new RuntimeException("Department '" + req.getName() + "' already exists in this institute");

        Department saved = departmentRepository.save(Department.builder()
                .name(req.getName())
                .institute(institute)
                .build());

        return toResponse(saved);
    }

    @Override
    public List<DepartmentResponse> getAllByInstitute(Long instituteId) {
        if (!instituteRepository.existsById(instituteId))
            throw new ResourceNotFoundException("Institute not found");

        return departmentRepository.findAllByInstituteId(instituteId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public DepartmentResponse getById(Long instituteId, Long departmentId) {
        Department dept = departmentRepository.findByIdAndInstituteId(departmentId, instituteId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return toResponse(dept);
    }

    @Override
    public DepartmentResponse update(Long instituteId, Long departmentId, DepartmentRequest req) {
        Department dept = departmentRepository.findByIdAndInstituteId(departmentId, instituteId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        dept.setName(req.getName());
        return toResponse(departmentRepository.save(dept));
    }

    @Override
    public void delete(Long instituteId, Long departmentId) {
        Department dept = departmentRepository.findByIdAndInstituteId(departmentId, instituteId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        departmentRepository.delete(dept);
    }

    private DepartmentResponse toResponse(Department d) {
        return DepartmentResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .instituteId(d.getInstitute().getId())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
