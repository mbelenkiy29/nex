import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error401 } from '../../shared/errors/Error401';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  aiTrustPreferencesInputSchema,
  AiTrustDataSource,
  AiTrustDataSourceKey,
  AiTrustPreferences,
  AiTrustPreferencesInput,
  AiTrustSignal,
} from './aiTrustSchemas';

export const AI_TRUST_DEFAULT_PREFERENCES: AiTrustPreferences = {
  useLessonContent: true,
  useLessonProgress: true,
  usePracticeResults: true,
  useChatHistory: true,
  useAttachments: true,
};

const preferenceKeys: Array<keyof AiTrustPreferences> = [
  'useLessonContent',
  'useLessonProgress',
  'usePracticeResults',
  'useChatHistory',
  'useAttachments',
];

function requireAiTrustUser(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }
  return context.currentUser.id;
}

function normalizePreferences(
  row: Partial<AiTrustPreferences> | null | undefined,
): AiTrustPreferences {
  return {
    ...AI_TRUST_DEFAULT_PREFERENCES,
    ...(row || {}),
  };
}

export async function aiTrustGetPreferences(
  context: AppContext,
): Promise<AiTrustPreferences> {
  const userId = requireAiTrustUser(context);
  const row = await prisma.$withRLS(
    { organization: context.currentOrganization ?? undefined },
    (tx) =>
      tx.aiTrustPreference.findUnique({
        where: { userId },
        select: {
          useLessonContent: true,
          useLessonProgress: true,
          usePracticeResults: true,
          useChatHistory: true,
          useAttachments: true,
        },
      }),
  );
  return normalizePreferences(row);
}

export async function aiTrustUpdatePreferences(
  body: unknown,
  context: AppContext,
): Promise<AiTrustPreferences> {
  const userId = requireAiTrustUser(context);
  const data = aiTrustPreferencesInputSchema.parse(body ?? {});

  const { oldData, row } = await prisma.$withRLS(
    { organization: context.currentOrganization ?? undefined },
    async (tx) => {
      const existing = await tx.aiTrustPreference.findUnique({
        where: { userId },
      });
      const next = await tx.aiTrustPreference.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...AI_TRUST_DEFAULT_PREFERENCES,
          ...data,
        },
      });
      return { oldData: existing, row: next };
    },
  );

  await auditLogCreate({
    context,
    entityId: row.id,
    entityName: 'AiTrustPreference',
    operation: oldData ? auditLogOperations.update : auditLogOperations.create,
    oldData,
    newData: row,
  });

  return normalizePreferences(row);
}

export function aiTrustOmittedSources(
  preferences: AiTrustPreferences,
): AiTrustDataSourceKey[] {
  const omitted: AiTrustDataSourceKey[] = [];
  if (!preferences.useLessonContent) omitted.push('lessonContent');
  if (!preferences.useLessonProgress) omitted.push('lessonProgress');
  if (!preferences.usePracticeResults) omitted.push('practiceResults');
  if (!preferences.useChatHistory) omitted.push('chatHistory');
  if (!preferences.useAttachments) omitted.push('attachments');
  return omitted;
}

export function aiTrustSource(
  key: AiTrustDataSourceKey,
  status: AiTrustDataSource['status'],
  options: Pick<AiTrustDataSource, 'count' | 'details'> = {},
): AiTrustDataSource {
  return {
    key,
    status,
    ...(options.count !== undefined ? { count: options.count } : {}),
    ...(options.details?.length ? { details: options.details } : {}),
  };
}

export function aiTrustLimitations(
  context: AppContext,
  preferences: AiTrustPreferences,
  extras: Array<string | null | undefined> = [],
) {
  const t = context.dictionary.aiTrust.limitations;
  return [
    t.general,
    !preferences.useLessonContent ? t.lessonContentOff : null,
    !preferences.useLessonProgress ? t.lessonProgressOff : null,
    !preferences.usePracticeResults ? t.practiceOff : null,
    !preferences.useChatHistory ? t.historyOff : null,
    !preferences.useAttachments ? t.attachmentsOff : null,
    ...extras,
  ].filter(Boolean) as string[];
}

export function aiTrustSignal(params: {
  context: AppContext;
  preferences: AiTrustPreferences;
  whyGenerated: string;
  influencingData: AiTrustDataSource[];
  confidenceLevel: AiTrustSignal['confidenceLevel'];
  limitations?: string[];
  model?: string | null;
}): AiTrustSignal {
  return {
    whyGenerated: params.whyGenerated,
    influencingData: params.influencingData,
    confidenceLevel: params.confidenceLevel,
    limitations:
      params.limitations && params.limitations.length
        ? params.limitations
        : aiTrustLimitations(params.context, params.preferences),
    privacySnapshot: {
      preferences: params.preferences,
      omitted: aiTrustOmittedSources(params.preferences),
    },
    generatedAt: new Date().toISOString(),
    model: params.model ?? null,
  };
}

export function aiTrustJson(signal: AiTrustSignal): Prisma.InputJsonValue {
  return signal as unknown as Prisma.InputJsonValue;
}
