import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpLoadingService } from '../core/services/http-loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  template: `@if (loading.pending()) {
    <div class="loading-bar" aria-live="polite" aria-busy="true"></div>
  }`,
  styleUrl: './loading-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent {
  readonly loading = inject(HttpLoadingService);
}
