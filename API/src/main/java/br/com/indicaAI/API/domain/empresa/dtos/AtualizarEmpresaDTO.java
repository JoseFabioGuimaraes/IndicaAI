package br.com.indicaAI.API.domain.empresa.dtos;

import java.util.UUID;

public record AtualizarEmpresaDTO(
        UUID id,
        String razaoSocial,
        String nomeFantasia,
        String email,
        String senha
) {
}
