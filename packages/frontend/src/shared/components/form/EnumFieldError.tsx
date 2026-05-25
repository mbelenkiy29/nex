import { FieldError } from '@/shared/components/ui/field';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import type { FieldError as RhfFieldError } from 'react-hook-form';

const ENUM_ERROR_PATTERN = /^(?<base>.+?):\s*(?<values>.+)$/;
const QUOTED_STRING = /^"|"$/g;

function parseEnumMessage(
  message: string,
): { base: string; values: string } | null {
  const match = ENUM_ERROR_PATTERN.exec(message);
  if (!match?.groups?.values) return null;
  return { base: match.groups.base, values: match.groups.values };
}

function translateValues(
  raw: string,
  labelMap: Record<string, string>,
): string {
  return raw
    .split(',')
    .map((v) => v.trim().replace(QUOTED_STRING, ''))
    .map((key) => dictionaryEnumerator(labelMap, key) ?? key)
    .join(', ');
}

export function EnumFieldError({
  error,
  labelMap,
}: {
  error: RhfFieldError | undefined;
  labelMap: Record<string, string>;
}) {
  if (!error?.message) return null;

  if (error.type !== 'invalid_value') {
    return <FieldError>{error.message}</FieldError>;
  }

  const parsed = parseEnumMessage(error.message);

  const content = parsed
    ? `${parsed.base}: ${translateValues(parsed.values, labelMap)}`
    : error.message;

  return <FieldError>{content}</FieldError>;
}
