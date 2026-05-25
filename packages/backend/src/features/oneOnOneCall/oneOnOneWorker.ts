// bypass-RLS: pg-boss worker — auto-complete + release-holds crons run
// without an HTTP request, so no per-request RLS context can be set.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { getDictionary } from '../../translation/getDictionary';
import { Locale } from '../../translation/locales';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { formatSessionWhen, notifyOneOnOneUser } from './oneOnOneService';
import type { OneOnOneJobData } from './oneOnOneJobSchemas';

/**
 * Dispatcher for the `one-on-one` pg-boss queue. Per-session reminder jobs
 * are scheduled via `boss.send` with `startAfter`; the two sweepers are
 * driven by `boss.schedule` and use `kind` to discriminate. Every branch is
 * idempotent — a re-fired reminder for a now-cancelled session is a no-op.
 */
export async function oneOnOneWorker(data: OneOnOneJobData): Promise<void> {
  switch (data.kind) {
    case 'reminder24h':
    case 'reminder1h':
      await runReminder(data);
      return;
    case 'autoComplete':
      await runAutoComplete();
      return;
    case 'releaseExpiredHold':
      await runReleaseExpiredHolds();
      return;
    default:
      console.warn(`oneOnOneWorker: unknown job kind ${(data as any).kind}`);
  }
}

async function runReminder(data: OneOnOneJobData): Promise<void> {
  if (!data.sessionId) return;

  const session =
    await prismaDangerouslyBypassRLS.oneOnOneSession.findUnique({
      where: { id: data.sessionId },
      include: { course: { select: { title: true } } },
    });
  // Only remind for live confirmed sessions whose start is still in the
  // future (cancelled / expired / past sessions are skipped silently).
  if (
    !session ||
    session.status !== 'confirmed' ||
    session.scheduledStartAt.getTime() < Date.now()
  ) {
    return;
  }

  const dictionary = await getDictionary((data.locale ?? 'en') as Locale);
  const t = dictionary.oneOnOneCall.notify;
  const when = formatSessionWhen(session.scheduledStartAt);
  const message = dictionaryFormat(t.reminderBody, session.course.title, when);

  await Promise.all([
    notifyOneOnOneUser(session.studentUserId, {
      title: t.reminderTitle,
      message,
    }),
    notifyOneOnOneUser(session.instructorUserId, {
      title: t.reminderTitle,
      message,
    }),
  ]);
}

async function runAutoComplete(): Promise<void> {
  const now = new Date();
  // findMany → updateMany would be one query, but we want an audit row per
  // session so the change is traceable.
  const due = await prismaDangerouslyBypassRLS.oneOnOneSession.findMany({
    where: { status: 'confirmed', scheduledEndAt: { lt: now } },
    select: { id: true, studentUserId: true },
    take: 500,
  });
  for (const row of due) {
    const old = await prismaDangerouslyBypassRLS.oneOnOneSession.findUnique({
      where: { id: row.id },
    });
    if (!old || old.status !== 'confirmed') continue;
    const next = await prismaDangerouslyBypassRLS.oneOnOneSession.update({
      where: { id: row.id },
      data: { status: 'completed' },
    });
    await auditLogCreate({
      entityId: next.id,
      entityName: 'OneOnOneSession',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: row.studentUserId,
      oldData: old,
      newData: next,
    });
  }
}

async function runReleaseExpiredHolds(): Promise<void> {
  const now = new Date();
  const due = await prismaDangerouslyBypassRLS.oneOnOneSession.findMany({
    where: {
      status: 'pendingPayment',
      paymentExpiresAt: { not: null, lt: now },
    },
    select: { id: true, studentUserId: true, course: { select: { title: true } } },
    take: 500,
  });
  const dictionary = await getDictionary('en');
  const t = dictionary.oneOnOneCall.notify;
  for (const row of due) {
    const old = await prismaDangerouslyBypassRLS.oneOnOneSession.findUnique({
      where: { id: row.id },
    });
    if (!old || old.status !== 'pendingPayment') continue;
    const next = await prismaDangerouslyBypassRLS.oneOnOneSession.update({
      where: { id: row.id },
      data: {
        status: 'expired',
        slotKey: null,
        paymentExpiresAt: null,
      },
    });
    await auditLogCreate({
      entityId: next.id,
      entityName: 'OneOnOneSession',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: row.studentUserId,
      oldData: old,
      newData: next,
    });
    await notifyOneOnOneUser(row.studentUserId, {
      title: t.cancelledTitle,
      message: `${row.course.title} — payment was not completed; the slot has been released.`,
    });
  }
}
