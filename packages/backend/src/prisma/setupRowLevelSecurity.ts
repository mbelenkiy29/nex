import { Client } from 'pg';
import { env } from '../env';

/**
 * Setup Row Level Security (RLS) for all multi-tenant tables.
 * This function is intended to run after database migrations and in test setup
 * to ensure RLS policies are in place before the application or tests access
 * multi-tenant tables.
 *
 * This requires elevated database privileges (ALTER TABLE, CREATE POLICY) so it
 * uses the DATABASE_MIGRATION_URL (postgres superuser).
 *
 * APPROACH: Role-based RLS using PostgreSQL's native BYPASSRLS privilege:
 * - DATABASE_RLS_USER: Has NOBYPASSRLS, subject to RLS policies
 * - DATABASE_BYPASS_RLS_URL: Uses a user with BYPASSRLS privilege
 * - DATABASE_MIGRATION_URL: Postgres superuser for migrations
 *
 * RLS provides an additional security layer at the database level to complement
 * the application-level organization filtering.
 */

/**
 * Create a PostgreSQL client with elevated privileges for RLS setup
 */
async function createMigrationClient(): Promise<Client> {
  const client = new Client({
    connectionString: env.DATABASE_MIGRATION_URL,
  });
  await client.connect();
  return client;
}

/**
 * Ensure the RLS database user exists with proper permissions (NOBYPASSRLS)
 */
async function ensureRlsUserExists(client: Client): Promise<void> {
  const rlsUser = env.DATABASE_RLS_USER;
  const rlsPassword = env.DATABASE_RLS_PASSWORD;
  const dbName = env.DATABASE_NAME;
  const schema = env.DATABASE_SCHEMA;

  if (!rlsUser || !rlsPassword) {
    console.warn(
      '⚠ DATABASE_RLS_USER or DATABASE_RLS_PASSWORD not set, skipping user creation',
    );
    return;
  }

  try {
    const result = await client.query(
      'SELECT 1 FROM pg_roles WHERE rolname = $1',
      [rlsUser],
    );

    if (result.rows.length === 0) {
      console.log(`Creating RLS database user: ${rlsUser}`);
      // PG protocol limitation (audit finding #16): `CREATE USER ... WITH
      // PASSWORD` cannot accept the password via the $1 parameter channel,
      // so we manually escape single quotes with the SQL standard `''`
      // doubling. The rlsPassword value is env-controlled (never user-
      // supplied), and identifier `rlsUser` is already double-quoted. This
      // is the accepted way to express CREATE USER from a client driver.
      const escapedPassword = rlsPassword.replace(/'/g, "''");
      await client.query(
        `CREATE USER "${rlsUser}" WITH PASSWORD '${escapedPassword}' NOBYPASSRLS`,
      );
    } else {
      // Ensure existing user has NOBYPASSRLS
      await client.query(`ALTER USER "${rlsUser}" NOBYPASSRLS`);
    }

    // Quote identifiers to handle special characters like hyphens
    if (env.NODE_ENV !== 'test') {
      console.log(`Granting permissions to RLS user: ${rlsUser}`);
    }
    await client.query(`GRANT CONNECT ON DATABASE "${dbName}" TO "${rlsUser}"`);
    await client.query(`GRANT USAGE ON SCHEMA "${schema}" TO "${rlsUser}"`);
    await client.query(
      `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "${schema}" TO "${rlsUser}"`,
    );
    await client.query(
      `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "${schema}" TO "${rlsUser}"`,
    );

    // Grant default privileges for future tables
    await client.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA "${schema}" GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${rlsUser}"`,
    );
    await client.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA "${schema}" GRANT USAGE, SELECT ON SEQUENCES TO "${rlsUser}"`,
    );

    if (env.NODE_ENV !== 'test') {
      console.log(`✓ RLS database user ${rlsUser} configured successfully`);
    }
  } catch (error) {
    console.error(`✗ Failed to setup RLS database user ${rlsUser}:`, error);
    throw error;
  }
}

/**
 * Fetch all tables that have an organizationId column from the database
 */
async function getTablesWithOrganizationId(client: Client): Promise<string[]> {
  const schema = env.DATABASE_SCHEMA;

  const result = await client.query<{ table_name: string }>(
    `
    SELECT DISTINCT t.table_name
    FROM information_schema.tables t
    INNER JOIN information_schema.columns c
      ON t.table_name = c.table_name
      AND t.table_schema = c.table_schema
    WHERE t.table_schema = $1
      AND t.table_type = 'BASE TABLE'
      AND c.column_name = 'organizationId'
    ORDER BY t.table_name;
  `,
    [schema],
  );

  return result.rows.map((row) => row.table_name);
}

/**
 * Enable RLS and create policies for a single table
 */
async function setupRLSForTable(
  client: Client,
  tableName: string,
): Promise<void> {
  const schema = env.DATABASE_SCHEMA;
  const rlsUser = env.DATABASE_RLS_USER;

  try {
    // Enable Row Level Security. DDL identifiers can't ride the $1/$2
    // parameter channel, so we round-trip through PG's `format('%I', ...)`
    // to get a safely-escaped statement string back before executing it.
    // The %I specifier handles identifier quoting exactly like PostgreSQL's
    // own catalog code does — immune to injection even if tableName/schema
    // ever became attacker-controllable. Closes audit finding #9 (today
    // tableName comes from information_schema, but defence-in-depth).
    //
    // NOTE: We intentionally do NOT use FORCE ROW LEVEL SECURITY.
    // This allows table owners (postgres) and users with BYPASSRLS to
    // bypass RLS; only the RLS user (with NOBYPASSRLS) is subject to it.
    const enableSql = await client.query<{ sql: string }>(
      `SELECT format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', $1::text, $2::text) AS sql`,
      [schema, tableName],
    );
    await client.query(enableSql.rows[0]!.sql);

    // Check if the tenant-isolation policy is already in place.
    // Parameterised — no template interpolation of tableName/schema.
    const existing = await client.query(
      `SELECT 1 FROM pg_catalog.pg_policies
       WHERE policyname = 'tenant_isolation_policy'
         AND tablename = $1
         AND schemaname = $2`,
      [tableName, schema],
    );

    if (existing.rows.length === 0) {
      // Build the CREATE POLICY SQL via format(%I, ...) for safe identifier
      // escaping. Dollar-quoted string ($sql$...$sql$) means we don't have
      // to escape the single quotes inside the USING clause.
      const policySql = rlsUser
        ? await client.query<{ sql: string }>(
            `SELECT format(
               $sql$CREATE POLICY tenant_isolation_policy ON %I.%I TO %I USING ("organizationId"::text = current_setting('app.current_organization_id', TRUE))$sql$,
               $1::text, $2::text, $3::text
             ) AS sql`,
            [schema, tableName, rlsUser],
          )
        : await client.query<{ sql: string }>(
            `SELECT format(
               $sql$CREATE POLICY tenant_isolation_policy ON %I.%I USING ("organizationId"::text = current_setting('app.current_organization_id', TRUE))$sql$,
               $1::text, $2::text
             ) AS sql`,
            [schema, tableName],
          );
      await client.query(policySql.rows[0]!.sql);
    }

    if (env.NODE_ENV !== 'test') {
      console.log(`✓ RLS enabled for table: ${tableName}`);
    }
  } catch (error) {
    console.error(`✗ Failed to setup RLS for table ${tableName}:`, error);
    throw error;
  }
}

/**
 * Tables that scope rows by a single user-id column (no organizationId).
 * Used for marketplace-pattern data that follows the user across orgs.
 * Closes audit finding #5 for genuinely cross-org user data.
 */
const USER_OWNED_TABLES: ReadonlyArray<{ table: string; column: string }> = [
  { table: 'CourseBuilderCheckpoint', column: 'userId' },
  { table: 'AiTrustPreference', column: 'userId' },
  { table: 'CourseAiGenerationJob', column: 'userId' },
  { table: 'CourseCertificate', column: 'userId' },
  { table: 'CourseCouponRedemption', column: 'userId' },
  { table: 'CourseDiagnosticAnswer', column: 'userId' },
  { table: 'CourseDiagnosticAttempt', column: 'userId' },
  { table: 'CourseDomainMastery', column: 'userId' },
  { table: 'CourseReadinessSnapshot', column: 'userId' },
  { table: 'CourseFlashcardReview', column: 'userId' },
  { table: 'CourseRemediationPlan', column: 'userId' },
  { table: 'CourseStudyStreak', column: 'userId' },
  { table: 'CourseStudyPlanItem', column: 'userId' },
  { table: 'CourseWishlist', column: 'userId' },
  { table: 'CourseWishlistItem', column: 'userId' },
];

/**
 * Tables where two user-id columns identify the participants. Either party
 * sees the row. OneOnOneSession is the canonical case: instructor in org A
 * sells to a student in org B — both must see the row when logged in.
 */
const PARTICIPANT_TABLES: ReadonlyArray<{
  table: string;
  columns: [string, string];
}> = [
  { table: 'OneOnOneSession', columns: ['instructorUserId', 'studentUserId'] },
];

/**
 * Create the user-isolation policy for a single-user-column table. Policy
 * name is distinct from `tenant_isolation_policy` so the two don't collide
 * if a table ever has both columns (Postgres ORs policies). Today these
 * tables don't have organizationId so only this one fires.
 */
async function setupUserOwnedRLS(
  client: Client,
  table: string,
  column: string,
): Promise<void> {
  const schema = env.DATABASE_SCHEMA;
  const rlsUser = env.DATABASE_RLS_USER;

  try {
    // ALTER TABLE ... ENABLE ROW LEVEL SECURITY (idempotent on re-run).
    const enableSql = await client.query<{ sql: string }>(
      `SELECT format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', $1::text, $2::text) AS sql`,
      [schema, table],
    );
    await client.query(enableSql.rows[0]!.sql);

    const existing = await client.query(
      `SELECT 1 FROM pg_catalog.pg_policies
       WHERE policyname = 'user_isolation_policy'
         AND tablename = $1
         AND schemaname = $2`,
      [table, schema],
    );

    if (existing.rows.length === 0) {
      const policySql = rlsUser
        ? await client.query<{ sql: string }>(
            `SELECT format(
               $sql$CREATE POLICY user_isolation_policy ON %I.%I TO %I USING (current_setting('app.current_user_id', TRUE)::uuid = %I)$sql$,
               $1::text, $2::text, $3::text, $4::text
             ) AS sql`,
            [schema, table, rlsUser, column],
          )
        : await client.query<{ sql: string }>(
            `SELECT format(
               $sql$CREATE POLICY user_isolation_policy ON %I.%I USING (current_setting('app.current_user_id', TRUE)::uuid = %I)$sql$,
               $1::text, $2::text, $3::text
             ) AS sql`,
            [schema, table, column],
          );
      await client.query(policySql.rows[0]!.sql);
    }

    if (env.NODE_ENV !== 'test') {
      console.log(`✓ User-owned RLS enabled for table: ${table} (${column})`);
    }
  } catch (error) {
    console.error(`✗ Failed to setup user-owned RLS for ${table}:`, error);
    throw error;
  }
}

/**
 * Create the two-participant policy. Row visible if the current user is
 * either participant. Used for OneOnOneSession.
 */
async function setupParticipantRLS(
  client: Client,
  table: string,
  columns: [string, string],
): Promise<void> {
  const schema = env.DATABASE_SCHEMA;
  const rlsUser = env.DATABASE_RLS_USER;
  const [col1, col2] = columns;

  try {
    const enableSql = await client.query<{ sql: string }>(
      `SELECT format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', $1::text, $2::text) AS sql`,
      [schema, table],
    );
    await client.query(enableSql.rows[0]!.sql);

    const existing = await client.query(
      `SELECT 1 FROM pg_catalog.pg_policies
       WHERE policyname = 'user_participant_policy'
         AND tablename = $1
         AND schemaname = $2`,
      [table, schema],
    );

    if (existing.rows.length === 0) {
      const policySql = rlsUser
        ? await client.query<{ sql: string }>(
            `SELECT format(
               $sql$CREATE POLICY user_participant_policy ON %I.%I TO %I USING (current_setting('app.current_user_id', TRUE)::uuid IN (%I, %I))$sql$,
               $1::text, $2::text, $3::text, $4::text, $5::text
             ) AS sql`,
            [schema, table, rlsUser, col1, col2],
          )
        : await client.query<{ sql: string }>(
            `SELECT format(
               $sql$CREATE POLICY user_participant_policy ON %I.%I USING (current_setting('app.current_user_id', TRUE)::uuid IN (%I, %I))$sql$,
               $1::text, $2::text, $3::text, $4::text
             ) AS sql`,
            [schema, table, col1, col2],
          );
      await client.query(policySql.rows[0]!.sql);
    }

    if (env.NODE_ENV !== 'test') {
      console.log(
        `✓ Participant RLS enabled for table: ${table} (${col1}, ${col2})`,
      );
    }
  } catch (error) {
    console.error(`✗ Failed to setup participant RLS for ${table}:`, error);
    throw error;
  }
}

/**
 * Setup Row Level Security for all multi-tenant tables
 */
export async function setupRowLevelSecurity(): Promise<void> {
  let client: Client | null = null;

  try {
    if (env.NODE_ENV !== 'test') {
      console.log('Setting up Row Level Security (RLS)...');
    }

    // Connect with elevated privileges (postgres user)
    client = await createMigrationClient();

    // Ensure RLS user exists with NOBYPASSRLS
    await ensureRlsUserExists(client);

    // Dynamically fetch all tables with organizationId
    const tables = await getTablesWithOrganizationId(client);

    if (tables.length === 0) {
      console.warn('⚠ No tables with organizationId found');
      return;
    }

    if (env.NODE_ENV !== 'test') {
      console.log(
        `Found ${tables.length} tables with organizationId:`,
        tables.join(', '),
      );
    }

    for (const tableName of tables) {
      await setupRLSForTable(client, tableName);
    }

    // Per-user / per-participant RLS for tables without organizationId
    // (CourseStudyPlanItem, OneOnOneSession). Picks up `app.current_user_id`
    // set by the appContext middleware via AsyncLocalStorage.
    //
    // Fail-loud guard against a future schema change accidentally adding
    // `organizationId` to one of these tables: Postgres ORs permissive
    // policies, so a row would become visible if EITHER the org matches OR
    // the user matches — strictly weaker than intended. Crash here so the
    // change can't be deployed.
    const orgTablesSet = new Set(tables);
    for (const { table } of [...USER_OWNED_TABLES, ...PARTICIPANT_TABLES]) {
      if (orgTablesSet.has(table)) {
        throw new Error(
          `RLS policy conflict: \`${table}\` is registered as a user-owned/participant table AND has an \`organizationId\` column. Postgres would OR the two policies and silently weaken isolation. Pick one strategy or wrap the new policy in \`AS RESTRICTIVE\`.`,
        );
      }
    }
    for (const { table, column } of USER_OWNED_TABLES) {
      await setupUserOwnedRLS(client, table, column);
    }
    for (const { table, columns } of PARTICIPANT_TABLES) {
      await setupParticipantRLS(client, table, columns);
    }

    if (env.NODE_ENV !== 'test') {
      console.log('✓ Row Level Security setup completed successfully');
    }
  } catch (error) {
    console.error('✗ Failed to setup Row Level Security:', error);
    // In production, RLS is a hard tenant-isolation requirement. Fail loudly
    // so a broken deploy cannot boot/serve traffic without RLS protection
    // (the CLI wrapper turns this into a non-zero exit, failing the deploy).
    if (env.NODE_ENV === 'production') {
      throw error;
    }
    // In development/test, allow startup so local work isn't blocked.
    console.warn(
      '⚠ Application will continue without RLS protection (non-production only)',
    );
  } finally {
    // Always close the client connection
    if (client) {
      await client.end();
    }
  }
}
