package br.com.indicaAI.API.domain.avaliacao;

import br.com.indicaAI.API.domain.empresa.Empresa;
import br.com.indicaAI.API.domain.funcionario.Funcionario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "avaliacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @Embedded
    private MetricasAvaliacao metricas;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDateTime dataAvaliacao = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAvaliacao status = StatusAvaliacao.PUBLICADA;

}
