import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrossel.html',
  styleUrls: ['./carrossel.scss']
})
export class CarrosselComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() filmes: any[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(private router: Router) {}

  ngOnInit() {
    this.setPageSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.setPageSize();
  }

  setPageSize() {
    const width = window.innerWidth;
    if (width < 640) { // mobile
      this.pageSize = 2;
    } else if (width < 1024) { // tablet
      this.pageSize = 5;
    } else { // desktop
      this.pageSize = 10;
    }
    this.pageIndex = 0;
  }

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

  navegarParaFilme(filme: any) {
    if (filme && filme.id) {
      this.router.navigate(['/filme', filme.id]);
    }
  }
} 
