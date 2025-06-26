import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CastCardComponent } from './components/cast-card.component';
import { CarrosselComponent } from './components/carrossel.component';
import { RatingComponent } from './components/rating.component';
import { MaterialModule } from './material-module';

@NgModule({
  declarations: [
    CastCardComponent,
    CarrosselComponent,
    RatingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatIconModule
  ],
  exports: [
    CastCardComponent,
    CarrosselComponent,
    RatingComponent,
    MaterialModule,
    MatIconModule
  ]
})
export class SharedModule { } 