package com.scheduler.college.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.scheduler.college.entity.enums.SubjectType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. DBMS, DSA, OS  /  DBMS Lab, OS Lab
    @Column(nullable = false)
    private String name;

    // THEORY or LAB
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubjectType type;

    // How many times per week — institute sets this
    @Column(nullable = false)
    private int periodsPerWeek;

    // Auto-set: 1 for THEORY, 2 for LAB (2 consecutive periods)
    @Column(nullable = false)
    private int periodDuration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    @JsonIgnore
    private Department department;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
