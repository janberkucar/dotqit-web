import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/** Maps Identity roles to client vs admin app surfaces (no new roles required). */
@Injectable({ providedIn: 'root' })
export class PortalSurfaceService {
  private readonly auth = inject(AuthService);

  readonly roles = computed(() =>
    (this.auth.session()?.user.roles ?? []).map((role) => role.trim()),
  );

  hasAdminSurface(): boolean {
    return this.roles().some((role) => {
      const key = role.toLowerCase();
      return key === 'admin' || key === 'hr';
    });
  }

  /** Any authenticated user with at least one known portal role can use the client surface. */
  hasClientSurface(): boolean {
    const rs = this.roles();
    if (rs.length === 0) {
      return !!this.auth.isAuthenticated();
    }
    return rs.some((role) => {
      const key = role.toLowerCase();
      return (
        key === 'admin' || key === 'hr' || key === 'employee'
      );
    });
  }

  defaultHomePath(): string {
    return this.hasAdminSurface() ? '/admin/dashboard' : '/client/dashboard';
  }
}
