import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PortalSurfaceService } from './portal-surface.service';

export const adminSurfaceGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const surface = inject(PortalSurfaceService);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (!surface.hasAdminSurface()) {
    return router.createUrlTree(['/client/dashboard']);
  }

  return true;
};
