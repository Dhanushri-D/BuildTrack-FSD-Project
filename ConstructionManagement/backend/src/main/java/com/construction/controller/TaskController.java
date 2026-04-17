package com.construction.controller;

import com.construction.dto.TaskDto;
import com.construction.entity.Task;
import com.construction.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAll(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<Task> create(@PathVariable Long projectId, @RequestBody TaskDto dto) {
        return ResponseEntity.ok(taskService.create(projectId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long projectId, @PathVariable Long id, @RequestBody TaskDto dto) {
        return ResponseEntity.ok(taskService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
