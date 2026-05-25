import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { AppContext } from '../../shared/controller/appContext';
import { authGuardBackend } from '../auth/authGuardBackend';
import {
  chatbotSendMessageInputSchema,
  ChatbotSendMessageInput,
  ChatbotMessage as ChatbotMessageDto,
} from './chatbotSchemas';
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

// Cap on prior turns sent to the model. Older history is silently dropped
// (v2 ships server-side summarization for long threads).
const CONVERSATION_HISTORY_LIMIT = 50;

export async function chatbotSendMessageController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend(
    {
      chatbot: ['use'],
    },
    context,
  );

  const input: ChatbotSendMessageInput =
    chatbotSendMessageInputSchema.parse(body);

  const userId = context.currentUser!.id;
  const organizationId = context.currentOrganization!.id;

  // Prevents multiple concurrent requests from same user to avoid response mixing
  try {
    await acquireChatbotLock(userId);
  } catch (error) {
    if (error instanceof ChatbotLockError) {
      logger.warn('ai.chatbot.concurrent_request', {
        userId,
        organizationId,
        courseId: input.courseId,
      });
      return c.json(
        {
          error: 'concurrent_request',
          message: error.message,
        },
        409, // Conflict
      );
    }
    throw error;
  }

  const limitCheck = await checkAllLimits(userId, organizationId);

  if (!limitCheck.allowed) {
    logger.warn('ai.chatbot.limit_exceeded', {
      userId,
      organizationId,
      courseId: input.courseId,
      limitType: limitCheck.limitType,
      current: limitCheck.current,
      limit: limitCheck.limit,
    });
    // Must release lock before returning to avoid permanent lockout
    await releaseChatbotLock(userId);

    return c.json(
      {
        error: 'limit_exceeded',
        limitType: limitCheck.limitType,
        current: limitCheck.current,
        limit: limitCheck.limit,
        message: getLimitExceededMessage(
          limitCheck.limitType,
          limitCheck.limit,
        ),
      },
      429, // Too Many Requests
    );
  }

  return streamSSE(c, async (stream) => {
    const startedAt = Date.now();
    let inputTokens = 0;
    let outputTokens = 0;
    let sawErrorChunk = false;

    try {
      for await (const chunk of streamChatbotResponse(
        input.message,
        input.conversationHistory || [],
        context,
        {
          courseId: input.courseId,
          lessonId: input.lessonId,
        },
      )) {
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
          // Brief delay ensures client receives final chunks before connection closes
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
          courseId: input.courseId,
          lessonId: input.lessonId,
          model: CHATBOT_MODEL,
          durationMs: durationMs(startedAt),
          errorCode: 'stream_error_chunk',
        });
      } else {
        logger.info('ai.chatbot.completed', {
          userId,
          organizationId,
          courseId: input.courseId,
          lessonId: input.lessonId,
          model: CHATBOT_MODEL,
          inputTokens,
          outputTokens,
          durationMs: durationMs(startedAt),
        });
      }
    } catch (error: any) {
      logger.error('ai.chatbot.failed', {
        userId,
        organizationId,
        courseId: input.courseId,
        lessonId: input.lessonId,
        model: CHATBOT_MODEL,
        durationMs: durationMs(startedAt),
        error: errorToLogMetadata(error),
      });
      await stream.writeSSE({
        data: JSON.stringify({
          type: 'error',
          content: error.message || 'An unexpected error occurred',
        }),
        event: 'error',
      });
    } finally {
      // Critical: ensures lock is always released preventing user lockout on errors
      await releaseChatbotLock(userId);
    }
  });
}

function getLimitExceededMessage(
  limitType: 'user' | 'organization' | 'global',
  limit: number,
): string {
  switch (limitType) {
    case 'user':
      return `You've reached your personal daily chatbot limit of ${limit.toLocaleString()} tokens. Your limit will reset tomorrow. Tokens count both your questions and the AI's responses.`;
    case 'organization':
      return `Your organization has reached its daily chatbot limit of ${limit.toLocaleString()} tokens. This limit is shared across all members and will reset tomorrow.`;
    case 'global':
      return 'The chatbot service has reached its daily capacity limit. Please try again tomorrow when the limit resets.';
  }
}

// ---------------------------------------------------------------------------
// Conversation-scoped send (Subsystem 2.2). Mirrors the legacy controller
// above but: (a) loads prior turns from `ChatbotMessage` rather than trusting
// the client; (b) persists the user row pre-stream and a placeholder
// assistant row that gets filled at `done`; (c) collects widget payloads from
// study-tool tool_result chunks into the assistant message's `widgets` JSON.
// ---------------------------------------------------------------------------
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

  // 1) Persist the user turn immediately. If the stream fails the user msg
  //    still lives in history (the typed-and-sent intent is preserved).
  const userRow = await prisma.chatbotMessage.create({
    data: {
      conversationId: conversation.id,
      // Denormalized from `conversation.organizationId` — same value, kept
      // explicit on the row so RLS can scope without a join. See the
      // ChatbotMessage model comment for why this is required (audit #5).
      organizationId,
      role: 'user',
      content: data.message,
    },
  });
  await prisma.chatbotConversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  // 2) Concurrency lock (per-user) — same primitive the modal uses.
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

  // 3) Daily token-limit gate.
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
        message: getLimitExceededMessage(
          limitCheck.limitType,
          limitCheck.limit,
        ),
      },
      429,
    );
  }

  // 4) Load prior turns (oldest first, cap CONVERSATION_HISTORY_LIMIT).
  const priorRows = await prisma.chatbotMessage.findMany({
    where: { conversationId: conversation.id, id: { not: userRow.id } },
    orderBy: { createdAt: 'desc' },
    take: CONVERSATION_HISTORY_LIMIT,
    select: { role: true, content: true, createdAt: true },
  });
  const history: ChatbotMessageDto[] = priorRows
    .slice()
    .reverse()
    .map((row) => ({
      role: row.role as 'user' | 'assistant',
      content: row.content,
    }));

  return streamSSE(c, async (stream) => {
    const startedAt = Date.now();
    let assistantText = '';
    let inputTokens = 0;
    let outputTokens = 0;
    const widgets: StudyToolWidget[] = [];
    let sawErrorChunk = false;

    try {
      for await (const chunk of streamChatbotResponse(
        data.message,
        history,
        context,
        {
          courseId: conversation.courseId ?? undefined,
          lessonId: conversation.lessonId ?? undefined,
        },
      )) {
        if (chunk.type === 'text' && chunk.content) {
          assistantText += chunk.content;
        }
        if (chunk.type === 'tool_result' && chunk.widget) {
          widgets.push(chunk.widget);
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
          content: error.message || 'An unexpected error occurred',
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
