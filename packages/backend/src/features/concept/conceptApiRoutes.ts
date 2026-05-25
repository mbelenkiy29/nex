import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { conceptArchiveManyController } from './controllers/conceptArchiveManyController';
import { conceptAutocompleteController } from './controllers/conceptAutocompleteController';
import { conceptCreateController } from './controllers/conceptCreateController';
import { conceptDeleteManyController } from './controllers/conceptDeleteManyController';
import { conceptFindController } from './controllers/conceptFindController';
import { conceptFindManyController } from './controllers/conceptFindManyController';
import { conceptImporterController } from './controllers/conceptImporterController';
import { conceptRestoreManyController } from './controllers/conceptRestoreManyController';
import { conceptUpdateController } from './controllers/conceptUpdateController';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';

export const conceptRoutes = new Hono();

conceptRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await conceptFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await conceptAutocompleteController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.post('/', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await conceptCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.post('/importer', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await conceptImporterController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.put('/archive', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await conceptArchiveManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.put('/restore', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await conceptRestoreManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.delete('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    await conceptDeleteManyController(query, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.get('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await conceptFindController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

conceptRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await conceptUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
