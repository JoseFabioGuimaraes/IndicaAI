package br.com.indicaAI.API.domain.avaliacao.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CriarAvaliacaoDTO(
        @NotNull(message = "ID do funcionário é obrigatório") UUID funcionarioId,

        @NotNull(message = "ID da empresa é obrigatório") UUID empresaId,

        @NotNull(message = "Nota é obrigatória") @Min(value = 1, message = "A nota mínima é 1") @Max(value = 5, message = "A nota máxima é 5") Integer nota,

        @NotBlank(message = "A descrição/comentário é obrigatória") String descricao) {
}
