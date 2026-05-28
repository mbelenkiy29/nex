import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import {
  aiTrustGetPreferencesController,
  aiTrustUpdatePreferencesController,
} from './aiTrustControllers';

export const aiTrustRoutes = new Hono();

aiTrustRoutes.get('/preferences', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await aiTrustGetPreferencesController(context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

aiTrustRoutes.put('/preferences', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await aiTrustUpdatePreferencesController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
