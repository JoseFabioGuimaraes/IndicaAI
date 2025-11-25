import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Funcionario, FuncionarioService } from '../../services/funcionario';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
    funcionario: Funcionario | null = null;
    loading = true;

    constructor(
        private funcionarioService: FuncionarioService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.funcionarioService.getMeuPerfil().subscribe({
            next: (dados) => {
                this.funcionario = dados;
                this.loading = false;
                this.cdr.detectChanges(); // Força a atualização da tela
            },
            error: (erro) => {
                console.error('Erro ao carregar perfil:', erro);
                this.loading = false;
            }
        });
    }
}
