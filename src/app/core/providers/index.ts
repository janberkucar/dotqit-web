import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { authInterceptor } from './auth-interceptor.provider';
import { apiErrorInterceptor } from './api-error-interceptor.provider';
import { correlationIdInterceptor } from './correlation-id-interceptor.provider';
import { loadingIndicatorInterceptor } from './loading-indicator-interceptor.provider';
import { provideLanguage } from './language.provider';

export function provideCoreProviders(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(
      withInterceptors([
        correlationIdInterceptor,
        authInterceptor,
        loadingIndicatorInterceptor,
        apiErrorInterceptor,
      ]),
    ),
    ...provideLanguage(),
  ]);
}
