import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { FilmeService } from '../../services/filme.service';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-inicio',
  imports: [HeaderComponent, RouterLink, NgFor, NgClass, CarrosselComponent, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
  standalone: true
})
export class Inicio implements OnInit, OnDestroy {
  filmes: any[] = [];
  filmesContinuarAssistindo: any[] = [];
  filmesMelhorAvaliados: any[] = [];
  filmesAventura: any[] = [];
  filmesTerror: any[] = [];
  filmesComedia: any[] = [];
  filmesDrama: any[] = [];

  banners = [
    {
      imagem: 'https://occ-0-8407-90.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABVr3AdhNeyrkV5sEf77Or41uiW1k_PNS0dxk2LGzXXjDRAHhRYfBJqm0RlSKiOlnV-A-9fC_u1g3euupMaFmKo3uoHedUlwSwTKJ.jpg?r=850',
      titulo: 'The Witcher',
      descricao: 'Acompanhe Geralt de Rívia em um mundo de fantasia repleto de monstros e magia.'
    },
    {
      imagem: 'https://rollingstone.com.br/media/uploads/la-casa-de-papel-parte-4-reproducao.jpg',
      titulo: 'La Casa de Papel',
      descricao: 'O maior assalto da história, com muita ação e reviravoltas.'
    },
    {
      imagem: 'https://nexo-uploads-beta.s3.amazonaws.com/wp-content/uploads/2023/11/29123634/stranger_binary_291670.jpg',
      titulo: 'Stranger Things',
      descricao: 'Mistério, aventura e nostalgia dos anos 80 em Hawkins.'
    },
    {
      imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWCo71Imdx5aEIO6VQ2MS8eWvymlsfWpbwvy269YA3UpYgLAAUEcxmEf0evt9b7KntkQMvBKKTVdlwoXbg2M1ycDGW7d46U2dlvZzGXNxrX0p2Oc5w7nSPpsLbq0FjbyBQHaTZpcnYbbE/s1600/Dark-Netflix.jpg',
      titulo: 'Dark',
      descricao: 'Uma viagem no tempo cheia de suspense e enigmas.'
    },
    {
      imagem: 'https://www.em.com.br/emfoco/wp-content/uploads/2025/05/08102112308116-1.jpg',
      titulo: 'Round 6',
      descricao: 'Um jogo mortal onde só um pode sobreviver.'
    }
  ];

  bannerAtivo = 0;
  private bannerTimer: any;

  constructor(private filmeService: FilmeService, private router: Router) {}

  ngOnInit() {
    this.filmeService.getFilmesComNotas().subscribe((data: any[]) => {
      this.filmes = data;
      this.filmesMelhorAvaliados = [...data].sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0)).slice(0, 20);
    });
    this.filmeService.getFilmesMinhaLista('assistindo').subscribe((data: any[]) => {
      this.filmesContinuarAssistindo = data;
    });
    this.filmeService.getFilmesPorGenero('Aventura').subscribe(filmes => this.filmesAventura = filmes.slice(0, 20));
    this.filmeService.getFilmesPorGenero('Terror').subscribe(filmes => this.filmesTerror = filmes.slice(0, 20));
    this.filmeService.getFilmesPorGenero('Comédia').subscribe(filmes => this.filmesComedia = filmes.slice(0, 20));
    this.filmeService.getFilmesPorGenero('Drama').subscribe(filmes => this.filmesDrama = filmes.slice(0, 20));
    this.iniciarTimerBanners();
    console.log(this.filmesContinuarAssistindo)
  }

  ngOnDestroy() {
    if (this.bannerTimer) {
      clearInterval(this.bannerTimer);
    }
  }

  iniciarTimerBanners() {
    this.bannerTimer = setInterval(() => {
      this.proximoBanner();
    }, 4000);
  }

  pararTimerBanners() {
    if (this.bannerTimer) {
      clearInterval(this.bannerTimer);
    }
  }

  reiniciarTimerBanners() {
    this.pararTimerBanners();
    this.iniciarTimerBanners();
  }

  bannerAnterior() {
    this.bannerAtivo = (this.bannerAtivo - 1 + this.banners.length) % this.banners.length;
    this.reiniciarTimerBanners();
  }

  proximoBanner() {
    this.bannerAtivo = (this.bannerAtivo + 1) % this.banners.length;
  }

  irParaBanner(index: number) {
    this.bannerAtivo = index;
    this.reiniciarTimerBanners();
  }

  irParaMinhaLista() {
    this.router.navigate(['/auth/minha-lista']);
  }
}
