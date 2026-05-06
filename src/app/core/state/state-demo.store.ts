import { computed, Injectable, signal } from '@angular/core';
import { DemoItem } from '../../shared/models/demo-item.model';

@Injectable({ providedIn: 'root' })
export class StateDemoStore {
  private readonly _counter = signal(0);
  private readonly _items = signal<DemoItem[]>([]);

  readonly counter = this._counter.asReadonly();
  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() => this._items().length);
  readonly summary = computed(
    () => `counter=${this._counter()} items=${this._items().length}`,
  );
  readonly debugSnapshot = computed(() =>
    JSON.stringify(
      {
        counter: this._counter(),
        items: this._items(),
        itemCount: this.itemCount(),
        summary: this.summary(),
      },
      null,
      2,
    ),
  );

  increment(): void {
    this._counter.update((v) => v + 1);
  }

  decrement(): void {
    this._counter.update((v) => v - 1);
  }

  addItem(label: string): void {
    const trimmed = label.trim();
    if (!trimmed) {
      return;
    }
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;
    this._items.update((list) => [...list, { id, label: trimmed }]);
  }

  removeItem(id: string): void {
    this._items.update((list) => list.filter((i) => i.id !== id));
  }
}
