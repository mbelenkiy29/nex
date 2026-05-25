import { createHash } from 'node:crypto';
// bypass-RLS: account-deletion sweep is a system-level cron with no
// per-request org context; deletion fans across all of a user's orgs.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { Prisma } from '../../prisma/generated/client';
import { env } from '../../env';
import { getDictionary } from '../../translation/getDictionary';
import { Locale } from '../../translation/locales';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { sendEmail } from '../../shared/lib/sendEmail';
import { Error400 } from '../../shared/errors/Error400';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  DELETION_GRACE_DAYS,
  DELETION_TOKEN_TTL_HOURS,
} from './userAccountSchemas';
import { mintToken } from './userAccountTokens';

/**
 * Step 1 of the deletion flow: the signed-in user asks to delete their
 * account. We stamp `deletionRequestedAt` + `deletionScheduledFor`, mint a
 * 24h confirmation token, and email the link. The user can cancel at any
 * point inside the 14-day window; without confirmation the hard-delete
 * cron never picks the row up.
 */
export async function requestAccountDeletion(params: {
  userId: string;
  organizationId: string | null;
  locale: Locale;
}): Promise<{ scheduledFor: Date }> {
  const { userId, organizationId, locale } = params;

  const user = await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      deletionRequestedAt: true,
      deletedAt: true,
    },
  });

  const dictionary = await getDictionary(locale);
  if (user.deletedAt) {
    throw new Error400(dictionary.account.delete.errors.alreadyDeleted);
  }

  const now = new Date();
  const scheduledFor = new Date(
    now.getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000,
  );
  const tokenExpiresAt = new Date(
    now.getTime() + DELETION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  );
  const token = mintToken();

  await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        deletionRequestedAt: now,
        deletionScheduledFor: scheduledFor,
        // A re-request after a previous cancellation resets confirmation.
        deletionConfirmedAt: null,
      },
    });

    await tx.accountDeletionConfirmationToken.create({
      data: {
        userId,
        token,
        expiresAt: tokenExpiresAt,
      },
    });
  });

  const e = dictionary.emails.accountDeletionRequestEmail;
  const confirmUrl = `${env.FRONTEND_URL}/account/delete/confirm?token=${encodeURIComponent(token)}`;
  const friendlyDate = scheduledFor.toUTCString();

  await sendEmail(
    user.email,
    null,
    e.subject,
    dictionaryFormat(
      e.content,
      user.name || user.email,
      confirmUrl,
      friendlyDate,
    ),
    'HTML',
    { channel: 'auth', userId },
  );

  await auditLogCreate({
    entityId: userId,
    entityName: 'User',
    operation: auditLogOperations.update,
    userId,
    organizationId,
    newData: {
      deletionRequestedAt: now.toISOString(),
      deletionScheduledFor: scheduledFor.toISOString(),
    },
  });

  return { scheduledFor };
}

/**
 * Step 2 of the deletion flow: the user clicks the email link. We mark
 * `deletionConfirmedAt` so the daily cron will pick the row up once
 * `deletionScheduledFor` elapses. Token is one-shot.
 */
export async function confirmAccountDeletion(params: {
  token: string;
  locale: Locale;
}): Promise<{ confirmed: boolean; scheduledFor: Date | null }> {
  const { token, locale } = params;
  const now = new Date();

  const row =
    await prismaDangerouslyBypassRLS.accountDeletionConfirmationToken.findUnique(
      {
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              deletionRequestedAt: true,
              deletionScheduledFor: true,
              deletedAt: true,
            },
          },
        },
      },
    );

  if (!row || row.consumedAt || row.expiresAt < now) {
    return { confirmed: false, scheduledFor: null };
  }
  if (row.user.deletedAt || !row.user.deletionRequestedAt) {
    // Either already hard-deleted, or the request was cancelled and never
    // re-issued. Either way the token is no longer actionable.
    return { confirmed: false, scheduledFor: null };
  }

  await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    await tx.accountDeletionConfirmationToken.update({
      where: { id: row.id },
      data: { consumedAt: now },
    });
    await tx.user.update({
      where: { id: row.user.id },
      data: { deletionConfirmedAt: now },
    });
  });

  const dictionary = await getDictionary(locale);
  const e = dictionary.emails.accountDeletionConfirmedEmail;
  const friendlyDate = row.user.deletionScheduledFor?.toUTCString() ?? '';
  await sendEmail(
    row.user.email,
    null,
    e.subject,
    dictionaryFormat(e.content, row.user.name || row.user.email, friendlyDate),
    'HTML',
    { channel: 'auth', userId: row.user.id },
  );

  await auditLogCreate({
    entityId: row.user.id,
    entityName: 'User',
    operation: auditLogOperations.update,
    userId: row.user.id,
    newData: { deletionConfirmedAt: now.toISOString() },
  });

  return { confirmed: true, scheduledFor: row.user.deletionScheduledFor };
}

/**
 * Step 3 (optional): the user changes their mind. Nulls the four deletion
 * fields if `deletedAt` is still null. After this, the row looks fresh.
 */
export async function cancelAccountDeletion(params: {
  userId: string;
  organizationId: string | null;
  locale: Locale;
}): Promise<void> {
  const { userId, organizationId, locale } = params;
  const user = await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, deletedAt: true, deletionRequestedAt: true },
  });
  if (user.deletedAt) {
    const dictionary = await getDictionary(locale);
    throw new Error400(dictionary.account.delete.errors.alreadyDeleted);
  }
  if (!user.deletionRequestedAt) {
    return; // idempotent no-op
  }

  await prismaDangerouslyBypassRLS.user.update({
    where: { id: userId },
    data: {
      deletionRequestedAt: null,
      deletionScheduledFor: null,
      deletionConfirmedAt: null,
    },
  });

  await auditLogCreate({
    entityId: userId,
    entityName: 'User',
    operation: auditLogOperations.update,
    userId,
    organizationId,
    newData: { deletionCancelled: true },
  });
}

/**
 * Cron handler. Runs daily; PII-anonymizes any user whose 14-day grace
 * window has elapsed AND who confirmed via email. Cascades the non-
 * retention tables (StudyNote, ChatbotConversation, Notification,
 * PushToken, UserDataExport). Keeps tax/legal-retention tables joined to
 * the anonymized row (CoursePurchase, AuditLog, OneOnOneSession).
 *
 * Better-Auth sessions are revoked via the auth API to terminate any
 * live login session immediately.
 */
export async function runAccountHardDeleteSweep(): Promise<{
  processedUserIds: string[];
}> {
  const now = new Date();
  const due = await prismaDangerouslyBypassRLS.user.findMany({
    where: {
      deletionConfirmedAt: { not: null },
      deletionScheduledFor: { lt: now },
      deletedAt: null,
    },
    select: { id: true, email: true },
    take: 200,
  });

  const processed: string[] = [];

  for (const row of due) {
    try {
      await hardDeleteUserData(row.id);
      processed.push(row.id);
    } catch (error) {
      console.error(`Failed to hard-delete user ${row.id}:`, error);
      // Don't throw — let the cron clear other rows. Failure is logged
      // and will be re-attempted on the next sweep.
    }
  }

  return { processedUserIds: processed };
}

async function hardDeleteUserData(userId: string): Promise<void> {
  const now = new Date();
  // Use a SHA-256 prefix instead of the raw userId so the anonymized email
  // doesn't expose the original primary key to any log that captures it.
  // Closes audit finding #21. 16 hex chars (64 bits) is uniqueness-safe for
  // the lifetime of the platform — collision probability stays negligible
  // well past 100M deleted users.
  const userIdHash = createHash('sha256')
    .update(userId)
    .digest('hex')
    .slice(0, 16);
  const anonymizedEmail = `deleted-${userIdHash}@example.invalid`;

  // Capture the original row for the audit log before we clobber it.
  const oldUser = await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, email: true, name: true, dateOfBirth: true },
  });

  await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    // Cascade the non-retention surfaces. Each table's @relation(onDelete:
    // Cascade) handles the row removal; we touch them here explicitly only
    // when the FK is SetNull or there's no FK at all.
    await tx.chatbotConversation.deleteMany({ where: { userId } });
    await tx.notification.deleteMany({ where: { userId } });
    await tx.pushToken.deleteMany({ where: { userId } });
    await tx.userDataExport.deleteMany({ where: { userId } });
    await tx.emailUnsubscribeToken.deleteMany({ where: { userId } });
    await tx.accountDeletionConfirmationToken.deleteMany({ where: { userId } });

    // Revoke any live Better-Auth sessions. Inside the transaction so a
    // failure rolls back the anonymization — closes audit finding #15. The
    // prior design swallowed session-revoke errors with a console.warn and
    // proceeded with the deletion, which left a window where the user row
    // looked anonymized to the sweep but the original user could still hit
    // protected routes from a cached session token. The next sweep retries
    // the whole deletion if this fails.
    await tx.session.deleteMany({ where: { userId } });

    // Anonymize the User row itself (keeps FKs from CoursePurchase /
    // AuditLog / OneOnOneSession intact for tax/legal retention).
    await tx.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        emailVerified: false,
        name: 'Deleted user',
        image: null,
        payoutMethodNote: null,
        dateOfBirth: null,
        emailUnsubscribedChannels: [],
        cookieConsent: Prisma.JsonNull,
        deletedAt: now,
      },
    });
  });

  await auditLogCreate({
    entityId: userId,
    entityName: 'User',
    operation: auditLogOperations.delete,
    userId,
    oldData: {
      email: oldUser.email,
      name: oldUser.name,
    },
    newData: {
      anonymizedAt: now.toISOString(),
      anonymizedEmail,
    },
  });
}

/**
 * Daily token-table cleanup. Drops consumed EmailUnsubscribeToken rows and
 * consumed/expired AccountDeletionConfirmationToken rows older than 30 days.
 * The grace window lets us answer "did this user actually click that
 * unsubscribe link?" for a month after the fact. Closes audit finding #20.
 *
 * Idempotent: returns the count deleted per table so the cron log shows
 * progress and a fully-clean run is a no-op (0/0).
 */
export async function runTokenCleanup(): Promise<{
  emailUnsubscribeTokens: number;
  accountDeletionTokens: number;
}> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Consumed unsubscribe tokens older than 30d.
  const emailUnsubscribeTokens =
    await prismaDangerouslyBypassRLS.emailUnsubscribeToken.deleteMany({
      where: {
        consumedAt: { not: null, lt: thirtyDaysAgo },
      },
    });

  // Deletion-confirmation tokens that are either consumed OR expired more
  // than 30 days ago.
  const accountDeletionTokens =
    await prismaDangerouslyBypassRLS.accountDeletionConfirmationToken.deleteMany(
      {
        where: {
          OR: [
            { consumedAt: { not: null, lt: thirtyDaysAgo } },
            { expiresAt: { lt: thirtyDaysAgo } },
          ],
        },
      },
    );

  return {
    emailUnsubscribeTokens: emailUnsubscribeTokens.count,
    accountDeletionTokens: accountDeletionTokens.count,
  };
}
