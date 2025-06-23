import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component'; 
import { FilmeDetalheComponent } from './pages/filme-detalhes/filme-detalhe';
import { Card } from './shared/card/cast-card';
import { RatingComponent } from './rating/rating.component';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FilmeDetalheComponent,
    Card,
    RatingComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
