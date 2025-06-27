import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cast-card',
  imports: [CommonModule],
  templateUrl: './cast-card.html',
  styleUrls: ['./cast-card.scss']
})
export class Card {
  @Input() nome: string = '';
  @Input() nomePersonagem: string = '';
  @Input() imageUrl: string = '';
}
