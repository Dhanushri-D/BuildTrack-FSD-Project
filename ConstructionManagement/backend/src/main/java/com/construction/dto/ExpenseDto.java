package com.construction.dto;

import com.construction.entity.Expense;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseDto {
    private String title;
    private BigDecimal amount;
    private Expense.Category category;
    private LocalDate date;
    private String vendor;
    private String notes;
}
