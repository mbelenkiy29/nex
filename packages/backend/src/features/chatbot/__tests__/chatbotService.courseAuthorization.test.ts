import { beforeEach, describe, expect, it, vi } from 'vitest';
import { streamChatbotResponse } from '../chatbotService';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { courseEnrollController } from '../../course/courseControllers';
import { Error403 } from '../../../shared/errors/Error403';
import { env } from '../../../env';
import type { AppContext } from '../../../shared/controller/appContext';

const anthropicMocks = vi.hoisted(() => ({
  createMessage: vi.fn(),
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: anthropicMocks.createMessage,
    },
  })),
}));

async function createCourseSeed() {
  const prisma = testPrismaClient();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const course = await prisma.course.create({
    data: {
      title: `Chatbot Course ${suffix}`,
      slug: `chatbot-course-${suffix}`,
      subtitle: 'Course-aware chatbot test',
      description: 'Course description for chatbot authorization.',
      category: 'Certification',
      status: 'published',
      accessType: 'free',
      nexVerified: true,
      publishedAt: new Date(),
    },
  });
  const module = await prisma.courseModule.create({
    data: {
      title: 'Module 1',
      orderIndex: 0,
      courseId: course.id,
    },
  });
  const lesson = await prisma.courseLesson.create({
    data: {
      title: 'Lesson 1',
      content: 'Course content available to the course-aware AI tutor.',
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
    },
  });

  return { course, lesson };
}

function ensurePlatformAdmin(email: string) {
  const normalized = email.toLowerCase();
  if (!env.PLATFORM_ADMIN_EMAILS.includes(normalized)) {
    env.PLATFORM_ADMIN_EMAILS.push(normalized);
  }
}

async function firstChatbotChunk(
  context: AppContext,
  courseId: string,
  lessonId: string,
) {
  const stream = streamChatbotResponse(
    'Help me study this lesson.',
    [],
    context,
    {
      courseId,
      lessonId,
    },
  );

  return await stream.next();
}

describe('streamChatbotResponse course authorization', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
    anthropicMocks.createMessage.mockReset();
    anthropicMocks.createMessage.mockResolvedValue(
      (async function* () {
        yield {
          type: 'content_block_delta',
          delta: { type: 'text_delta', text: 'Course response.' },
        };
        yield {
          type: 'message_delta',
          delta: { stop_reason: 'end_turn' },
          usage: { output_tokens: 1 },
        };
      })(),
    );
  });

  it('allows enrolled students to request course-scoped chat', async () => {
    const student = await createTestUserWithOrganization();
    const seed = await createCourseSeed();
    const context = createAuthenticatedContext(
      student.user,
      student.organization,
      student.member,
    );

    await courseEnrollController({ id: seed.course.id }, context);

    const chunk = await firstChatbotChunk(
      context,
      seed.course.id,
      seed.lesson.id,
    );

    expect(chunk.done).toBe(false);
    expect(['error', 'text']).toContain(chunk.value?.type);
  });

  it('allows platform admins to request course-scoped chat without enrollment', async () => {
    const admin = await createTestUserWithOrganization({
      email: `chatbot-admin-${Date.now()}@example.com`,
    });
    ensurePlatformAdmin(admin.user.email);
    const seed = await createCourseSeed();
    const context = createAuthenticatedContext(
      admin.user,
      admin.organization,
      admin.member,
    );

    const chunk = await firstChatbotChunk(
      context,
      seed.course.id,
      seed.lesson.id,
    );

    expect(chunk.done).toBe(false);
    expect(['error', 'text']).toContain(chunk.value?.type);
  });

  it('rejects unenrolled users before making an AI request', async () => {
    const user = await createTestUserWithOrganization();
    const seed = await createCourseSeed();
    const context = createAuthenticatedContext(
      user.user,
      user.organization,
      user.member,
    );

    await expect(
      firstChatbotChunk(context, seed.course.id, seed.lesson.id),
    ).rejects.toBeInstanceOf(Error403);
    expect(anthropicMocks.createMessage).not.toHaveBeenCalled();
  });
});
