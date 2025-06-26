import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit {
  menuAberto = false;
  busca: string = '';

  @Output() buscaChange = new EventEmitter<string>();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['busca'] !== undefined) {
        this.busca = params['busca'];
      }
    });
  }

  filtrarFilmes() {
    this.buscaChange.emit(this.busca);
  }

  onEnterBusca() {
    this.buscaChange.emit(this.busca);
    this.router.navigate(['/filmes'], { queryParams: { busca: this.busca } });
  }

  clearBusca() {
    this.busca = '';
    this.filtrarFilmes();
  }

  logout() {
    localStorage.removeItem('token');
    this.toastService.logoutSuccess();
    this.router.navigate(['/auth/login']);
  }
}
