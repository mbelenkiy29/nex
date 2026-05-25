import { dictionary as deDictionary } from './de/de';
import { dictionary as enDictionary } from './en/en';
import { dictionary as esDictionary } from './es/es';
import { dictionary as frDictionary } from './fr/fr';
import { dictionary as ptBRDictionary } from './pt-BR/pt-BR';
import type { Locale } from './locales';

type DictionaryRecord = Record<string, unknown>;

type FallbackCandidate = {
  locale: Locale;
  path: string;
  reason: 'exact' | 'english-signal';
  value: string;
};

const dictionaries: Record<Locale, DictionaryRecord> = {
  en: enDictionary,
  es: esDictionary,
  de: deDictionary,
  fr: frDictionary,
  'pt-BR': ptBRDictionary,
};

const ignoredPathPatterns = [
  /^projectName$/,
  /^shared\.locales\./,
  /\.(dateFormat|datetimeFormat|version)$/,
];

const ignoredExactValues = new Set([
  'API',
  'AI',
  'AI Tutor',
  'CSV',
  'Google',
  'NexExam',
  'Nex Verified',
  'Stripe',
  'URL',
  'UUID',
]);

const englishSignalWords = new Set([
  'account',
  'action',
  'add',
  'admin',
  'answer',
  'before',
  'build',
  'can',
  'choose',
  'complete',
  'continue',
  'course',
  'courses',
  'create',
  'delete',
  'email',
  'exam',
  'from',
  'has',
  'have',
  'help',
  'lesson',
  'message',
  'must',
  'new',
  'not',
  'please',
  'policy',
  'practice',
  'review',
  'save',
  'service',
  'student',
  'study',
  'submit',
  'teacher',
  'the',
  'this',
  'to',
  'use',
  'user',
  'with',
  'you',
  'your',
]);

function flattenDictionary(
  value: unknown,
  prefix = '',
): Array<[string, unknown]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [[prefix, value]];
  }

  return Object.entries(value as DictionaryRecord).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return flattenDictionary(child, path);
  });
}

function isIgnored(path: string, value: string): boolean {
  return (
    ignoredPathPatterns.some((pattern) => pattern.test(path)) ||
    ignoredExactValues.has(value.trim())
  );
}

function isLikelyEnglish(value: string): boolean {
  const normalized = value
    .replace(/\{[0-9]+\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, ' ');

  const tokens = normalized
    .match(/[A-Za-z][A-Za-z']+/g)
    ?.map((token) => token.toLowerCase())
    .filter((token) => token !== 'nexexam');

  if (!tokens || tokens.length < 4) {
    return false;
  }

  const signalCount = tokens.filter((token) =>
    englishSignalWords.has(token),
  ).length;

  return signalCount >= 2 && signalCount / tokens.length >= 0.25;
}

function auditFallbacks(): FallbackCandidate[] {
  const englishEntries = new Map(flattenDictionary(enDictionary));
  const candidates: FallbackCandidate[] = [];

  for (const [locale, dictionary] of Object.entries(dictionaries) as Array<
    [Locale, DictionaryRecord]
  >) {
    if (locale === 'en') {
      continue;
    }

    for (const [path, value] of flattenDictionary(dictionary)) {
      if (typeof value !== 'string' || value.trim().length < 4) {
        continue;
      }

      if (isIgnored(path, value)) {
        continue;
      }

      const englishValue = englishEntries.get(path);
      if (value === englishValue) {
        const words = value.match(/[A-Za-z][A-Za-z']+/g) ?? [];
        if (isLikelyEnglish(value) || words.length >= 3 || value.length >= 24) {
          candidates.push({ locale, path, reason: 'exact', value });
        }
        continue;
      }

      if (isLikelyEnglish(value)) {
        candidates.push({ locale, path, reason: 'english-signal', value });
      }
    }
  }

  return candidates;
}

function numberArg(name: string, fallback: number): number {
  const arg = process.argv.find((item) => item.startsWith(`${name}=`));
  if (!arg) {
    return fallback;
  }

  const parsed = Number(arg.split('=')[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const strict = process.argv.includes('--strict');
const maxPerLocale = numberArg('--max', 40);
const candidates = auditFallbacks();

if (candidates.length === 0) {
  console.log('Translation fallback audit: no likely English fallbacks found.');
} else {
  console.log(
    `Translation fallback audit: ${candidates.length} likely English fallback(s) found.`,
  );

  for (const locale of ['es', 'pt-BR', 'de', 'fr'] as Locale[]) {
    const localeCandidates = candidates.filter(
      (candidate) => candidate.locale === locale,
    );

    if (localeCandidates.length === 0) {
      continue;
    }

    console.log(`\n${locale}: ${localeCandidates.length}`);
    for (const candidate of localeCandidates.slice(0, maxPerLocale)) {
      const preview =
        candidate.value.length > 110
          ? `${candidate.value.slice(0, 107)}...`
          : candidate.value;
      console.log(`- ${candidate.path} [${candidate.reason}] ${preview}`);
    }

    if (localeCandidates.length > maxPerLocale) {
      console.log(`- ...${localeCandidates.length - maxPerLocale} more`);
    }
  }

  console.log('\nUse --strict to make this audit fail when candidates remain.');
  process.exitCode = strict ? 1 : 0;
}
