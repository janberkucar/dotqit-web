import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { authInterceptor } from './auth-interceptor.provider';
import { provideLanguage } from './language.provider';

export function provideCoreProviders(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([authInterceptor])),
    ...provideLanguage(),
  ]);
}
