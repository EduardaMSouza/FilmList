import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../services/filme.service';
import { CommonModule } from '@angular/common';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';

@Component({
  selector: 'app-minha-lista',
  standalone: true,
  imports: [CommonModule, CarrosselComponent],
  templateUrl: './minha-lista.html',
  styleUrl: './minha-lista.scss'
})
export class MinhaLista implements OnInit {
  showSearchInput = false;
  filmes: any[] = [];
  filmesFiltrados: any[] = [];
  todosFilmes: any[] = [];
  
  // Filtros
  filtros = {
    assistido: false,
    praAssistir: false,
    jaAssistido: false
  };

  constructor(private filmeService: FilmeService) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.filmeService.getMinhaLista(userId).subscribe(userMovies => {
        const movieIds = userMovies.map(um => um.movieId);
        this.filmeService.getFilmesComNotas().subscribe(filmes => {
          this.todosFilmes = filmes.filter(filme => movieIds.includes(filme.id));
          this.filmes = [...this.todosFilmes];
          this.filmesFiltrados = [...this.todosFilmes];
        });
      });
    }
  }

  // Método para aplicar filtros
  aplicarFiltros() {
    this.filmesFiltrados = this.todosFilmes.filter(filme => {
      // Aqui você pode implementar a lógica de filtro baseada no status do filme
      // Por enquanto, vamos mostrar todos os filmes se nenhum filtro estiver ativo
      const nenhumFiltroAtivo = !this.filtros.assistido && !this.filtros.praAssistir && !this.filtros.jaAssistido;
      
      if (nenhumFiltroAtivo) {
        return true;
      }
      
      // Implementar lógica de filtro baseada no status do filme
      // Por exemplo, se o filme tem uma propriedade 'status' ou 'watched'
      if (this.filtros.assistido && filme.watched) {
        return true;
      }
      if (this.filtros.praAssistir && filme.watchlist) {
        return true;
      }
      if (this.filtros.jaAssistido && filme.completed) {
        return true;
      }
      
      return false;
    });
    
    this.filmes = [...this.filmesFiltrados];
  }

  // Método para alternar filtros
  toggleFiltro(tipo: 'assistido' | 'praAssistir' | 'jaAssistido') {
    this.filtros[tipo] = !this.filtros[tipo];
    this.aplicarFiltros();
  }

  // Método para limpar todos os filtros
  limparFiltros() {
    this.filtros = {
      assistido: false,
      praAssistir: false,
      jaAssistido: false
    };
    this.filmes = [...this.todosFilmes];
    this.filmesFiltrados = [...this.todosFilmes];
  }
}
