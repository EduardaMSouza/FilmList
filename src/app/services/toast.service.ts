import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  success(message: string, title: string = 'Sucesso!') {
    this.toastr.success(message, title);
  }

  error(message: string, title: string = 'Erro!') {
    this.toastr.error(message, title);
  }

  warning(message: string, title: string = 'Atenção!') {
    this.toastr.warning(message, title);
  }

  info(message: string, title: string = 'Informação') {
    this.toastr.info(message, title);
  }

  loginSuccess() {
    this.success('Login realizado com sucesso!', 'Bem-vindo!');
  }

  loginError() {
    this.error('Email ou senha incorretos. Tente novamente.', 'Erro no Login');
  }

  registerSuccess() {
    this.success('Conta criada com sucesso! Você já pode fazer login.', 'Conta Criada!');
  }

  registerError() {
    this.error('Erro ao criar conta. Verifique os dados e tente novamente.', 'Erro no Cadastro');
  }

  movieAddedToList() {
    this.success('Filme adicionado à sua lista!', 'Filme Adicionado');
  }

  movieRemovedFromList() {
    this.success('Filme removido da sua lista!', 'Filme Removido');
  }

  moviesAddedToList(count: number) {
    this.success(`${count} filme(s) adicionado(s) à sua lista!`, 'Filmes Adicionados');
  }

  moviesRemovedFromList(count: number) {
    this.success(`${count} filme(s) removido(s) da sua lista!`, 'Filmes Removidos');
  }

  ratingUpdated() {
    this.success('Nota atualizada com sucesso!', 'Nota Atualizada');
  }

  statusUpdated() {
    this.success('Status do filme atualizado!', 'Status Atualizado');
  }

  logoutSuccess() {
    this.success('Logout realizado com sucesso!', 'Até logo!');
  }

  profileUpdated() {
    this.success('Perfil atualizado com sucesso!', 'Perfil Atualizado');
  }

  genericError() {
    this.error('Ocorreu um erro. Tente novamente.', 'Erro');
  }

  networkError() {
    this.error('Erro de conexão. Verifique sua internet.', 'Erro de Rede');
  }
} 