import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmeService } from '../services/filme';
import { CarrosselComponent } from '../shared/carrossel/carrossel';

interface Filme {
  id: number;
  title: string;
  poster_url: string;
  release_date: string;
  rating?: number;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarrosselComponent],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements OnInit {
  continuarAssistindo: Filme[] = [];
  melhoresAvaliados: Filme[] = [];
  filmes: Filme[] = [];

  constructor(private filmeService: FilmeService) {}

  ngOnInit(): void {
    this.filmeService.getFilmesComNotas().subscribe((filmes: Filme[]) => {
      this.continuarAssistindo = filmes.slice(0, 6);

      this.melhoresAvaliados = [...filmes]
        .filter(f => f.rating !== null)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6);
    });
  }
}
