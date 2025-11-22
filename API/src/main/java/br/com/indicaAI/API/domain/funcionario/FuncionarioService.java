package br.com.indicaAI.API.domain.funcionario;

import br.com.indicaAI.API.domain.funcionario.dtos.CadastroFuncionarioDTO;
import br.com.indicaAI.API.domain.funcionario.mensageria.SolicitacaoValidacaoMQ;
import br.com.indicaAI.API.infrastructure.rabbitmq.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final RabbitTemplate rabbitTemplate;

    public FuncionarioService(FuncionarioRepository funcionarioRepository, RabbitTemplate rabbitTemplate) {
        this.funcionarioRepository = funcionarioRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public Funcionario cadastrarFuncionario(CadastroFuncionarioDTO dados) {
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

        var mensagem = new SolicitacaoValidacaoMQ(
                salvo.getId(),
                salvo.getFotoRostoUrl(),
                salvo.getFotoDocumentoUrl()
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_VALIDACAO_REQUEST, mensagem);

        return salvo;
    }
}