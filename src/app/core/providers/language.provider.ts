import { InjectionToken, Provider } from '@angular/core';
import { LanguageKey } from '../language/language.types';
export const DEFAULT_LANGUAGE = new InjectionToken<LanguageKey>(
  'DEFAULT_LANGUAGE',
);
export const LANGUAGE_STORAGE_KEY = new InjectionToken<string>(
  'LANGUAGE_STORAGE_KEY',
);
export function provideLanguage(): Provider[] {
  return [
    { provide: DEFAULT_LANGUAGE, useValue: 'en' as LanguageKey },
    { provide: LANGUAGE_STORAGE_KEY, useValue: 'qit.language' },
  ];
}
