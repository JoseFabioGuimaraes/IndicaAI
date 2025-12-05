package br.com.indicaAI.API.controllers.funcionario;

import br.com.indicaAI.API.domain.funcionario.Funcionario;
import br.com.indicaAI.API.domain.funcionario.FuncionarioService;
import br.com.indicaAI.API.domain.funcionario.dtos.AtualizacaoFuncionarioDTO;
import br.com.indicaAI.API.domain.funcionario.dtos.CadastroFuncionarioDTO;
import br.com.indicaAI.API.domain.funcionario.dtos.DetalhamentoFuncionarioDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<DetalhamentoFuncionarioDTO> cadastrar(
            @RequestBody @Valid CadastroFuncionarioDTO dto,
            UriComponentsBuilder uriBuilder) {
        var funcionarioDetalhado = funcionarioService.cadastrarFuncionario(dto);
        URI uri = uriBuilder.path("/funcionarios/{id}").buildAndExpand(funcionarioDetalhado.id()).toUri();
        return ResponseEntity.created(uri).body(funcionarioDetalhado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalhamentoFuncionarioDTO> detalhar(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails usuarioLogado) {
        if (usuarioLogado instanceof Funcionario f && !f.getId().equals(id)) {
            return ResponseEntity.status(403).build();
        }

        var dto = funcionarioService.detalhar(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/me")
    public ResponseEntity<DetalhamentoFuncionarioDTO> meuPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails instanceof Funcionario funcionarioLogado) {
            var dto = funcionarioService.detalhar(funcionarioLogado.getId());
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalhamentoFuncionarioDTO> atualizar(
            @PathVariable UUID id,
            @RequestBody @Valid AtualizacaoFuncionarioDTO dto,
            @AuthenticationPrincipal Funcionario funcionarioLogado) {
        if (!funcionarioLogado.getId().equals(id)) {
            return ResponseEntity.status(403).build();
        }

        var atualizado = funcionarioService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(
            @PathVariable UUID id,
            @AuthenticationPrincipal Funcionario funcionarioLogado) {
        if (!funcionarioLogado.getId().equals(id)) {
            return ResponseEntity.status(403).build();
        }

        funcionarioService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<java.util.List<DetalhamentoFuncionarioDTO>> buscar(
            @RequestParam String termo) {
        var lista = funcionarioService.buscarPorNome(termo);
        return ResponseEntity.ok(lista);
    }
}