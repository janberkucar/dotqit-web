import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'report',
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./public-outage-report.page').then(
        (m) => m.PublicOutageReportPage,
      ),
  },
];
