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
  pageIndex: number = 0;
  readonly pageSize: number = 10;

  get pagedFilmes() {
    const start = this.pageIndex * this.pageSize;
    return this.filmes.slice(start, start + this.pageSize);
  }

  get canScrollLeft() {
    return this.pageIndex > 0;
  }

  get canScrollRight() {
    return (this.pageIndex + 1) * this.pageSize < this.filmes.length;
  }

  scrollLeft() {
    if (this.canScrollLeft) {
      this.pageIndex--;
    }
  }

  scrollRight() {
    if (this.canScrollRight) {
      this.pageIndex++;
    }
  }
} 
