import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FilmeDetalheComponent } from './filme-detalhe.component';
import { MaterialModule } from '../../shared/material-module';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    FilmeDetalheComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    LayoutModule,
    SharedModule,
    FilmeDetalheComponent
  ],
  exports: [
    FilmeDetalheComponent
  ]
})
export class FilmesFeatureModule { } 