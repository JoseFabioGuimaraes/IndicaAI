import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {

    private readonly API = 'http://localhost:8080/empresas/cadastro';

    constructor(private http: HttpClient) { }

    cadastrar(dados: any): Observable<any> {
        return this.http.post(this.API, dados);
    }
}
