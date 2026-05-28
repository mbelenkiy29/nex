import { z } from 'zod';
import { fileUploadedSchema } from '../file/fileSchemas';

export const chatbotMessageRoleSchema = z.enum(['user', 'assistant']);
export const chatbotAttachmentExtractionStatusSchema = z.enum([
  'ready',
  'failed',
]);

export const chatbotAttachmentInputSchema = fileUploadedSchema.extend({
  size: z.number().int().min(0).max(10_000_000).optional(),
});

export const chatbotAttachmentSchema = chatbotAttachmentInputSchema.extend({
  extractionStatus: chatbotAttachmentExtractionStatusSchema,
  extractedText: z.string().optional(),
  extractionError: z.string().optional(),
});

export const chatbotMessageSchema = z.object({
  role: chatbotMessageRoleSchema,
  content: z.string(),
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
export type ChatbotAttachmentInput = z.infer<
  typeof chatbotAttachmentInputSchema
>;
export type ChatbotAttachment = z.infer<typeof chatbotAttachmentSchema>;
export type ChatbotLimitExceededError = z.infer<
  typeof chatbotLimitExceededErrorSchema
>;
export type ChatbotConcurrentRequestError = z.infer<
  typeof chatbotConcurrentRequestErrorSchema
>;
