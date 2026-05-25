import type { Locale } from '../../translation/locales';

/**
 * Whitelist of locale → human-readable language name for use inside AI
 * system prompts.
 *
 * Closes finding #13 from the 2026-05-23 security audit. `context.locale`
 * is already typed as `Locale` (a 5-value union), so the prior dictionary
 * lookup is safe today — but this helper:
 *   (a) consolidates the three duplicate implementations (chatbotTools,
 *       chatbotService, courseStudyAiControllers) into one source of
 *       truth, and
 *   (b) makes the safe set explicit in source instead of inferred from
 *       the translation dictionary, so a future dictionary change can't
 *       reopen the prompt-injection surface.
 *
 * Values mirror what `dictionary.shared.locales.<key>` returns today, so
 * the change is behavior-preserving for the model.
 */
const PROMPT_LANGUAGE_NAMES: Readonly<Record<Locale, string>> = Object.freeze({
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  'pt-BR': 'Português (Brasil)',
});

export function promptLanguageName(locale: Locale | string | undefined): string {
  if (locale && locale in PROMPT_LANGUAGE_NAMES) {
    return PROMPT_LANGUAGE_NAMES[locale as Locale];
  }
  return PROMPT_LANGUAGE_NAMES.en;
}
