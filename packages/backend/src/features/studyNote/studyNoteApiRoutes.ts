import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '../../shared/controller/ApiResponseSuccess';
import { appContext } from '../../shared/controller/appContext';
import { studyNoteArchiveManyController } from './controllers/studyNoteArchiveManyController';
import { studyNoteAutocompleteController } from './controllers/studyNoteAutocompleteController';
import { studyNoteCreateController } from './controllers/studyNoteCreateController';
import { studyNoteDeleteManyController } from './controllers/studyNoteDeleteManyController';
import { studyNoteFindController } from './controllers/studyNoteFindController';
import { studyNoteFindManyController } from './controllers/studyNoteFindManyController';
import { studyNoteImporterController } from './controllers/studyNoteImporterController';
import { studyNoteRestoreManyController } from './controllers/studyNoteRestoreManyController';
import { studyNoteUpdateController } from './controllers/studyNoteUpdateController';
import { parseHonoQuery } from '../../shared/lib/parseHonoQuery';

export const studyNoteRoutes = new Hono();

studyNoteRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await studyNoteFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.get('/autocomplete', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await studyNoteAutocompleteController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.post('/', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await studyNoteCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.post('/importer', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await studyNoteImporterController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.put('/archive', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await studyNoteArchiveManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.put('/restore', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const body = await c.req.json();
    await studyNoteRestoreManyController(body, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.delete('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    await studyNoteDeleteManyController(query, context);
    const payload = true;
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.get('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    context = await appContext(c);
    const payload = await studyNoteFindController({ id }, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

studyNoteRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await studyNoteUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
