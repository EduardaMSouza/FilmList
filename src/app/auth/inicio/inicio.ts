import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilmeService } from '../../services/filme.service';
import { CarrosselComponent } from '../../shared/carrossel/carrossel';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CarrosselComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
  standalone: true
})
export class Inicio implements OnInit {
  filmes: any[] = [];

  constructor(private filmeService: FilmeService) {}

  ngOnInit() {
    this.filmeService.getFilmesComNotas().subscribe((data: any[]) => {
      this.filmes = data;
    });
  }

  get filmesMelhorAvaliados() {
    return [...this.filmes].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
}
