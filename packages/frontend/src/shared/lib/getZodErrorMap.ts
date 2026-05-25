import { zodEn } from '@project/backend/translation/en/zodEn';
import { zodFr } from '@project/backend/translation/fr/zodFr';
import { zodEs } from '@project/backend/translation/es/zodEs';
import { zodDe } from '@project/backend/translation/de/zodDe';
import { zodPtBR } from '@project/backend/translation/pt-BR/zodPtBR';
import { defaultLocale, Locale } from '@project/backend/translation/locales';

export const zodErrorMaps = {
  en: zodEn,
  fr: zodFr,
  es: zodEs,
  de: zodDe,
  'pt-BR': zodPtBR,
};

export function getZodErrorMap(locale: Locale) {
  return zodErrorMaps[locale]
    ? zodErrorMaps[locale]
    : zodErrorMaps[defaultLocale];
}
