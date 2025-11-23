import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'login', component: LoginComponent }
];
