package br.com.indicaAI.API.domain.empresa;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(name = "nome_fantasia")
    private String nomeFantasia;

    @Enumerated(EnumType.STRING)
    private StatusEmpresa status = StatusEmpresa.ATIVO;

    public void inativar() {
        this.status = StatusEmpresa.INATIVO;
    }
}
