package br.com.indicaAI.API.domain.autenticacao;

import br.com.indicaAI.API.domain.empresa.EmpresaRepository;
import br.com.indicaAI.API.domain.funcionario.FuncionarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    private final FuncionarioRepository funcionarioRepository;
    private final EmpresaRepository empresaRepository;

    public AutenticacaoService(FuncionarioRepository funcionarioRepository, EmpresaRepository empresaRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.empresaRepository = empresaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var funcionario = funcionarioRepository.findByEmail(username);
        if (funcionario != null) {
            return (UserDetails) funcionario;
        }
        var empresa = empresaRepository.findByEmail(username);
        if (empresa != null) {
            return (UserDetails) empresa;
        }

        throw new UsernameNotFoundException("Usuário ou empresa não encontrado");
    }
}