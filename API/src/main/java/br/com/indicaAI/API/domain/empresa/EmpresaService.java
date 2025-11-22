package br.com.indicaAI.API.domain.empresa;

import br.com.indicaAI.API.domain.empresa.dtos.AlterarSenhaDTO;
import br.com.indicaAI.API.domain.empresa.dtos.AtualizarEmpresaDTO;
import br.com.indicaAI.API.domain.empresa.dtos.CadastroEmpresaDTO;
import br.com.indicaAI.API.domain.empresa.dtos.InformacoesEmpresaDTO;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaService(EmpresaRepository empresaRepository, PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Empresa cadastrarEmpresa(CadastroEmpresaDTO dados) {
        if (empresaRepository.existsByCnpj(dados.cnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado");
        }
        if (empresaRepository.existsByEmail(dados.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Empresa novaEmpresa = new Empresa();
        novaEmpresa.setRazaoSocial(dados.razaoSocial());
        novaEmpresa.setNomeFantasia(dados.nomeFantasia());
        novaEmpresa.setCnpj(dados.cnpj());
        novaEmpresa.setEmail(dados.email());
        novaEmpresa.setSenha(passwordEncoder.encode(dados.senha()));
        novaEmpresa.setStatus(StatusEmpresa.ATIVO);

        return empresaRepository.save(novaEmpresa);
    }

    @Transactional
    public Empresa atualizarEmpresa(AtualizarEmpresaDTO dados) {
        var empresa = empresaRepository.findById(dados.id())
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));

        if (empresa.getStatus() == StatusEmpresa.INATIVO) {
            throw new IllegalArgumentException("Empresa inativa não pode ser editada.");
        }

        if (dados.razaoSocial() != null) empresa.setRazaoSocial(dados.razaoSocial());
        if (dados.nomeFantasia() != null) empresa.setNomeFantasia(dados.nomeFantasia());
        if (dados.email() != null) empresa.setEmail(dados.email());
        if (dados.senha() != null) empresa.setSenha(passwordEncoder.encode(dados.senha()));

        return empresa;
    }

    @Transactional
    public void excluirEmpresa(UUID id) {
        var empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));

        empresa.inativar();
    }

    public InformacoesEmpresaDTO detalharEmpresa(UUID id) {
        var empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));

        if (empresa.getStatus() == StatusEmpresa.INATIVO) {
            throw new IllegalArgumentException("Empresa inativa / Conta desativada.");
        }

        return new InformacoesEmpresaDTO(empresa);
    }

    @Transactional
    public void alterarSenha(AlterarSenhaDTO dados) {
        var empresa = empresaRepository.findById(dados.id())
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));
        if (empresa.getStatus() == StatusEmpresa.INATIVO) {
            throw new IllegalArgumentException("Empresa inativa.");
        }
        if (!passwordEncoder.matches(dados.senhaAtual(), empresa.getSenha())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        empresa.setSenha(passwordEncoder.encode(dados.novaSenha()));

    }
}