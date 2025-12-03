package br.com.indicaAI.API.domain.funcionario.dtos;

import br.com.indicaAI.API.domain.funcionario.Funcionario;
import br.com.indicaAI.API.domain.funcionario.StatusFuncionario;
import java.util.UUID;

public record DetalhamentoFuncionarioDTO(
        UUID id,
        String nomeCompleto,
        String email,
        String cpf,
        StatusFuncionario status,
        String cidade,
        String sobre
) {
    public DetalhamentoFuncionarioDTO(Funcionario funcionario) {
        this(
                funcionario.getId(),
                funcionario.getNomeCompleto(),
                funcionario.getEmail(),
                funcionario.getCpf(),
                funcionario.getStatus(),
                funcionario.getCidade(),
                funcionario.getSobre()
        );
    }
}