import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgForm, FormGroupDirective, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched || isSubmitted)
        );
    }
}

@Component({
    selector: 'login',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class Login {
    protected title = 'film-list';
    loginForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    mensagemErro: string = '';

    constructor(
        private fb: FormBuilder, 
        private authService: AuthService, 
        private router: Router,
        private toastService: ToastService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(3)]],  
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    get senha() {
        return this.loginForm.get('senha');
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const email = this.email?.value;
            const senha = this.senha?.value;

            this.authService.login(email, senha).subscribe({
                next: (response) => {
                    this.authService.saveToken(response.token);
                    this.toastService.loginSuccess();
                    this.router.navigate(['/auth/inicio']);
                    console.log('Login bem-sucedido:', response);
                },
                error: (error) => {
                    console.error('Erro ao fazer login:', error);
                    this.toastService.loginError();
                    this.mensagemErro = 'Email ou senha inválidos';
                }
            });
        } else {
            this.toastService.warning('Preencha todos os campos corretamente', 'Campos Inválidos');
            this.mensagemErro = 'Preencha todos os campos corretamente';
        }
    }
}
