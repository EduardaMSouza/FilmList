import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserMovieService {
  private apiUrl = 'http://localhost:3000/userMovies';

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getUserMovie(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${movieId}`, { headers: this.headers });
  }

  updateUserMovie(id: number, body: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, body, { headers: this.headers });
  }

  createUserMovie(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }
}
