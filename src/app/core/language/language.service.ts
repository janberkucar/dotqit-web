/** Core Imports */
import { computed, inject, Injectable, signal } from '@angular/core';
import { EN_DICTIONARY } from './dictionaries/en.dictionary';
import { TR_DICTIONARY } from './dictionaries/tr.dictionary';

import {
  LanguageKey,
  LanguageDictionary,
  SUPPORTED_LANGUAGES,
} from './language.types';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '../providers/language.provider';
// Export dictionary type in here.
export const DICTIONARIES: Record<LanguageKey, LanguageDictionary> = {
  en: EN_DICTIONARY,
  tr: TR_DICTIONARY,
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly defaultLanguage = inject(DEFAULT_LANGUAGE);
  private readonly storageKey = inject(LANGUAGE_STORAGE_KEY);
  private readonly _language = signal<LanguageKey>(this.getInitialLanguage());
  readonly language = this._language.asReadonly();
  readonly dictionary = computed(() => DICTIONARIES[this._language()]);

  setLanguage(language: LanguageKey): void {
    this._language.set(language);
    this.setStored(language);
  }

  // Shorthand function for me to remember.
  t(key: string): string {
    const dict = this.dictionary();
    return dict[key] ?? EN_DICTIONARY[key] ?? key;
  }

  supportedLanguages(): readonly LanguageKey[] {
    return SUPPORTED_LANGUAGES;
  }

  private getInitialLanguage(): LanguageKey {
    const fromStorage = this.getStored();
    return fromStorage ?? this.defaultLanguage;
  }

  private getStored(): LanguageKey | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const value = localStorage.getItem(this.storageKey);
    if (!value) {
      return null;
    }
    return this.isLanguageKey(value) ? value : null;
  }

  private setStored(language: LanguageKey): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.storageKey, language);
  }

  private isLanguageKey(value: string): value is LanguageKey {
    return SUPPORTED_LANGUAGES.includes(value as LanguageKey);
  }
}
