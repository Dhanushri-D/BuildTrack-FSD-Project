package com.construction.controller;

import com.construction.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/projects/{id}/summary")
    public ResponseEntity<Map<String, Object>> getProjectSummary(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getProjectSummary(id));
    }
}
