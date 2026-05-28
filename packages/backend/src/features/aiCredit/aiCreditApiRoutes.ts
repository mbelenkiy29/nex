import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import {
  aiCreditBalanceController,
  aiCreditCheckoutController,
} from './aiCreditControllers';

export const aiCreditRoutes = new Hono();

aiCreditRoutes.get('/balance', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await aiCreditBalanceController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

aiCreditRoutes.post('/:id/checkout', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await aiCreditCheckoutController(
      { id: c.req.param('id') },
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
