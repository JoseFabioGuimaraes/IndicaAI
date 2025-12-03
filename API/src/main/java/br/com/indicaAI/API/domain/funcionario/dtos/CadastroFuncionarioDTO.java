package br.com.indicaAI.API.domain.funcionario.dtos;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CPF;

public record CadastroFuncionarioDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nomeCompleto,

        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Formato de email inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        String senha,

        @NotBlank(message = "A URL da foto do rosto é obrigatória")
        String fotoRostoUrl,

        @NotBlank(message = "A URL da foto do documento é obrigatória")
        String fotoDocumentoUrl,

        String cidade,
        String sobre
) {
}
