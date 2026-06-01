package com.scheduler.college.controller;

import com.scheduler.college.dto.request.SubjectRequest;
import com.scheduler.college.dto.response.SubjectResponse;
import com.scheduler.college.entity.enums.SubjectType;
import com.scheduler.college.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    // POST /api/departments/{departmentId}/subjects
    @PostMapping("/api/departments/{departmentId}/subjects")
    public ResponseEntity<SubjectResponse> create(
            @PathVariable Long departmentId,
            @Valid @RequestBody SubjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subjectService.create(departmentId, req));
    }

    // GET /api/departments/{departmentId}/subjects
    // Optional filter: ?type=THEORY or ?type=LAB
    @GetMapping("/api/departments/{departmentId}/subjects")
    public ResponseEntity<List<SubjectResponse>> getAllByDepartment(
            @PathVariable Long departmentId,
            @RequestParam(required = false) SubjectType type) {
        if (type != null)
            return ResponseEntity.ok(subjectService.getAllByDepartmentAndType(departmentId, type));
        return ResponseEntity.ok(subjectService.getAllByDepartment(departmentId));
    }

    // GET /api/subjects/{id}
    @GetMapping("/api/subjects/{id}")
    public ResponseEntity<SubjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getById(id));
    }

    // PUT /api/subjects/{id}
    @PutMapping("/api/subjects/{id}")
    public ResponseEntity<SubjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest req) {
        return ResponseEntity.ok(subjectService.update(id, req));
    }

    // DELETE /api/subjects/{id}
    @DeleteMapping("/api/subjects/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
