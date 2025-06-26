import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './header.component';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatIconModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class LayoutModule { } 