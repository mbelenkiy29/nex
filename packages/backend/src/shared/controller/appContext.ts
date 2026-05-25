import {
  ApiKey,
  Organization,
  Subscription,
} from '../../prisma/generated/client';
import { Context } from 'hono';
import {
  authMiddlewareForApiKey,
  authMiddlewareForMcp,
  authMiddlewareForSession,
} from '../../features/auth/authMiddleware';
import { MemberWithRelationships } from '../../features/member/memberSchemas';
import { UserWithMembers } from '../../features/user/userSchemas';
import { dictionaryMiddleware } from '../../translation/dictionaryMiddleware';
import { Dictionary, Locale } from '../../translation/locales';
import { dictionaryValidateLocale } from '../../translation/dictionaryValidateLocale';
import { rlsUserContext } from '../lib/rlsUserContext';

export interface AppAuthContextOptional {
  currentUser?: UserWithMembers | null;
  currentMember?: MemberWithRelationships | null;
  currentOrganization?: Organization | null;
  currentSubscription?: Subscription | null;
  apiKey?: ApiKey | null;
}

export interface AppContext extends AppAuthContextOptional {
  locale: Locale;
  dictionary: Dictionary;
  headers: Headers;
  isMcpRequest?: boolean;
}

export interface AppAuthContext extends AppAuthContextOptional {
  currentUser: UserWithMembers;
  currentMember: MemberWithRelationships;
  currentOrganization: Organization;
}

// Enable JSON serialization of BigInt values
// Without this, JSON.stringify throws when encountering BigInt types
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function appContextForMcp(
  userId: string,
  organizationId: string,
  language: string,
  c: Context,
) {
  const actualLocale = dictionaryValidateLocale(language);
  let context = await dictionaryMiddleware(actualLocale, {});
  context = await authMiddlewareForMcp(userId, organizationId, c, context);
  enterRlsUserScope(context);
  return context;
}

export async function appContext(c: Context) {
  const headerLocale = c.req.header('Accept-Language')?.split(',')[0];
  const actualLocale = dictionaryValidateLocale(headerLocale);
  let context = await dictionaryMiddleware(actualLocale, {});
  context.headers = c.req.raw.headers;
  const apiKeyHeader = context.headers.get('x-api-key');

  if (apiKeyHeader) {
    context = await authMiddlewareForApiKey(apiKeyHeader, context);
  } else {
    context = await authMiddlewareForSession(c, context);
  }

  enterRlsUserScope(context);
  return context;
}

/**
 * Sets `rlsUserContext`'s store to the resolved currentUser.id for the rest
 * of this request's async chain. `$withRLS` reads it inside its transaction
 * and SET LOCALs `app.current_user_id` so the per-user / per-participant
 * RLS policies on CourseStudyPlanItem + OneOnOneSession can match.
 * Hono creates a fresh async context per request, so each request gets its
 * own store. Closes audit finding #5.
 *
 * The userId MUST be a valid UUID — the matching PG policies cast via
 * `current_setting(...)::uuid` and would throw on every read against
 * those tables if a malformed value reached `set_config()`. Better-Auth
 * issues UUIDs by default; the MCP auth path takes the userId from the
 * transport layer, which could in principle be any string. Validating
 * here fail-closes both paths.
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function enterRlsUserScope(context: AppContext): void {
  const userId = context.currentUser?.id;
  if (userId && UUID_REGEX.test(userId)) {
    rlsUserContext.enterWith({ userId });
  }
}
