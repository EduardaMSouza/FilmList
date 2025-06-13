import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Login } from './login/login.component';

bootstrapApplication(Login, appConfig)
  .catch((err) => console.error(err));
