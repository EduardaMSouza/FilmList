import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Core Module
import { CoreModule } from './core/core.module';

// Shared Module
import { SharedModule } from './shared/shared.module';

// Layout Module
import { LayoutModule } from './layout/layout.module';

// Feature Modules
import { AuthFeatureModule } from './features/auth/auth-feature.module';
import { FilmesFeatureModule } from './features/filmes/filmes-feature.module';
import { MinhaListaFeatureModule } from './features/minha-lista/minha-lista-feature.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    
    // Core Module (deve ser importado apenas uma vez)
    CoreModule,
    
    // Shared Module
    SharedModule,
    
    // Layout Module
    LayoutModule,
    
    // Feature Modules
    AuthFeatureModule,
    FilmesFeatureModule,
    MinhaListaFeatureModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
