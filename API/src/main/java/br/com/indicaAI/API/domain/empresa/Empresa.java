package br.com.indicaAI.API.domain.empresa;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")

public class Empresa implements UserDetails {

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
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_EMPRESA"));
    }

    @Override
    public String getPassword() { return senha; }
    @Override
    public String getUsername() { return email; }
}
