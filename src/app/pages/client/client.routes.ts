import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/client-dashboard.page').then(
        (m) => m.ClientDashboardPage,
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./history/client-history.page').then((m) => m.ClientHistoryPage),
  },
  {
    path: 'outages',
    loadComponent: () =>
      import('./outages/client-outage-list.page').then(
        (m) => m.ClientOutageListPage,
      ),
  },
  {
    path: 'outages/new',
    loadComponent: () =>
      import('./outages/client-outage-create.page').then(
        (m) => m.ClientOutageCreatePage,
      ),
  },
  {
    path: 'outages/:id',
    loadComponent: () =>
      import('./outages/client-outage-detail.page').then(
        (m) => m.ClientOutageDetailPage,
      ),
  },
];
