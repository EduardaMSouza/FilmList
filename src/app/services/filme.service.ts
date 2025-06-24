import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private apiUrl = 'http://localhost:3000/movies';  

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getFilmePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
   getFilmesComNotas(): Observable<any[]> {
    const filmes$ = this.http.get<any[]>(`http://localhost:3000/movies`);
    const ratings$ = this.http.get<any[]>(`http://localhost:3000/ratings`);

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

  getFilmesMinhaLista(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/userMovies`, { headers: this.headers }).pipe(
      map(userMovies => {
        return userMovies.map(userMovie => {
          if (!userMovie.movie) {
            return null; 
          }

          return {
            ...userMovie.movie,
            userRating: userMovie.rating || null,
            status: userMovie.status || '',
            userMovieId: userMovie.id || null
          };
        }).filter(filme => filme !== null); 
      })
    );
  }
}