/** Core Imports */
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
/** Mapper Imports */
import { mapLoginResponseDtoToSession } from '../mappers/auth.mapper';
/** Model Imports */
import { AuthSession } from '../../shared/models/auth-session.model';
import { LoginRequestDto } from '../api/dto/auth.dto';
import { AuthApiService } from '../api/services/auth-api.service';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly sessionStore = inject(SessionService);
  private readonly _session = signal<AuthSession | null>(this.sessionStore.read());

  readonly session = this._session.asReadonly();

  readonly isAuthenticated = computed(() => !!this._session()?.accessToken);

  readonly accessToken = computed(() => this._session()?.accessToken ?? null);

  login(payload: LoginRequestDto): Observable<AuthSession> {
    return this.authApi.login(payload).pipe(
      map(mapLoginResponseDtoToSession),
      tap((session) => this.setSession(session)),
    );
  }

  restoreSession(): void {
    this._session.set(this.sessionStore.read());
  }

  logout(): void {
    this.sessionStore.clear();
    this._session.set(null);
  }

  private setSession(session: AuthSession): void {
    this.sessionStore.save(session);
    this._session.set(session);
  }
}
