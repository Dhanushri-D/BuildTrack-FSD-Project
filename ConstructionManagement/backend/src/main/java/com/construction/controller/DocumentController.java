package com.construction.controller;

import com.construction.entity.Document;
import com.construction.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/api/projects/{projectId}/documents")
    public ResponseEntity<List<Document>> getAll(@PathVariable Long projectId) {
        return ResponseEntity.ok(documentService.getByProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/documents")
    public ResponseEntity<Document> upload(@PathVariable Long projectId,
                                           @RequestParam("file") MultipartFile file,
                                           @RequestParam(required = false) String category) throws IOException {
        return ResponseEntity.ok(documentService.upload(projectId, file, category));
    }

    @DeleteMapping("/api/projects/{projectId}/documents/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        Resource resource = new UrlResource(Paths.get(uploadDir).resolve(filename).toUri());
        if (!resource.exists()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }
}
