import { z } from 'zod';

export const aiTrustPreferencesSchema = z.object({
  useLessonContent: z.boolean().default(true),
  useLessonProgress: z.boolean().default(true),
  usePracticeResults: z.boolean().default(true),
  useChatHistory: z.boolean().default(true),
  useAttachments: z.boolean().default(true),
});

export const aiTrustPreferencesInputSchema = aiTrustPreferencesSchema.partial();

export const aiTrustDataSourceKeySchema = z.enum([
  'studentPrompt',
  'courseOutline',
  'lessonContent',
  'lessonProgress',
  'practiceResults',
  'examDate',
  'chatHistory',
  'attachments',
]);

export const aiTrustSourceStatusSchema = z.enum([
  'used',
  'omitted',
  'unavailable',
]);

export const aiTrustConfidenceSchema = z.enum(['high', 'medium', 'low']);

export const aiTrustDataSourceSchema = z.object({
  key: aiTrustDataSourceKeySchema,
  status: aiTrustSourceStatusSchema,
  count: z.number().int().nonnegative().optional(),
  details: z.array(z.string()).optional(),
});

export const aiTrustSignalSchema = z.object({
  whyGenerated: z.string(),
  influencingData: z.array(aiTrustDataSourceSchema),
  confidenceLevel: aiTrustConfidenceSchema,
  limitations: z.array(z.string()),
  privacySnapshot: z.object({
    preferences: aiTrustPreferencesSchema,
    omitted: z.array(aiTrustDataSourceKeySchema),
  }),
  generatedAt: z.string(),
  model: z.string().nullable(),
});

export type AiTrustPreferences = z.infer<typeof aiTrustPreferencesSchema>;
export type AiTrustPreferencesInput = z.infer<
  typeof aiTrustPreferencesInputSchema
>;
export type AiTrustDataSourceKey = z.infer<typeof aiTrustDataSourceKeySchema>;
export type AiTrustSourceStatus = z.infer<typeof aiTrustSourceStatusSchema>;
export type AiTrustConfidence = z.infer<typeof aiTrustConfidenceSchema>;
export type AiTrustDataSource = z.infer<typeof aiTrustDataSourceSchema>;
export type AiTrustSignal = z.infer<typeof aiTrustSignalSchema>;
