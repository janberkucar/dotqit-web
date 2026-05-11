import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'activate',
    loadComponent: () =>
      import('./activate-account.page').then((m) => m.ActivateAccountPage),
  },
  {
    path: 'bootstrap-admin',
    loadComponent: () =>
      import('./bootstrap-admin.page').then((m) => m.BootstrapAdminPage),
  },
];
