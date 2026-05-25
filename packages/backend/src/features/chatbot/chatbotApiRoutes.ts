import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import {
  rateLimitFromProfile,
  rateLimitProfiles,
  rateLimitRequest,
} from '../../shared/lib/rateLimiter';
import {
  chatbotSendConversationMessageController,
  chatbotSendMessageController,
} from './chatbotController';
import {
  chatbotConversationArchiveController,
  chatbotConversationCreateController,
  chatbotConversationGetController,
  chatbotConversationListController,
  chatbotConversationRenameController,
} from './chatbotConversationController';

export const chatbotRoutes = new Hono();

// ---- Conversation CRUD ----------------------------------------------------
chatbotRoutes.get('/conversations', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = Object.fromEntries(new URL(c.req.url).searchParams.entries());
    return await chatbotConversationListController(query, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

chatbotRoutes.post('/conversations', async (c) => {
  let context;
  try {
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await chatbotConversationCreateController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

chatbotRoutes.get('/conversations/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    return await chatbotConversationGetController(id, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

chatbotRoutes.patch('/conversations/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await chatbotConversationRenameController(id, body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

chatbotRoutes.delete('/conversations/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    return await chatbotConversationArchiveController(id, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// ---- Streaming send (per-conversation, persistent) -----------------------
chatbotRoutes.post('/conversations/:id/message', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'chatbot-conversation'),
    );
    const body = await c.req.json();
    return await chatbotSendConversationMessageController(id, body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// ---- Legacy in-memory send -----------------------------------------------
// Kept until Subsystem 3.7 bridges the ChatbotSheet modal onto the new route.
// Removed in v2.
chatbotRoutes.post('/message', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'chatbot-message'),
    );
    const body = await c.req.json();
    return await chatbotSendMessageController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
