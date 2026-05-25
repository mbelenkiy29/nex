# Entity CRUD Reference

This file contains comprehensive examples of implementing CRUD operations. Use these patterns when building new features with similar requirements.

## Overview

This serves as the **canonical example** of a complete CRUD implementation with all possible field types, relationships, and operations.

**Use this reference when:**

- Implementing a new entity with CRUD operations
- Understanding how different field types are handled (text, number, date, enums, relationships, files, etc.)
- Building list pages with filtering, sorting, pagination, and bulk operations
- Creating forms with comprehensive validation
- Implementing CSV import/export
- Adding autocomplete inputs for relationships
- Working with multi-field filters

## Related Documentation

For frontend-specific patterns, see:

- **[Frontend Form Patterns](frontend-form-patterns.md)** - Form component with all field types
- **[Frontend List Patterns](frontend-list-patterns.md)** - Data table and list column patterns
- **[Frontend View Patterns](frontend-view-patterns.md)** - View page, filter, actions, link, new button, CSV export patterns

## Backend Structure

### Route Handler Pattern

```typescript
// features/entity/entityApiRoutes.ts
import { Hono } from 'hono';
import { ApiResponseError } from '@/shared/controller/ApiResponseError';
import { ApiResponseSuccess } from '@/shared/controller/ApiResponseSuccess';
import { appContext } from '@/shared/controller/appContext';
import { parseHonoQuery } from '@/shared/lib/parseHonoQuery';
import { entityCreateController } from './controllers/entityCreateController';
import { entityFindManyController } from './controllers/entityFindManyController';
import { entityUpdateController } from './controllers/entityUpdateController';

export const entityRoutes = new Hono();

// Create
entityRoutes.post('/', async (c) => {
  let context;
  try {
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await entityCreateController(body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// List with filters
entityRoutes.get('/', async (c) => {
  let context;
  try {
    context = await appContext(c);
    const query = parseHonoQuery(c.req.query());
    const payload = await entityFindManyController(query, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// Update
entityRoutes.put('/:id', async (c) => {
  let context;
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    context = await appContext(c);
    const payload = await entityUpdateController({ id }, body, context);
    return ApiResponseSuccess(c, context, payload);
  } catch (error: any) {
    return ApiResponseError(c, context, error);
  }
});

// IMPORTANT: Route ordering matters
// Specific routes MUST come before parameterized routes:
entityRoutes.get('/', ...);              // List - order doesn't matter
entityRoutes.get('/autocomplete', ...);  // MUST come before /:id
entityRoutes.post('/', ...);             // Create - order doesn't matter
entityRoutes.post('/importer', ...);     // MUST come before /:id
entityRoutes.put('/archive', ...);       // Bulk operations before /:id
entityRoutes.delete('/', ...);           // Bulk operations before /:id
entityRoutes.get('/:id', ...);           // Parameterized route comes after
entityRoutes.put('/:id', ...);           // Parameterized route comes after
```

### Schemas

```typescript
// features/entity/entitySchemas.ts
import { z } from 'zod';

export const entityCreateSchema = z.object({
  name: z.string().min(1).max(255),
  contact: z.string().email(),
  status: z.enum(['active', 'inactive']).optional(),
  // ... other fields
});

export type EntityCreateInput = z.infer<typeof entityCreateSchema>;
```

### Controller Pattern

```typescript
// features/entity/controllers/entityCreateController.ts
import { authGuardBackend } from '@/features/auth/authGuardBackend';
import { entityPermissions } from '../entityPermissions';
import { entityCreateSchema } from '../entitySchemas';
import { AppContext } from '@/shared/controller/appContext';

// OpenAPI documentation
export const entityCreateApiDoc: RouteConfig = {
  method: 'post',
  path: '/api/entity',
  body: entityCreateInputSchema,
  response: 'Entity',
};

// MCP tool definition
export const entityCreateMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'entity_create',
  description: dictionary.entity.mcpDescription.create,
  requiredPermissions: { entity: ['create'] },
  schema: toMcpJsonSchema(entityCreateInputSchema),
  handler: async (params, context) => {
    return await entityCreateController(params, context);
  },
});

// Public controller with auth guard
export async function entityCreateController(
  body: unknown,
  context: AppContext,
) {
  await authGuardBackend({ entity: ['create'] }, context);
  return await entityCreate(body, context);
}

// Internal implementation
async function entityCreate(body: unknown, context: AppContext) {
  const { currentOrganization } = await authGuardBackend(
    { entity: ['create'] },
    context,
  );

  // Validate input with Zod schema
  const data = entityCreateInputSchema.parse(body);

  // Implementation with RLS, audit logging, etc.
  // ...
}
```

### Multi-Tenancy with RLS

```typescript
// Application-level filtering (manual)
const entities = await prisma.entity.findMany({
  where: {
    organizationId: context.currentOrganization.id,
    // ... other filters
  },
});

// Database-level filtering (recommended with RLS)
const entities = await prisma.$withRLS(
  { organization: context.currentOrganization },
  async (tx) => {
    return await tx.entity.findMany({
      where: { name: { contains: filter.name } },
    });
  },
);
```

### Audit Logging

```typescript
import { auditLogCreate } from '@/features/auditLog/auditLogCreate';

// After create/update/delete operations
await auditLogCreate({
  entityName: 'entity',
  entityId: entity.id,
  action: 'create',
  values: entity,
  context,
});
```

### Member Relationship Handling

When including relationships in Prisma queries for audit logging:

**Pattern:**

- Check if related entity is 'member'
- For member relationships: Include fullName and user.email
- For other relationships: Include display field only

**Example generated code for member relationship:**

```typescript
owner: {
  select: {
    id: true,
    fullName: true,     // Member-specific fields for audit logs
    user: {
      select: {
        email: true,    // Nested user email for complete identity
      },
    },
  },
}
```

**Example generated code for regular relationship:**

```typescript
category: {
  select: {
    id: true,
    name: true,  // Display field from entity.properties.display
  },
}
```

**Why:**

- Audit logs need human-readable member info: "John Doe (john@example.com)"
- Regular entities only need their display field (e.g., product name)
- Member relationships require fullName + user.email for complete tracking

## Frontend Structure

### Router Configuration

```typescript
// features/entity/entityRouter.ts
import { createRoute } from '@tanstack/react-router';
import { authenticatedRoute } from '@/shared/routes/authenticatedRoute';
import { buildPageTitle } from '@/shared/lib/buildPageTitle';
import { authGuardFrontend } from '@/features/auth/authGuardFrontend';
import { useAuthStore } from '@/shared/stores/authStore';

export const entityEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/entity/$id/edit',
  head: () => ({
    meta: [{ title: buildPageTitle('Edit Entity') }],
  }),
  beforeLoad: async ({ location }) => {
    const { currentUser, currentMember } = useAuthStore.getState();
    authGuardFrontend(
      { currentUser, currentMember },
      { entity: ['update'] },
      location.pathname,
    );
  },
}).lazy(() =>
  import('./pages/EntityEditPage').then((d) => d.entityEditLazyRoute),
);

// Export array of all routes for registration
export const entityRouter = [entityListRoute, entityEditRoute /* ... */];
```

### Page Component

```typescript
// features/entity/pages/EntityEditPage.tsx
import { createLazyRoute } from '@tanstack/react-router';
import { entityEditRoute } from '../entityRouter';

export const entityEditLazyRoute = createLazyRoute('/entity/$id/edit')({
  component: EntityEditPage,
});

export function EntityEditPage() {
  // Access route params via imported route
  const { id } = entityEditRoute.useParams();

  // Access search params
  const { referrer } = entityEditRoute.useSearch();

  // Component implementation
  // ...
}
```

## Testing Examples

### Unit Test (Backend)

```typescript
// features/entity/__tests__/entityCreateController.test.ts
import { describe, it, expect } from 'vitest';
import { testPrismaClient } from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { entityCreateController } from '../controllers/entityCreateController';

describe('EntityCreateController', () => {
  it('should create an entity', async () => {
    const prisma = testPrismaClient();
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);

    const result = await entityCreateController(
      {
        name: 'Test Entity',
        contact: 'test@example.com',
      },
      context,
    );

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Entity');
  });
});
```

### E2E Test (Playwright)

```typescript
// features/entity/__e2e__/entityList.spec.ts
import { test, expect } from '@playwright/test';
import { cleanTestDatabase } from '../../../test/testPrismaClient';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';

test.describe('Entity List Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  test('entity list page loads', async ({ page }) => {
    await signUpAndSignIn(page);
    await page.goto('/entity');
    await expect(page.getByTestId('page-header-title')).toBeVisible();
  });
});
```

## Field Type Examples

This demonstrates all possible field types:

### Text Fields

- `name` - Basic string input
- `code` - String input with specific format

### Numeric Fields

- `year` - Integer input with range
- `amount` - Decimal input with precision

### Date/Time Fields

- `date` - Date-only field
- `timestamp` - DateTime field with timezone

### Enum Fields

- `category` - Single select from enum
- `tags` - Multi-select from enum array
- `status` - Single select with default value

### Boolean Fields

- `active` - Simple yes/no boolean
- `archivedAt` - Soft delete timestamp (archived filter)

### File Fields

- `images` - Multiple image uploads
- `documents` - Multiple file uploads

### Relationship Fields

- `relatedEntity` - One-to-one relationship
- `owner` - Many-to-one relationship
- `items` - One-to-many relationship
- `associations` - Many-to-many relationship

## Import Paths Reference

When working with entity feature in frontend:

```typescript
// ✅ Correct imports
import { EntityWithRelationships } from '@project/backend/features/entity/entitySchemas';
import { entityLabel } from '@project/backend/features/entity/entityLabel';
import { entityEnumerators } from '@project/backend/features/entity/entityEnumerators';
import { entityExporterMapper } from '@/features/entity/entityExporterMapper';
import { EntityAutocompleteInput } from '@/features/entity/components/EntityAutocompleteInput';

// ❌ Wrong imports (NEVER do these)
import type { Entity } from '@prisma/client'; // Wrong - use prismaTypes
import { entityExporterMapper } from '@project/backend/features/entity/entityExporterMapper'; // Wrong - exporter is frontend-only
```

## Quick Reference Checklist

When implementing a new CRUD feature:

**Backend:**

- [ ] Create feature directory structure
- [ ] Define Zod schemas with all field types
- [ ] Implement controllers (create, read, update, delete, archive, restore, autocomplete, import)
- [ ] Add route handlers with proper ordering
- [ ] Configure OpenAPI documentation
- [ ] Add MCP tool definitions
- [ ] Implement permissions guard
- [ ] Add audit logging
- [ ] Use RLS for multi-tenancy
- [ ] Write unit tests for controllers
- [ ] Write E2E tests for pages

**Frontend:**

- [ ] Create feature directory structure
- [ ] Configure router with lazy-loaded pages
- [ ] Implement list page with DataTable
- [ ] Create comprehensive filter component
- [ ] Build form component with all field types
- [ ] Add actions component (table + view modes)
- [ ] Create link component for references
- [ ] Add new button component
- [ ] Implement autocomplete components (single + multiple)
- [ ] Add CSV exporter mapper
- [ ] Add data-testid attributes for E2E testing
