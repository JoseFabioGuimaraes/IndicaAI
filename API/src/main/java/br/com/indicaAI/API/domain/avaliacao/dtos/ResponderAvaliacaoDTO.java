package br.com.indicaAI.API.domain.avaliacao.dtos;

import jakarta.validation.constraints.NotBlank;

public record ResponderAvaliacaoDTO(
        @NotBlank(message = "A resposta não pode estar vazia")
        String resposta
) {
}