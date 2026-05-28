import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';
import { memberAutocompleteController } from './controllers/memberAutocompleteController';
import { memberFindController } from './controllers/memberFindController';
import { memberFindManyController } from './controllers/memberFindManyController';
import { memberUpdateController } from './controllers/memberUpdateController';
import { memberUpdateMeController } from './controllers/memberUpdateMeController';
import { memberCompleteOnboardingController } from './controllers/memberCompleteOnboardingController';
import {
  memberPersonalizedOnboardingController,
  memberPersonalizedOnboardingGenerateController,
  memberPersonalizedOnboardingUpdateController,
} from './controllers/memberPersonalizedOnboardingController';
import { invitationCreateController } from '../invitation/controllers/invitationCreateController';
import { memberRemoveController } from './controllers/memberRemoveController';
import { memberDisableController } from './controllers/memberDisableController';
import { memberRestoreController } from './controllers/memberRestoreController';
import { memberImporterController } from './controllers/memberImporterController';
import { memberUpdateMeInputSchema } from './memberSchemas';

export const memberRoutes = new Hono();

memberRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await memberFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await memberAutocompleteController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.put('/me', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    const data = memberUpdateMeInputSchema.parse(body);
    const payload = await memberUpdateMeController(data, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.get('/me/personalized-onboarding', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await memberPersonalizedOnboardingController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.put('/me/personalized-onboarding', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await memberPersonalizedOnboardingUpdateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.post('/me/personalized-onboarding/generate-plan', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await memberPersonalizedOnboardingGenerateController(
      await c.req.json(),
      context,
    );
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Marks the post-signup course-selector step complete. Idempotent — the
// signup welcome page calls this on both Skip and Continue. Once set, the
// auth guard never redirects back to /welcome/courses for this member.
memberRoutes.post('/me/complete-onboarding', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const payload = await memberCompleteOnboardingController(context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.post('/invite', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    const payload = await invitationCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.get('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await memberFindController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const body = await c.req.json();
    const payload = await memberUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.delete('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await memberRemoveController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.patch('/:id/disable', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await memberDisableController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.patch('/:id/restore', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await memberRestoreController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

memberRoutes.post('/importer', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    const payload = await memberImporterController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
