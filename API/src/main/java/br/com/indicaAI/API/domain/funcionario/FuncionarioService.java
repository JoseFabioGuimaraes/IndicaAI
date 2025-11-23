package br.com.indicaAI.API.domain.funcionario;

import br.com.indicaAI.API.domain.funcionario.dtos.AtualizacaoFuncionarioDTO;
import br.com.indicaAI.API.domain.funcionario.dtos.CadastroFuncionarioDTO;
import br.com.indicaAI.API.domain.funcionario.dtos.DetalhamentoFuncionarioDTO;
import br.com.indicaAI.API.domain.funcionario.mensageria.SolicitacaoValidacaoMQ;
import br.com.indicaAI.API.infrastructure.rabbitmq.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import java.util.UUID;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final RabbitTemplate rabbitTemplate;

    public FuncionarioService(FuncionarioRepository funcionarioRepository, RabbitTemplate rabbitTemplate) {
        this.funcionarioRepository = funcionarioRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public DetalhamentoFuncionarioDTO cadastrarFuncionario(CadastroFuncionarioDTO dados) {
        if (funcionarioRepository.existsByCpf(dados.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }
        if (funcionarioRepository.existsByEmail(dados.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Funcionario novo = new Funcionario();
        novo.setNomeCompleto(dados.nomeCompleto());
        novo.setCpf(dados.cpf());
        novo.setEmail(dados.email());
        novo.setSenha(dados.senha());
        novo.setFotoRostoUrl(dados.fotoRostoUrl());
        novo.setFotoDocumentoUrl(dados.fotoDocumentoUrl());

        novo.setStatus(StatusFuncionario.PENDENTE_VALIDACAO);

        Funcionario salvo = funcionarioRepository.save(novo);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                var mensagem = new SolicitacaoValidacaoMQ(
                        salvo.getId(),
                        salvo.getFotoRostoUrl(),
                        salvo.getFotoDocumentoUrl()
                );
                rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_VALIDACAO_REQUEST, mensagem);
                System.out.println("Mensagem enviada para o RabbitMQ após commit!");
            }
        });

        return new DetalhamentoFuncionarioDTO(salvo);
    }

    public DetalhamentoFuncionarioDTO detalhar(UUID id) {
        var funcionario = buscarFuncionarioAtivo(id);
        return new DetalhamentoFuncionarioDTO(funcionario);
    }

    @Transactional
    public DetalhamentoFuncionarioDTO atualizar(UUID id, AtualizacaoFuncionarioDTO dados) {
        var funcionario = buscarFuncionarioAtivo(id);

        if (dados.nomeCompleto() != null) funcionario.setNomeCompleto(dados.nomeCompleto());
        if (dados.senha() != null) funcionario.setSenha(dados.senha());
        if (dados.email() != null) funcionario.setEmail(dados.email());

        return new DetalhamentoFuncionarioDTO(funcionario);
    }

    @Transactional
    public void inativar(UUID id) {
        var funcionario = buscarFuncionarioAtivo(id);
        funcionario.setStatus(StatusFuncionario.INATIVO);
    }

    private Funcionario buscarFuncionarioAtivo(UUID id) {
        var funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com id: " + id));

        if (funcionario.getStatus() != StatusFuncionario.ATIVO) {
            throw new RuntimeException("Operação não permitida. O funcionário não está ATIVO.");
        }

        return funcionario;
    }
}