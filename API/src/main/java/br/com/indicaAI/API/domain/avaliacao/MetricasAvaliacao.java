package br.com.indicaAI.API.domain.avaliacao;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MetricasAvaliacao {

    private Integer notaAssiduidade;
    private Integer notaTecnica;
    private Integer notaComportamental;

}