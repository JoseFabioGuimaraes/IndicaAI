package br.com.indicaAI.API.domain.shared;

public interface EmailService {
    void enviarEmailAprovacao(String email, String nome);
    void enviarEmailRejeicao(String email, String nome, String motivo);
}