import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  filtrarFilmes() {
    this.buscaChange.emit(this.busca);
  }
}
