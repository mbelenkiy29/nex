import { describe, it, expect, beforeEach } from 'vitest';
import { testPrismaClient } from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { chatbotSendConversationMessageController } from '../chatbotController';
import { releaseChatbotLock } from '../chatbotLockService';
import { Context } from 'hono';

describe('chatbotController - Lock Protection', () => {
  beforeEach(async () => {
    const prisma = testPrismaClient();
    await prisma.chatbotMessage.deleteMany();
    await prisma.chatbotConversation.deleteMany();
    await prisma.chatbotUsage.deleteMany();
  });

  it('should reject concurrent requests from same user', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);

    const mockHonoContext = {
      json: (data: any, status?: number) => ({
        data,
        status,
      }),
      header: () => {},
      newResponse: (body: any, init?: any) => new Response(body, init),
    } as unknown as Context;

    const conversation = await testPrismaClient().chatbotConversation.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        title: 'Test conversation',
      },
    });
    const input = { message: 'Hello' };

    const firstRequest = chatbotSendConversationMessageController(
      conversation.id,
      input,
      context,
      mockHonoContext,
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    const secondRequest = chatbotSendConversationMessageController(
      conversation.id,
      input,
      context,
      mockHonoContext,
    );

    const secondResponse = (await secondRequest) as any;

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.data.error).toBe('concurrent_request');
    expect(secondResponse.data.message).toContain(
      'already have a chatbot request in progress',
    );

    await releaseChatbotLock(user.id);
    await firstRequest;
  }, 10000);

  it('should allow request after previous request completes', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);

    const mockHonoContext = {
      json: (data: any, status?: number) => ({
        data,
        status,
      }),
      header: () => {},
      newResponse: (body: any, init?: any) => new Response(body, init),
    } as unknown as Context;

    const conversation = await testPrismaClient().chatbotConversation.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        title: 'Test conversation',
      },
    });
    const input = { message: 'Hello' };

    const firstRequest = chatbotSendConversationMessageController(
      conversation.id,
      input,
      context,
      mockHonoContext,
    );

    await releaseChatbotLock(user.id);

    const secondRequest = chatbotSendConversationMessageController(
      conversation.id,
      input,
      context,
      mockHonoContext,
    );

    await releaseChatbotLock(user.id);
    await Promise.all([firstRequest, secondRequest]);
  }, 10000);

  it('should allow different users to have concurrent requests', async () => {
    const user1Data = await createTestUserWithOrganization();
    const user2Data = await createTestUserWithOrganization();

    const context1 = createAuthenticatedContext(
      user1Data.user,
      user1Data.organization,
      user1Data.member,
    );
    const context2 = createAuthenticatedContext(
      user2Data.user,
      user2Data.organization,
      user2Data.member,
    );

    const mockHonoContext = {
      json: (data: any, status?: number) => ({
        data,
        status,
      }),
      header: () => {},
      newResponse: (body: any, init?: any) => new Response(body, init),
    } as unknown as Context;

    const prisma = testPrismaClient();
    const conversation1 = await prisma.chatbotConversation.create({
      data: {
        userId: user1Data.user.id,
        organizationId: user1Data.organization.id,
        title: 'Test conversation',
      },
    });
    const conversation2 = await prisma.chatbotConversation.create({
      data: {
        userId: user2Data.user.id,
        organizationId: user2Data.organization.id,
        title: 'Test conversation',
      },
    });
    const input = { message: 'Hello' };

    const request1 = chatbotSendConversationMessageController(
      conversation1.id,
      input,
      context1,
      mockHonoContext,
    );
    const request2 = chatbotSendConversationMessageController(
      conversation2.id,
      input,
      context2,
      mockHonoContext,
    );

    await releaseChatbotLock(user1Data.user.id);
    await releaseChatbotLock(user2Data.user.id);
    await Promise.all([request1, request2]);
  }, 10000);
});
