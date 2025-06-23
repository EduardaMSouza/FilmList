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

  constructor(private filmeService: FilmeService) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.filmeService.getMinhaLista(userId).subscribe(userMovies => {
        const movieIds = userMovies.map(um => um.movieId);
        this.filmeService.getFilmesComNotas().subscribe(filmes => {
          this.filmes = filmes.filter(filme => movieIds.includes(filme.id));
        });
      });
    }
  }
}
