import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import {
  creatorEarningsGetPayoutMethodController,
  creatorEarningsListPayoutsController,
  creatorEarningsUpdatePayoutMethodController,
} from './creatorEarningsControllers';

export const creatorEarningsRoutes = new Hono();

// Creator's own payouts (status-filterable, paginated).
creatorEarningsRoutes.get('/payouts', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await creatorEarningsListPayoutsController(
      c.req.query(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Read the current user's payout-method note.
creatorEarningsRoutes.get('/method', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await creatorEarningsGetPayoutMethodController(context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Update (or clear with null) the payout-method note.
creatorEarningsRoutes.put('/method', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await creatorEarningsUpdatePayoutMethodController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
