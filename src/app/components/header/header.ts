import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
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
