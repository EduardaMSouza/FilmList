import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrossel',
  templateUrl: './carrossel.component.html',
  styleUrls: ['./carrossel.component.scss']
})
export class CarrosselComponent implements OnInit, AfterViewInit {
  @Input() titulo: string = '';
  @Input() filmes: any[] = [];
  @ViewChild('carrosselWrapper', { static: false }) carrosselWrapper!: ElementRef;
  @ViewChild('card', { static: false }) card!: ElementRef;
  pageIndex: number = 0;
  pageSize: number = 1;

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.setPageSize(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.setPageSize();
  }

  setPageSize() {
    const width = window.innerWidth;
    if (width <= 600) { 
      this.pageSize = 1;
    } else if (width <= 1024) {
      this.pageSize = 4;
    } else { 
      this.pageSize = 7;
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
