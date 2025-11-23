package br.com.indicaAI.API.infrastructure.security;

import br.com.indicaAI.API.domain.empresa.Empresa;
import br.com.indicaAI.API.domain.funcionario.Funcionario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Object usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            String subject = "";
            String tipo = "";

            if (usuario instanceof Funcionario f) {
                subject = f.getEmail();
                tipo = "FUNCIONARIO";
            } else if (usuario instanceof Empresa e) {
                subject = e.getEmail();
                tipo = "EMPRESA";
            }

            return JWT.create()
                    .withIssuer("IndicaAI")
                    .withSubject(subject)
                    .withClaim("tipo", tipo) // Guardamos o tipo para ajudar na validação
                    .withExpiresAt(dataExpiracao())
                    .sign(algoritmo);
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token", exception);
        }
    }

    public String getSubject(String tokenJWT) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("IndicaAI")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException exception){
            throw new RuntimeException("Token inválido ou expirado!");
        }
    }

    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
