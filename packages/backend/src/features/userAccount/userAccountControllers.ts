import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import { Error401 } from '../../shared/errors/Error401';
import { escapeHtml } from '../../shared/lib/escapeHtml';
import {
  accountDeletionConfirmSchema,
  accountDeletionRequestSchema,
  cookieConsentSchema,
  dataExportRequestSchema,
  emailPreferencesSchema,
  emailUnsubscribeQuerySchema,
} from './userAccountSchemas';
import {
  cancelAccountDeletion,
  confirmAccountDeletion,
  requestAccountDeletion,
} from './userAccountDeletionService';
import {
  listDataExports,
  mintDataExportSignedUrl,
  requestDataExport,
} from './userAccountDataExportService';
import {
  applyUnsubscribe,
  setEmailPreferences,
} from './userAccountUnsubscribeService';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
// bypass-RLS: account self-service (deletion, data export, email prefs)
// operates on the User across every org they belong to. The public
// unsubscribe endpoint has no session at all (token is the auth).
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';

function requireSignedIn(context: AppContext): {
  userId: string;
  organizationId: string | null;
} {
  if (!context.currentUser) throw new Error401();
  return {
    userId: context.currentUser.id,
    organizationId: context.currentOrganization?.id ?? null,
  };
}

export async function userAccountDeletionRequestController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  accountDeletionRequestSchema.parse(body);
  const { userId, organizationId } = requireSignedIn(context);
  const result = await requestAccountDeletion({
    userId,
    organizationId,
    locale: context.locale,
  });
  return c.json({ scheduledFor: result.scheduledFor.toISOString() }, 202);
}

export async function userAccountDeletionConfirmController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const input = accountDeletionConfirmSchema.parse(body);
  const result = await confirmAccountDeletion({
    token: input.token,
    locale: context.locale,
  });
  if (!result.confirmed) {
    return c.json({ confirmed: false }, 400);
  }
  return c.json({
    confirmed: true,
    scheduledFor: result.scheduledFor?.toISOString() ?? null,
  });
}

export async function userAccountDeletionCancelController(
  context: AppContext,
  c: Context,
) {
  const { userId, organizationId } = requireSignedIn(context);
  await cancelAccountDeletion({
    userId,
    organizationId,
    locale: context.locale,
  });
  return c.json({ cancelled: true });
}

export async function userAccountDataExportRequestController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  dataExportRequestSchema.parse(body);
  const { userId, organizationId } = requireSignedIn(context);
  if (!organizationId) throw new Error401();
  const result = await requestDataExport({
    userId,
    organizationId,
    locale: context.locale,
  });
  return c.json(result, 202);
}

export async function userAccountDataExportListController(
  context: AppContext,
  c: Context,
) {
  const { userId } = requireSignedIn(context);
  const exports_ = await listDataExports({ userId });
  return c.json({ items: exports_ });
}

export async function userAccountDataExportDownloadController(
  exportId: string,
  context: AppContext,
  c: Context,
) {
  const { userId } = requireSignedIn(context);
  const url = await mintDataExportSignedUrl({ userId, exportId });
  return c.json({ downloadUrl: url });
}

export async function userAccountEmailUnsubscribeController(
  query: unknown,
  _context: AppContext,
  c: Context,
) {
  // Public route — no signed-in user required. Token IS the auth.
  const input = emailUnsubscribeQuerySchema.parse(query);
  const result = await applyUnsubscribe({
    token: input.token,
    channelsParam: input.channels,
  });
  // Server-rendered HTML page — works even if the SPA is down.
  const channelsList = result.channelsApplied.length
    ? result.channelsApplied.join(', ')
    : 'no changes';
  const body = result.ok
    ? `<!doctype html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head><body style="font-family:system-ui;padding:48px;max-width:560px;margin:0 auto;color:#0d0d0d">
<h1 style="font-size:22px;margin-bottom:12px">You're unsubscribed</h1>
<p style="line-height:1.6">We won't send you ${escapeHtml(channelsList)} emails anymore. You'll keep receiving security and transactional messages (password resets, payment receipts) — those are required and can't be turned off.</p>
<p style="margin-top:24px"><a href="/account" style="color:#0066cc">Manage all your preferences</a></p></body></html>`
    : `<!doctype html><html><head><meta charset="utf-8"><title>Link expired</title></head><body style="font-family:system-ui;padding:48px;max-width:560px;margin:0 auto;color:#0d0d0d">
<h1 style="font-size:22px;margin-bottom:12px">This link can't be used</h1>
<p style="line-height:1.6">The unsubscribe link is invalid or has already been used. <a href="/account" style="color:#0066cc">Sign in to manage your preferences</a>.</p></body></html>`;
  return c.html(body, result.ok ? 200 : 400);
}

export async function userAccountEmailPreferencesController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const input = emailPreferencesSchema.parse(body);
  const { userId, organizationId } = requireSignedIn(context);
  const result = await setEmailPreferences({
    userId,
    organizationId,
    preferences: input,
  });
  return c.json(result);
}

export async function userAccountCookieConsentController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  const input = cookieConsentSchema.parse(body);
  const { userId, organizationId } = requireSignedIn(context);
  const cookieConsent = {
    essential: true,
    analytics: input.analytics,
    marketing: input.marketing,
    acceptedAt: new Date().toISOString(),
  };
  await prismaDangerouslyBypassRLS.user.update({
    where: { id: userId },
    data: { cookieConsent },
  });
  await auditLogCreate({
    entityId: userId,
    entityName: 'User',
    operation: auditLogOperations.update,
    userId,
    organizationId,
    newData: { cookieConsent },
  });
  return c.json({ cookieConsent });
}

export async function userAccountMeController(context: AppContext, c: Context) {
  const { userId } = requireSignedIn(context);
  const user = await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      deletionRequestedAt: true,
      deletionScheduledFor: true,
      deletionConfirmedAt: true,
      emailUnsubscribedChannels: true,
      cookieConsent: true,
      termsAcceptedVersion: true,
      privacyAcceptedVersion: true,
    },
  });
  return c.json(user);
}

// escapeHtml moved to ../../shared/lib/escapeHtml so other server-rendered
// HTML responses can reuse it (audit finding #17).
