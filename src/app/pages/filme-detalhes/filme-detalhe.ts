import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmeService } from '../../services/filme.service';
import { CommonModule } from '@angular/common';
import { Card } from '../../shared/card/cast-card';
import { RatingComponent } from '../../rating/rating.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CastMember {  
  name: string;
  character: string;
  photo_url: string;
}

interface Filme {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string;
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
  imports: [CommonModule, Card, RatingComponent],
})
export class FilmeDetalheComponent implements OnInit {
  filmeId!: number;
  filme!: Filme;
  cast: CastMember[] = [];
  carregando = true;
  erro: string | null = null;

  userStatus: string = '';
  userRating: number | null = null;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private filmeService: FilmeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.filmeId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarFilme();
    this.buscarUserMovieData();
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
      next: (data: Filme) => {
        this.filme = data;
        this.cast = data.cast;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao buscar filme ou filme não encontrado.';
        this.carregando = false;
      },
    });
  }

  buscarUserMovieData(): void {
    this.http
      .get<any>(`http://localhost:3000/userMovies/${this.filmeId}`, { headers: this.headers })
      .subscribe({
        next: (userMovie) => {
          this.userStatus = userMovie.status;
          this.userRating = userMovie.rating;
        },
        error: (err) => {
          if (err.status === 404) {
            this.userStatus = '';
            this.userRating = null;
          } else {
            console.error('Erro ao buscar status/nota do usuário:', err);
          }
        },
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
