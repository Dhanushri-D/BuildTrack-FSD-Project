package com.construction.dto;

import com.construction.entity.Contractor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractorDto {
    private String name;
    private String company;
    private String email;
    private String phone;
    private String specialty;
    private BigDecimal contractValue;
    private LocalDate contractStart;
    private LocalDate contractEnd;
    private Contractor.Status status;
}
