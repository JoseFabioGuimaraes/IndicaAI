import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe o service que você criou anteriormente
import { Avaliacao, AvaliacaoService } from '../../services/avaliacao';

@Component({
    selector: 'app-minhas-avaliacoes',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './minhas-avaliacoes.component.html',
    styleUrl: './minhas-avaliacoes.component.scss'
})
export class MinhasAvaliacoesComponent implements OnInit {
    avaliacoes: Avaliacao[] = [];
    loading = true;
    erroMsg = '';

    constructor(
        private avaliacaoService: AvaliacaoService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.avaliacaoService.getMinhasAvaliacoes().subscribe({
            next: (dados) => {
                console.log('Dados recebidos da API:', dados);
                this.avaliacoes = dados;
                this.loading = false;
                this.cdr.detectChanges(); // Força a atualização da tela
                console.log('Loading definido para false. Avaliacoes:', this.avaliacoes);
            },
            error: (erro) => {
                console.error('Erro de API:', erro);
                this.erroMsg = 'Não foi possível carregar as avaliações.';
                this.loading = false;
            }
        });
    }

    calcularPontuacao(metricas: any): number {
        if (!metricas) return 0;
        const { notaAssiduidade, notaTecnica, notaComportamental } = metricas;
        const media = (notaAssiduidade + notaTecnica + notaComportamental) / 3;
        return Math.round(media);
    }

    // Lógica para colorir a nota
    getClassePontuacao(nota: number): string {
        if (nota >= 80) return 'high';   // Verde
        if (nota >= 50) return 'medium'; // Amarelo
        return 'low';                    // Vermelho
    }
}