package com.construction.controller;

import com.construction.dto.ExpenseDto;
import com.construction.entity.Expense;
import com.construction.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects/{projectId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getAll(@PathVariable Long projectId) {
        return ResponseEntity.ok(expenseService.getByProject(projectId));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(@PathVariable Long projectId) {
        return ResponseEntity.ok(expenseService.getAnalytics(projectId));
    }

    @PostMapping
    public ResponseEntity<Expense> create(@PathVariable Long projectId, @RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(expenseService.create(projectId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(@PathVariable Long projectId, @PathVariable Long id, @RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(expenseService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
