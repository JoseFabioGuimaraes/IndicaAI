package br.com.indicaAI.API.controllers.avaliacao;

import br.com.indicaAI.API.domain.avaliacao.AvaliacaoService;
import br.com.indicaAI.API.domain.avaliacao.dtos.CriarAvaliacaoDTO;
import br.com.indicaAI.API.domain.avaliacao.dtos.DetalhamentoAvaliacaoDTO;
import br.com.indicaAI.API.domain.avaliacao.dtos.ResponderAvaliacaoDTO;
import br.com.indicaAI.API.domain.empresa.Empresa;
import br.com.indicaAI.API.domain.funcionario.Funcionario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping("/criar")
    public ResponseEntity<DetalhamentoAvaliacaoDTO> avaliar(
            @RequestBody @Valid CriarAvaliacaoDTO dto,
            @AuthenticationPrincipal Empresa empresaLogada,
            UriComponentsBuilder uriBuilder
    ) {
        var avaliacao = avaliacaoService.avaliar(dto, empresaLogada);
        URI uri = uriBuilder.path("/avaliacoes/{id}").buildAndExpand(avaliacao.id()).toUri();
        return ResponseEntity.created(uri).body(avaliacao);
    }

    @PostMapping("/{id}/responder")
    public ResponseEntity<DetalhamentoAvaliacaoDTO> responder(
            @PathVariable UUID id,
            @RequestBody @Valid ResponderAvaliacaoDTO dto,
            @AuthenticationPrincipal Funcionario funcionarioLogado
    ) {
        var resposta = avaliacaoService.responder(id, dto, funcionarioLogado);
        return ResponseEntity.ok(resposta);
    }

    // FUNCIONÁRIO VÊ SUAS PRÓPRIAS AVALIAÇÕES
    @GetMapping("/minhas")
    public ResponseEntity<List<DetalhamentoAvaliacaoDTO>> listarMinhas(
            @AuthenticationPrincipal Funcionario funcionarioLogado
    ) {
        var lista = avaliacaoService.listarPorFuncionario(funcionarioLogado.getId());
        return ResponseEntity.ok(lista);
    }

    // NOVO: EMPRESA VÊ HISTÓRICO DE UM FUNCIONÁRIO (DE TODAS AS EMPRESAS)
    @GetMapping("/funcionario/{id}")
    public ResponseEntity<List<DetalhamentoAvaliacaoDTO>> listarHistoricoDeFuncionario(
            @PathVariable UUID id
    ) {
        // Retorna a lista completa, onde cada item tem o nome da empresa que avaliou
        var lista = avaliacaoService.listarPorFuncionario(id);
        return ResponseEntity.ok(lista);
    }
}