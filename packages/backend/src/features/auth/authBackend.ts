import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { apiKey } from '@better-auth/api-key';
import { captcha, mcp, openAPI, organization } from 'better-auth/plugins';
// bypass-RLS: Better-Auth's prismaAdapter and signup/session hooks run
// before any per-request RLS context exists; auth-schema tables (User,
// Session, Account, Verification) are global by design.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { getFrontendUrl } from '../../shared/lib/getFrontendUrl';
import { redisConnection } from '../../shared/lib/redisConnection';
import { sendEmail } from '../../shared/lib/sendEmail';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { dictionaryLocaleFromRequest } from '../../translation/dictionaryLocaleFromRequest';
import { getDictionary } from '../../translation/getDictionary';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { memberCanRemoveAdmin } from '../member/memberCanRemoveAdmin';
import { sendNotification } from '../notification/notificationService';
import { organizationFromRequest } from '../organization/organizationFromRequest';
import { accessControl, roles, rolesIds } from '../permissions';
import { subscriptionCancelOnStripe } from '../subscription/subscriptionCancelOnStripe';
import {
  invalidateMember,
  invalidateOrganizationAndMembers,
} from './authCache';
import {
  apiKeyMaxExpiresInDays,
  apiKeyMinExpiresInDays,
} from './authConstants';
import { authAutoSelectOrganization } from './authSingleOrganizationSetSession';
import { authSingleOrganizationSetup } from './authSingleOrganizationSetup';
import { invitationComputeStatus } from '../invitation/invitationComputedStatus';
import { InvitationStatus } from '../invitation/invitationSchemas';
import { trustedOrigins } from './authTrustedOrigins';
import {
  assertSignupComplianceFields,
  buildSignupComplianceFields,
} from './authSignupCompliance';
import { env } from '../../env';
import { defaultLocale } from '../../translation/locales';

export const authBackend = betterAuth({
  database: prismaAdapter(prismaDangerouslyBypassRLS, {
    provider: 'postgresql',
  }),
  ...(env.REDIS_URL
    ? {
        secondaryStorage: {
          get: async (key) => {
            return await redisConnection.get(key);
          },
          set: async (key, value, ttl) => {
            if (ttl) {
              await redisConnection.set(key, value, 'EX', ttl);
            } else {
              await redisConnection.set(key, value);
            }
          },
          delete: async (key) => {
            await redisConnection.del(key);
          },
        },
      }
    : {}),
  plugins: [
    ...(env.RECAPTCHA_SECRET_KEY
      ? [
          captcha({
            provider: 'google-recaptcha',
            secretKey: env.RECAPTCHA_SECRET_KEY,
            endpoints: [
              '/sign-up/email',
              '/sign-in/email',
              '/forget-password',
              '/reset-password',
              '/send-verification-email',
              '/verify-email',
            ],
          }),
        ]
      : []),

    organization({
      ac: accessControl,
      roles: roles,
      creatorRole: rolesIds.admin,
      defaultRole: env.ORGANIZATION_DEFAULT_ROLE || undefined,
      schema: {
        organization: {
          additionalFields: {
            logosDark: {
              type: 'json',
              required: false,
              input: true,
            },
            logosLight: {
              type: 'json',
              required: false,
              input: true,
            },
            backgroundImageDark: {
              type: 'json',
              required: false,
              input: true,
            },
            backgroundImageLight: {
              type: 'json',
              required: false,
              input: true,
            },
            updatedAt: {
              type: 'date',
              required: true,
              defaultValue: () => new Date(),
              input: false,
            },
            createdByUserId: {
              type: 'string',
              required: false,
              input: false,
            },
            updatedByUserId: {
              type: 'string',
              required: false,
              input: false,
            },
          },
        },
        member: {
          modelName: 'Member',
          additionalFields: {
            updatedAt: {
              type: 'date',
              required: true,
              defaultValue: () => new Date(),
              input: false,
            },
            firstName: {
              type: 'string',
              input: true,
              required: false,
            },
            lastName: {
              type: 'string',
              input: true,
              required: false,
            },
            fullName: {
              type: 'string',
              input: false,
              required: false,
            },
            avatars: {
              type: 'json',
              input: true,
              required: false,
            },
            disabled: {
              type: 'boolean',
              required: false,
              defaultValue: false,
              input: false,
            },
            status: {
              type: 'string',
              required: false,
              input: false,
            },
            importHash: {
              type: 'string',
              input: false,
              required: false,
            },
            createdByUserId: {
              type: 'string',
              required: false,
              input: false,
            },
            createdByMemberId: {
              type: 'string',
              required: false,
              input: false,
            },
            updatedByUserId: {
              type: 'string',
              required: false,
              input: false,
            },
            updatedByMemberId: {
              type: 'string',
              required: false,
              input: false,
            },
          },
        },
        invitation: {
          modelName: 'invitation',
        },
      },

      allowUserToCreateOrganization: true,
      organizationLimit: env.ORGANIZATION_MODE === 'single' ? 1 : 100,
      memberLimit: 1000,
      invitationExpiresIn: 60 * 60 * 48, // 48 hours

      async sendInvitationEmail(data, request) {
        const locale = dictionaryLocaleFromRequest(request);
        const dictionary = await getDictionary(locale);
        const frontendUrl = getFrontendUrl(data.organization.slug);

        const existingUser = await prismaDangerouslyBypassRLS.user.findFirst({
          where: { email: data.email },
          select: { id: true },
        });

        const inviteLink = `${frontendUrl}/auth/invitation?token=${data.id}&email=${encodeURIComponent(data.email)}${existingUser ? '&existingUser=true' : ''}`;

        const isSingleMode = env.ORGANIZATION_MODE === 'single';
        const emailTemplate = isSingleMode
          ? dictionary.emails.invitationEmail.singleOrganization
          : dictionary.emails.invitationEmail.multiOrganization;

        const subject = isSingleMode
          ? dictionaryFormat(emailTemplate.subject, data.organization.name)
          : dictionaryFormat(
              emailTemplate.subject,
              dictionary.projectName,
              data.organization.name,
            );

        const content = isSingleMode
          ? dictionaryFormat(
              emailTemplate.content,
              data.organization.name,
              inviteLink,
            )
          : dictionaryFormat(
              emailTemplate.content,
              dictionary.projectName,
              inviteLink,
              data.organization.name,
            );

        await sendEmail(data.email, null, subject, content, 'HTML');
      },

      organizationHooks: {
        afterCreateOrganization: async ({ organization, member, user }) => {
          await prismaDangerouslyBypassRLS.organization.update({
            where: { id: organization.id },
            data: {
              createdByUserId: user.id,
            },
          });

          await auditLogCreate({
            entityId: organization.id,
            entityName: 'Organization',
            operation: auditLogOperations.create,
            organizationId: organization.id,
            userId: user.id,
            memberId: member.id,
            newData: organization,
          });
        },

        afterUpdateOrganization: async ({ organization, user }) => {
          if (organization) {
            await prismaDangerouslyBypassRLS.organization.update({
              where: { id: organization.id },
              data: {
                updatedByUserId: user.id,
              },
            });

            await auditLogCreate({
              entityId: organization.id,
              entityName: 'Organization',
              operation: auditLogOperations.update,
              organizationId: organization.id,
              userId: user.id,
              newData: organization,
            });

            await invalidateOrganizationAndMembers(organization.id);
          }
        },

        beforeDeleteOrganization: async ({ organization, user }) => {
          await subscriptionCancelOnStripe({
            organizationId: organization.id,
          });

          await auditLogCreate({
            entityId: organization.id,
            entityName: 'Organization',
            operation: auditLogOperations.delete,
            organizationId: organization.id,
            userId: user.id,
            oldData: organization,
          });

          await invalidateOrganizationAndMembers(organization.id);
        },

        beforeAddMember: async ({ user, organization }) => {
          // Prevent disabled members from rejoining
          const disabledMember =
            await prismaDangerouslyBypassRLS.member.findFirst({
              where: {
                userId: user.id,
                organizationId: organization.id,
                disabled: true,
              },
            });

          if (disabledMember) {
            throw new APIError('BAD_REQUEST', {
              message: 'MEMBER_DISABLED_CANNOT_REJOIN',
            });
          }
        },

        afterAddMember: async ({ member, user, organization }) => {
          const updateData: any = {};

          if (member.firstName || member.lastName) {
            updateData.fullName = [member.firstName, member.lastName]
              .filter(Boolean)
              .join(' ');
          }

          updateData.createdByUserId = user.id;

          if (Object.keys(updateData).length > 0) {
            await prismaDangerouslyBypassRLS.member.update({
              where: { id: member.id },
              data: updateData,
            });
          }

          await auditLogCreate({
            entityId: member.id,
            entityName: 'Member',
            operation: auditLogOperations.create,
            organizationId: organization.id,
            userId: user.id,
            memberId: member.id,
            newData: member,
          });

          await invalidateMember(member.userId, organization.id);

          // Send notification to admin members about new member
          await sendNotification({
            organizationId: organization.id,
            roles: ['admin'],
            payload: {
              type: 'memberAdded',
              memberName: user.name || user.email,
              memberEmail: user.email,
              organizationName: '', // Will be populated by worker
            },
            senderUserId: user.id,
            locale: defaultLocale, // Hook doesn't have request context, use default
          });
        },

        beforeRemoveMember: async ({ member, organization }) => {
          // Prevent deleting admin if organization has active subscription
          // (only when SUBSCRIPTION_MODE is 'organization')
          // Note: CANNOT_REMOVE_SELF is checked in controllers with AppContext
          try {
            await memberCanRemoveAdmin(member, organization.id);
          } catch (error: any) {
            if (error.name === 'CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION') {
              throw new APIError('BAD_REQUEST', {
                message: 'CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION',
              });
            }
            if (error.name === 'CANNOT_REMOVE_SELF') {
              throw new APIError('BAD_REQUEST', {
                message: 'CANNOT_REMOVE_SELF',
              });
            }
            throw error;
          }
        },

        afterRemoveMember: async ({ member, user, organization }) => {
          await auditLogCreate({
            entityId: member.id,
            entityName: 'Member',
            operation: auditLogOperations.delete,
            organizationId: organization.id,
            userId: user.id,
            memberId: member.id,
            oldData: member,
          });

          await invalidateMember(member.userId, organization.id);

          await subscriptionCancelOnStripe({
            organizationId: organization.id,
            userId: member.userId,
          });
        },

        afterCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          const inviterMember =
            await prismaDangerouslyBypassRLS.member.findFirstOrThrow({
              where: {
                organizationId: organization.id,
                userId: inviter.id,
              },
            });

          await auditLogCreate({
            entityId: invitation.id,
            entityName: 'Invitation',
            operation: auditLogOperations.create,
            organizationId: organization.id,
            userId: inviter.userId,
            memberId: inviterMember.id,
            newData: invitation,
          });
        },

        beforeAcceptInvitation: async ({ invitation, user }) => {
          if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
            throw new APIError('BAD_REQUEST', {
              code: 'INVITATION_EMAIL_MISMATCH',
            });
          }

          if (new Date() > new Date(invitation.expiresAt)) {
            throw new APIError('BAD_REQUEST', {
              code: 'INVITATION_EXPIRED',
            });
          }

          if (invitation.status !== 'pending') {
            throw new APIError('BAD_REQUEST', {
              code: 'INVITATION_NOT_PENDING',
            });
          }
        },

        afterAcceptInvitation: async ({
          invitation,
          member,
          user,
          organization,
        }) => {
          await auditLogCreate({
            entityId: invitation.id,
            entityName: 'Invitation',
            operation: auditLogOperations.update,
            organizationId: organization.id,
            userId: user.id,
            memberId: member.id,
            oldData: { ...invitation, status: 'pending' },
            newData: { ...invitation, status: 'accepted' },
          });
        },

        afterRejectInvitation: async ({ invitation, user, organization }) => {
          await auditLogCreate({
            entityId: invitation.id,
            entityName: 'Invitation',
            operation: auditLogOperations.update,
            organizationId: organization.id,
            userId: user.id,
            oldData: { ...invitation, status: 'pending' },
            newData: { ...invitation, status: 'rejected' },
          });
        },

        afterCancelInvitation: async ({
          invitation,
          cancelledBy,
          organization,
        }) => {
          const cancelledByMember =
            await prismaDangerouslyBypassRLS.member.findFirstOrThrow({
              where: {
                organizationId: organization.id,
                userId: cancelledBy.id,
              },
            });

          await auditLogCreate({
            entityId: invitation.id,
            entityName: 'Invitation',
            operation: auditLogOperations.update,
            organizationId: organization.id,
            userId: cancelledBy.id,
            memberId: cancelledByMember.id,
            oldData: { ...invitation, status: 'pending' },
            newData: { ...invitation, status: 'cancelled' },
          });
        },
      },
    }),

    apiKey({
      enableSessionForAPIKeys: true,
      enableMetadata: true,
      apiKeyHeaders: ['x-api-key'],
      defaultKeyLength: 64,
      rateLimit: {
        enabled: true,
        timeWindow: 1000 * 60 * 60 * 24,
        maxRequests: 1000,
      },
      keyExpiration: {
        defaultExpiresIn: null,
        minExpiresIn: apiKeyMinExpiresInDays,
        maxExpiresIn: apiKeyMaxExpiresInDays,
      },
      ...(env.REDIS_URL
        ? {
            storage: 'secondary-storage' as const,
            fallbackToDatabase: true,
          }
        : {}),
      schema: {
        apikey: {
          modelName: 'ApiKey',
        },
      },
    }),

    openAPI({
      path: '/reference',
      disableDefaultReference: false,
    }),

    mcp({
      loginPage: `${getFrontendUrl()}/auth/sign-in`,
      oidcConfig: {
        loginPage: `${getFrontendUrl()}/auth/sign-in`,
        allowDynamicClientRegistration: true,
        useJWTPlugin: true,
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: !env.AUTH_BYPASS_EMAIL_VERIFICATION,
    sendResetPassword: async ({ user, token }, request) => {
      const locale = dictionaryLocaleFromRequest(request);
      const dictionary = await getDictionary(locale);
      const organization = await organizationFromRequest(request);
      const frontendUrl = `${getFrontendUrl(organization?.slug)}/auth/password-reset/confirm?token=${token}`;
      const brandName = organization?.name || dictionary.projectName;

      const subject = dictionaryFormat(
        dictionary.emails.passwordResetEmail.subject,
        brandName,
      );
      const content = dictionaryFormat(
        dictionary.emails.passwordResetEmail.content,
        brandName,
        frontendUrl,
      );
      await sendEmail(user.email, null, subject, content, 'HTML', {
        channel: 'auth',
        userId: user.id,
      });

      await auditLogCreate({
        entityId: user.id,
        entityName: 'User',
        operation: auditLogOperations.passwordResetRequest,
        userId: user.id,
        newData: { email: user.email },
      });
    },
    onPasswordReset: async ({ user }, _request) => {
      await auditLogCreate({
        entityId: user.id,
        entityName: 'User',
        operation: auditLogOperations.passwordResetConfirm,
        userId: user.id,
        newData: { email: user.email },
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, token }, request) => {
      if (user.emailVerified) {
        return;
      }
      const locale = dictionaryLocaleFromRequest(request);
      const dictionary = await getDictionary(locale);
      const organization = await organizationFromRequest(request);
      const brandName = organization?.name || dictionary.projectName;

      const frontendUrl = `${getFrontendUrl(organization?.slug)}/auth/verify-email/confirm?token=${token}`;

      const subject = dictionaryFormat(
        dictionary.emails.verifyEmailEmail.subject,
        brandName,
      );
      const content = dictionaryFormat(
        dictionary.emails.verifyEmailEmail.content,
        brandName,
        frontendUrl,
      );
      await sendEmail(user.email, null, subject, content, 'HTML', {
        channel: 'auth',
        userId: user.id,
      });
    },
    autoSignInAfterVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async (
        { user, newEmail, token },
        request,
      ) => {
        const locale = dictionaryLocaleFromRequest(request);
        const dictionary = await getDictionary(locale);
        const organization = await organizationFromRequest(request);
        const frontendUrl = `${getFrontendUrl(organization?.slug)}/auth/email-change/confirm?token=${token}&newEmail=${encodeURIComponent(newEmail)}`;
        const brandName = organization?.name || dictionary.projectName;

        const subject = dictionaryFormat(
          dictionary.emails.emailChangeEmail.subject,
          brandName,
        );
        const content = dictionaryFormat(
          dictionary.emails.emailChangeEmail.content,
          brandName,
          frontendUrl,
          newEmail,
        );

        await sendEmail(user.email, null, subject, content, 'HTML', {
          channel: 'auth',
          userId: user.id,
        });

        await auditLogCreate({
          entityId: user.id,
          entityName: 'User',
          operation: auditLogOperations.emailChangeRequest,
          userId: user.id,
          newData: { newEmail },
        });
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID || '',
      clientSecret: env.AUTH_GOOGLE_SECRET || '',
      enabled: Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET),
    },
  },
  secret: env.AUTH_SECRET || '',
  baseURL: env.BACKEND_URL || 'http://localhost:3011',
  trustedOrigins,

  // Activates Better-Auth's built-in stricter rate-limit rules:
  //   /sign-in/*, /sign-up/*, /change-password, /change-email → 3 per 10s
  //   /forget-password/*, /request-password-reset,
  //   /send-verification-email, /email-otp/* → 3 per 60s
  //   everything else under /api/auth/* → 100 per 60s
  // Storage uses Redis when configured (shared across pods) and otherwise
  // falls back to in-process memory — explicit `memory` avoids the
  // database backend, which would error out (no RateLimit Prisma model).
  rateLimit: {
    enabled: true,
    storage: env.REDIS_URL
      ? ('secondary-storage' as const)
      : ('memory' as const),
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session: any) => {
          // If it's multi-domain mode, do not auto-select organization,
          // it will pick from the domain
          if (env.ORGANIZATION_MODE === 'multi-domain') {
            return { data: session };
          }

          // Auto-select organization when user has exactly one membership
          let member = await authAutoSelectOrganization({
            userId: session.userId,
            prisma: prismaDangerouslyBypassRLS,
          });

          // Auto-create org for new users in single-org mode
          if (!member) {
            const user =
              await prismaDangerouslyBypassRLS.user.findUniqueOrThrow({
                where: { id: session.userId },
                select: { id: true, email: true },
              });

            const result = await authSingleOrganizationSetup({
              user,
              auth: authBackend,
              prisma: prismaDangerouslyBypassRLS,
            });

            if (result) {
              member = result;
            }
          }

          // Set activeOrganizationId on the session before it's created
          if (member) {
            return {
              data: {
                ...session,
                activeOrganizationId: member.organizationId,
                activeMemberId: member.memberId,
              },
            };
          }

          return { data: session };
        },
        after: async (session: any) => {
          await auditLogCreate({
            entityId: session.userId,
            entityName: 'User',
            operation: auditLogOperations.signIn,
            userId: session.userId,
            organizationId: session.activeOrganizationId ?? null,
            memberId: session.activeMemberId ?? null,
            newData: { sessionId: session.id },
          });
        },
      },
      delete: {
        after: async (session: any) => {
          await auditLogCreate({
            entityId: session.userId,
            entityName: 'User',
            operation: auditLogOperations.signOut,
            userId: session.userId,
            organizationId: session.activeOrganizationId ?? null,
            oldData: { sessionId: session.id },
          });
        },
      },
    },
    user: {
      create: {
        before: async (user: any, ctx: any) => {
          // Validate compliance fields from the signup body. Reject COPPA
          // (under-13) accounts; require both ToS + Privacy acceptance.
          // Existing invitation accept-flow keeps working: the invitation
          // branch below preserves the new fields too.
          const body = (ctx?.body ?? {}) as {
            dateOfBirth?: string;
            termsAccepted?: boolean;
            privacyAccepted?: boolean;
          };
          await assertSignupComplianceFields(body);

          const complianceFields = buildSignupComplianceFields(body);

          const invitationToken = ctx?.headers?.get?.('x-invitation-token');
          if (!invitationToken) {
            return { data: { ...user, ...complianceFields } };
          }

          try {
            const invitation =
              await prismaDangerouslyBypassRLS.invitation.findUnique({
                where: { id: invitationToken },
                select: { email: true, status: true, expiresAt: true },
              });

            if (
              invitation &&
              invitationComputeStatus(invitation) ===
                InvitationStatus.pending &&
              invitation.email.toLowerCase() === user.email.toLowerCase()
            ) {
              return {
                data: {
                  ...user,
                  ...complianceFields,
                  emailVerified: true,
                },
              };
            }
          } catch (err) {
            console.error(
              'Failed to validate invitation token during signup',
              err,
            );
          }

          return { data: { ...user, ...complianceFields } };
        },
        after: async (user: any) => {
          await auditLogCreate({
            entityId: user.id,
            entityName: 'User',
            operation: auditLogOperations.signUp,
            userId: user.id,
            newData: { email: user.email },
          });
        },
      },
      update: {
        after: async (user: any, oldUser: any) => {
          if (user.email !== oldUser.email) {
            await auditLogCreate({
              entityId: user.id,
              entityName: 'User',
              operation: auditLogOperations.emailChangeConfirm,
              userId: user.id,
              oldData: { email: oldUser.email },
              newData: { email: user.email },
            });
          }
        },
      },
    },
    verification: {
      update: {
        after: async (verification: any) => {
          if (verification.value) {
            await auditLogCreate({
              entityId: verification.identifier,
              entityName: 'User',
              operation: auditLogOperations.verifyEmailConfirm,
              userId: verification.identifier,
              newData: { verified: true, value: verification.value },
            });
          }
        },
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const isAuthPath =
        ctx.path === '/sign-in/email' || ctx.path.startsWith('/callback');
      const returned = ctx.context.returned;

      if (isAuthPath && returned instanceof APIError) {
        const email = ctx.body?.email as string | undefined;
        await auditLogCreate({
          entityId: '00000000-0000-0000-0000-000000000000',
          entityName: 'User',
          operation: auditLogOperations.signInFailed,
          newData: {
            email,
            error: returned.message,
            statusCode: returned.status,
            path: ctx.path,
            ipAddress:
              ctx.headers?.get('x-forwarded-for') ||
              ctx.headers?.get('x-real-ip'),
            userAgent: ctx.headers?.get('user-agent'),
          },
        });
      }
    }),
  },

  advanced: {
    cookiePrefix: 'project',
    database: {
      // Let database generate UUIDs instead of Better Auth generating IDs
      generateId: false,
    },
  },
});
