import type { Organization } from '../../prisma/generated/client';
// bypass-RLS: resolves the organization from the request hostname/header
// before an RLS context exists for that org (chicken-and-egg lookup).
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';

/**
 * Get organization based on x-organization-id header from request
 */
export async function organizationFromRequest(
  request?: Request,
): Promise<Organization | null> {
  try {
    if (request?.headers) {
      const organizationId = request.headers.get('x-organization-id');

      if (organizationId) {
        const organization =
          await prismaDangerouslyBypassRLS.organization.findUnique({
            where: {
              id: organizationId,
            },
          });

        return organization;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
