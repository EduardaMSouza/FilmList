import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface Filme {
  id: number;
  title: string;
  poster_url: string;
  rating?: number | null;
}

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
   getFilmesComNotas(): Observable<Filme[]> {
    const filmes$ = this.http.get<any>(`http://localhost:3000/movies?limit=400`);
    const ratings$ = this.http.get<any[]>(`http://localhost:3000/ratings`);
    
    return forkJoin([filmes$, ratings$]).pipe(
      map(([filmes, ratings]) => {
        const filmesArray = filmes.data || filmes;
        return filmesArray.map((filme: Filme) => {
          const ratingsDoFilme = ratings.filter((r: any) => r.movieId === filme.id);
          const media = ratingsDoFilme.length
            ? ratingsDoFilme.reduce((acc: number, r: any) => acc + r.rating, 0) / ratingsDoFilme.length
            : null;

          return {
            ...filme,
            rating: media ? +media.toFixed(1) : null
          };
        });
      })
    );
  }

  getFilmesMinhaLista(status?: string): Observable<any[]> {
    let url = `http://localhost:3000/userMovies`;
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }
    return this.http.get<any[]>(url, { headers: this.headers }).pipe(
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