import { Component } from '@angular/core';
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
    imports: [
        // RouterOutlet,
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

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
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
            console.log('Email:', this.email?.value);
            console.log('Senha:', this.senha?.value);
        } else {
            console.log('Formulário inválido');
        }
    }
}
