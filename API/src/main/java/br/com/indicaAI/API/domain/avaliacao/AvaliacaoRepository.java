package br.com.indicaAI.API.domain.avaliacao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {
    List<Avaliacao> findAllByFuncionarioId(UUID funcionarioId);
}
