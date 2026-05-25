import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import {
  rateLimitFromProfile,
  rateLimitProfiles,
  rateLimitRequest,
} from '../../shared/lib/rateLimiter';
import {
  courseAiGenerateController,
  courseAiJobController,
} from './courseAiControllers';

export const courseAiRoutes = new Hono();

courseAiRoutes.post('/:courseId/generate', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'course-ai-generate'),
    );
    const payload = await courseAiGenerateController(
      { courseId: c.req.param('courseId') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseAiRoutes.get('/jobs/:jobId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.aiPoll, 'course-ai-job'),
    );
    const payload = await courseAiJobController(
      { jobId: c.req.param('jobId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
