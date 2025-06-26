import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { CadastroComponent } from './features/auth/cadastro.component';
import { FilmeDetalheComponent } from './features/filmes/filme-detalhe.component';
import { MinhaListaComponent } from './features/minha-lista/minha-lista.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: CadastroComponent },
  { path: 'minha-lista', component: MinhaListaComponent },
  { path: 'filme/:id', component: FilmeDetalheComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },  
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' },
];
