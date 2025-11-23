package br.com.indicaAI.API.domain.shared;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Primary
public class SmtpEmailService implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    @Override
    public void enviarEmailAprovacao(String email, String nome) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(remetente);
        message.setTo(email);
        message.setSubject("Bem-vindo ao IndicaAI!");
        message.setText("Olá " + nome + ",\n\n"
                + "Seu perfil foi APROVADO com sucesso!\n"
                + "Acesse agora: http://link-do-seu-sistema.com\n\n"
                + "Atenciosamente,\nEquipe IndicaAI");

        mailSender.send(message);
        System.out.println("E-mail de aprovação enviado para: " + email);
    }

    @Override
    public void enviarEmailRejeicao(String email, String nome, String motivo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(remetente);
        message.setTo(email);
        message.setSubject("Atualização sobre seu cadastro no IndicaAI");
        message.setText("Olá " + nome + ",\n\n"
                + "Infelizmente não validamos seu perfil no momento.\n"
                + "Motivo: " + motivo + "\n\n"
                + "Você pode tentar novamente enviando novas fotos: http://link-correcao.com\n\n"
                + "Atenciosamente,\nEquipe IndicaAI");

        mailSender.send(message);
        System.out.println("E-mail de rejeição enviado para: " + email);
    }
}