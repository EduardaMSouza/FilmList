import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private apiUrl = 'http://localhost:3000/movies';  

  constructor(private http: HttpClient) {}

  getFilmePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
   getFilmesComNotas(): Observable<any[]> {
    const filmes$ = this.http.get<any[]>(`${this.apiUrl}/movies`);
    const ratings$ = this.http.get<any[]>(`${this.apiUrl}/ratings`);

    return forkJoin([filmes$, ratings$]).pipe(
      map(([filmes, ratings]) => {
        return filmes.map(filme => {
          const ratingsDoFilme = ratings.filter(r => r.movieId === filme.id);
          const media = ratingsDoFilme.length
            ? ratingsDoFilme.reduce((acc, r) => acc + r.rating, 0) / ratingsDoFilme.length
            : null;

          return {
            ...filme,
            rating: media ? +media.toFixed(1) : null
          };
        });
      })
    );
  }
}