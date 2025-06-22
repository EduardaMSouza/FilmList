import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { Login } from './login/login.component';       // 👈 importe os componentes
import { Cadastro } from './cadastro/cadastro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule,
        Login,    
    Cadastro
  ]
})
export class AuthModule { }
