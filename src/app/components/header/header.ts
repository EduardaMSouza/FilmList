import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  menuAberto = false;
  busca: string = '';

  @Output() buscaChange = new EventEmitter<string>();

  constructor(private router: Router) {}

  filtrarFilmes() {
    this.buscaChange.emit(this.busca);
  }

  onEnterBusca() {
    this.buscaChange.emit(this.busca);
    this.router.navigate(['/filmes'], { queryParams: { busca: this.busca } });
  }
}
