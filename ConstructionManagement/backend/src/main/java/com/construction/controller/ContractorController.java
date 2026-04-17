package com.construction.controller;

import com.construction.dto.ContractorDto;
import com.construction.entity.Contractor;
import com.construction.service.ContractorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/contractors")
@RequiredArgsConstructor
public class ContractorController {
    private final ContractorService contractorService;

    @GetMapping
    public ResponseEntity<List<Contractor>> getAll(@PathVariable Long projectId) {
        return ResponseEntity.ok(contractorService.getByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<Contractor> create(@PathVariable Long projectId, @RequestBody ContractorDto dto) {
        return ResponseEntity.ok(contractorService.create(projectId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contractor> update(@PathVariable Long projectId, @PathVariable Long id, @RequestBody ContractorDto dto) {
        return ResponseEntity.ok(contractorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        contractorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
