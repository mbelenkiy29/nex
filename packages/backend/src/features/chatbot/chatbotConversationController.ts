import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import { authGuardBackend } from '../auth/authGuardBackend';
import { Error401 } from '../../shared/errors/Error401';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { Error400 } from '../../shared/errors/Error400';
import { prisma } from '../../prisma';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import {
  chatbotConversationCreateInputSchema,
  chatbotConversationListInputSchema,
  chatbotConversationRenameInputSchema,
  CHATBOT_CONVERSATION_TITLE_MAX,
} from './chatbotConversationSchemas';

// Trim the first user message into a conversation title. Cuts at a word
// boundary under the max so we don't slice mid-word; falls back to the
// dictionary's `aiTutor.untitled` when the message is blank.
function deriveConversationTitle(
  initialMessage: string | null | undefined,
  context: AppContext,
): string {
  const fallback = context.dictionary.aiTutor?.untitled ?? 'New chat';
  if (!initialMessage) return fallback;
  const trimmed = initialMessage.trim().replace(/\s+/g, ' ');
  if (!trimmed) return fallback;
  if (trimmed.length <= CHATBOT_CONVERSATION_TITLE_MAX) return trimmed;
  const slice = trimmed.slice(0, CHATBOT_CONVERSATION_TITLE_MAX);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice).trimEnd() + '…';
}

function requireSignedInWithOrg(context: AppContext) {
  if (!context.currentUser || !context.currentOrganization) {
    throw new Error401();
  }
  return {
    userId: context.currentUser.id,
    organizationId: context.currentOrganization.id,
  };
}

// Loader used by every conversation-scoped route. Guards owner-only access:
// platform admins are NOT bypassed because chat content is treated as private
// per-user data (no broad-admin read path in v1).
export async function chatbotConversationLoad(
  conversationId: string,
  context: AppContext,
) {
  const { userId } = requireSignedInWithOrg(context);
  const conversation = await prisma.chatbotConversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) {
    throw new Error404();
  }
  if (conversation.userId !== userId) {
    throw new Error403();
  }
  return conversation;
}

export async function chatbotConversationListController(
  query: unknown,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend({ chatbot: ['use'] }, context);
  const { userId } = requireSignedInWithOrg(context);
  const data = chatbotConversationListInputSchema.parse(query ?? {});

  const where = {
    userId,
    ...(data.archived === 'true'
      ? { NOT: { archivedAt: null } }
      : { archivedAt: null }),
  };

  const [conversations, total] = await Promise.all([
    prisma.chatbotConversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: data.take,
      skip: data.skip,
      select: {
        id: true,
        title: true,
        courseId: true,
        lessonId: true,
        archivedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.chatbotConversation.count({ where }),
  ]);

  return c.json({ conversations, total });
}

export async function chatbotConversationCreateController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend({ chatbot: ['use'] }, context);
  const { userId, organizationId } = requireSignedInWithOrg(context);
  const data = chatbotConversationCreateInputSchema.parse(body ?? {});

  // Reject a lessonId that isn't tied to a courseId we can validate.
  if (data.lessonId && !data.courseId) {
    throw new Error400('lessonId requires courseId.');
  }

  // Course/lesson scoping is best-effort: we verify ownership (enrollment OR
  // creator OR platform admin) by attempting to fetch the course alongside an
  // enrollment row. The detailed access policy lives in
  // `courseEnsureLearningAccess`; we don't import it here to avoid a feature
  // cycle — the safer minimal check is "course exists, published or owned".
  if (data.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
      select: { id: true, status: true, safetyHold: true, creatorUserId: true },
    });
    if (!course) {
      throw new Error404();
    }
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: { courseId: data.courseId, userId, status: 'active' },
      select: { id: true },
    });
    const isCreator = course.creatorUserId === userId;
    const isPublishedAndSafe =
      course.status === 'published' && !course.safetyHold;
    if (!enrollment && !isCreator && !isPublishedAndSafe) {
      throw new Error403();
    }
  }

  if (data.lessonId) {
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: data.lessonId },
      select: { id: true, courseId: true },
    });
    if (!lesson || lesson.courseId !== data.courseId) {
      throw new Error404();
    }
  }

  const title = deriveConversationTitle(data.initialMessage, context);
  const conversation = await prisma.chatbotConversation.create({
    data: {
      userId,
      organizationId,
      courseId: data.courseId ?? null,
      lessonId: data.lessonId ?? null,
      title,
    },
  });

  await auditLogCreate({
    context,
    entityId: conversation.id,
    entityName: 'ChatbotConversation',
    operation: auditLogOperations.create,
    newData: { title, courseId: conversation.courseId, lessonId: conversation.lessonId },
  });

  return c.json({ conversation }, 201);
}

export async function chatbotConversationGetController(
  conversationId: string,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend({ chatbot: ['use'] }, context);
  const conversation = await chatbotConversationLoad(conversationId, context);

  const messages = await prisma.chatbotMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      createdAt: true,
      role: true,
      content: true,
      widgets: true,
    },
  });

  return c.json({ conversation, messages });
}

export async function chatbotConversationRenameController(
  conversationId: string,
  body: unknown,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend({ chatbot: ['use'] }, context);
  const existing = await chatbotConversationLoad(conversationId, context);
  const data = chatbotConversationRenameInputSchema.parse(body ?? {});

  const conversation = await prisma.chatbotConversation.update({
    where: { id: existing.id },
    data: { title: data.title },
  });

  await auditLogCreate({
    context,
    entityId: conversation.id,
    entityName: 'ChatbotConversation',
    operation: auditLogOperations.update,
    oldData: { title: existing.title },
    newData: { title: conversation.title },
  });

  return c.json({ conversation });
}

export async function chatbotConversationArchiveController(
  conversationId: string,
  context: AppContext,
  c: Context,
) {
  await authGuardBackend({ chatbot: ['use'] }, context);
  const existing = await chatbotConversationLoad(conversationId, context);
  if (existing.archivedAt) {
    return c.json({ ok: true });
  }

  const conversation = await prisma.chatbotConversation.update({
    where: { id: existing.id },
    data: { archivedAt: new Date() },
  });

  await auditLogCreate({
    context,
    entityId: conversation.id,
    entityName: 'ChatbotConversation',
    operation: auditLogOperations.delete,
    oldData: { archivedAt: null },
    newData: { archivedAt: conversation.archivedAt },
  });

  return c.json({ ok: true });
}
