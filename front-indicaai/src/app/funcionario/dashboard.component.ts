import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-dashboard-funcionario',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardFuncionarioComponent {
    menuAberto = false; // Controle do menu mobile

    constructor(private router: Router) { }

    toggleMenu() {
        this.menuAberto = !this.menuAberto;
    }

    logout() {
        // Futuramente aqui você limpará o token de autenticação
        this.router.navigate(['/login']);
    }
}