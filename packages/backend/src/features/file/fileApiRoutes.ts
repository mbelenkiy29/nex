import { Hono } from 'hono';
import { ApiResponseError } from '../../shared/controller/ApiResponseError';
import { appContext } from '../../shared/controller/appContext';
import {
  rateLimitFromProfile,
  rateLimitProfiles,
  rateLimitRequest,
} from '../../shared/lib/rateLimiter';
import { handleUpload } from './uploadRouter';

export const fileRoutes = new Hono();

/**
 * Better Upload handler for direct S3 uploads
 * Handles pre-signed URL generation and file uploads
 */
fileRoutes.post('/upload', async (c) => {
  let context;
  try {
    context = await appContext(c);
    await rateLimitRequest(
      c,
      context,
      rateLimitFromProfile(rateLimitProfiles.upload, 'file-upload'),
    );
    const request = c.req.raw;
    (request as any).context = context;

    return handleUpload(request);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});
