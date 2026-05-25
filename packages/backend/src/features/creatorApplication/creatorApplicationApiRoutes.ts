import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import {
  creatorApplicationIdentityScanController,
  creatorApplicationMeController,
  creatorApplicationPayoutOnboardingController,
  creatorApplicationUpsertController,
} from './creatorApplicationControllers';

export const creatorApplicationRoutes = new Hono();

creatorApplicationRoutes.get('/me', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorApplicationMeController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

creatorApplicationRoutes.post('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorApplicationUpsertController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

creatorApplicationRoutes.post('/identity-scan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorApplicationIdentityScanController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

creatorApplicationRoutes.post('/payout-onboarding', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await creatorApplicationPayoutOnboardingController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
