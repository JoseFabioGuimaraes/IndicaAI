package br.com.indicaAI.API.domain.funcionario;

import br.com.indicaAI.API.domain.funcionario.mensageria.ResultadoValidacaoMQ;
import br.com.indicaAI.API.domain.shared.EmailService;
import br.com.indicaAI.API.infrastructure.rabbitmq.RabbitMQConfig;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class FuncionarioValidacaoListener {

    private final FuncionarioRepository funcionarioRepository;
    private final EmailService emailService;

    public FuncionarioValidacaoListener(FuncionarioRepository funcionarioRepository, EmailService emailService) {
        this.funcionarioRepository = funcionarioRepository;
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitMQConfig.FILA_VALIDACAO_RESPONSE)
    @Transactional
    public void processarRespostaDaIA(ResultadoValidacaoMQ resultado) {
        System.out.println("Recebi resposta da IA para o funcionário: " + resultado.funcionarioId());

        var funcionario = funcionarioRepository.findById(resultado.funcionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado para validar id: " + resultado.funcionarioId()));

        if (resultado.aprovado()) {
            funcionario.setStatus(StatusFuncionario.ATIVO);
            emailService.enviarEmailAprovacao(funcionario.getEmail(), funcionario.getNomeCompleto());
        } else {
            funcionario.setStatus(StatusFuncionario.REJEITADO);
            // Aqui poderíamos salvar o motivo da rejeição em algum lugar
            emailService.enviarEmailRejeicao(funcionario.getEmail(), funcionario.getNomeCompleto(), resultado.motivoRejeicao());
        }

        funcionarioRepository.save(funcionario);
    }
}