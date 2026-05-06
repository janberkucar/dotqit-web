import { Routes } from '@angular/router';

export const STATE_DEMO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./state-demo.page').then((m) => m.StateDemoPage),
  },
];
