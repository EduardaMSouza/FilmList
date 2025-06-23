import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  register(nome: string, email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { nome, email, senha });
  }

  saveToken(token: string) {
    localStorage.setItem('userToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  logout() {
    localStorage.removeItem('userToken');
  }
}
