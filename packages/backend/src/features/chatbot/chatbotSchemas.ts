import { z } from 'zod';

export const chatbotMessageRoleSchema = z.enum(['user', 'assistant']);

export const chatbotMessageSchema = z.object({
  role: chatbotMessageRoleSchema,
  content: z.string(),
});

// Legacy input shape (no conversationId) — still accepted by the old
// `POST /api/chatbot/message` route during the transition. Frontend modal
// (`ChatbotSheet`) writes to this until Subsystem 3.7 bridges it onto the new
// per-conversation route. Will be removed in v2 with the modal.
export const chatbotSendMessageInputSchema = z.object({
  message: z.string().trim().min(1).max(10000),
  conversationHistory: z.array(chatbotMessageSchema).optional(),
  courseId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
});

export const chatbotLimitExceededErrorSchema = z.object({
  error: z.literal('limit_exceeded'),
  limitType: z.enum(['user', 'organization', 'global']),
  current: z.number(),
  limit: z.number(),
  message: z.string(),
});

export const chatbotConcurrentRequestErrorSchema = z.object({
  error: z.literal('concurrent_request'),
  message: z.string(),
});

export type ChatbotMessageRole = z.infer<typeof chatbotMessageRoleSchema>;
export type ChatbotMessage = z.infer<typeof chatbotMessageSchema>;
export type ChatbotSendMessageInput = z.infer<
  typeof chatbotSendMessageInputSchema
>;
export type ChatbotLimitExceededError = z.infer<
  typeof chatbotLimitExceededErrorSchema
>;
export type ChatbotConcurrentRequestError = z.infer<
  typeof chatbotConcurrentRequestErrorSchema
>;
