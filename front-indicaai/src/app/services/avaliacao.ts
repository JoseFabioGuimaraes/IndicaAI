import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MetricasAvaliacao {
    notaAssiduidade: number;
    notaTecnica: number;
    notaComportamental: number;
}

export interface Avaliacao {
    id: string; // UUID
    nomeEmpresa: string;
    nomeFuncionario: string;
    metricas: MetricasAvaliacao;
    descricao: string;
    resposta: string;
    dataAvaliacao: string; // ISO Date string
}

@Injectable({
    providedIn: 'root'
})
export class AvaliacaoService {

    // URL base da sua API
    private readonly API = 'http://localhost:8080/avaliacoes';

    constructor(private http: HttpClient) { }

    /**
     * Busca as avaliações do funcionário logado.
     * Endpoint: GET /avaliacoes/minhas
     */
    getMinhasAvaliacoes(): Observable<Avaliacao[]> {
        return this.http.get<Avaliacao[]>(`${this.API}/minhas`);
    }
}