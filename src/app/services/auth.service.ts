import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // URL do seu backend

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  // Cadastro
  register(nome: string, email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { nome, email, senha });
  }

  // Opcional: Salvar token no localStorage
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
