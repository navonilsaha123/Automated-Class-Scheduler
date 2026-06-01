package com.scheduler.college.repository;

import com.scheduler.college.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByInstituteId(Long instituteId);
    boolean existsByNameAndInstituteId(String name, Long instituteId);
    Optional<Department> findByIdAndInstituteId(Long id, Long instituteId);
}
