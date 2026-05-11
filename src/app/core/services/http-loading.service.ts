import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoadingService {
  private readonly depth = signal(0);

  /** True while at least one HTTP request started via loading interceptor is in flight. */
  readonly pending = computed(() => this.depth() > 0);

  begin(): void {
    this.depth.update((d) => d + 1);
  }

  end(): void {
    this.depth.update((d) => Math.max(0, d - 1));
  }
}
