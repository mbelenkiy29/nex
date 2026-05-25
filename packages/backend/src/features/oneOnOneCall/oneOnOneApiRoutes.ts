import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import {
  oneOnOneCreateSessionTypeController,
  oneOnOneDeleteSessionTypeController,
  oneOnOneGetAvailabilityController,
  oneOnOnePutAvailabilityController,
  oneOnOneUpdateSessionTypeController,
} from './oneOnOneAvailabilityControllers';
import {
  oneOnOneCancelSessionController,
  oneOnOneCreateBookingController,
  oneOnOneCreateNoteController,
  oneOnOneDeleteNoteController,
  oneOnOneGetSessionController,
  oneOnOneListCourseSessionTypesController,
  oneOnOneListSessionsController,
  oneOnOneListSlotsController,
  oneOnOneUpdateNoteController,
} from './oneOnOneBookingControllers';
import { oneOnOneOpenDisputeController } from './oneOnOneDisputeControllers';

export const oneOnOneRoutes = new Hono();

// --- Instructor (self) ------------------------------------------------------

oneOnOneRoutes.get('/availability', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneGetAvailabilityController(context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.put('/availability', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOnePutAvailabilityController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.post('/session-types', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOneCreateSessionTypeController(body, context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.patch('/session-types/:id', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOneUpdateSessionTypeController(
      c.req.param('id'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.delete('/session-types/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneDeleteSessionTypeController(
      c.req.param('id'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// --- Student-side: discover & book in a course -----------------------------

oneOnOneRoutes.get('/courses/:courseId/session-types', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneListCourseSessionTypesController(
      c.req.param('courseId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.get('/courses/:courseId/slots', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneListSlotsController(
      c.req.param('courseId'),
      c.req.query(),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.post('/courses/:courseId/bookings', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOneCreateBookingController(
      c.req.param('courseId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// --- Sessions: list / detail / cancel / notes ------------------------------

oneOnOneRoutes.get('/sessions', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneListSessionsController(c.req.query(), context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.get('/sessions/:id', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneGetSessionController(c.req.param('id'), context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.post('/sessions/:id/cancel', async (c) => {
  let context;
  try {
    // Body is optional — `{}` is fine.
    const body = await c.req.json().catch(() => ({}));
    context = await appContext(c);
    return await oneOnOneCancelSessionController(
      c.req.param('id'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.post('/sessions/:id/notes', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOneCreateNoteController(
      c.req.param('id'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.patch('/sessions/:id/notes/:noteId', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOneUpdateNoteController(
      c.req.param('id'),
      c.req.param('noteId'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.delete('/sessions/:id/notes/:noteId', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await oneOnOneDeleteNoteController(
      c.req.param('id'),
      c.req.param('noteId'),
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

oneOnOneRoutes.post('/sessions/:id/dispute', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    return await oneOnOneOpenDisputeController(
      c.req.param('id'),
      body,
      context,
      c,
    );
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
