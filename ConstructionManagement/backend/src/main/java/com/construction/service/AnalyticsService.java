package com.construction.service;

import com.construction.entity.Project;
import com.construction.entity.User;
import com.construction.repository.ProjectRepository;
import com.construction.repository.TaskRepository;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    private List<Project> getScopedProjects() {
        User user = currentUser();
        if (user.getRole() == User.Role.ADMIN) return projectRepository.findAll();
        List<Project> managed = projectRepository.findByUserId(user.getId());
        List<Project> assigned = projectRepository.findByAssigneeId(user.getId());
        List<Project> combined = new ArrayList<>(managed);
        assigned.forEach(p -> { if (combined.stream().noneMatch(m -> m.getId().equals(p.getId()))) combined.add(p); });
        return combined;
    }

    public Map<String, Object> getDashboardStats() {
        List<Project> all = getScopedProjects();
        long active    = all.stream().filter(p -> p.getStatus() == Project.Status.ACTIVE).count();
        long completed = all.stream().filter(p -> p.getStatus() == Project.Status.COMPLETED).count();
        long onHold    = all.stream().filter(p -> p.getStatus() == Project.Status.ON_HOLD).count();
        BigDecimal totalBudget = all.stream().map(p -> p.getTotalBudget() != null ? p.getTotalBudget() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalSpent  = all.stream().map(p -> p.getSpentBudget() != null ? p.getSpentBudget() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        double avgProgress = all.stream().mapToInt(p -> p.getProgress() != null ? p.getProgress() : 0).average().orElse(0);

        User user = currentUser();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalProjects",    all.size());
        stats.put("activeProjects",   active);
        stats.put("completedProjects",completed);
        stats.put("onHoldProjects",   onHold);
        stats.put("totalBudget",      totalBudget);
        stats.put("totalSpent",       totalSpent);
        stats.put("averageProgress",  Math.round(avgProgress));
        // totalUsers: ADMIN sees all, others see only themselves
        stats.put("totalUsers", user.getRole() == User.Role.ADMIN ? userRepository.count() : 1);
        return stats;
    }

    public Map<String, Object> getProjectSummary(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        long totalTasks      = taskRepository.findByProjectId(projectId).size();
        long doneTasks       = taskRepository.findByProjectIdAndStatus(projectId, com.construction.entity.Task.Status.DONE).size();
        long inProgressTasks = taskRepository.findByProjectIdAndStatus(projectId, com.construction.entity.Task.Status.IN_PROGRESS).size();

        BigDecimal budget = project.getTotalBudget() != null ? project.getTotalBudget() : BigDecimal.ZERO;
        BigDecimal spent  = project.getSpentBudget()  != null ? project.getSpentBudget()  : BigDecimal.ZERO;
        double budgetUsedPct = budget.compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(budget, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalTasks",       totalTasks);
        result.put("doneTasks",        doneTasks);
        result.put("inProgressTasks",  inProgressTasks);
        result.put("budgetUsedPercent",Math.round(budgetUsedPct));
        result.put("aiSummary",        generateAiSummary(project, totalTasks, doneTasks, budgetUsedPct));
        result.put("budgetAlert",      budgetUsedPct > 80);
        result.put("predictedOverrun", budgetUsedPct > 90 && project.getProgress() != null && project.getProgress() < 80);
        return result;
    }

    private String generateAiSummary(Project project, long total, long done, double budgetPct) {
        String status   = project.getStatus() != null ? project.getStatus().name() : "UNKNOWN";
        int    progress = project.getProgress() != null ? project.getProgress() : 0;
        return String.format(
            "Project '%s' is currently %s with %d%% overall progress. %d of %d tasks completed. Budget utilization stands at %.1f%%. %s",
            project.getName(), status, progress, done, total, budgetPct,
            budgetPct > 80 ? "⚠️ Budget alert: spending is high relative to progress." :
            progress > 70  ? "Project is on track for timely completion." :
                             "Monitor task completion to stay on schedule."
        );
    }
}
