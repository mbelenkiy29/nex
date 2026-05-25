import type { ReactNode } from 'react';

/**
 * Safe alternative to `dictionaryFormat(...)` + `dangerouslySetInnerHTML`
 * for translation templates that wrap a single user-supplied value in
 * `<strong>` markup — e.g. `"Confirm your email at <strong>{0}</strong>."`.
 *
 * The value is rendered as a React text node, so any HTML in it is escaped
 * by React automatically (closes the XSS that string-replace +
 * dangerouslySetInnerHTML was opening).
 *
 * If the marker is missing or duplicated (e.g. a translation drops the
 * `<strong>` wrapper), the helper falls back to substituting the value
 * with a plain `.replace('{0}', value)` — still safe because the result
 * is rendered as a single text node, not HTML.
 */
export function dictionaryFormatBold(
  template: string,
  value: string,
): ReactNode {
  const marker = '<strong>{0}</strong>';
  const idx = template.indexOf(marker);
  if (idx < 0) {
    return template.replace('{0}', value);
  }
  return (
    <>
      {template.slice(0, idx)}
      <strong>{value}</strong>
      {template.slice(idx + marker.length)}
    </>
  );
}
