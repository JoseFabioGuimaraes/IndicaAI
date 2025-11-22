package br.com.indicaAI.API.infrastructure.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String FILA_VALIDACAO_REQUEST = "validacao.documento.request";

    public static final String FILA_VALIDACAO_RESPONSE = "validacao.documento.response";

    @Bean
    public Queue queueRequest() {
        return new Queue(FILA_VALIDACAO_REQUEST, true);
    }

    @Bean
    public Queue queueResponse() {
        return new Queue(FILA_VALIDACAO_RESPONSE, true);
    }
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
