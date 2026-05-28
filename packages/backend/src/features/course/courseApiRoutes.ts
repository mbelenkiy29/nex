import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';
import {
  rateLimitFromProfile,
  rateLimitProfiles,
  rateLimitRequest,
} from '../../shared/lib/rateLimiter';
import {
  courseAssignmentSubmissionController,
  courseActivationController,
  courseAutocompleteController,
  courseCatalogController,
  courseCertificateController,
  courseCertificateListController,
  courseCertificateVerifyController,
  courseCompareController,
  courseCreatorProfileController,
  courseDetailController,
  courseEnrollController,
  courseLearnController,
  courseLessonCompleteController,
  courseMyLearningController,
  courseOnboardingSuggestionsController,
  coursePracticeExamStartController,
  coursePracticeExamSubmitController,
  courseQuizAttemptController,
  courseRatingUpsertController,
  courseSaveController,
  courseUnsaveController,
  courseWishlistCreateController,
  courseWishlistItemAddController,
  courseWishlistItemRemoveController,
  courseWishlistsController,
} from './courseControllers';
import { courseCheckoutController } from './courseCheckoutController';
import { courseBundleCheckoutController } from './courseBundleCheckoutController';
import {
  courseFreeSampleController,
  courseFreeSampleDiagnosticAnswerController,
  courseFreeSampleDiagnosticCompleteController,
  courseFreeSampleDiagnosticStartController,
} from './courseFreeSampleControllers';

export const courseRoutes = new Hono();

courseRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.publicRead, 'course-catalog'),
    );
    const payload = await courseCatalogController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.publicRead, 'course-autocomplete'),
    );
    const payload = await courseAutocompleteController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Top published courses for the signup "pick your first courses" step.
// Verified-first + rating-weighted ordering — kept separate from the catalog
// because the welcome page cares about onboarding-quality signal rather
// than the user's current filter state.
courseRoutes.get('/onboarding-suggestions', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseOnboardingSuggestionsController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/my-learning', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseMyLearningController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/compare', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseCompareController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/wishlists', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseWishlistsController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/wishlists', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseWishlistCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/wishlists/:wishlistId/items/:courseId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseWishlistItemAddController(
      {
        wishlistId: c.req.param('wishlistId'),
        courseId: c.req.param('courseId'),
      },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.delete('/wishlists/:wishlistId/items/:courseId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseWishlistItemRemoveController(
      {
        wishlistId: c.req.param('wishlistId'),
        courseId: c.req.param('courseId'),
      },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/creator/:creatorId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseCreatorProfileController(
      { creatorId: c.req.param('creatorId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/certificates', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseCertificateListController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/certificates/verify/:verificationCode', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.publicRead, 'certificate-verify'),
    );
    const payload = await courseCertificateVerifyController({
      verificationCode: c.req.param('verificationCode'),
    });
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/bundles/:id/checkout', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBundleCheckoutController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/:slug', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseDetailController(
      { slug: c.req.param('slug') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/:id/free-sample', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.publicRead, 'course-free-sample'),
    );
    const payload = await courseFreeSampleController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/free-sample/diagnostic/start', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(
        rateLimitProfiles.publicRead,
        'course-free-sample-diagnostic-start',
      ),
    );
    const payload = await courseFreeSampleDiagnosticStartController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post(
  '/:id/free-sample/diagnostic/:attemptId/answer',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await courseFreeSampleDiagnosticAnswerController(
        {
          id: c.req.param('id'),
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

courseRoutes.post(
  '/:id/free-sample/diagnostic/:attemptId/complete',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await courseFreeSampleDiagnosticCompleteController(
        {
          id: c.req.param('id'),
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

courseRoutes.get('/:id/certificate', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseCertificateController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/save', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseSaveController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.delete('/:id/save', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseUnsaveController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/enroll', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseEnrollController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Paid courses route through Stripe Checkout rather than direct enrollment.
// The webhook (`coursePaymentWebhookHandler`) writes CourseEnrollment on
// payment success — never this controller.
courseRoutes.post('/:id/checkout', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.publicRead, 'course-checkout'),
    );
    const payload = await courseCheckoutController(
      { id: c.req.param('id') },
      await c.req.json().catch(() => ({})),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.put('/:id/rating', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseRatingUpsertController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/:id/learn', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseLearnController(
      {
        id: c.req.param('id'),
        activationSource:
          c.req.query('activation') === '1'
            ? 'post_purchase_activation'
            : undefined,
      },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.get('/:id/activation', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseActivationController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/lesson/:lessonId/complete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseLessonCompleteController(
      { id: c.req.param('id'), lessonId: c.req.param('lessonId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/assignment/:assignmentId/submission', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseAssignmentSubmissionController(
      { id: c.req.param('id'), assignmentId: c.req.param('assignmentId') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/quiz/:quizId/attempt', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseQuizAttemptController(
      { id: c.req.param('id'), quizId: c.req.param('quizId') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post('/:id/practice-exam/:examId/start', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await coursePracticeExamStartController(
      { id: c.req.param('id'), examId: c.req.param('examId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseRoutes.post(
  '/:id/practice-exam/:examId/attempt/:attemptId/submit',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await coursePracticeExamSubmitController(
        {
          id: c.req.param('id'),
          examId: c.req.param('examId'),
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
