package com.scheduler.college.repository;

import com.scheduler.college.entity.Subject;
import com.scheduler.college.entity.enums.SubjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findAllByDepartmentId(Long departmentId);
    List<Subject> findAllByDepartmentIdAndType(Long departmentId, SubjectType type);
    List<Subject> findAllByDepartmentInstituteId(Long instituteId);
}
