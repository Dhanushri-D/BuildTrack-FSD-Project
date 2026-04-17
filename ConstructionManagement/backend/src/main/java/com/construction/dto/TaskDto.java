package com.construction.dto;

import com.construction.entity.Task;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskDto {
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Integer progress;
    private Long assigneeId;
}
