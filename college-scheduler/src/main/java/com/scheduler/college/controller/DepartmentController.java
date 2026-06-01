package com.scheduler.college.controller;

import com.scheduler.college.dto.request.DepartmentRequest;
import com.scheduler.college.dto.response.DepartmentResponse;
import com.scheduler.college.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/institutes/{instituteId}/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    // POST /api/institutes/{instituteId}/departments
    @PostMapping
    public ResponseEntity<DepartmentResponse> create(
            @PathVariable Long instituteId,
            @Valid @RequestBody DepartmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departmentService.create(instituteId, req));
    }

    // GET /api/institutes/{instituteId}/departments
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAll(@PathVariable Long instituteId) {
        return ResponseEntity.ok(departmentService.getAllByInstitute(instituteId));
    }

    // GET /api/institutes/{instituteId}/departments/{departmentId}
    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> getById(
            @PathVariable Long instituteId,
            @PathVariable Long departmentId) {
        return ResponseEntity.ok(departmentService.getById(instituteId, departmentId));
    }

    // PUT /api/institutes/{instituteId}/departments/{departmentId}
    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> update(
            @PathVariable Long instituteId,
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentRequest req) {
        return ResponseEntity.ok(departmentService.update(instituteId, departmentId, req));
    }

    // DELETE /api/institutes/{instituteId}/departments/{departmentId}
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long instituteId,
            @PathVariable Long departmentId) {
        departmentService.delete(instituteId, departmentId);
        return ResponseEntity.noContent().build();
    }
}
