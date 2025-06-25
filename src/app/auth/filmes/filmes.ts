import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../services/filme.service';
import { UserMovieService } from '../../services/user-movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';

@Component({
  selector: 'app-filmes',
  standalone: true,
  imports: [CommonModule, RouterModule, CarrosselComponent, FormsModule, NouisliderModule],
  templateUrl: './filmes.html',
  styleUrl: './filmes.scss'
})
export class Filmes implements OnInit {
  showSearchInput = false;
  filmes: any[] = [];
  filmesFiltrados: any[] = [];
  todosFilmes: any[] = [];
  busca: string = '';
  
  // Filtros de ano e gêneros para o novo layout
  anoMin = 1910;
  anoMax = 2025;
  anosSelecionados: number[] = [this.anoMin, this.anoMax];

  generosPrincipais = ['Ação', 'Aventura', 'Romance'];
  generosExtras = ['Comédia', 'Drama', 'Ficção', 'Terror', 'Suspense', 'Animação', 'Documentário'];
  mostrarTodosGeneros = false;

  get generosVisiveis() {
    return this.generosPrincipais;
  }
  get generosOcultos() {
    return this.generosExtras;
  }

  filtros = {
    generos: {} as { [key: string]: boolean },
    // outros filtros podem ser adicionados aqui
  };

  menuAberto = false;
  
  modoAdicao = false;
  filmesSelecionados: Set<number> = new Set();

  constructor(
    private filmeService: FilmeService,
    private userMovieService: UserMovieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filmeService.getFilmesComNotas().subscribe((filmes: any[]) => {
      this.todosFilmes = filmes;
      this.filmes = [...this.todosFilmes];
      this.filmesFiltrados = [...this.todosFilmes];
      console.log('Todos os filmes:', this.todosFilmes);
    });
  }

  navegarParaDetalhes(filmeId: number) {
    this.router.navigate(['/filme', filmeId]);
  }

  toggleModoAdicao() {
    this.modoAdicao = !this.modoAdicao;
    if (!this.modoAdicao) {
      this.filmesSelecionados.clear();
    }
  }

  toggleSelecaoFilme(filme: any, event: Event) {
    if (!this.modoAdicao) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const filmeId = filme.id;
    if (this.filmesSelecionados.has(filmeId)) {
      this.filmesSelecionados.delete(filmeId);
    } else {
      this.filmesSelecionados.add(filmeId);
    }
  }

  isFilmeSelecionado(filme: any): boolean {
    return this.filmesSelecionados.has(filme.id);
  }

  adicionarFilmesSelecionados() {
    if (this.filmesSelecionados.size === 0) return;

    const promises = Array.from(this.filmesSelecionados).map(filmeId => {
      const userMovieData = {
        movieId: filmeId,
        status: 'pra-assistir'
      };
      return this.userMovieService.createUserMovie(userMovieData).toPromise();
    });

    Promise.all(promises).then(() => {
      console.log('Filmes adicionados com sucesso!');
      this.filmesSelecionados.clear();
      this.modoAdicao = false;
    }).catch(error => {
      console.error('Erro ao adicionar filmes:', error);
    });
  }

  cancelarAdicao() {
    this.filmesSelecionados.clear();
    this.modoAdicao = false;
  }

  temFiltrosAtivos(): boolean {
    return Object.values(this.filtros.generos).some(filtro => filtro === true);
  }

  toggleGenero(genero: string) {
    this.filtros.generos[genero] = !this.filtros.generos[genero];
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const generosAtivos = Object.keys(this.filtros.generos).filter(g => this.filtros.generos[g]);
    if (generosAtivos.length === 1) {
      // Filtro de ano + gênero no backend
      this.filmeService.getFilmesPorAnoEGenero(this.anosSelecionados[0], this.anosSelecionados[1], generosAtivos[0])
        .subscribe(filmes => {
          this.filmesFiltrados = filmes;
          this.filtrarFilmes();
        });
    } else {
      // Filtro de ano no backend, múltiplos gêneros no frontend
      this.filmeService.getFilmesPorAno(this.anosSelecionados[0], this.anosSelecionados[1])
        .subscribe(filmes => {
          if (generosAtivos.length > 1) {
            this.filmesFiltrados = filmes.filter(filme =>
              filme.genres && generosAtivos.some(g =>
                Array.isArray(filme.genres) ? filme.genres.includes(g) : filme.genres === g
              )
            );
          } else {
            this.filmesFiltrados = filmes;
          }
          this.filtrarFilmes();
        });
    }
  }

  limparFiltros() {
    this.filtros = {
      generos: {} as { [key: string]: boolean },
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

  ajustarAnoMin() {
    if (this.anosSelecionados[0] > this.anosSelecionados[1]) {
      this.anosSelecionados[0] = this.anosSelecionados[1];
    }
    this.aplicarFiltros();
  }

  ajustarAnoMax() {
    if (this.anosSelecionados[1] < this.anosSelecionados[0]) {
      this.anosSelecionados[1] = this.anosSelecionados[0];
    }
    this.aplicarFiltros();
  }
}