import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../services/filme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-minha-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, CarrosselComponent, FormsModule],
  templateUrl: './minha-lista.html',
  styleUrl: './minha-lista.scss'
})
export class MinhaLista implements OnInit {
  showSearchInput = false;
  filmes: any[] = [];
  filmesFiltrados: any[] = [];
  todosFilmes: any[] = [];
  busca: string = '';
  
  filtros = {
    assistido: false,
    praAssistir: false,
    jaAssistido: false
  };

  menuAberto = false;

  constructor(private filmeService: FilmeService) {}

  ngOnInit() {
    this.filmeService.getFilmesMinhaLista().subscribe(filmes => {
      this.todosFilmes = filmes;
      this.filmes = [...this.todosFilmes];
      this.filmesFiltrados = [...this.todosFilmes];
      console.log('Filmes da minha lista:', this.todosFilmes);
    });
  }

  aplicarFiltros() {
    this.filmesFiltrados = this.todosFilmes.filter(filme => {
      const nenhumFiltroAtivo = !this.filtros.assistido && !this.filtros.praAssistir && !this.filtros.jaAssistido;
      
      if (nenhumFiltroAtivo) {
        return true;
      }
      
      if (this.filtros.assistido && filme.status === 'assistindo') {
        return true;
      }
      if (this.filtros.praAssistir && (filme.status === 'pra-assistir' || filme.status === '')) {
        return true;
      }
      if (this.filtros.jaAssistido && filme.status === 'ja-assisti') {
        return true;
      }
      
      return false;
    });
    this.filtrarFilmes();
  }

  toggleFiltro(tipo: 'assistido' | 'praAssistir' | 'jaAssistido') {
    this.filtros[tipo] = !this.filtros[tipo];
    this.aplicarFiltros();
  }

  limparFiltros() {
    this.filtros = {
      assistido: false,
      praAssistir: false,
      jaAssistido: false
    };
    this.filmes = [...this.todosFilmes];
    this.filmesFiltrados = [...this.todosFilmes];
    this.filtrarFilmes();
  }

  filtrarFilmes() {
    const termo = this.busca.trim().toLowerCase();
    if (!termo) {
      this.filmes = [...this.filmesFiltrados];
      return;
    }
    this.filmes = this.filmesFiltrados.filter(filme =>
      filme.title.toLowerCase().includes(termo)
    );
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'assistindo':
        return 'Assistindo';
      case 'pra-assistir':
        return 'Pra assistir';
      case 'ja-assisti':
        return 'Já assisti';
      case '':
        return 'Sem status';
      default:
        return 'Sem status';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'assistindo':
        return 'status-assistindo';
      case 'pra-assistir':
        return 'status-pra-assistir';
      case 'ja-assisti':
        return 'status-ja-assisti';
      case '':
        return 'status-sem-status';
      default:
        return 'status-sem-status';
    }
  }
}
