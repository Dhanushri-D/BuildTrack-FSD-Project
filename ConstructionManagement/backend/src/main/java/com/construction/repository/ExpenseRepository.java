package com.construction.repository;

import com.construction.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByProjectId(Long projectId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.project.id = :projectId")
    BigDecimal sumByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.project.id = :projectId GROUP BY e.category")
    List<Object[]> sumByCategory(@Param("projectId") Long projectId);
}
