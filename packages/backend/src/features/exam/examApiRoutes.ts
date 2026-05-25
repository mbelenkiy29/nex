import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { examArchiveManyController } from './controllers/examArchiveManyController';
import { examAutocompleteController } from './controllers/examAutocompleteController';
import { examCreateController } from './controllers/examCreateController';
import { examDeleteManyController } from './controllers/examDeleteManyController';
import { examFindController } from './controllers/examFindController';
import { examFindManyController } from './controllers/examFindManyController';
import { examImporterController } from './controllers/examImporterController';
import { examRestoreManyController } from './controllers/examRestoreManyController';
import { examUpdateController } from './controllers/examUpdateController';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';

export const examRoutes = new Hono();

examRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await examFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await examAutocompleteController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.post('/', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await examCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.post('/importer', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await examImporterController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.put('/archive', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await examArchiveManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.put('/restore', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await examRestoreManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.delete('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    await examDeleteManyController(query, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.get('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await examFindController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

examRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await examUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
