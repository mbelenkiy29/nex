import { z } from 'zod';
import { AppContext } from '../../shared/controller/appContext';
import {
  pricingExposureInputSchema,
  pricingPackagesInputSchema,
  pricingPackagesOutputSchema,
} from './pricingSchemas';
import {
  pricingExperimentAssignAndExpose,
  pricingPackagesResolve,
} from './pricingService';

export async function pricingPackagesController(
  query: unknown,
  context: AppContext,
): Promise<z.output<typeof pricingPackagesOutputSchema>> {
  const input = pricingPackagesInputSchema.parse(query);
  return pricingPackagesOutputSchema.parse(
    await pricingPackagesResolve(input, context),
  );
}

export async function pricingExposureController(
  body: unknown,
  context: AppContext,
) {
  const input = pricingExposureInputSchema.parse(body);
  await pricingExperimentAssignAndExpose(input, context);
  return { ok: true };
}
