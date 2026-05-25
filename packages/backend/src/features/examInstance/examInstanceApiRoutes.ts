import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { examInstanceArchiveManyController } from './controllers/examInstanceArchiveManyController';
import { examInstanceAutocompleteController } from './controllers/examInstanceAutocompleteController';
import { examInstanceCreateController } from './controllers/examInstanceCreateController';
import { examInstanceDeleteManyController } from './controllers/examInstanceDeleteManyController';
import { examInstanceFindController } from './controllers/examInstanceFindController';
import { examInstanceFindManyController } from './controllers/examInstanceFindManyController';
import { examInstanceImporterController } from './controllers/examInstanceImporterController';
import { examInstanceRestoreManyController } from './controllers/examInstanceRestoreManyController';
import { examInstanceUpdateController } from './controllers/examInstanceUpdateController';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';

export const examInstanceRoutes = new Hono();

examInstanceRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await examInstanceFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await examInstanceAutocompleteController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.post('/', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await examInstanceCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.post('/importer', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await examInstanceImporterController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.put('/archive', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await examInstanceArchiveManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.put('/restore', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await examInstanceRestoreManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.delete('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    await examInstanceDeleteManyController(query, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.get('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await examInstanceFindController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examInstanceRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await examInstanceUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
