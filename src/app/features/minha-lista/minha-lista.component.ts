import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../core/services/filme.service';
import { UserMovieService } from '../../core/services/user-movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrosselComponent } from '../../shared/components/carrossel.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-minha-lista',
  templateUrl: './minha-lista.component.html',
  styleUrl: './minha-lista.component.scss'
})
export class MinhaListaComponent implements OnInit {
  showSearchInput = false;
  filmes: any[] = [];
  filmesFiltrados: any[] = [];
  todosFilmes: any[] = [];
  busca: string = '';
  
  filtros = {
    assistido: false,
    praAssistir: false,
    jaAssistido: false,
    generos: {} as { [key: string]: boolean }
  };

  generosPrincipais = ['Ação', 'Aventura', 'Romance'];
  generosExtras = ['Comédia', 'Drama', 'Ficção', 'Terror', 'Suspense', 'Animação', 'Documentário'];
  mostrarTodosGeneros = false;

  get generosVisiveis() {
    return this.generosPrincipais;
  }

  get generosOcultos() {
    return this.generosExtras;
  }

  menuAberto = false;
  
  modoRemocao = false;
  filmesSelecionados: Set<number> = new Set();

  paginaAtual: number = 1;
  tamanhoPagina: number = 12;

  ordenacao: string = 'nota';

  constructor(
    private filmeService: FilmeService,
    private userMovieService: UserMovieService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.filmeService.getFilmesMinhaLista().subscribe(filmes => {
      this.todosFilmes = filmes;
      this.filmes = [...this.todosFilmes];
      this.filmesFiltrados = [...this.todosFilmes];
      this.ordenarFilmes();
      console.log('Filmes da minha lista:', this.todosFilmes);
    });
  }

  navegarParaDetalhes(filmeId: number) {
    this.router.navigate(['/filme', filmeId]);
  }

  toggleModoRemocao() {
    this.modoRemocao = !this.modoRemocao;
    if (!this.modoRemocao) {
      this.filmesSelecionados.clear();
    }
  }

  toggleSelecaoFilme(filme: any, event: Event) {
    if (!this.modoRemocao) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const userMovieId = filme.userMovieId;
    if (this.filmesSelecionados.has(userMovieId)) {
      this.filmesSelecionados.delete(userMovieId);
    } else {
      this.filmesSelecionados.add(userMovieId);
    }
  }

  isFilmeSelecionado(filme: any): boolean {
    return this.filmesSelecionados.has(filme.userMovieId);
  }

  removerFilmesSelecionados() {
    if (this.filmesSelecionados.size === 0) return;

    const promises = Array.from(this.filmesSelecionados).map(filmeId => {
      return this.userMovieService.deleteUserMovie(filmeId).toPromise();
    });

    Promise.all(promises).then(() => {
      this.toastService.moviesRemovedFromList(this.filmesSelecionados.size);
      this.filmeService.getFilmesMinhaLista().subscribe(filmes => {
        this.todosFilmes = filmes;
        this.filmes = [...this.todosFilmes];
        this.filmesFiltrados = [...this.todosFilmes];
        this.aplicarFiltros();
      });
      
      this.filmesSelecionados.clear();
      this.modoRemocao = false;
    }).catch(error => {
      console.error('Erro ao remover filmes:', error);
      this.toastService.genericError();
    });
  }

  cancelarRemocao() {
    this.filmesSelecionados.clear();
    this.modoRemocao = false;
  }

  temFiltrosAtivos(): boolean {
    return Object.values(this.filtros.generos).some(filtro => filtro === true) ||
           this.filtros.assistido || 
           this.filtros.praAssistir || 
           this.filtros.jaAssistido;
  }

  toggleGenero(genero: string) {
    this.filtros.generos[genero] = !this.filtros.generos[genero];
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.filmesFiltrados = this.todosFilmes.filter(filme => {
      const generosAtivos = Object.keys(this.filtros.generos).filter(g => this.filtros.generos[g]);
      const nenhumFiltroStatus = !this.filtros.assistido && !this.filtros.praAssistir && !this.filtros.jaAssistido;
      const nenhumFiltroGenero = generosAtivos.length === 0;
      
      if (nenhumFiltroStatus && nenhumFiltroGenero) return true;
      
      let passaFiltroStatus = nenhumFiltroStatus;
      if (!passaFiltroStatus) {
        if (this.filtros.assistido && filme.status === 'assistindo') passaFiltroStatus = true;
        if (this.filtros.praAssistir && (filme.status === 'pra-assistir' || filme.status === '')) passaFiltroStatus = true;
        if (this.filtros.jaAssistido && filme.status === 'ja-assisti') passaFiltroStatus = true;
      }
      
      let passaFiltroGenero = nenhumFiltroGenero;
      if (!passaFiltroGenero) {
        if (filme.genre_names && Array.isArray(filme.genre_names)) {
          passaFiltroGenero = generosAtivos.some(g => filme.genre_names.includes(g));
        } else if (filme.genres) {
          if (Array.isArray(filme.genres)) {
            passaFiltroGenero = generosAtivos.some(g => filme.genres.includes(g));
          } else {
            passaFiltroGenero = generosAtivos.some(g => filme.genres === g);
          }
        }
      }
      
      return passaFiltroStatus && passaFiltroGenero;
    });
    this.filtrarFilmes();
    this.paginaAtual = 1;
  }

  toggleFiltro(tipo: 'assistido' | 'praAssistir' | 'jaAssistido') {
    this.filtros[tipo] = !this.filtros[tipo];
    this.aplicarFiltros();
  }

  limparFiltros() {
    this.filtros = {
      assistido: false,
      praAssistir: false,
      jaAssistido: false,
      generos: {} as { [key: string]: boolean }
    };
    this.filmes = [...this.todosFilmes];
    this.filmesFiltrados = [...this.todosFilmes];
    this.filtrarFilmes();
  }

  ordenarFilmes() {
    if (this.ordenacao === 'nota') {
      this.filmes.sort((a, b) => ((b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0)));
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

  get filmesPaginados(): any[] {
    const inicio = (this.paginaAtual - 1) * this.tamanhoPagina;
    const fim = inicio + this.tamanhoPagina;
    return this.filmes.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.filmes.length / this.tamanhoPagina);
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
    const paginas: number[] = [];
    const inicio = Math.max(1, this.paginaAtual - 2);
    const fim = Math.min(this.totalPaginas, this.paginaAtual + 2);
    
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  onBuscaChange(valor: string) {
    this.busca = valor;
    this.filtrarFilmes();
  }
}
