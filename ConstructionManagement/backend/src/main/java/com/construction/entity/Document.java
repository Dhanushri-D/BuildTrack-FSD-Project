package com.construction.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String fileUrl;
    private String fileType;
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    private Category category;

    @JsonIgnoreProperties({"tasks", "expenses", "siteUpdates", "contractors", "documents", "manager"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @JsonIgnoreProperties({"password"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @Column(updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public enum Category { CONTRACT, BLUEPRINT, PERMIT, REPORT, INVOICE, OTHER }
}
