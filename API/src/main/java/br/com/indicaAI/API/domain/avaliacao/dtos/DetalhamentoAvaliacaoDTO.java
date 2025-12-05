package br.com.indicaAI.API.domain.avaliacao.dtos;

import br.com.indicaAI.API.domain.avaliacao.Avaliacao;
import br.com.indicaAI.API.domain.avaliacao.MetricasAvaliacao;

import java.time.LocalDateTime;
import java.util.UUID;

public record DetalhamentoAvaliacaoDTO(
        UUID id,
        String nomeEmpresa,
        String nomeFuncionario,
        Integer nota,
        String descricao,
        String resposta,
        LocalDateTime dataAvaliacao) {
    public DetalhamentoAvaliacaoDTO(Avaliacao avaliacao) {
        this(
                avaliacao.getId(),
                avaliacao.getEmpresa().getNomeFantasia(), // ou razaoSocial
                avaliacao.getFuncionario().getNomeCompleto(),
                avaliacao.getNota(),
                avaliacao.getDescricao(),
                avaliacao.getResposta(),
                avaliacao.getDataAvaliacao());
    }
}