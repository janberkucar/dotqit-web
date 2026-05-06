import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StateDemoStore } from '../../core/state/state-demo.store';

@Component({
  selector: 'app-state-demo-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './state-demo.page.html',
  styleUrl: './state-demo.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateDemoPage {
  readonly store = inject(StateDemoStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  addItem(input: HTMLInputElement): void {
    this.store.addItem(input.value);
    input.value = '';
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
