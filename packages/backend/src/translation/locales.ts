import { dictionary } from './en/en';

export type Locale = 'en' | 'fr' | 'es' | 'de' | 'pt-BR';
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'fr', 'es', 'de', 'pt-BR'];
export type Dictionary = typeof dictionary;
