import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface DadosAutenticacao {
    email: string;
    senha: string;
}

export interface DadosTokenJWT {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly API = 'http://localhost:8080/login';
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient, private router: Router) { }

    login(dados: DadosAutenticacao): Observable<DadosTokenJWT> {
        return this.http.post<DadosTokenJWT>(this.API, dados).pipe(
            tap(response => this.salvarToken(response.token))
        );
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.router.navigate(['/login']);
    }

    salvarToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    estaLogado(): boolean {
        return !!this.getToken();
    }
}
