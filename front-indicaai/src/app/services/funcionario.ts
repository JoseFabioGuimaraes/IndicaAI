import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Funcionario {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
  cargo: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private readonly API = 'http://localhost:8080/funcionarios';

  constructor(private http: HttpClient) { }

  cadastrar(dados: any): Observable<any> {
    return this.http.post(`${this.API}/cadastro`, dados);
  }

  getMeuPerfil(): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.API}/me`);
  }
}