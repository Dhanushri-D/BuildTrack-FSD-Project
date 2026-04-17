package com.construction.service;

import com.construction.dto.SiteUpdateDto;
import com.construction.entity.SiteUpdate;
import com.construction.repository.ProjectRepository;
import com.construction.repository.SiteUpdateRepository;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteUpdateService {
    private final SiteUpdateRepository siteUpdateRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<SiteUpdate> getByProject(Long projectId) {
        return siteUpdateRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public SiteUpdate create(Long projectId, SiteUpdateDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        SiteUpdate update = SiteUpdate.builder()
                .title(dto.getTitle())
                .notes(dto.getNotes())
                .mediaUrls(dto.getMediaUrls())
                .mediaType(dto.getMediaType())
                .project(projectRepository.findById(projectId).orElseThrow())
                .postedBy(userRepository.findByUsername(username).orElse(null))
                .build();
        return siteUpdateRepository.save(update);
    }

    public void delete(Long id) { siteUpdateRepository.deleteById(id); }
}
