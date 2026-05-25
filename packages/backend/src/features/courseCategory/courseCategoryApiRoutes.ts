import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import { courseCategoryListController } from './courseCategoryControllers';

export const courseCategoryRoutes = new Hono();

// Public — drives the marketplace category chip row and the builder
// dropdown. No org gate; matches `courseCatalogController` which is also
// world-readable.
courseCategoryRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    return await courseCategoryListController(c.req.query(), context, c);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
