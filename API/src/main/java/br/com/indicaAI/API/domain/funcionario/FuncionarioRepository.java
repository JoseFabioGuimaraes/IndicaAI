package br.com.indicaAI.API.domain.funcionario;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

public interface FuncionarioRepository extends JpaRepository<Funcionario, UUID> {

    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    Funcionario findByEmail(String email);

}
