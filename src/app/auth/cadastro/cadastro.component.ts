import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
    FormControl,
    NgForm,
    FormGroupDirective,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    selector: 'cadastro',
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
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.scss'],
})
export class Cadastro {
    cadastroForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    mensagemErro: string = '';
    mensagemSucesso: string = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.cadastroForm = this.fb.group(
            {
                nome: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                senha: ['', [Validators.required, Validators.minLength(6)]],
                confirmarSenha: ['', Validators.required],
            },
            { validators: this.senhasIguaisValidator() }
        );
    }

    get nome() {
        return this.cadastroForm.get('nome');
    }

    get email() {
        return this.cadastroForm.get('email');
    }

    get senha() {
        return this.cadastroForm.get('senha');
    }

    get confirmarSenha() {
        return this.cadastroForm.get('confirmarSenha');
    }

    onSubmit() {
        if (this.cadastroForm.valid) {
            const nome = this.nome?.value;
            const email = this.email?.value;
            const senha = this.senha?.value;

            this.authService.register(nome, email, senha).subscribe({
                next: (response) => {
                    this.mensagemSucesso = 'Cadastro realizado com sucesso!';
                    this.mensagemErro = '';
                    console.log('Usuário cadastrado:', response);
                    this.router.navigate(['/auth/login']);
                },
                error: (error) => {
                    console.error('Erro ao cadastrar:', error);
                    this.mensagemErro = 'Erro ao cadastrar. Tente novamente.';
                    this.mensagemSucesso = '';
                }
            });
        } else {
            this.mensagemErro = 'Preencha todos os campos corretamente.';
        }
    }

    private senhasIguaisValidator(): ValidatorFn {
        return (form: AbstractControl): { [key: string]: any } | null => {
            const senha = form.get('senha')?.value;
            const confirmarSenha = form.get('confirmarSenha')?.value;
            return senha === confirmarSenha ? null : { mismatch: true };
        };
    }
}
