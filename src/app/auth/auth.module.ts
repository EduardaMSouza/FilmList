import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { Login } from './login/login.component';       // 👈 importe os componentes
import { Cadastro } from './cadastro/cadastro.component';
import { Inicio } from './inicio/inicio';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule,
        Login,    
    Cadastro,
    Inicio
  ]
})
export class AuthModule { }
