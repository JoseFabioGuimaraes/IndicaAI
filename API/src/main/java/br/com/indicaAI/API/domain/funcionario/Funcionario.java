package br.com.indicaAI.API.domain.funcionario;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "funcionarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nomeCompleto;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(columnDefinition = "TEXT")
    private String fotoRostoUrl;

    @Column(columnDefinition = "TEXT")
    private String fotoDocumentoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusFuncionario status;

}