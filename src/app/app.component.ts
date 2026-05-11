import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoadingBarComponent } from './shell/loading-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingBarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {
    inject(AuthService).restoreSession();
  }
}
