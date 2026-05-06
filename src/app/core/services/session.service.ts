/** Core Imports */
import { Injectable } from '@angular/core';
/** Model Imports */
import { AuthSession } from '../../shared/models/auth-session.model';

const SESSION_STORAGE_KEY = 'qit.auth.session';

@Injectable({ providedIn: 'root' })
export class SessionService {

  save(session: AuthSession): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  read(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw || typeof localStorage === 'undefined') {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.accessToken || !parsed?.user?.email) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  clear(): void {
    if (typeof localStorage === 'undefined' || !localStorage) {
      return;
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}
