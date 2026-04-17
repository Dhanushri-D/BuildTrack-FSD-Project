package com.construction.dto;

import com.construction.entity.Project;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProjectDto {
    private String name;
    private String description;
    private Project.Status status;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalBudget;
    private BigDecimal spentBudget;
    private Integer progress;
    private String location;
    private String clientName;
    private Long managerId;
}
