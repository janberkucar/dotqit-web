export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface LoginResponseDto {
  accessToken: string;
  expiresAtUtc: string;
  user: UserDto;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface RegisterResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  requiresActivation: boolean;
}

export interface ActivateAccountRequestDto {
  code: string;
}

export interface ResendActivationRequestDto {
  email: string;
}

export interface BasicMessageResponseDto {
  message: string;
}

export interface ApiProblemDetailsDto {
  status?: number;
  title?: string;
  detail?: string;
  instance?: string;
}

export interface ApiErrorMessageDto {
  message: string;
}

export interface ApiValidationErrorDto {
  errors: string[];
}

export interface BootstrapAdminStatusDto {
  canBootstrap: boolean;
}

export interface BootstrapAdminRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface BootstrapAdminResponseDto {
  message: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export type ApiErrorDto =
  | ApiProblemDetailsDto
  | ApiErrorMessageDto
  | ApiValidationErrorDto;

export class ApiHttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: string[] = [],
    public readonly correlationId?: string | null,
  ) {
    super(message);
    this.name = 'ApiHttpError';
  }
}
