import { createHash } from 'node:crypto';
import { APIError } from 'better-auth';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { Error403 } from '../../../shared/errors/Error403';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { dictionaryEnumerator } from '../../../translation/dictionaryEnumerator';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { authBackend } from '../../auth/authBackend';
import { authGuardBackend } from '../../auth/authGuardBackend';
// bypass-RLS: Better-Auth's createApiKey returns a key not yet linked to
// an organization — we post-set organizationId via the bypass client
// because the RLS context can't read a row that's missing its org tag.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../../prisma';
import { apiKeyCreateBodySchema } from '../apiKeySchemas';
import { dictionaryFormat } from '../../../translation/dictionaryFormat';

export const apiKeyCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/api-key',
  body: apiKeyCreateBodySchema,
};

export async function apiKeyCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend(
    {
      apiKey: ['create'],
    },
    context,
  );
  return await apiKeyCreate(body, context);
}

export async function apiKeyCreate(body: unknown, context: AppContext) {
  const data = apiKeyCreateBodySchema.parse(body);

  // Validate permissions if provided - ensure user has all requested permissions
  if (data.permissions && Object.keys(data.permissions).length > 0) {
    // Check if user has all the requested permissions
    for (const [resource, actions] of Object.entries(data.permissions)) {
      for (const action of actions) {
        try {
          await authGuardBackend(
            {
              [resource]: [action],
            },
            context,
          );
        } catch (error) {
          throw new Error403(
            dictionaryFormat(
              context.dictionary.apiKey.errors.permissionDenied,
              resource,
              action,
            ),
          );
        }
      }
    }
  }

  if (!context.currentOrganization?.id) {
    throw new Error400(context.dictionary.apiKey.errors.organizationRequired);
  }

  try {
    const apiKey = await authBackend.api.createApiKey({
      body: {
        name: data.name,
        expiresIn: data.expiresInSeconds,
        permissions: data.permissions,
        userId: context.currentUser?.id,
        organizationId: context.currentOrganization.id,
        metadata: {
          organizationId: context.currentOrganization.id,
        },
      },
    });

    if (!apiKey) {
      throw new Error400(context.dictionary.apiKey.errors.createFailed);
    }

    await prismaDangerouslyBypassRLS.apiKey.update({
      where: { id: apiKey.id },
      data: { organizationId: context.currentOrganization.id },
    });

    // Audit-log the API key creation, but DON'T log the full permissions map —
    // a leaked audit log would otherwise hand an attacker a capability matrix
    // per key (audit finding #18). We log just the resource keys (high-level
    // surface) plus a 16-char SHA-256 of the full permissions JSON (lets ops
    // detect "did this key's permissions ever change?" without retaining the
    // grants themselves).
    const permissions = data.permissions ?? null;
    const permissionsHash = permissions
      ? createHash('sha256')
          .update(JSON.stringify(permissions))
          .digest('hex')
          .slice(0, 16)
      : null;
    await auditLogCreate({
      entityId: apiKey.id,
      entityName: 'ApiKey',
      operation: auditLogOperations.create,
      context,
      newData: {
        id: apiKey.id,
        name: apiKey.name,
        expiresAt: apiKey.expiresAt,
        permissionResources: permissions ? Object.keys(permissions) : null,
        permissionsHash,
        organizationId: context.currentOrganization.id,
      },
    });

    return apiKey;
  } catch (error) {
    if (error instanceof APIError) {
      throw new Error400(
        dictionaryEnumerator(
          context.dictionary.auth.errors,
          error.body?.code,
        ) ||
          error?.body?.message ||
          context.dictionary.shared.errors.unknown,
      );
    }

    throw error;
  }
}
