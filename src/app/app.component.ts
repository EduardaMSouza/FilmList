import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastrModule
  ],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
