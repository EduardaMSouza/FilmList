import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../services/filme.service';
import { UserMovieService } from '../../services/user-movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { HeaderComponent } from '../../components/header/header';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filmes',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, CarrosselComponent, FormsModule, NouisliderModule, MatSelectModule],
  templateUrl: './filmes.html',
  styleUrl: './filmes.scss'
})
export class Filmes implements OnInit {
  showSearchInput = false;
  filmes: any[] = [];
  filmesFiltrados: any[] = [];
  todosFilmes: any[] = [];
  busca: string = '';
  
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
  };

  menuAberto = false;
  
  modoAdicao = false;
  filmesSelecionados: Set<number> = new Set();

  paginaAtual: number = 1;
  tamanhoPagina: number = 8;

  ordenacao: string = 'nota';

  constructor(
    private filmeService: FilmeService,
    private userMovieService: UserMovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['busca'] !== undefined) {
        this.busca = params['busca'];
        setTimeout(() => this.filtrarFilmes(), 0);
      }
    });
    this.filmeService.getFilmesComNotas().subscribe((filmes: any[]) => {
      this.todosFilmes = filmes;
      this.filmes = [...this.todosFilmes];
      this.filmesFiltrados = [...this.todosFilmes];
      this.ordenarFilmes();
      if (this.busca) {
        setTimeout(() => this.filtrarFilmes(), 0);
      }
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
      this.filmeService.getFilmesPorAnoEGenero(this.anosSelecionados[0], this.anosSelecionados[1], generosAtivos[0])
        .subscribe(filmes => {
          this.filmesFiltrados = filmes;
          this.filtrarFilmes();
        });
    } else {
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

  ordenarFilmes() {
    if (this.ordenacao === 'nota') {
      this.filmes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (this.ordenacao === 'nome') {
      this.filmes.sort((a, b) => a.title.localeCompare(b.title));
    }
    this.paginaAtual = 1;
  }

  filtrarFilmes() {
    const termo = this.busca.trim().toLowerCase();
    if (!termo) {
      this.filmes = [...this.filmesFiltrados];
      this.ordenarFilmes();
      this.paginaAtual = 1;
      return;
    }
    this.filmes = this.filmesFiltrados.filter(filme =>
      filme.title.toLowerCase().includes(termo)
    );
    this.ordenarFilmes();
    this.paginaAtual = 1;
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

  onBuscaChange(valor: string) {
    this.busca = valor;
    this.filtrarFilmes();
  }

  get filmesPaginados(): any[] {
    const inicio = (this.paginaAtual - 1) * this.tamanhoPagina;
    const fim = inicio + this.tamanhoPagina;
    return this.filmes.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.filmes.length / this.tamanhoPagina) || 1;
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
  }

  paginasExibidas(): number[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;
    const paginas: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) paginas.push(i);
    } else {
      if (atual <= 4) {
        for (let i = 1; i <= 5; i++) paginas.push(i);
        paginas.push(total - 1, total);
      } else if (atual >= total - 3) {
        paginas.push(1, 2);
        for (let i = total - 4; i <= total; i++) paginas.push(i);
      } else {
        paginas.push(1, 2, atual - 1, atual, atual + 1, total - 1, total);
      }
    }
    return Array.from(new Set(paginas)).filter(p => p >= 1 && p <= total);
  }
}