package com.construction.controller;

import com.construction.dto.SiteUpdateDto;
import com.construction.entity.SiteUpdate;
import com.construction.service.SiteUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/site-updates")
@RequiredArgsConstructor
public class SiteUpdateController {
    private final SiteUpdateService siteUpdateService;

    @GetMapping
    public ResponseEntity<List<SiteUpdate>> getAll(@PathVariable Long projectId) {
        return ResponseEntity.ok(siteUpdateService.getByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<SiteUpdate> create(@PathVariable Long projectId, @RequestBody SiteUpdateDto dto) {
        return ResponseEntity.ok(siteUpdateService.create(projectId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        siteUpdateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
