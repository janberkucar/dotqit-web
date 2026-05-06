// TODO(@Janberk): Move the types into shared/types index.ts file to import and remove here.
export const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;
export type LanguageKey = (typeof SUPPORTED_LANGUAGES)[number];
export type LanguageDictionary = Record<string, string>;
