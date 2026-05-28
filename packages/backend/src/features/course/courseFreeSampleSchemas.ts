import { z } from 'zod';

export const courseFreeSampleParamsSchema = z.object({
  id: z.uuid(),
});

export const courseFreeSampleDiagnosticParamsSchema =
  courseFreeSampleParamsSchema.extend({
    attemptId: z.uuid(),
  });

export const courseFreeSampleDiagnosticAnswerInputSchema = z.object({
  answerId: z.uuid(),
  selectedAnswerIndex: z.number().int().min(0).max(20),
});
