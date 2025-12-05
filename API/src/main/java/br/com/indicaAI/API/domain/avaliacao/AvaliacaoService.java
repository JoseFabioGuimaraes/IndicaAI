package br.com.indicaAI.API.domain.avaliacao;

import br.com.indicaAI.API.domain.avaliacao.dtos.CriarAvaliacaoDTO;
import br.com.indicaAI.API.domain.avaliacao.dtos.DetalhamentoAvaliacaoDTO;
import br.com.indicaAI.API.domain.avaliacao.dtos.ResponderAvaliacaoDTO;
import br.com.indicaAI.API.domain.empresa.Empresa;
import br.com.indicaAI.API.domain.empresa.EmpresaRepository;
import br.com.indicaAI.API.domain.funcionario.Funcionario;
import br.com.indicaAI.API.domain.funcionario.FuncionarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final EmpresaRepository empresaRepository;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, FuncionarioRepository funcionarioRepository,
            EmpresaRepository empresaRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional
    public DetalhamentoAvaliacaoDTO avaliar(CriarAvaliacaoDTO dados, Empresa empresaAutenticada) {
        if (avaliacaoRepository.existsByEmpresaIdAndFuncionarioId(empresaAutenticada.getId(), dados.funcionarioId())) {
            throw new IllegalArgumentException("Sua empresa já avaliou este funcionário.");
        }

        var funcionario = funcionarioRepository.findById(dados.funcionarioId())
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setEmpresa(empresaAutenticada);
        avaliacao.setFuncionario(funcionario);
        avaliacao.setDescricao(dados.descricao());
        avaliacao.setStatus(StatusAvaliacao.PUBLICADA);

        MetricasAvaliacao metricas = new MetricasAvaliacao(
                dados.notaAssiduidade(),
                dados.notaTecnica(),
                dados.notaComportamental());
        avaliacao.setMetricas(metricas);

        avaliacaoRepository.save(avaliacao);
        return new DetalhamentoAvaliacaoDTO(avaliacao);
    }

    @Transactional
    public DetalhamentoAvaliacaoDTO responder(UUID idAvaliacao, ResponderAvaliacaoDTO dados,
            Funcionario funcionarioAutenticado) {
        var avaliacao = avaliacaoRepository.findById(idAvaliacao)
                .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada"));

        if (!avaliacao.getFuncionario().getId().equals(funcionarioAutenticado.getId())) {
            throw new IllegalArgumentException("Você não tem permissão para responder esta avaliação.");
        }

        if (avaliacao.getResposta() != null) {
            throw new IllegalArgumentException("Esta avaliação já foi respondida.");
        }

        avaliacao.setResposta(dados.resposta());
        return new DetalhamentoAvaliacaoDTO(avaliacao);
    }

    // Renomeado para ser genérico (usado por Empresa e Funcionário)
    public List<DetalhamentoAvaliacaoDTO> listarPorFuncionario(UUID funcionarioId) {
        var lista = avaliacaoRepository.findAllByFuncionarioId(funcionarioId);
        return lista.stream().map(DetalhamentoAvaliacaoDTO::new).toList();
    }

    public List<DetalhamentoAvaliacaoDTO> listarPorEmpresa(UUID empresaId) {
        var lista = avaliacaoRepository.findAllByEmpresaId(empresaId);
        return lista.stream().map(DetalhamentoAvaliacaoDTO::new).toList();
    }
}