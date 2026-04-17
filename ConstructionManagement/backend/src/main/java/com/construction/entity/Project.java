package com.construction.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal totalBudget;
    private BigDecimal spentBudget;
    private Integer progress;

    private String location;
    private String clientName;

    @JsonIgnoreProperties({"project", "tasks", "expenses", "siteUpdates", "contractors", "documents"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @JsonIgnoreProperties("project")
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks;

    @JsonIgnoreProperties("project")
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Expense> expenses;

    @JsonIgnoreProperties("project")
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<SiteUpdate> siteUpdates;

    @JsonIgnoreProperties("project")
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Contractor> contractors;

    @JsonIgnoreProperties("project")
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Document> documents;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public enum Status { PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED }
}
