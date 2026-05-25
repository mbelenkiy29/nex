#!/usr/bin/env tsx

import { dictionaries } from './getDictionary';
import type { Locale } from './locales';

const blockedCopyMarkers = [
  'DRAFT',
  'BORRADOR',
  'BROUILLON',
  'RASCUNHO',
  'ENTWURF',
  'legal counsel',
  'asesoría legal',
  'conseil juridique',
  'assessoria jurídica',
  'Rechtsberatung',
];

const failures: string[] = [];

for (const [locale, dictionary] of Object.entries(dictionaries) as Array<
  [Locale, (typeof dictionaries)[Locale]]
>) {
  auditLegalPolicy(locale, 'terms', dictionary.legal.terms);
  auditLegalPolicy(locale, 'privacy', dictionary.legal.privacy);
}

if (failures.length) {
  console.error(
    [
      'Policy launch audit failed.',
      'Resolve every item before public launch:',
      ...failures.map((failure) => `- ${failure}`),
    ].join('\n'),
  );
  process.exit(1);
}

console.log('Policy launch audit passed.');

function auditLegalPolicy(
  locale: Locale,
  key: 'terms' | 'privacy',
  policy: {
    body: string;
    legalReviewRequired?: boolean;
    version: string;
  },
) {
  for (const marker of blockedCopyMarkers) {
    if (policy.body.includes(marker)) {
      failures.push(`${locale}.${key} contains blocked marker "${marker}"`);
    }
  }

  if (policy.legalReviewRequired) {
    failures.push(
      `${locale}.${key} is still marked legalReviewRequired for version ${policy.version}`,
    );
  }
}
