package com.scheduler.college.repository;

import com.scheduler.college.entity.Institute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InstituteRepository extends JpaRepository<Institute, Long> {
    Optional<Institute> findByEmail(String email);
    boolean existsByEmail(String email);
}
