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
  trustSafetyPoliciesController,
  trustSafetyPolicyAcceptController,
  trustSafetyReportCreateController,
} from './trustSafetyControllers';

export const trustSafetyRoutes = new Hono();

trustSafetyRoutes.get('/policies', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await trustSafetyPoliciesController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

trustSafetyRoutes.post('/policies/accept', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.report, 'policy-accept'),
    );
    const payload = await trustSafetyPolicyAcceptController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

trustSafetyRoutes.post('/reports', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.report, 'trust-report'),
    );
    const payload = await trustSafetyReportCreateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
