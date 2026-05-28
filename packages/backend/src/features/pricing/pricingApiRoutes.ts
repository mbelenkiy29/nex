import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';
import {
  pricingExposureController,
  pricingPackagesController,
} from './pricingControllers';

export const pricingRoutes = new Hono();

pricingRoutes.get('/packages', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await pricingPackagesController(
      parseHonoQuery(c.req.query()),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

pricingRoutes.post('/exposures', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await pricingExposureController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
