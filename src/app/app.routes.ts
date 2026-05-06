import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/state-demo/state-demo.routes').then(
        (m) => m.STATE_DEMO_ROUTES,
      ),
  },
];
