import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login.component';
import { Cadastro } from './cadastro/cadastro.component';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Cadastro }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
