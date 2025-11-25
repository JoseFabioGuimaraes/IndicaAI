import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/funcionario']);
                },
                error: (err: any) => {
                    console.error('Erro no login:', err);
                    alert('Falha no login. Verifique suas credenciais.');
                }
            });
        } else {
            alert('Preencha todos os campos corretamente.');
        }
    }

    irParaCadastro() {
        this.router.navigate(['/cadastro']);
    }
}
