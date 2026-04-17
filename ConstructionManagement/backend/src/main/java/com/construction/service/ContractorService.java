package com.construction.service;

import com.construction.dto.ContractorDto;
import com.construction.entity.Contractor;
import com.construction.repository.ContractorRepository;
import com.construction.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractorService {
    private final ContractorRepository contractorRepository;
    private final ProjectRepository projectRepository;

    public List<Contractor> getByProject(Long projectId) { return contractorRepository.findByProjectId(projectId); }

    public Contractor create(Long projectId, ContractorDto dto) {
        Contractor contractor = Contractor.builder()
                .name(dto.getName()).company(dto.getCompany()).email(dto.getEmail())
                .phone(dto.getPhone()).specialty(dto.getSpecialty())
                .contractValue(dto.getContractValue()).contractStart(dto.getContractStart())
                .contractEnd(dto.getContractEnd()).status(dto.getStatus())
                .project(projectRepository.findById(projectId).orElseThrow())
                .build();
        return contractorRepository.save(contractor);
    }

    public Contractor update(Long id, ContractorDto dto) {
        Contractor c = contractorRepository.findById(id).orElseThrow();
        c.setName(dto.getName()); c.setCompany(dto.getCompany()); c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone()); c.setSpecialty(dto.getSpecialty());
        c.setContractValue(dto.getContractValue()); c.setContractStart(dto.getContractStart());
        c.setContractEnd(dto.getContractEnd()); c.setStatus(dto.getStatus());
        return contractorRepository.save(c);
    }

    public void delete(Long id) { contractorRepository.deleteById(id); }
}
