package br.com.indicaAI.API.domain.funcionario;

import br.com.indicaAI.API.domain.funcionario.mensageria.ResultadoValidacaoMQ;
import br.com.indicaAI.API.domain.shared.EmailService;
import br.com.indicaAI.API.infrastructure.rabbitmq.RabbitMQConfig;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class FuncionarioValidacaoListener {

    private final FuncionarioRepository funcionarioRepository;
    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(FuncionarioValidacaoListener.class);

    public FuncionarioValidacaoListener(FuncionarioRepository funcionarioRepository, EmailService emailService) {
        this.funcionarioRepository = funcionarioRepository;
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitMQConfig.FILA_VALIDACAO_RESPONSE)
    @Transactional
    public void processarRespostaDaIA(ResultadoValidacaoMQ resultado) {
        logger.info("Recebi resposta da IA para o funcionário: {}", resultado.funcionarioId());

        var funcionario = funcionarioRepository.findById(resultado.funcionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado para validar id: " + resultado.funcionarioId()));

        if (resultado.aprovado()) {
            funcionario.setStatus(StatusFuncionario.ATIVO);
        } else {
            funcionario.setStatus(StatusFuncionario.REJEITADO);
        }

        funcionarioRepository.save(funcionario);

        try {
            if (resultado.aprovado()) {
                emailService.enviarEmailAprovacao(funcionario.getEmail(), funcionario.getNomeCompleto());
            } else {
                emailService.enviarEmailRejeicao(funcionario.getEmail(), funcionario.getNomeCompleto(), resultado.motivoRejeicao());
            }
        } catch (Exception e) {
            logger.error("Falha ao enviar e-mail para o funcionário ID: {}. Erro: {}", funcionario.getId(), e.getMessage());
        }
    }
}