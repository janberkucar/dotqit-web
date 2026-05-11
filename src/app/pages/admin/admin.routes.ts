import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/admin-dashboard.page').then(
        (m) => m.AdminDashboardPage,
      ),
  },
  {
    path: 'inbox',
    loadComponent: () =>
      import('./inbox/admin-inbox.page').then((m) => m.AdminInboxPage),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/admin-notifications.page').then(
        (m) => m.AdminNotificationsPage,
      ),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/admin-analytics.page').then(
        (m) => m.AdminAnalyticsPage,
      ),
  },
  {
    path: 'outages',
    loadComponent: () =>
      import('./outages/admin-outage-list.page').then(
        (m) => m.AdminOutageListPage,
      ),
  },
  {
    path: 'outages/:id',
    loadComponent: () =>
      import('./outages/admin-outage-edit.page').then(
        (m) => m.AdminOutageEditPage,
      ),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./services/admin-services.page').then((m) => m.AdminServicesPage),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/admin-users.page').then((m) => m.AdminUsersPage),
  },
];
