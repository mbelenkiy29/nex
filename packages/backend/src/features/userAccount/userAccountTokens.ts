import { randomBytes } from 'node:crypto';
import { CONFIRMATION_TOKEN_BYTES } from './userAccountSchemas';

/**
 * URL-safe random token used for one-shot links emailed to the user
 * (deletion confirmation, unsubscribe). `base64url` avoids `+/=` so the
 * token can sit unescaped in a query string.
 */
export function mintToken(): string {
  return randomBytes(CONFIRMATION_TOKEN_BYTES).toString('base64url');
}
