package com.construction.repository;

import com.construction.entity.SiteUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SiteUpdateRepository extends JpaRepository<SiteUpdate, Long> {
    List<SiteUpdate> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
