import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import {
  studentExperienceAdaptivePlanGenerateController,
  studentExperienceCourseOverviewController,
  studentExperienceDashboardController,
  studentExperienceDiagnosticAnswerController,
  studentExperienceDiagnosticCompleteController,
  studentExperienceDiagnosticStartController,
  studentExperienceFlashcardReviewController,
  studentExperienceHomeworkController,
  studentExperienceLearningOutcomesController,
  studentExperienceNoteCreateController,
  studentExperienceNoteDeleteController,
  studentExperienceNotesListController,
  studentExperienceNoteUpdateController,
  studentExperienceOfflineSyncController,
  studentExperiencePracticeAnswerController,
  studentExperiencePracticeCompleteController,
  studentExperiencePracticeController,
  studentExperiencePracticeStartController,
  studentExperienceRemediationGenerateController,
  studentExperienceResumeController,
  studentExperienceResumeUpdateController,
  studentExperienceStudyPlanCreateController,
  studentExperienceStudyPlanDeleteController,
  studentExperienceStudyPlanListController,
  studentExperienceStudyPlanUpdateController,
  studentReminderPreferenceListController,
  studentReminderPreferenceUpsertController,
} from './studentExperienceControllers';

export const studentExperienceRoutes = new Hono();

studentExperienceRoutes.get('/dashboard', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceDashboardController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/course/:courseId/overview', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceCourseOverviewController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/course/:courseId/resume', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceResumeController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.put('/course/:courseId/resume', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceResumeUpdateController(
      { courseId: c.req.param('courseId') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post('/sync', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceOfflineSyncController(
      await c.req.json().catch(() => ({})),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post('/course/:courseId/sync', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json().catch(() => ({}));
    const payload = await studentExperienceOfflineSyncController(
      {
        ...body,
        mutations: (body.mutations || []).map((mutation: any) => ({
          ...mutation,
          courseId: mutation.courseId || c.req.param('courseId'),
        })),
      },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/reminder-preferences', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentReminderPreferenceListController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.put('/reminder-preferences', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentReminderPreferenceUpsertController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/course/:courseId/homework', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceHomeworkController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/course/:courseId/practice', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperiencePracticeController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post('/course/:courseId/practice/start', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json().catch(() => ({}));
    const payload = await studentExperiencePracticeStartController(
      { courseId: c.req.param('courseId') },
      body,
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post(
  '/practice-attempt/:attemptId/answer',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperiencePracticeAnswerController(
        { attemptId: c.req.param('attemptId') },
        await c.req.json(),
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.post(
  '/practice-attempt/:attemptId/complete',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperiencePracticeCompleteController(
        { attemptId: c.req.param('attemptId') },
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.get('/course/:courseId/notes', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceNotesListController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post('/course/:courseId/notes', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceNoteCreateController(
      { courseId: c.req.param('courseId') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.patch('/course/:courseId/notes/:noteId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceNoteUpdateController(
      {
        courseId: c.req.param('courseId'),
        noteId: c.req.param('noteId'),
      },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.delete('/course/:courseId/notes/:noteId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceNoteDeleteController(
      {
        courseId: c.req.param('courseId'),
        noteId: c.req.param('noteId'),
      },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/course/:courseId/study-plan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceStudyPlanListController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post('/course/:courseId/study-plan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceStudyPlanCreateController(
      { courseId: c.req.param('courseId') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post('/course/:courseId/adaptive-plan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceAdaptivePlanGenerateController(
      { courseId: c.req.param('courseId') },
      await c.req.json().catch(() => ({})),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.get('/course/:courseId/outcomes', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceLearningOutcomesController(
      { courseId: c.req.param('courseId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.post(
  '/course/:courseId/diagnostic/start',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperienceDiagnosticStartController(
        { courseId: c.req.param('courseId') },
        await c.req.json().catch(() => ({})),
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.post(
  '/course/:courseId/diagnostic/:attemptId/answer',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperienceDiagnosticAnswerController(
        {
          courseId: c.req.param('courseId'),
          attemptId: c.req.param('attemptId'),
        },
        await c.req.json(),
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.post(
  '/course/:courseId/diagnostic/:attemptId/complete',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperienceDiagnosticCompleteController(
        {
          courseId: c.req.param('courseId'),
          attemptId: c.req.param('attemptId'),
        },
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.post(
  '/course/:courseId/flashcards/:flashcardId/review',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperienceFlashcardReviewController(
        {
          courseId: c.req.param('courseId'),
          flashcardId: c.req.param('flashcardId'),
        },
        await c.req.json(),
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.post('/course/:courseId/remediation', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await studentExperienceRemediationGenerateController(
      { courseId: c.req.param('courseId') },
      await c.req.json().catch(() => ({})),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studentExperienceRoutes.patch(
  '/course/:courseId/study-plan/:itemId',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperienceStudyPlanUpdateController(
        {
          courseId: c.req.param('courseId'),
          itemId: c.req.param('itemId'),
        },
        await c.req.json(),
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

studentExperienceRoutes.delete(
  '/course/:courseId/study-plan/:itemId',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await studentExperienceStudyPlanDeleteController(
        {
          courseId: c.req.param('courseId'),
          itemId: c.req.param('itemId'),
        },
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);
