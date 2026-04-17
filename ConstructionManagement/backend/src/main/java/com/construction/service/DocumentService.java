package com.construction.service;

import com.construction.entity.Document;
import com.construction.repository.DocumentRepository;
import com.construction.repository.ProjectRepository;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public List<Document> getByProject(Long projectId) { return documentRepository.findByProjectId(projectId); }

    public Document upload(Long projectId, MultipartFile file, String category) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        Document doc = Document.builder()
                .name(file.getOriginalFilename())
                .fileUrl("/api/files/" + filename)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .category(category != null ? Document.Category.valueOf(category) : Document.Category.OTHER)
                .project(projectRepository.findById(projectId).orElseThrow())
                .uploadedBy(userRepository.findByUsername(username).orElse(null))
                .build();
        return documentRepository.save(doc);
    }

    public void delete(Long id) { documentRepository.deleteById(id); }
}
