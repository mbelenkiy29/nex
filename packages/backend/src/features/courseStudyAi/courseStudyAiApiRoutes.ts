import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import {
  rateLimitFromProfile,
  rateLimitProfiles,
  rateLimitRequest,
} from '../../shared/lib/rateLimiter';
import {
  courseStudyAiCreateStudyPlanItemController,
  courseStudyAiDeleteStudyPlanItemController,
  courseStudyAiExplainLessonController,
  courseStudyAiGenerateStudyPlanController,
  courseStudyAiGetExamDateController,
  courseStudyAiListStudyPlanController,
  courseStudyAiNextController,
  courseStudyAiPracticeController,
  courseStudyAiPutExamDateController,
  courseStudyAiQuizController,
  courseStudyAiSubmitQuizController,
  courseStudyAiSummarizeLessonController,
  courseStudyAiUpdateStudyPlanItemController,
  courseStudyAiWeaknessesController,
} from './courseStudyAiControllers';

export const courseStudyAiRoutes = new Hono();

// Streaming (SSE): explains the focused lesson in plain language.
courseStudyAiRoutes.post('/:courseId/explain-lesson', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'study-explain-lesson'),
    );
    const body = await c.req.json();
    return await courseStudyAiExplainLessonController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Streaming (SSE): summarizes the focused lesson for quick revision.
courseStudyAiRoutes.post('/:courseId/summarize-lesson', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'study-summarize-lesson'),
    );
    const body = await c.req.json();
    return await courseStudyAiSummarizeLessonController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// One-shot JSON: a short interactive quiz from a module.
courseStudyAiRoutes.post('/:courseId/quiz', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'study-quiz'),
    );
    const body = await c.req.json();
    return await courseStudyAiQuizController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// One-shot JSON: a larger practice-question set from a module.
courseStudyAiRoutes.post('/:courseId/practice', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'study-practice'),
    );
    const body = await c.req.json();
    return await courseStudyAiPracticeController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Persists a completed AI quiz attempt (no AI call).
courseStudyAiRoutes.post('/:courseId/quiz/submit', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await courseStudyAiSubmitQuizController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Reads / sets the student's target exam date for this course.
courseStudyAiRoutes.get('/:courseId/exam-date', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await courseStudyAiGetExamDateController(
      c.req.param('courseId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseStudyAiRoutes.put('/:courseId/exam-date', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await courseStudyAiPutExamDateController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Deterministic per-topic weakness report (no AI).
courseStudyAiRoutes.get('/:courseId/weaknesses', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await courseStudyAiWeaknessesController(
      c.req.param('courseId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// AI recommendation: what should I study next?
courseStudyAiRoutes.get('/:courseId/next', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'study-next'),
    );
    return await courseStudyAiNextController(
      c.req.param('courseId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Study plan — list.
courseStudyAiRoutes.get('/:courseId/study-plan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await courseStudyAiListStudyPlanController(
      c.req.param('courseId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Study plan — add a manual item.
courseStudyAiRoutes.post('/:courseId/study-plan', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await courseStudyAiCreateStudyPlanItemController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Study plan — AI-generate dated items toward the exam date.
courseStudyAiRoutes.post('/:courseId/study-plan/generate', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.ai, 'study-plan-generate'),
    );
    return await courseStudyAiGenerateStudyPlanController(
      c.req.param('courseId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Study plan — update an item (toggle done, edit).
courseStudyAiRoutes.patch('/:courseId/study-plan/:itemId', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await courseStudyAiUpdateStudyPlanItemController(
      c.req.param('courseId'),
      c.req.param('itemId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Study plan — delete an item.
courseStudyAiRoutes.delete('/:courseId/study-plan/:itemId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await courseStudyAiDeleteStudyPlanItemController(
      c.req.param('courseId'),
      c.req.param('itemId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
