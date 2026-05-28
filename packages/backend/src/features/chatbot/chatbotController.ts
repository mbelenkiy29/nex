import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { AppContext } from '../../shared/controller/appContext';
import { authGuardBackend } from '../auth/authGuardBackend';
import { ChatbotMessage as ChatbotMessageDto } from './chatbotSchemas';
import { chatbotSendConversationMessageInputSchema } from './chatbotConversationSchemas';
import { chatbotConversationLoad } from './chatbotConversationController';
import { CHATBOT_MODEL, streamChatbotResponse } from './chatbotService';
import { checkAllLimits, trackTokenUsage } from './chatbotUsageService';
import {
  acquireChatbotLock,
  releaseChatbotLock,
  ChatbotLockError,
} from './chatbotLockService';
import { StudyToolWidget } from './chatbotTools';
import { prisma } from '../../prisma';
import { Prisma } from '../../prisma/generated/client';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  durationMs,
  errorToLogMetadata,
  logger,
} from '../../shared/lib/logger';
import {
  chatbotMessageContentForModel,
  chatbotProcessAttachments,
} from './chatbotAttachmentService';
import {
  aiTrustGetPreferences,
  aiTrustJson,
  aiTrustLimitations,
  aiTrustSignal,
  aiTrustSource,
} from '../aiTrust/aiTrustService';
import type {
  AiTrustPreferences,
  AiTrustSignal,
} from '../aiTrust/aiTrustSchemas';

// Cap on prior turns sent to the model. Older history is silently dropped.
const CONVERSATION_HISTORY_LIMIT = 50;

function chatbotTrustSignal(params: {
  context: AppContext;
  preferences: AiTrustPreferences;
  courseId: string | null;
  lessonId: string | null;
  historyCount: number;
  attachmentCount: number;
}): AiTrustSignal {
  const { context, preferences } = params;
  return aiTrustSignal({
    context,
    preferences,
    whyGenerated: context.dictionary.aiTrust.reasons.aiTutor,
    influencingData: [
      aiTrustSource('studentPrompt', 'used', { count: 1 }),
      params.courseId
        ? aiTrustSource('courseOutline', 'used')
        : aiTrustSource('courseOutline', 'unavailable'),
      params.lessonId
        ? preferences.useLessonContent
          ? aiTrustSource('lessonContent', 'used')
          : aiTrustSource('lessonContent', 'omitted')
        : aiTrustSource('lessonContent', 'unavailable'),
      preferences.useChatHistory
        ? aiTrustSource(
            'chatHistory',
            params.historyCount > 0 ? 'used' : 'unavailable',
            { count: params.historyCount },
          )
        : aiTrustSource('chatHistory', 'omitted'),
      preferences.useAttachments
        ? aiTrustSource(
            'attachments',
            params.attachmentCount > 0 ? 'used' : 'unavailable',
            { count: params.attachmentCount },
          )
        : aiTrustSource('attachments', 'omitted'),
    ],
    confidenceLevel:
      params.courseId || params.historyCount || params.attachmentCount
        ? 'medium'
        : 'low',
    limitations: aiTrustLimitations(context, preferences, [
      context.dictionary.aiTrust.limitations.verifyAnswers,
    ]),
    model: CHATBOT_MODEL,
  });
}

function getLimitExceededMessage(
  limitType: 'user' | 'organization' | 'global',
  context: AppContext,
): string {
  switch (limitType) {
    case 'user':
      return context.dictionary.aiTutor.alerts.limitDaily;
    case 'organization':
      return context.dictionary.aiTutor.alerts.limitOrg;
    case 'global':
      return context.dictionary.aiTutor.alerts.limitGlobal;
  }
}

export async function chatbotSendConversationMessageController(
  conversationId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend({ chatbot: ['use'] }, context);

  const data = chatbotSendConversationMessageInputSchema.parse(body);
  const conversation = await chatbotConversationLoad(conversationId, context);

  const userId = context.currentUser!.id;
  const organizationId = context.currentOrganization!.id;
  const preferences = await aiTrustGetPreferences(context);

  // 1) Concurrency lock (per-user) — same primitive the modal uses.
  try {
    await acquireChatbotLock(userId);
  } catch (error) {
    if (error instanceof ChatbotLockError) {
      logger.warn('ai.chatbot.concurrent_request', {
        userId,
        organizationId,
        conversationId: conversation.id,
        courseId: conversation.courseId,
      });
      return c.json(
        { error: 'concurrent_request', message: error.message },
        409,
      );
    }
    throw error;
  }

  // 2) Daily token-limit gate.
  const limitCheck = await checkAllLimits(userId, organizationId);
  if (!limitCheck.allowed) {
    logger.warn('ai.chatbot.limit_exceeded', {
      userId,
      organizationId,
      conversationId: conversation.id,
      courseId: conversation.courseId,
      limitType: limitCheck.limitType,
      current: limitCheck.current,
      limit: limitCheck.limit,
    });
    await releaseChatbotLock(userId);
    return c.json(
      {
        error: 'limit_exceeded',
        limitType: limitCheck.limitType,
        current: limitCheck.current,
        limit: limitCheck.limit,
        message: getLimitExceededMessage(limitCheck.limitType, context),
      },
      429,
    );
  }

  let userRow: Awaited<ReturnType<typeof prisma.chatbotMessage.create>>;
  let processedAttachments: Awaited<
    ReturnType<typeof chatbotProcessAttachments>
  >;
  let persistedAttachments: unknown[] = [];
  let history: ChatbotMessageDto[];
  try {
    processedAttachments = preferences.useAttachments
      ? await chatbotProcessAttachments(data.attachments, context)
      : [];
    persistedAttachments = preferences.useAttachments
      ? processedAttachments
      : data.attachments || [];

    // 3) Persist the user turn. If streaming fails after this point, the user
    //    msg still lives in history.
    userRow = await prisma.chatbotMessage.create({
      data: {
        conversationId: conversation.id,
        // Denormalized from `conversation.organizationId` — same value, kept
        // explicit on the row so RLS can scope without a join. See the
        // ChatbotMessage model comment for why this is required (audit #5).
        organizationId,
        role: 'user',
        content: data.message,
        attachments:
          persistedAttachments.length > 0
            ? (persistedAttachments as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
      },
    });
    await prisma.chatbotConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // 4) Load prior turns (oldest first, cap CONVERSATION_HISTORY_LIMIT).
    const priorRows = await prisma.chatbotMessage.findMany({
      where: { conversationId: conversation.id, id: { not: userRow.id } },
      orderBy: { createdAt: 'desc' },
      take: CONVERSATION_HISTORY_LIMIT,
      select: { role: true, content: true, attachments: true, createdAt: true },
    });
    history = priorRows
      .slice()
      .reverse()
      .map((row) => ({
        role: row.role as 'user' | 'assistant',
        content:
          row.role === 'user'
            ? chatbotMessageContentForModel(
                row.content,
                preferences.useAttachments ? (row.attachments as any) : [],
              )
            : row.content,
      }));
    if (!preferences.useChatHistory) {
      history = [];
    }
  } catch (error) {
    await releaseChatbotLock(userId);
    throw error;
  }

  return streamSSE(c, async (stream) => {
    const startedAt = Date.now();
    let assistantText = '';
    let inputTokens = 0;
    let outputTokens = 0;
    const widgets: StudyToolWidget[] = [];
    const widgetTrustSignals: AiTrustSignal[] = [];
    let sawErrorChunk = false;

    try {
      for await (const chunk of streamChatbotResponse(
        data.message,
        history,
        context,
        {
          courseId: conversation.courseId ?? undefined,
          lessonId: conversation.lessonId ?? undefined,
          attachments: preferences.useAttachments ? processedAttachments : [],
          preferences,
        },
      )) {
        if (chunk.type === 'text' && chunk.content) {
          assistantText += chunk.content;
        }
        if (chunk.type === 'tool_result' && chunk.widget) {
          widgets.push(chunk.widget);
          const trust = (chunk.widget.payload as Record<string, unknown>)
            ?.trust;
          if (trust && typeof trust === 'object') {
            widgetTrustSignals.push(trust as AiTrustSignal);
          }
        }
        if (chunk.type === 'usage' && chunk.usage) {
          inputTokens = chunk.usage.inputTokens;
          outputTokens = chunk.usage.outputTokens;
        }
        if (chunk.type === 'error') {
          sawErrorChunk = true;
        }

        await stream.writeSSE({
          data: JSON.stringify(chunk),
          event: chunk.type,
        });

        if (chunk.type === 'error' || chunk.type === 'done') {
          await stream.sleep(100);
        }
      }

      if (inputTokens > 0 || outputTokens > 0) {
        await trackTokenUsage(
          userId,
          organizationId,
          inputTokens,
          outputTokens,
        );
      }
      if (sawErrorChunk) {
        logger.warn('ai.chatbot.failed', {
          userId,
          organizationId,
          conversationId: conversation.id,
          courseId: conversation.courseId,
          lessonId: conversation.lessonId,
          model: CHATBOT_MODEL,
          durationMs: durationMs(startedAt),
          errorCode: 'stream_error_chunk',
        });
      } else {
        logger.info('ai.chatbot.completed', {
          userId,
          organizationId,
          conversationId: conversation.id,
          courseId: conversation.courseId,
          lessonId: conversation.lessonId,
          model: CHATBOT_MODEL,
          inputTokens,
          outputTokens,
          widgetCount: widgets.length,
          durationMs: durationMs(startedAt),
        });
      }
    } catch (error: any) {
      logger.error('ai.chatbot.failed', {
        userId,
        organizationId,
        conversationId: conversation.id,
        courseId: conversation.courseId,
        lessonId: conversation.lessonId,
        model: CHATBOT_MODEL,
        durationMs: durationMs(startedAt),
        error: errorToLogMetadata(error),
      });
      await stream.writeSSE({
        data: JSON.stringify({
          type: 'error',
          content: error.message || context.dictionary.chatbot.error,
        }),
        event: 'error',
      });
    } finally {
      // 5) Persist the assistant row even on partial / aborted streams — the
      //    next send will see this in history.
      const assistantRow = await prisma.chatbotMessage.create({
        data: {
          conversationId: conversation.id,
          // Same denormalized organizationId as the user turn above.
          organizationId,
          role: 'assistant',
          content: assistantText,
          widgets:
            widgets.length > 0
              ? (widgets as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
          trustSignals: aiTrustJson(
            widgetTrustSignals[widgetTrustSignals.length - 1] ??
              chatbotTrustSignal({
                context,
                preferences,
                courseId: conversation.courseId,
                lessonId: conversation.lessonId,
                historyCount: history.length,
                attachmentCount: preferences.useAttachments
                  ? processedAttachments.length
                  : 0,
              }),
          ),
          inputTokens: inputTokens || null,
          outputTokens: outputTokens || null,
        },
      });
      await prisma.chatbotConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });
      await auditLogCreate({
        context,
        entityId: assistantRow.id,
        entityName: 'ChatbotMessage',
        operation: auditLogOperations.create,
        newData: {
          conversationId: conversation.id,
          role: 'assistant',
          widgetCount: widgets.length,
          inputTokens,
          outputTokens,
        },
      });
      await releaseChatbotLock(userId);
    }
  });
}
