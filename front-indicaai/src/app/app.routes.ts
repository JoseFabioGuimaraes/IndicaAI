import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { DashboardFuncionarioComponent } from './funcionario/dashboard.component';
import { MinhasAvaliacoesComponent } from './funcionario/minhas-avaliacoes/minhas-avaliacoes.component';
import { PerfilComponent } from './funcionario/perfil/perfil.component';

export const routes: Routes = [
    // Redireciona para login ao abrir o site
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'cadastro', component: CadastroComponent },
    { path: 'login', component: LoginComponent },

    // Rota Principal do Funcionário
    {
        path: 'funcionario',
        component: DashboardFuncionarioComponent,
        children: [
            // Ao entrar em /funcionario, vai direto para /funcionario/avaliacoes
            { path: '', redirectTo: 'avaliacoes', pathMatch: 'full' },
            { path: 'avaliacoes', component: MinhasAvaliacoesComponent },
            // Placeholder para perfil (para não quebrar o link do menu)
            { path: 'perfil', component: PerfilComponent }
        ]
    }
];