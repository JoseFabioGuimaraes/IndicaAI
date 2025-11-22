package br.com.indicaAI.API.domain.empresa.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CNPJ;

public record CadastroEmpresaDTO(
        @NotBlank(message = "Razão social é obrigatória")
        String razaoSocial,
        String nomeFantasia,

        @NotBlank(message = "CNPJ é obrigatório")
        @CNPJ(message = "CNPJ inválido")
        String cnpj,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha
) {
}
