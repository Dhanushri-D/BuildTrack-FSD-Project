package com.construction.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contractors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Contractor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String company;
    private String email;
    private String phone;
    private String specialty;
    private BigDecimal contractValue;
    private LocalDate contractStart;
    private LocalDate contractEnd;

    @Enumerated(EnumType.STRING)
    private Status status;

    @JsonIgnoreProperties({"tasks", "expenses", "siteUpdates", "contractors", "documents", "manager"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status { ACTIVE, COMPLETED, TERMINATED }
}
