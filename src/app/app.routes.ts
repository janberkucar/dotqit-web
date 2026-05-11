import { Routes } from '@angular/router';
import { adminSurfaceGuard } from './core/services/admin-surface.guard';
import { authGuard } from './core/services/auth.guard';
import { clientSurfaceGuard } from './core/services/client-surface.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'public',
    loadChildren: () =>
      import('./pages/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: 'client',
    canActivate: [authGuard, clientSurfaceGuard],
    loadChildren: () =>
      import('./pages/client/client.routes').then((m) => m.CLIENT_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminSurfaceGuard],
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  /** Legacy `/hr/*` URLs; auth runs on `/client/*` after redirect (Angular forbids canActivate + redirectTo here). */
  {
    path: 'hr',
    redirectTo: '/client/dashboard',
    pathMatch: 'prefix',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'client',
  },
  {
    path: '**',
    redirectTo: 'client',
  },
];
