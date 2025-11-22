package br.com.indicaAI.API.domain.empresa.dtos;

import br.com.indicaAI.API.domain.empresa.Empresa;

import java.util.UUID;

public record InformacoesEmpresaDTO(
        UUID id,
        String razaoSocial,
        String nomeFantasia,
        String cnpj,
        String email
) {
    public InformacoesEmpresaDTO(Empresa empresa) {
        this(
                empresa.getId(),
                empresa.getRazaoSocial(),
                empresa.getNomeFantasia(),
                empresa.getCnpj(),
                empresa.getEmail()
        );
    }
}
