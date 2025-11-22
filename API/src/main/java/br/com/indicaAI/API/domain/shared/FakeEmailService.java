package br.com.indicaAI.API.domain.shared;

import br.com.indicaAI.API.domain.shared.EmailService;
import org.springframework.stereotype.Service;

@Service
public class FakeEmailService implements EmailService {
    @Override
    public void enviarEmailAprovacao(String email, String nome) {
        System.out.println("\n[EMAIL ENVIADO] --------------------------------");
        System.out.println("Para: " + email);
        System.out.println("Assunto: Bem-vindo ao IndicaAI!");
        System.out.println("Olá " + nome + ", seu perfil foi APROVADO! Acesse: http://link...");
        System.out.println("------------------------------------------------\n");
    }

    @Override
    public void enviarEmailRejeicao(String email, String nome, String motivo) {
        System.out.println("\n[EMAIL ENVIADO] --------------------------------");
        System.out.println("Para: " + email);
        System.out.println("Assunto: Problema no cadastro IndicaAI");
        System.out.println("Olá " + nome + ", infelizmente não validamos seu perfil.");
        System.out.println("Motivo: " + motivo);
        System.out.println("Envie novas fotos aqui: http://novo-link...");
        System.out.println("------------------------------------------------\n");
    }
}