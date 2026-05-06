import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateDemoStore } from '../../core/state/state-demo.store';

@Component({
  selector: 'app-state-demo-page',
  standalone: true,
  templateUrl: './state-demo.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateDemoPage {
  readonly store = inject(StateDemoStore);

  addItem(input: HTMLInputElement): void {
    this.store.addItem(input.value);
    input.value = '';
  }
}
