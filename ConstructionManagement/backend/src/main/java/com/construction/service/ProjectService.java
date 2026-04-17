package com.construction.service;

import com.construction.dto.ProjectDto;
import com.construction.entity.Project;
import com.construction.entity.User;
import com.construction.repository.ProjectRepository;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    private boolean isAdmin() {
        return currentUser().getRole() == User.Role.ADMIN;
    }

    // Returns userId filter: null for ADMIN (no filter), actual id for others
    private Long scopedUserId() {
        return isAdmin() ? null : currentUser().getId();
    }

    public List<Project> getAll() {
        if (isAdmin()) return projectRepository.findAll();
        User user = currentUser();
        // MANAGER/ENGINEER: projects they manage + projects where they are assigned to a task
        List<Project> managed = projectRepository.findByUserId(user.getId());
        List<Project> assigned = projectRepository.findByAssigneeId(user.getId());
        List<Project> combined = new ArrayList<>(managed);
        assigned.forEach(p -> { if (combined.stream().noneMatch(m -> m.getId().equals(p.getId()))) combined.add(p); });
        return combined;
    }

    public Project getById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project create(ProjectDto dto) {
        Project project = mapToEntity(dto, new Project());
        // If not admin and no manager set, assign current user as manager
        if (project.getManager() == null && !isAdmin()) {
            project.setManager(currentUser());
        }
        return projectRepository.save(project);
    }

    public Project update(Long id, ProjectDto dto) {
        Project project = getById(id);
        return projectRepository.save(mapToEntity(dto, project));
    }

    public void delete(Long id) { projectRepository.deleteById(id); }

    public List<Project> search(String query) {
        Long userId = scopedUserId();
        return projectRepository.search(query, userId);
    }

    public List<Project> filter(String status, Long managerId) {
        Project.Status s = status != null ? Project.Status.valueOf(status) : null;
        Long userId = scopedUserId();
        return projectRepository.filter(s, managerId, userId);
    }

    private Project mapToEntity(ProjectDto dto, Project project) {
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setTotalBudget(dto.getTotalBudget());
        project.setSpentBudget(dto.getSpentBudget());
        project.setProgress(dto.getProgress());
        project.setLocation(dto.getLocation());
        project.setClientName(dto.getClientName());
        if (dto.getManagerId() != null) {
            User manager = userRepository.findById(dto.getManagerId()).orElse(null);
            project.setManager(manager);
        }
        return project;
    }
}
