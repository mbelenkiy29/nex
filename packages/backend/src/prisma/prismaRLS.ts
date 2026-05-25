import { PrismaClient } from './generated/client';
import { env } from '../env';
import { rlsUserContext } from '../shared/lib/rlsUserContext';

/**
 * Prisma extension for Row Level Security (RLS) support.
 *
 * Exposes a helper (`$withRLS`) that wraps Prisma operations in a transaction
 * while setting the current organization context via a PostgreSQL session
 * variable used by RLS policies.
 */

export type PrismaWithRLS = ReturnType<typeof createPrismaWithRLS>;

export function createPrismaWithRLS(prisma: PrismaClient) {
  return prisma.$extends({
    client: {
      /**
       * Execute a query with organization context for RLS policies.
       *
       * Wraps the callback in a transaction and, when an organization ID is
       * provided, sets `app.current_organization_id` for the duration of that
       * transaction so PostgreSQL RLS policies can enforce tenant isolation.
       *
       * @param options - Context options including the organization (if any).
       * @param fn - The function to execute using the RLS-aware client.
       */
      async $withRLS<T>(
        options: {
          organization?: { id?: string | null };
        },
        fn: (client: PrismaClient) => Promise<T>,
      ): Promise<T> {
        return await (prisma as any).$transaction(async (tx: PrismaClient) => {
          // Set search_path for raw queries (workaround for @prisma/adapter-pg bug #24660)
          await tx.$executeRawUnsafe(
            `SET LOCAL search_path TO "${env.DATABASE_SCHEMA}";`,
          );

          if (options.organization?.id) {
            // Uses `set_config('name', value, is_local=true)` instead of the
            // prior `SET LOCAL ... = '${id}'` template-string form. Behaviour
            // is identical (same session-local setting, cleared at COMMIT/
            // ROLLBACK), but the value is bound through Prisma's parameter
            // template so even a future malformed organization.id can't be
            // interpreted as SQL. Closes audit finding #8.
            await tx.$executeRaw`SELECT set_config('app.current_organization_id', ${options.organization.id}, true);`;
          }

          // Per-user RLS for tables that scope by `userId` (CourseStudyPlanItem)
          // or by participant id (OneOnOneSession). The middleware sets the
          // userId once per request via AsyncLocalStorage; this picks it up
          // without changes to the 112 existing $withRLS call sites. Closes
          // audit finding #5 for the genuinely-cross-org tables. When the
          // store is empty (e.g. a job that incorrectly uses $withRLS instead
          // of the bypass client) the new policies fail closed — no rows.
          const userId = rlsUserContext.getStore()?.userId;
          if (userId) {
            await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true);`;
          }

          return await fn(tx);
        });
      },
    },
  });
}
