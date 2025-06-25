import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmeService } from '../../services/filme.service';
import { CommonModule } from '@angular/common';
import { Card } from '../../shared/card/cast-card';
import { RatingComponent } from '../../rating/rating.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filme as FilmeBase } from '../../services/filme.service';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';
import { HeaderComponent } from '../../components/header/header';

interface CastMember {  
  name: string;
  character: string;
  photo_url: string;
}

interface FilmeDetalhe extends FilmeBase {
  release_date: string;
  overview: string;
  genres: string[];
  runtime: number;
  cast: CastMember[];
  averageRating: number;
  totalUsers: number;
}

@Component({
  standalone: true,
  selector: 'app-filme-detalhe',
  templateUrl: './filme-detalhe.html',
  styleUrls: ['./filme-detalhe.scss'],
  imports: [HeaderComponent, CommonModule, Card, RatingComponent, CarrosselComponent],
})
export class FilmeDetalheComponent implements OnInit {
  filmeId!: number;
  filme!: FilmeDetalhe;
  cast: CastMember[] = [];
  carregando = true;
  erro: string | null = null;

  userStatus: string = '';
  userRating: number | null = null;
  watchStatus: string = '';

  filmes: FilmeBase[] = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private filmeService: FilmeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.filmeId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarFilme();
    this.buscarFilmesRecomendados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.watchStatus = changes['status'].currentValue;
    }

    if (changes['userRatingFromBackend']) {
      this.userRating = changes['userRatingFromBackend'].currentValue;
    }
    
  }

  get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  buscarFilme(): void {
    this.filmeService.getFilmePorId(this.filmeId).subscribe({
      next: (data: any) => {
        this.filme = data;
        this.cast = data.cast;
        this.userStatus = data.userStatus || '';
        this.userRating = data.userRating ?? null;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao buscar filme ou filme não encontrado.';
        this.carregando = false;
      },
    });
  }

  buscarFilmesRecomendados(): void {
    this.filmeService.getFilmesComNotas().subscribe((data: FilmeBase[]) => {
      this.filmes = data
        .filter(f => f.id !== this.filmeId)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10);
    }, () => {
      this.filmes = [];
    });
  }

  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      const cardWidth = 160 + 16;
      container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      const cardWidth = 160 + 16;
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
    }
  }
}
