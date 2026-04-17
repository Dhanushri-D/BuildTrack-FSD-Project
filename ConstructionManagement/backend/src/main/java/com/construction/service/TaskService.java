package com.construction.service;

import com.construction.dto.TaskDto;
import com.construction.entity.Task;
import com.construction.entity.User;
import com.construction.repository.ProjectRepository;
import com.construction.repository.TaskRepository;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    public List<Task> getByProject(Long projectId) {
        User user = currentUser();
        if (user.getRole() == User.Role.ADMIN) return taskRepository.findByProjectId(projectId);
        // MANAGER sees all tasks in their projects; ENGINEER sees only assigned tasks
        if (user.getRole() == User.Role.MANAGER) return taskRepository.findByProjectId(projectId);
        return taskRepository.findByProjectIdAndAssigneeId(projectId, user.getId());
    }

    public Task create(Long projectId, TaskDto dto) {
        Task task = mapToEntity(dto, new Task());
        task.setProject(projectRepository.findById(projectId).orElseThrow());
        return taskRepository.save(task);
    }

    public Task update(Long id, TaskDto dto) {
        Task task = taskRepository.findById(id).orElseThrow();
        return taskRepository.save(mapToEntity(dto, task));
    }

    public void delete(Long id) { taskRepository.deleteById(id); }

    private Task mapToEntity(TaskDto dto, Task task) {
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setStartDate(dto.getStartDate());
        task.setDueDate(dto.getDueDate());
        task.setProgress(dto.getProgress());
        if (dto.getAssigneeId() != null)
            task.setAssignee(userRepository.findById(dto.getAssigneeId()).orElse(null));
        return task;
    }
}
