// bypass-RLS: unsubscribe token consumption runs from an email link with
// NO session — token IS the auth. EmailUnsubscribeToken is a user-scoped
// global table (no organizationId).
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { env } from '../../env';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { EMAIL_CHANNELS, EmailChannel, isUnsubscribable } from '../../shared/email/emailSchemas';
import { mintToken } from './userAccountTokens';

/**
 * Mints a fresh one-shot unsubscribe token for the user and returns a
 * ready-to-paste URL the email worker can append in the footer. Tokens
 * are not bound to a channel — the click flow takes the channel list as a
 * query parameter so a single token can carry multiple opt-outs.
 */
export async function buildUnsubscribeUrl(
  userId: string,
  channels: EmailChannel[],
): Promise<string> {
  const token = mintToken();
  await prismaDangerouslyBypassRLS.emailUnsubscribeToken.create({
    data: { userId, token },
  });
  const channelParam = channels.filter(isUnsubscribable).join(',');
  return `${env.FRONTEND_URL}/api/user-account/email/unsubscribe?token=${encodeURIComponent(token)}&channels=${encodeURIComponent(channelParam)}`;
}

/**
 * Consumes the token and applies the requested unsubscribes. Idempotent —
 * a re-clicked link returns the already-applied state instead of erroring.
 * Returns the channels successfully applied so the public landing page can
 * tell the user what changed.
 */
export async function applyUnsubscribe(params: {
  token: string;
  channelsParam: string | undefined;
}): Promise<{ ok: boolean; channelsApplied: EmailChannel[] }> {
  const { token, channelsParam } = params;

  const requested = parseChannels(channelsParam);
  if (requested.length === 0) {
    return { ok: false, channelsApplied: [] };
  }

  const row = await prismaDangerouslyBypassRLS.emailUnsubscribeToken.findUnique(
    {
      where: { token },
      include: {
        user: { select: { id: true, emailUnsubscribedChannels: true } },
      },
    },
  );
  if (!row) {
    return { ok: false, channelsApplied: [] };
  }

  // Already-consumed token re-applied: still report success (idempotent).
  const now = new Date();
  const next = Array.from(
    new Set([...(row.user.emailUnsubscribedChannels as string[]), ...requested]),
  );

  await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: row.user.id },
      data: { emailUnsubscribedChannels: next },
    });
    if (!row.consumedAt) {
      await tx.emailUnsubscribeToken.update({
        where: { id: row.id },
        data: { consumedAt: now },
      });
    }
  });

  await auditLogCreate({
    entityId: row.user.id,
    entityName: 'User',
    operation: auditLogOperations.update,
    userId: row.user.id,
    newData: { emailUnsubscribedChannels: next },
  });

  return { ok: true, channelsApplied: requested };
}

function parseChannels(raw: string | undefined): EmailChannel[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter((c): c is EmailChannel =>
      (EMAIL_CHANNELS as readonly string[]).includes(c) && isUnsubscribable(c as EmailChannel),
    );
}

export async function setEmailPreferences(params: {
  userId: string;
  organizationId: string | null;
  preferences: {
    marketing?: boolean;
    digest?: boolean;
    productUpdates?: boolean;
  };
}): Promise<{ emailUnsubscribedChannels: EmailChannel[] }> {
  const { userId, organizationId, preferences } = params;
  const user = await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
    where: { id: userId },
    select: { emailUnsubscribedChannels: true },
  });

  const current = new Set<string>(user.emailUnsubscribedChannels);
  // `subscribed=true`  → remove from unsubscribed list
  // `subscribed=false` → add to unsubscribed list
  for (const [channel, subscribed] of Object.entries(preferences)) {
    if (typeof subscribed !== 'boolean') continue;
    if (!isUnsubscribable(channel as EmailChannel)) continue;
    if (subscribed) {
      current.delete(channel);
    } else {
      current.add(channel);
    }
  }

  const next = Array.from(current);
  await prismaDangerouslyBypassRLS.user.update({
    where: { id: userId },
    data: { emailUnsubscribedChannels: next },
  });

  await auditLogCreate({
    entityId: userId,
    entityName: 'User',
    operation: auditLogOperations.update,
    userId,
    organizationId,
    newData: { emailUnsubscribedChannels: next },
  });

  return { emailUnsubscribedChannels: next as EmailChannel[] };
}
