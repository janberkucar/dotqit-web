import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PortalSurfaceService } from './portal-surface.service';

export const clientSurfaceGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const surface = inject(PortalSurfaceService);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (!surface.hasClientSurface()) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
