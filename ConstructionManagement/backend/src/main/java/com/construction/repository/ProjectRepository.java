package com.construction.repository;

import com.construction.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Project.Status status);
    List<Project> findByManagerId(Long managerId);

    @Query("SELECT p FROM Project p WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.clientName) LIKE LOWER(CONCAT('%', :q, '%'))) AND (:userId IS NULL OR p.manager.id = :userId)")
    List<Project> search(@Param("q") String query, @Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE (:status IS NULL OR p.status = :status) AND (:managerId IS NULL OR p.manager.id = :managerId) AND (:userId IS NULL OR p.manager.id = :userId)")
    List<Project> filter(@Param("status") Project.Status status, @Param("managerId") Long managerId, @Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE p.manager.id = :userId")
    List<Project> findByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.tasks t WHERE t.assignee.id = :userId")
    List<Project> findByAssigneeId(@Param("userId") Long userId);
}
