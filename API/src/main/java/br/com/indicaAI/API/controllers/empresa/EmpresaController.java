package br.com.indicaAI.API.controllers.empresa;

import br.com.indicaAI.API.domain.empresa.Empresa;
import br.com.indicaAI.API.domain.empresa.EmpresaService;
import br.com.indicaAI.API.domain.empresa.dtos.AlterarSenhaDTO;
import br.com.indicaAI.API.domain.empresa.dtos.AtualizarEmpresaDTO;
import br.com.indicaAI.API.domain.empresa.dtos.CadastroEmpresaDTO;
import br.com.indicaAI.API.domain.empresa.dtos.InformacoesEmpresaDTO;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<InformacoesEmpresaDTO> cadastrar(@RequestBody @Valid CadastroEmpresaDTO dto, UriComponentsBuilder uriBuilder){
        Empresa novaEmpresa = empresaService.cadastrarEmpresa(dto);
        URI uri = uriBuilder.path("/empresas/{id}").buildAndExpand(novaEmpresa.getId()).toUri();
        return ResponseEntity.created(uri).body(new InformacoesEmpresaDTO(novaEmpresa));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<InformacoesEmpresaDTO> atualizar(@RequestBody @Valid AtualizarEmpresaDTO dto) {
        var empresaAtualizada = empresaService.atualizarEmpresa(dto);
        return ResponseEntity.ok(new InformacoesEmpresaDTO(empresaAtualizada));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        empresaService.excluirEmpresa(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InformacoesEmpresaDTO> detalhar(@PathVariable UUID id) {
        var dto = empresaService.detalharEmpresa(id);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/alterar-senha")
    @Transactional
    public ResponseEntity<Void> alterarSenha(@RequestBody @Valid AlterarSenhaDTO dados) {
        empresaService.alterarSenha(dados);
        return ResponseEntity.noContent().build();
    }
}
