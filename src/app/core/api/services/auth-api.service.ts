/** Core Imports */
import { inject, Injectable } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';
/** API Imports */
import { API_CONFIG } from '../config/api.config';
/** DTO Imports */
import { LoginRequestDto, LoginResponseDto } from '../dto/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly apiConfig = inject(API_CONFIG);

  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    const email = payload.email.trim().toLowerCase();
    const password = payload.password.trim();
    if (!email || !password) {
      return throwError(() => new Error('Email and password are required.'));
    }
    return of({ email, password }).pipe(
      delay(300),
      map(({ email: normalizedEmail }) => {
        const endpoint = `${this.apiConfig.baseUrl}/auth/login`;
        void endpoint;
        return {
          accessToken: `access-token-${btoa(normalizedEmail)}`,
          user: {
            id: 'user-1',
            name:
              normalizedEmail === 'qit.dev@gmail.com'
                ? 'Admin User'
                : 'Qit User',
            email: normalizedEmail,
          },
        };
      }),
    );
  }
}
