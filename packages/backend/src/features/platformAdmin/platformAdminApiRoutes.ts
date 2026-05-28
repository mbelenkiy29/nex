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
  creatorPayoutCreateController,
  creatorPayoutListController,
  creatorPayoutStatusController,
  platformAdminInvitationCreateController,
  platformAdminMemberStatusController,
  platformAdminMetricsController,
  platformAdminOrganizationsController,
  platformAdminOverviewController,
  platformAdminStudentsController,
  platformPromotionActiveController,
  platformPromotionCreateController,
  platformPromotionListController,
  platformPromotionUpdateController,
} from './controllers/platformAdminControllers';
import {
  platformAdminAssignmentSubmissionReviewController,
  platformAdminCourseCreateController,
  platformAdminCourseEnrollController,
  platformAdminCourseFindController,
  platformAdminCourseListController,
  platformAdminCourseReviewController,
  platformAdminCourseUpdateController,
  platformAdminCourseVideoTranscriptRetryController,
} from '../course/courseControllers';
import {
  platformAdminCourseCategoryCreateController,
  platformAdminCourseCategoryDisableController,
  platformAdminCourseCategoryListController,
  platformAdminCourseCategoryUpdateController,
} from '../courseCategory/courseCategoryControllers';
import {
  platformAdminCoursePurchaseListController,
  platformAdminCoursePurchaseRefundController,
} from '../course/coursePurchaseAdminController';
import {
  platformAdminCreatorApplicationListController,
  platformAdminCreatorApplicationReviewController,
} from '../creatorApplication/creatorApplicationControllers';
import {
  oneOnOneDisputeAdminFindController,
  oneOnOneDisputeAdminListController,
  oneOnOneDisputeAdminResolveController,
} from './controllers/oneOnOneDisputeAdminController';
import {
  platformAdminTrustSafetyCourseHoldController,
  platformAdminTrustSafetyCourseReviewDecisionsController,
  platformAdminTrustSafetyCreatorStatusController,
  platformAdminTrustSafetyQueueController,
  platformAdminTrustSafetyReportUpdateController,
  platformAdminTrustSafetyRiskFlagCreateController,
  platformAdminTrustSafetyRiskFlagUpdateController,
  platformAdminTrustSafetyRuleScanController,
} from '../trustSafety/trustSafetyControllers';
import {
  platformAdminPricingExperimentCreateController,
  platformAdminPricingExperimentListController,
  platformAdminPricingExperimentUpdateController,
} from '../pricing/pricingAdminControllers';
import {
  platformAdminAiCreditPackCreateController,
  platformAdminAiCreditPackListController,
  platformAdminAiCreditPackUpdateController,
} from '../aiCredit/aiCreditControllers';

export const platformAdminRoutes = new Hono();
export const platformPromotionRoutes = new Hono();

platformAdminRoutes.get('/overview', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminOverviewController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/metrics', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminMetricsController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/trust-safety', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminTrustSafetyQueueController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/trust-safety/rule-scan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.notification, 'rule-scan'),
    );
    const payload = await platformAdminTrustSafetyRuleScanController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/trust-safety/reports/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.notification, 'report-update'),
    );
    const payload = await platformAdminTrustSafetyReportUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/trust-safety/risk-flags', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.notification, 'risk-flag-create'),
    );
    const payload = await platformAdminTrustSafetyRiskFlagCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/trust-safety/risk-flags/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.notification, 'risk-flag-update'),
    );
    const payload = await platformAdminTrustSafetyRiskFlagUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch(
  '/trust-safety/creators/:userId/status',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      await rateLimitRequest(
        c,
        context,
        rateLimitFromProfile(rateLimitProfiles.notification, 'creator-safety'),
      );
      const payload = await platformAdminTrustSafetyCreatorStatusController(
        { userId: c.req.param('userId') },
        await c.req.json(),
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

platformAdminRoutes.patch('/trust-safety/courses/:id/hold', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.notification, 'course-hold'),
    );
    const payload = await platformAdminTrustSafetyCourseHoldController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get(
  '/trust-safety/course-reviews/:courseId/decisions',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload =
        await platformAdminTrustSafetyCourseReviewDecisionsController(
          { courseId: c.req.param('courseId') },
          context,
        );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

platformAdminRoutes.get('/students', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminStudentsController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/organizations', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminOrganizationsController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/invitations', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminInvitationCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/members/:id/disable', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminMemberStatusController(
      { id: c.req.param('id'), disabled: true },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/members/:id/restore', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminMemberStatusController(
      { id: c.req.param('id'), disabled: false },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/promotions', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformPromotionListController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/pricing-experiments', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminPricingExperimentListController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/pricing-experiments', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminPricingExperimentCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/pricing-experiments/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminPricingExperimentUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/ai-credit-packs', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminAiCreditPackListController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/ai-credit-packs', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminAiCreditPackCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/ai-credit-packs/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminAiCreditPackUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/promotions', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformPromotionCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.put('/promotions/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformPromotionUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/payouts', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorPayoutListController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/courses', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminCourseListController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/courses', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(
        rateLimitProfiles.courseCreate,
        'admin-course-create',
      ),
    );
    const payload = await platformAdminCourseCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/courses/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminCourseFindController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.put('/courses/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminCourseUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post(
  '/courses/:id/lessons/:lessonId/video-transcript/retry',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await platformAdminCourseVideoTranscriptRetryController(
        { id: c.req.param('id'), lessonId: c.req.param('lessonId') },
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

platformAdminRoutes.post('/courses/:id/review', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(
        rateLimitProfiles.courseCreate,
        'admin-course-review',
      ),
    );
    const payload = await platformAdminCourseReviewController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/courses/:id/enrollments', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminCourseEnrollController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// --- Course categories (curated marketplace taxonomy) ---------------------

platformAdminRoutes.get('/course-categories', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await platformAdminCourseCategoryListController(
      c.req.query(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/course-categories', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await platformAdminCourseCategoryCreateController(
      await c.req.json(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.put('/course-categories/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await platformAdminCourseCategoryUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/course-categories/:id/status', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await platformAdminCourseCategoryDisableController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// --- Course purchases (admin-only refund workflow) ------------------------

platformAdminRoutes.get('/course-purchases', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await platformAdminCoursePurchaseListController(
      c.req.query(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/course-purchases/:id/refund', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await platformAdminCoursePurchaseRefundController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/assignment-submissions/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminAssignmentSubmissionReviewController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/creator-applications', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminCreatorApplicationListController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/creator-applications/:id/status', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformAdminCreatorApplicationReviewController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/payouts', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorPayoutCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.patch('/payouts/:id/status', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorPayoutStatusController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformPromotionRoutes.get('/active', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await platformPromotionActiveController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// --- 1:1 session disputes -------------------------------------------------

platformAdminRoutes.get('/one-on-one/disputes', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await oneOnOneDisputeAdminListController(
      c.req.query(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.get('/one-on-one/disputes/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await oneOnOneDisputeAdminFindController(
      c.req.param('id'),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

platformAdminRoutes.post('/one-on-one/disputes/:id/resolve', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await oneOnOneDisputeAdminResolveController(
      c.req.param('id'),
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
