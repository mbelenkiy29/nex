## Project Overview

Full-stack TypeScript monorepo for a multi-organization SaaS application with:

- **Backend**: Hono.js API server with PostgreSQL/Prisma, PgBoss workers
- **Frontend**: React 19 with Vite, TanStack Router/Query/Table, React Hook Form, shadcn/ui
- **Architecture**: Feature-based backend structure with multi-tenancy and audit logging

## Build Verification

**Always run `pnpm build` after code changes** to catch TypeScript errors and ensure the build passes before finishing a task.

## Translations

**IMPORTANT: No hardcoded text.** All user-facing strings must use translation dictionaries in `packages/backend/src/translation/{en,es,pt-BR,de,fr}/`. When adding new text, you MUST add translations to ALL locale folders.

Run `pnpm translation:audit` during launch-copy cleanup to surface likely English fallback strings in non-English dictionaries.

## NexExam Brand & Human Interface Guidelines

The product UI must follow the NexExam brand system from the provided kit:

- Brand name: **NexExam**
- Typeface: **Plus Jakarta Sans**
- Primary: `#5B5CF6`; Primary Light: `#8B5CF6`; Accent: `#E9D5FF`; Secondary: `#3B82F6`; Secondary Light: `#DBEAFE`; Success: `#22C55E`
- Neutrals: `#0F172A`, `#334155`, `#64748B`, `#CBD5E1`, `#E2E8F0`, `#F1F5F9`, `#F8FAFC`, `#FFFFFF`
- Visual style: modern AI learning platform, soft glass surfaces, rounded 8-12px controls, subtle blue/violet depth, line icons with rounded 2px strokes, minimal friendly layouts.

Always apply Human Interface Guidelines principles before UI work:

- Clarity: hierarchy, labels, and states must be immediately understandable.
- Deference: content and learning actions come before decoration.
- Depth: use motion, elevation, and layered surfaces sparingly to show relationships.
- Consistency: new UI must reuse the NexExam tokens, spacing rhythm, icon style, and existing shadcn/ui primitives.
- Accessibility: preserve keyboard navigation, focus rings, semantic controls, contrast, and responsive layouts.

Do not introduce unrelated color systems, hardcoded user-facing copy, generic landing-page composition, or decorative elements that do not support the learning workflow.

## Shared Backend Imports

Frontend can import from `@project/backend` for shared code:

- Schemas/types: `@project/backend/features/*/schemas`
- Translations: `@project/backend/translation/*`
- Formatters: `@project/backend/shared/lib/format*`
- Labels: `@project/backend/features/*/label`
- Permissions: `@project/backend/features/permissions`

## Environment Variables

Configuration defined in `packages/backend/src/env.ts`. **NEVER use `process.env` directly** - always import from `env.ts`.

## Prisma & Row Level Security

Database access via `packages/backend/src/prisma/`. Two clients:

- `prisma` - Use `$withRLS({ organization }, fn)` for org-scoped queries
- `prismaDangerouslyBypassRLS` - Only for system ops (auth, webhooks, jobs)

Entities with `organizationId` automatically get RLS policies. Always use `$withRLS` for tenant isolation.

## AppContext (Backend)

Request context from `shared/controller/appContext.ts`. Contains `currentUser`, `currentMember`, `currentOrganization`, `currentSubscription`, `dictionary`, `locale`. Created via `appContext(c)` in controllers.

## AuthStore (Frontend)

Zustand store in `features/auth/authStore.ts`. Access via `useAuthStore()`. Provides `currentUser`, `currentMember`, `currentOrganization`, `hasPermission()`, `signOut()`, `dictionary`, `locale`.

## Query Invalidation (Frontend)

**IMPORTANT: Always invalidate queries after mutations.** When a mutation succeeds, invalidate all related queries so they refetch fresh data. Consider entities affected beyond the primary one (e.g., creating an order may affect product stock).

```typescript
const mutation = useMutation({
  mutationFn: orderCreateApiCall,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['order'] });
    queryClient.invalidateQueries({ queryKey: ['product'] }); // affected entity
  },
});
```

## Routing

- **Backend**: Register feature routes in `features/apiRoutes.ts` via `apiRoutes.route('/path', featureRoutes)`
- **Frontend**: Register feature routes in `features/router.ts` under `authenticatedRoute.addChildren()`

## Zod Schemas

All Zod schemas must be defined in `*Schemas.ts` files (e.g., `categorySchemas.ts`). Export schemas for reuse in controllers and frontend. Shared schemas in `shared/schemas/`.

## Naming Conventions

Entity-specific functions should be prefixed with the entity name for better IDE auto-complete discoverability. When typing the entity name, all related functions appear together.

```typescript
// Good - entity name first
orderComputeTotal(order);
orderValidate(order);
orderStatusToWhere(status);

// Bad - verb first scatters related functions
computeOrderTotal(order);
validateOrder(order);
```

## Error Handling

Use typed errors from `shared/errors/`: `Error400` (bad request), `Error401` (unauthorized), `Error403` (forbidden), `Error404` (not found). Never throw generic `Error`.

## Data Formatting

Backend returns raw data; frontend handles all display formatting. Never format in API responses:

- **Dates**: Return ISO strings (`toISOString()`), frontend uses `formatDateTime(date, dictionary)`
- **Numbers/Decimals**: Return raw numbers, frontend formats with locale
- **Currency**: Return raw amounts, frontend formats with currency symbol/locale

This ensures consistent locale-aware formatting and keeps backend responses reusable.

## Number/Integer Form Inputs

Use `numberSchema` or `numberOptionalSchema` from `shared/schemas/numberSchema.ts`. Define separate `z.input`/`z.output` types for form state (strings) vs submission (numbers). See `docs/frontend-form-patterns.md` for examples.

## Authentication

Better Auth with RBAC, sessions, API keys, and MCP support. Use `authGuardBackend` for backend authorization, `authGuardFrontend` for route protection. Define roles/permissions and storage permissions (file uploads) in `features/permissions.ts`. See `docs/auth-reference.md` for details.

## Audit Logging

All create/update/delete operations must call `auditLogCreate()` from `features/auditLog/auditLogCreate.ts`. See existing controllers for usage patterns.

## Background Jobs

Non-blocking tasks (emails, notifications) must use PgBoss queues. Pattern: create queue in `shared/jobs/pgBoss.ts`, add job via `boss.send(QUEUE_NAME, data)`. See `shared/email/emailQueue.ts` for reference.

## Tests

Only run or create tests when explicitly requested. Run only tests related to current change with `pnpm test FILE_NAME`. See `docs/test-structure.md` for details.

## Reference Docs

- `docs/auth-reference.md` - Authentication, authorization, RBAC
- `docs/entity-crud-reference.md` - Complete CRUD patterns (backend + frontend)
- `docs/frontend-form-patterns.md` - React Hook Form with all field types
- `docs/frontend-list-patterns.md` - TanStack Table data table patterns
- `docs/frontend-view-patterns.md` - View page, filters, actions, links
- `docs/chatbot-reference.md` - AI chatbot with Claude API and streaming
- `docs/mcp-reference.md` - MCP server for AI assistant integration

## Essential Commands

### Development

```bash
pnpm dev                    # Start frontend + backend + worker (all services)
pnpm dev:server            # Start frontend + backend only (no worker)
pnpm worker:dev            # Start worker process with hot reload
```

### Building

```bash
pnpm build                 # Build all packages
pnpm build:backend         # Build backend only
pnpm build:frontend        # Build frontend only
```

### Testing

#### Unit Tests (Backend)

```bash
pnpm test                  # Run all backend unit tests
pnpm test:backend          # Run backend tests (explicit)
pnpm test:watch            # Run tests in watch mode
pnpm test:ui               # Open Vitest UI in browser
pnpm test:coverage         # Run tests with coverage report
```

#### End-to-End Tests (Playwright)

```bash
pnpm test:e2e              # Run e2e tests (headless)
pnpm test:e2e:ui           # Open Playwright UI
pnpm test:e2e:headed       # Run e2e tests with browser visible
```

### Database (Prisma)

```bash
pnpm --filter backend prisma:generate        # Generate Prisma client types
pnpm --filter backend db:migrate:create      # Generate and migrate database (dev)
pnpm --filter backend db:migrate             # Deploy migrations (prod)
pnpm --filter backend prisma:studio          # Open Prisma Studio GUI
```

# Code Comment Review Guidelines

Review all comments in the codebase and apply these rules:

## Remove Comments When:

- The code is self-explanatory through clear variable/function names
- The comment merely restates what the code obviously does
- Modern language features or patterns make the intent clear
- The comment is outdated or contradicts the actual code
- It's a commented-out code block (should be deleted or uncommented)

Examples of unnecessary comments to remove:

```typescript
// Set user as active
user.isActive = true;

// Create new instance of UserService
const userService = new UserService();

// Loop through all items
items.forEach((item) => processItem(item));

// Return the result
return calculateTotal(orders);
```

## Add Comments When:

- Complex algorithms or business logic require explanation of "why"
- Non-obvious performance optimizations or workarounds
- Explaining the reasoning behind a particular approach
- Warning about potential pitfalls or edge cases
- Documenting external API contracts or integration points
- Explaining magic numbers or configuration values
- Clarifying unintuitive but necessary code patterns

Examples of helpful comments to add:

```typescript
// Using Map instead of object for O(1) lookups with 100k+ user records
// Benchmarked: 3x faster than object property access at this scale
const userCache = new Map<string, User>();

// Retry with exponential backoff: payment gateway returns 502 during
// high traffic periods. Usually succeeds within 3 attempts.
const result = await retryWithBackoff(() => processPayment(order), 3);

// TypeScript can't infer this is non-null after the filter operation
// Safe to assert because filter removes all null/undefined values
const validUsers = users
  .filter((u) => u.email)
  .map((u) => u.email!.toLowerCase());

// 2592000000 = 30 days in milliseconds
// Session expiry must match the refresh token TTL in auth service
const SESSION_DURATION = 2592000000;

// Intentionally not using async/await here to avoid blocking the event loop
// These operations need to run in parallel for acceptable performance (<100ms)
Promise.all([fetchUser(), fetchOrders(), fetchPreferences()]).then(
  ([user, orders, prefs]) => renderDashboard(user, orders, prefs),
);
```

## Review Process:

1. Scan through all files with comments
2. For each comment, ask: "Would a competent TypeScript developer understand this code without the comment?"
3. If yes, remove the comment
4. If no, keep or improve the comment to explain the "why" not the "what"
5. Look for complex sections lacking comments and add clarifying ones

Focus on improving signal-to-noise ratio: every comment should add genuine value.
