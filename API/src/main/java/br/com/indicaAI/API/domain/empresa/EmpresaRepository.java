package br.com.indicaAI.API.domain.empresa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


public interface EmpresaRepository extends JpaRepository<Empresa, UUID> {
    boolean existsByCnpj(String cnpj);
    boolean existsByEmail(String email);
    Empresa findByEmail(String email);
}
