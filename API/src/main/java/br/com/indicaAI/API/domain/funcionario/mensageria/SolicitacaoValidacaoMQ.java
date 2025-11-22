package br.com.indicaAI.API.domain.funcionario.mensageria;


import java.util.UUID;

public record SolicitacaoValidacaoMQ(
        UUID funcionarioId,
        String fotoRostoUrl,
        String fotoDocumentoUrl
) {}