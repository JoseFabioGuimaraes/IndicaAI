package br.com.indicaAI.API.controllers.funcionario;

import br.com.indicaAI.API.domain.funcionario.Funcionario;
import br.com.indicaAI.API.domain.funcionario.FuncionarioService;
import br.com.indicaAI.API.domain.funcionario.dtos.CadastroFuncionarioDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Funcionario> cadastrar(
            @RequestBody @Valid CadastroFuncionarioDTO dto,
            UriComponentsBuilder uriBuilder
    ) {
        Funcionario novoFuncionario = funcionarioService.cadastrarFuncionario(dto);
        URI uri = uriBuilder.path("/funcionarios/{id}").buildAndExpand(novoFuncionario.getId()).toUri();
        return ResponseEntity.created(uri).body(novoFuncionario);
    }
}