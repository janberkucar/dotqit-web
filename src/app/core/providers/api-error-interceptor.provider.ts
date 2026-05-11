import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  ApiErrorDto,
  ApiHttpError,
} from '../api/dto/auth.dto';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const correlationId =
        error.headers?.get('x-correlation-id') ??
        request.headers.get('X-Correlation-Id');

      const parsed = parseApiError(error.error as ApiErrorDto | null | undefined);
      return throwError(
        () =>
          new ApiHttpError(
            error.status,
            parsed.message,
            parsed.errors,
            correlationId,
          ),
      );
    }),
  );

function parseApiError(error: ApiErrorDto | null | undefined): {
  message: string;
  errors: string[];
} {
  if (!error) {
    return { message: 'Unexpected API error.', errors: [] };
  }

  if (typeof error === 'string') {
    return { message: error, errors: [] };
  }

  if (typeof error !== 'object') {
    return { message: 'Unexpected API error.', errors: [] };
  }

  if ('errors' in error && Array.isArray(error.errors)) {
    return {
      message: error.errors[0] ?? 'Validation error.',
      errors: error.errors,
    };
  }

  if ('message' in error && typeof error.message === 'string') {
    return { message: error.message, errors: [] };
  }

  if ('detail' in error && typeof error.detail === 'string') {
    return { message: error.detail, errors: [] };
  }

  if ('title' in error && typeof error.title === 'string') {
    return { message: error.title, errors: [] };
  }

  return { message: 'Unexpected API error.', errors: [] };
}
