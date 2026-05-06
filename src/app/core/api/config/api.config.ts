import { InjectionToken } from '@angular/core';
// Default api config object.
export interface ApiConfig {
  baseUrl: string;
}
export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  factory: () => ({
    baseUrl: '/api',
  }),
});
