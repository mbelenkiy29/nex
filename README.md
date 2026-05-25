# NexExam

NexExam is a multi-organization learning and exam-prep platform for students,
course creators, and platform administrators. It combines a course marketplace,
Udemy-style course builder, student learning workspace, AI study workflows,
trust and safety review, payments, and creator verification in one TypeScript
monorepo.

## Stack

- Backend: Hono API, PostgreSQL, Prisma, PgBoss workers, Better Auth, Stripe,
  S3-compatible uploads, and web push notifications.
- Frontend: React 19, Vite, TanStack Router/Query/Table, React Hook Form, and
  shadcn/ui.
- Mobile: Expo/React Native wrapper that runs the NexExam web app in a WebView
  with native push notification support.

## Workspace

- `packages/backend` - API server, Prisma schema, workers, translations, tests.
- `packages/frontend` - NexExam web application and design system.
- `packages/mobile` - Expo mobile shell.
- `packages/upload` - local MinIO setup for file uploads.
- `packages/multi-domain` - local Caddy setup for multi-tenant domains.
- `docs` - implementation references for auth, CRUD, forms, lists, views, MCP,
  chatbot, and tests.

## Getting Started

Install dependencies from the repository root:

```bash
pnpm install
```

Configure backend environment variables in `packages/backend/.env`. The source
of truth for required and optional variables is `packages/backend/src/env.ts`.
Use `packages/upload` when you need local S3-compatible file storage.

Run the web app and API:

```bash
pnpm dev:server
```

Run the full development stack, including the worker:

```bash
pnpm dev
```

## Common Commands

```bash
pnpm build                 # Build backend and frontend
pnpm typecheck             # Typecheck backend and frontend
pnpm test:backend          # Run backend unit tests
pnpm test:e2e              # Run Playwright end-to-end tests
pnpm worker:dev            # Run PgBoss worker with hot reload
pnpm translation:audit     # Report likely English fallbacks in locale files
```

Database and Prisma commands:

```bash
pnpm --filter backend prisma:generate
pnpm --filter backend db:migrate:create
pnpm --filter backend db:migrate
```

## Product Conventions

NexExam user-facing text belongs in the backend translation dictionaries under
`packages/backend/src/translation/{en,es,pt-BR,de,fr}`. Add or update all locale
files in the same change, and run the translation audit before launch-facing
copy changes ship.

Frontend UI should follow `packages/frontend/DESIGN.md`: use NexExam brand
tokens, shadcn primitives, accessible labels and focus states, restrained color,
and dictionary-driven empty/loading/error states.

Backend data access should use the RLS-aware Prisma client for tenant-scoped
queries and should audit create, update, and delete operations.
