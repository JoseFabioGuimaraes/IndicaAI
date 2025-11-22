package br.com.indicaAI.API.domain.funcionario.mensageria;

import java.util.UUID;

public record ResultadoValidacaoMQ(
        UUID funcionarioId,
        boolean aprovado,
        String motivoRejeicao
) {}
