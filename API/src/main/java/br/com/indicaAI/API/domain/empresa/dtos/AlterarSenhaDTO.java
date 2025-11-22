package br.com.indicaAI.API.domain.empresa.dtos;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record AlterarSenhaDTO(
        UUID id,
        @NotBlank String senhaAtual,
        @NotBlank String novaSenha
) {
}
