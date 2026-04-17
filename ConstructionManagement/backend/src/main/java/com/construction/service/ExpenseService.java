package com.construction.service;

import com.construction.dto.ExpenseDto;
import com.construction.entity.Expense;
import com.construction.repository.ExpenseRepository;
import com.construction.repository.ProjectRepository;
import com.construction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Expense> getByProject(Long projectId) { return expenseRepository.findByProjectId(projectId); }

    public Expense create(Long projectId, ExpenseDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Expense expense = Expense.builder()
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .category(dto.getCategory())
                .date(dto.getDate())
                .vendor(dto.getVendor())
                .notes(dto.getNotes())
                .project(projectRepository.findById(projectId).orElseThrow())
                .createdBy(userRepository.findByUsername(username).orElse(null))
                .build();
        return expenseRepository.save(expense);
    }

    public Expense update(Long id, ExpenseDto dto) {
        Expense expense = expenseRepository.findById(id).orElseThrow();
        expense.setTitle(dto.getTitle());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setDate(dto.getDate());
        expense.setVendor(dto.getVendor());
        expense.setNotes(dto.getNotes());
        return expenseRepository.save(expense);
    }

    public void delete(Long id) { expenseRepository.deleteById(id); }

    public Map<String, Object> getAnalytics(Long projectId) {
        BigDecimal total = expenseRepository.sumByProjectId(projectId);
        List<Object[]> byCategory = expenseRepository.sumByCategory(projectId);
        Map<String, BigDecimal> categoryMap = new LinkedHashMap<>();
        for (Object[] row : byCategory) categoryMap.put(row[0].toString(), (BigDecimal) row[1]);
        Map<String, Object> result = new HashMap<>();
        result.put("total", total != null ? total : BigDecimal.ZERO);
        result.put("byCategory", categoryMap);
        return result;
    }
}
