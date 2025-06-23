import { Routes } from '@angular/router';
import { Login } from './auth/login/login.component';
import { Cadastro } from './auth/cadastro/cadastro.component';
import { FilmeDetalheComponent } from './pages/filme-detalhes/filme-detalhe';
import { Inicio } from './inicio/inicio';

export const routes: Routes = [
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Cadastro },
  { path: 'filme/:id', component: FilmeDetalheComponent },
  {path:  'home', component: Inicio},
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },  
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
  

];
