import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrossel.html',
  styleUrls: ['./carrossel.scss']
})
export class CarrosselComponent {
  @Input() titulo: string = '';
  @Input() filmes: any[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollLeft -= 220;
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollLeft += 220;
  }
} 
