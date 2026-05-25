import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../env';
// bypass-RLS: GDPR data export must collect everything the user owns
// across every org they're in. Filters scope explicitly to userId.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { getPgBoss } from '../../shared/jobs/pgBoss';
import { processJobs } from '../../shared/jobs/jobProcessor';
import { getDictionary } from '../../translation/getDictionary';
import { Locale } from '../../translation/locales';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { sendEmail } from '../../shared/lib/sendEmail';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { Error400 } from '../../shared/errors/Error400';
import {
  USER_ACCOUNT_QUEUE,
  UserAccountJobData,
} from './userAccountJobSchemas';
import {
  DATA_EXPORT_RATE_LIMIT_HOURS,
  DATA_EXPORT_SIGNED_URL_TTL_SECONDS,
} from './userAccountSchemas';

function getS3Client(): S3Client {
  return new S3Client({
    region: env.S3_REGION || 'us-east-1',
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: env.S3_ENDPOINT ? true : false,
  });
}

/**
 * Enqueue a new export. Rate-limited to one request per
 * DATA_EXPORT_RATE_LIMIT_HOURS so the worker isn't spammed by a stuck-tab
 * client. Throws Error400 if the user is already within the cooldown.
 */
export async function requestDataExport(params: {
  userId: string;
  organizationId: string;
  locale: Locale;
}): Promise<{ id: string; status: 'queued' }> {
  const { userId, organizationId, locale } = params;
  const cooldownStart = new Date(
    Date.now() - DATA_EXPORT_RATE_LIMIT_HOURS * 60 * 60 * 1000,
  );
  const recent = await prismaDangerouslyBypassRLS.userDataExport.findFirst({
    where: { userId, createdAt: { gt: cooldownStart } },
    select: { id: true },
  });
  if (recent) {
    throw new Error400(
      `A data export was already requested within the last ${DATA_EXPORT_RATE_LIMIT_HOURS} hours.`,
    );
  }

  const row = await prismaDangerouslyBypassRLS.userDataExport.create({
    data: { userId, organizationId },
    select: { id: true },
  });

  const boss = await getPgBoss();
  const jobData: UserAccountJobData = {
    kind: 'dataExport',
    exportId: row.id,
    locale,
  };
  await boss.send(USER_ACCOUNT_QUEUE, jobData);

  if (env.BACKGROUND_JOB_MODE === 'inline') {
    await processJobs();
  }

  await auditLogCreate({
    entityId: row.id,
    entityName: 'UserDataExport',
    operation: auditLogOperations.create,
    userId,
    organizationId,
    newData: { id: row.id, status: 'queued' },
  });

  return { id: row.id, status: 'queued' };
}

export async function listDataExports(params: {
  userId: string;
}): Promise<
  Array<{
    id: string;
    createdAt: Date;
    completedAt: Date | null;
    failedAt: Date | null;
    status: 'queued' | 'completed' | 'failed';
  }>
> {
  const rows = await prismaDangerouslyBypassRLS.userDataExport.findMany({
    where: { userId: params.userId },
    select: {
      id: true,
      createdAt: true,
      completedAt: true,
      failedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    completedAt: r.completedAt,
    failedAt: r.failedAt,
    status: r.failedAt
      ? ('failed' as const)
      : r.completedAt
        ? ('completed' as const)
        : ('queued' as const),
  }));
}

/**
 * Mints a fresh short-TTL signed URL for downloading a completed export.
 * Throws if the user doesn't own the row or the export hasn't completed.
 */
export async function mintDataExportSignedUrl(params: {
  userId: string;
  exportId: string;
}): Promise<string> {
  const row = await prismaDangerouslyBypassRLS.userDataExport.findUnique({
    where: { id: params.exportId },
    select: { userId: true, completedAt: true, s3Key: true },
  });
  if (!row || row.userId !== params.userId) {
    throw new Error400('Export not found');
  }
  if (!row.completedAt || !row.s3Key) {
    throw new Error400('Export not ready');
  }
  const client = getS3Client();
  return await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_PRIVATE,
      Key: row.s3Key,
    }),
    { expiresIn: DATA_EXPORT_SIGNED_URL_TTL_SECONDS },
  );
}

/**
 * Worker body. Collects the user's data into one JSON document and uploads
 * it to the private S3 bucket. On success: stamp completedAt + s3Key, email
 * the user. On failure: stamp failedAt + errorMessage; pg-boss retries with
 * backoff.
 */
export async function runDataExportJob(exportId: string, locale: Locale) {
  const row = await prismaDangerouslyBypassRLS.userDataExport.findUnique({
    where: { id: exportId },
    select: {
      id: true,
      userId: true,
      organizationId: true,
      completedAt: true,
      failedAt: true,
    },
  });
  if (!row || row.completedAt || row.failedAt) return; // idempotent

  try {
    const data = await collectUserData(row.userId);
    const json = JSON.stringify(data, null, 2);
    const s3Key = `data-exports/${row.userId}/${row.id}.json`;
    const client = getS3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_PRIVATE,
        Key: s3Key,
        Body: json,
        ContentType: 'application/json',
      }),
    );

    await prismaDangerouslyBypassRLS.userDataExport.update({
      where: { id: row.id },
      data: { completedAt: new Date(), s3Key },
    });

    const user = await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
      where: { id: row.userId },
      select: { email: true, name: true },
    });
    const dictionary = await getDictionary(locale);
    const e = dictionary.emails.dataExportReadyEmail;
    const downloadUrl = `${env.FRONTEND_URL}/account/data-export`;
    await sendEmail(
      user.email,
      null,
      e.subject,
      dictionaryFormat(e.content, user.name || user.email, downloadUrl),
      'HTML',
      { channel: 'transactional', userId: row.userId },
    );

    await auditLogCreate({
      entityId: row.id,
      entityName: 'UserDataExport',
      operation: auditLogOperations.update,
      userId: row.userId,
      organizationId: row.organizationId,
      newData: { status: 'completed', s3Key },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Data export failed';
    await prismaDangerouslyBypassRLS.userDataExport.update({
      where: { id: row.id },
      data: { failedAt: new Date(), errorMessage: message.slice(0, 1000) },
    });
    throw error;
  }
}

/**
 * Collects every user-scoped table into one JSON blob. List is explicit
 * (not "everything in schema") so adding a new model doesn't accidentally
 * leak into exports. When you add a new user-scoped model that contains
 * PII the user authored, add a block here.
 */
async function collectUserData(userId: string): Promise<Record<string, unknown>> {
  const px = prismaDangerouslyBypassRLS;
  const [
    user,
    members,
    coursePurchases,
    courseRatings,
    courseStudentNotes,
    courseStudyPlanItems,
    coursePracticeAttempts,
    chatbotConversations,
    studyNotes,
    examInstances,
    dailyGoals,
    documentUploads,
    notifications,
    oneOnOneSessionsStudent,
    oneOnOneSessionsInstructor,
    oneOnOneNotes,
  ] = await Promise.all([
    px.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        dateOfBirth: true,
        termsAcceptedAt: true,
        termsAcceptedVersion: true,
        privacyAcceptedAt: true,
        privacyAcceptedVersion: true,
        emailUnsubscribedChannels: true,
        cookieConsent: true,
      },
    }),
    px.member.findMany({ where: { userId } }),
    px.coursePurchase.findMany({ where: { userId } }),
    px.courseRating.findMany({ where: { userId } }),
    px.courseStudentNote.findMany({ where: { userId } }),
    px.courseStudyPlanItem.findMany({ where: { userId } }),
    px.coursePracticeAttempt.findMany({ where: { userId } }),
    px.chatbotConversation.findMany({
      where: { userId },
      include: { messages: true },
    }),
    px.studyNote.findMany({ where: { createdByUserId: userId } }),
    px.examInstance.findMany({ where: { createdByUserId: userId } }),
    px.dailyGoal.findMany({ where: { createdByUserId: userId } }),
    px.documentUpload.findMany({ where: { createdByUserId: userId } }),
    px.notification.findMany({ where: { userId } }),
    px.oneOnOneSession.findMany({ where: { studentUserId: userId } }),
    px.oneOnOneSession.findMany({ where: { instructorUserId: userId } }),
    px.oneOnOneSessionNote.findMany({ where: { authorUserId: userId } }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    schema: 'nexexam.userDataExport.v1',
    user,
    organizationMemberships: members,
    coursePurchases,
    courseRatings,
    courseStudentNotes,
    courseStudyPlanItems,
    coursePracticeAttempts,
    chatbotConversations,
    studyNotes,
    examInstances,
    dailyGoals,
    documentUploads,
    notifications,
    oneOnOneSessionsAsStudent: oneOnOneSessionsStudent,
    oneOnOneSessionsAsInstructor: oneOnOneSessionsInstructor,
    oneOnOneSessionNotes: oneOnOneNotes,
  };
}
