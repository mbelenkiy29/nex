import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { lessonArchiveManyController } from './controllers/lessonArchiveManyController';
import { lessonAutocompleteController } from './controllers/lessonAutocompleteController';
import { lessonCreateController } from './controllers/lessonCreateController';
import { lessonDeleteManyController } from './controllers/lessonDeleteManyController';
import { lessonFindController } from './controllers/lessonFindController';
import { lessonFindManyController } from './controllers/lessonFindManyController';
import { lessonImporterController } from './controllers/lessonImporterController';
import { lessonRestoreManyController } from './controllers/lessonRestoreManyController';
import { lessonUpdateController } from './controllers/lessonUpdateController';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';

export const lessonRoutes = new Hono();

lessonRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await lessonFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await lessonAutocompleteController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.post('/', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await lessonCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.post('/importer', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await lessonImporterController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.put('/archive', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await lessonArchiveManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.put('/restore', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await lessonRestoreManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.delete('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    await lessonDeleteManyController(query, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.get('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await lessonFindController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

lessonRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await lessonUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
