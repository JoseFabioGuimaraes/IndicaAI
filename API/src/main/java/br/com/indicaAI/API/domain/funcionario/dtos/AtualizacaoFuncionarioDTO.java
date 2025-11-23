package br.com.indicaAI.API.domain.funcionario.dtos;

import java.util.UUID;

public record AtualizacaoFuncionarioDTO(
        String nomeCompleto,
        String senha,
        String email
) {
}