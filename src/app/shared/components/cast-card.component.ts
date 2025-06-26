import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cast-card',
  templateUrl: './cast-card.component.html',
  styleUrls: ['./cast-card.component.scss']
})
export class CastCardComponent {
  @Input() nome: string = '';
  @Input() nomePersonagem: string = '';
  @Input() imageUrl: string = '';
}
