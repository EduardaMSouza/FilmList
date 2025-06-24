import { Routes } from '@angular/router';
import { Login } from './auth/login/login.component';
import { Cadastro } from './auth/cadastro/cadastro.component';
import { Inicio } from './auth/inicio/inicio';
import { FilmeDetalheComponent } from './pages/filme-detalhes/filme-detalhe';
import { MinhaLista } from './auth/minha-lista/minha-lista';

export const routes: Routes = [
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Cadastro },
  { path: 'auth/inicio', component: Inicio },
  { path: 'minha-lista', component: MinhaLista },
  { path: 'inicio', component: Inicio },
  { path: 'filme/:id', component: FilmeDetalheComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },  
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
];
