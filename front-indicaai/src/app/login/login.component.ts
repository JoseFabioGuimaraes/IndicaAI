import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Login attempt:', this.loginForm.value);
            alert('Login simulado! (Lógica de backend pendente)');
        } else {
            alert('Preencha todos os campos corretamente.');
        }
    }

    irParaCadastro() {
        this.router.navigate(['/cadastro']);
    }
}
