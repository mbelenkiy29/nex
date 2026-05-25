import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import { publicRouteRateLimiter } from '../../shared/lib/publicRouteRateLimiter';
import {
  userAccountCookieConsentController,
  userAccountDataExportDownloadController,
  userAccountDataExportListController,
  userAccountDataExportRequestController,
  userAccountDeletionCancelController,
  userAccountDeletionConfirmController,
  userAccountDeletionRequestController,
  userAccountEmailPreferencesController,
  userAccountEmailUnsubscribeController,
  userAccountMeController,
} from './userAccountControllers';

export const userAccountRoutes = new Hono();

// Per-IP rate limiters for the three token-bearing / write-side routes that
// can be hit without a valid session (deletion-confirm, data-export, email
// unsubscribe). Closes finding #4 from the 2026-05-23 security audit. 10
// requests per minute is generous for legitimate use (one email click) and
// hard-stops the spam pattern that would write to the token tables on every
// hit. Per-pod state — see publicRouteRateLimiter.ts for the rationale.
const deletionConfirmRateLimit = publicRouteRateLimiter({
  routeKey: 'userAccount:deletionConfirm',
  windowMs: 60_000,
  max: 10,
});
const dataExportRequestRateLimit = publicRouteRateLimiter({
  routeKey: 'userAccount:dataExportRequest',
  windowMs: 60_000,
  max: 10,
});
const emailUnsubscribeRateLimit = publicRouteRateLimiter({
  routeKey: 'userAccount:emailUnsubscribe',
  windowMs: 60_000,
  max: 10,
});

// ---- Deletion flow --------------------------------------------------------

userAccountRoutes.post('/deletion', async (c) => {
  let context;
  try {
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await userAccountDeletionRequestController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

userAccountRoutes.post('/deletion/confirm', deletionConfirmRateLimit, async (c) => {
  let context;
  try {
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await userAccountDeletionConfirmController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

userAccountRoutes.delete('/deletion', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await userAccountDeletionCancelController(context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// ---- Data export ----------------------------------------------------------

userAccountRoutes.post('/data-export', dataExportRequestRateLimit, async (c) => {
  let context;
  try {
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await userAccountDataExportRequestController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

userAccountRoutes.get('/data-export', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await userAccountDataExportListController(context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

userAccountRoutes.get('/data-export/:id/download', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    return await userAccountDataExportDownloadController(id, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// ---- Email preferences + public unsubscribe -------------------------------

userAccountRoutes.patch('/email-preferences', async (c) => {
  let context;
  try {
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await userAccountEmailPreferencesController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// PUBLIC route — token is the auth. Mounted under the same prefix for
// link-builder convenience; emailUnsubscribeController never touches the
// session so signed-out clicks still work.
userAccountRoutes.get('/email/unsubscribe', emailUnsubscribeRateLimit, async (c) => {
  let context;
  try {
    const query = Object.fromEntries(new URL(c.req.url).searchParams.entries());
    context = await appContext(c);
    return await userAccountEmailUnsubscribeController(query, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// ---- Cookie consent + me --------------------------------------------------

userAccountRoutes.post('/cookie-consent', async (c) => {
  let context;
  try {
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await userAccountCookieConsentController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

userAccountRoutes.get('/me', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await userAccountMeController(context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
