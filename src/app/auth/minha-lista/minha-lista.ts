import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../services/filme.service';
import { UserMovieService } from '../../services/user-movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  
  modoRemocao = false;
  filmesSelecionados: Set<number> = new Set();

  paginaAtual: number = 1;
  tamanhoPagina: number = 8;

  constructor(
    private filmeService: FilmeService,
    private userMovieService: UserMovieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filmeService.getFilmesMinhaLista().subscribe(filmes => {
      this.todosFilmes = filmes;
      this.filmes = [...this.todosFilmes];
      this.filmesFiltrados = [...this.todosFilmes];
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
    });
  }

  cancelarRemocao() {
    this.filmesSelecionados.clear();
    this.modoRemocao = false;
  }

  aplicarFiltros() {
    this.filmesFiltrados = this.todosFilmes.filter(filme => {
      const nenhumFiltroAtivo = !this.filtros.assistido && !this.filtros.praAssistir && !this.filtros.jaAssistido;
      if (nenhumFiltroAtivo) return true;
      if (this.filtros.assistido && filme.status === 'assistindo') return true;
      if (this.filtros.praAssistir && (filme.status === 'pra-assistir' || filme.status === '')) return true;
      if (this.filtros.jaAssistido && filme.status === 'ja-assisti') return true;
      return false;
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
      this.paginaAtual = 1;
      return;
    }
    this.filmes = this.filmesFiltrados.filter(filme =>
      filme.title.toLowerCase().includes(termo)
    );
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
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
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

}
