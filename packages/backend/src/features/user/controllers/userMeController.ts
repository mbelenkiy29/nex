import { z } from 'zod';
// bypass-RLS: /me lists the current user's memberships across ALL of
// their orgs — multi-org visibility is the whole point of this endpoint.
// All reads filter explicitly on userId = currentUser.id.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../../prisma';
import { AppContext } from '../../../shared/controller/appContext';
import { RouteConfig } from '../../../shared/openapi/routeToPath';
import { Dictionary } from '../../../translation/locales';
import { toMcpJsonSchema } from '../../mcp/mcpSchemaConverter';
import { McpTool } from '../../mcp/mcpTypes';
import { platformAdminIsUserAllowed } from '../../platformAdmin/platformAdminGuard';

export const userMeApiDoc: RouteConfig = {
  method: 'get',
  path: '/api/user/me',
  response:
    '{ members: Member[], activeSubscriptions: Subscription[], isPlatformAdmin: boolean, isCreator: boolean, isVerifiedCreator: boolean }',
};

export const userMeMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'user_me',
  description: dictionary.user.mcpDescription.me,
  requiredPermissions: {},
  schema: toMcpJsonSchema(z.object({})),
  handler: async (params, context) => {
    return await userMeController(context);
  },
});

export async function userMeController(context: AppContext) {
  if (!context.currentUser) {
    return {
      members: [],
      activeSubscriptions: [],
      isPlatformAdmin: false,
      isCreator: false,
      isVerifiedCreator: false,
    };
  }

  const members = await prismaDangerouslyBypassRLS.member.findMany({
    where: {
      userId: context.currentUser.id,
    },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const activeSubscriptions =
    await prismaDangerouslyBypassRLS.subscription.findMany({
      where: {
        OR: [
          // User-level subscriptions
          {
            userId: context.currentUser.id,
            organizationId: null,
            status: {
              in: ['active', 'trialing'],
            },
          },
          // Organization-level subscriptions for user's organizations
          {
            organizationId: {
              in: members.map((m) => m.organizationId),
            },
            status: {
              in: ['active', 'trialing'],
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

  const creatorApplication =
    await prismaDangerouslyBypassRLS.creatorApplication.findUnique({
      where: {
        userId: context.currentUser.id,
      },
      select: { nexVerified: true },
    });

  return {
    members,
    activeSubscriptions,
    isPlatformAdmin: platformAdminIsUserAllowed(context.currentUser.email),
    isCreator: creatorApplication !== null,
    isVerifiedCreator: creatorApplication?.nexVerified === true,
  };
}
