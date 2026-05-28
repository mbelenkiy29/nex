import { AppContext } from '../../shared/controller/appContext';
import { productAnalyticsEventOutputSchema } from './productAnalyticsSchemas';
import { productAnalyticsTrackEvent } from './productAnalyticsService';
import { z } from 'zod';

export async function productAnalyticsEventCreateController(
  body: unknown,
  context: AppContext,
): Promise<z.output<typeof productAnalyticsEventOutputSchema>> {
  await productAnalyticsTrackEvent(body as any, context);

  return { ok: true };
}
