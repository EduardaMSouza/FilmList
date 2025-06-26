import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { CadastroComponent } from './cadastro.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  declarations: [
    LoginComponent,
    CadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MaterialModule
  ],
  exports: [
    LoginComponent,
    CadastroComponent
  ]
})
export class AuthFeatureModule { } 