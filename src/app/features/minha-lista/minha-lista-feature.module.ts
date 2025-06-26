import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MinhaListaComponent } from './minha-lista.component';
import { MaterialModule } from '../../shared/material-module';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    MinhaListaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    LayoutModule,
    SharedModule
  ],
  exports: [
    MinhaListaComponent
  ]
})
export class MinhaListaFeatureModule { } 