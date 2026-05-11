/** Core Imports */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/** API Imports */
import { API_CONFIG } from '../config/api.config';
/** DTO Imports */
import {
  ActivateAccountRequestDto,
  BasicMessageResponseDto,
  BootstrapAdminRequestDto,
  BootstrapAdminResponseDto,
  BootstrapAdminStatusDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResendActivationRequestDto,
} from '../dto/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly http = inject(HttpClient);

  getBootstrapAdminStatus(): Observable<BootstrapAdminStatusDto> {
    return this.http.get<BootstrapAdminStatusDto>(
      `${this.apiConfig.baseUrl}/auth/bootstrap-admin-status`,
    );
  }

  bootstrapAdmin(
    payload: BootstrapAdminRequestDto,
  ): Observable<BootstrapAdminResponseDto> {
    return this.http.post<BootstrapAdminResponseDto>(
      `${this.apiConfig.baseUrl}/auth/bootstrap-admin`,
      {
        email: payload.email.trim(),
        password: payload.password,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        dateOfBirth: payload.dateOfBirth,
      },
    );
  }

  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiConfig.baseUrl}/auth/login`, {
      email: payload.email.trim(),
      password: payload.password,
    });
  }

  register(payload: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(
      `${this.apiConfig.baseUrl}/auth/register`,
      payload,
    );
  }

  activate(
    payload: ActivateAccountRequestDto,
  ): Observable<BasicMessageResponseDto> {
    return this.http.post<BasicMessageResponseDto>(
      `${this.apiConfig.baseUrl}/auth/activate`,
      payload,
    );
  }

  resendActivation(
    payload: ResendActivationRequestDto,
  ): Observable<BasicMessageResponseDto> {
    return this.http.post<BasicMessageResponseDto>(
      `${this.apiConfig.baseUrl}/auth/resend-activation`,
      {
        email: payload.email.trim(),
      },
    );
  }
}
