import { z } from 'zod';
import { chatbotAttachmentInputSchema } from './chatbotSchemas';

// Auto-title trim: take the first 60 chars at a word boundary, fall back to
// the dictionary's `aiTutor.untitled` string in the controller if the first
// user message is blank or whitespace-only.
export const CHATBOT_CONVERSATION_TITLE_MAX = 80;

export const chatbotConversationListInputSchema = z.object({
  archived: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .default('false'),
  take: z.coerce.number().int().min(1).max(100).optional().default(50),
  skip: z.coerce.number().int().min(0).optional().default(0),
});

export const chatbotConversationCreateInputSchema = z.object({
  courseId: z.string().uuid().nullable().optional(),
  lessonId: z.string().uuid().nullable().optional(),
  initialMessage: z.string().trim().max(10000).optional(),
});

export const chatbotConversationRenameInputSchema = z.object({
  title: z.string().trim().min(1).max(CHATBOT_CONVERSATION_TITLE_MAX),
});

export const chatbotSendConversationMessageInputSchema = z.object({
  message: z.string().trim().min(1).max(10000),
  attachments: z.array(chatbotAttachmentInputSchema).max(5).optional(),
});

export type ChatbotConversationListInput = z.infer<
  typeof chatbotConversationListInputSchema
>;
export type ChatbotConversationCreateInput = z.infer<
  typeof chatbotConversationCreateInputSchema
>;
export type ChatbotConversationRenameInput = z.infer<
  typeof chatbotConversationRenameInputSchema
>;
export type ChatbotSendConversationMessageInput = z.infer<
  typeof chatbotSendConversationMessageInputSchema
>;
