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
  courseBuilderAssignmentSubmissionReviewController,
  courseBuilderCheckpointCreateController,
  courseBuilderCheckpointDeleteController,
  courseBuilderCheckpointListController,
  courseBuilderCheckpointRestoreController,
  courseBuilderCreateController,
  courseBuilderGetController,
  courseBuilderListController,
  courseBuilderMetricsController,
  courseBuilderSubmitForReviewController,
  courseBuilderUpdateController,
  courseBuilderWithdrawController,
} from './courseBuilderControllers';

export const courseBuilderRoutes = new Hono();

courseBuilderRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderListController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.post('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.courseCreate, 'builder-create'),
    );
    const payload = await courseBuilderCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.get('/metrics', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderMetricsController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.get('/:id/checkpoints', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderCheckpointListController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.post('/:id/checkpoints', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderCheckpointCreateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.post(
  '/:id/checkpoints/:checkpointId/restore',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await courseBuilderCheckpointRestoreController(
        {
          id: c.req.param('id'),
          checkpointId: c.req.param('checkpointId'),
        },
        context,
      );
      return ApiResponseSuccess(c, context, payload);
    } catch (error: any) {
      return ApiResponseError(c, context, error);
    }
  },
);

courseBuilderRoutes.delete('/:id/checkpoints/:checkpointId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderCheckpointDeleteController(
      { id: c.req.param('id'), checkpointId: c.req.param('checkpointId') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.get('/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderGetController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.put('/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderUpdateController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.post('/:id/submit', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.courseCreate, 'builder-submit'),
    );
    const payload = await courseBuilderSubmitForReviewController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.post('/:id/withdraw', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await courseBuilderWithdrawController(
      { id: c.req.param('id') },
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

courseBuilderRoutes.patch(
  '/:courseId/assignment-submissions/:submissionId/review',
  async (c) => {
    let context;
    try {
      context = await appContext(c);
      const payload = await courseBuilderAssignmentSubmissionReviewController(
        {
          courseId: c.req.param('courseId'),
          submissionId: c.req.param('submissionId'),
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
