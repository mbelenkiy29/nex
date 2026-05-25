# Unit Test Structure

This document provides comprehensive guidelines for writing unit tests with Vitest.

## Framework and Configuration

**Framework**: Vitest with TypeScript support for backend unit tests.

**Configuration** (`packages/backend/vitest.config.ts`):

- Test files: `src/**/*.{test,spec}.ts` (colocated with source)
- Excludes: `node_modules`, `dist`, `src/**/__e2e__/**`
- Global setup: `testUnitGlobalSetup.ts`
- Setup files: `testUnitSetup.ts`
- Coverage: V8 provider with text, JSON, HTML reports
- Single-threaded execution to avoid DB conflicts
- 30-second timeout per test

## Test Utilities

**Test Utilities** (`packages/backend/src/test/testUtils.ts`):

- `createMockContext()` - Mock unauthenticated context
- `createAuthenticatedContext()` - Mock authenticated context
- `createMockRequest()` - Mock Hono request
- `createMockFile()` - Mock file uploads
- `wait()` - Async wait helper
- External service mocks: Stripe, file storage, email queue, Better Auth

**Test Factories** (`packages/backend/src/test/testFactories.ts`):

- `createTestUser()` - Create test user
- `createTestOrganization()` - Create test organization
- `createTestMember()` - Create test member
- `createTestUserWithOrganization()` - Complete setup with user, org, and member
- `createTestApiKey()` - Create test API key for a user
- `createTestAuditLog()` - Create test audit log entry

**Test Database** (`packages/backend/src/test/testPrismaClient.ts`):

- `testPrismaClient()` - Prisma client for tests (uses `prismaDangerouslyBypassRLS` to bypass Row Level Security)
- `cleanTestDatabase()` - Clean DB between tests (fast - truncates tables without rebuilding schema)
- `resetTestDatabase()` - Full DB reset with migrations (slow - use only when schema changes)
- `disconnectPrismaTestClient()` - Disconnect Prisma client (used in teardown)

## Unit Test Example

```typescript
// Unit test example: src/features/entity/__tests__/entityCreateController.test.ts
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
        code: 'TEST-001',
      },
      context,
    );

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Entity');
  });
});
```

## Key Patterns

- **Import required testing utilities**: `describe`, `it`, `expect` from vitest
- **Use test factories**: `createTestUserWithOrganization()` for complete auth setup
- **Mock context**: `createAuthenticatedContext()` for authenticated requests
- **Test database client**: `testPrismaClient()` for database operations
- **Clear assertions**: Check expected outcomes with `expect()`
- **Descriptive test names**: Use clear, action-oriented descriptions

## File Naming Conventions

- **Unit tests**: Named after the **controller name** (e.g., `entityCreateController.test.ts`)
- Tests colocated in `__tests__/` directory alongside source code
- Use `.test.ts` extension for unit tests

## Test Categories

### 1. Utility Tests

Test pure functions in isolation without external dependencies.

**Examples:**

- `formatDecimal` - Number formatting utility
- `objectRemoveEmptyNullAndUndefined` - Object cleaning utility

### 2. Schema Tests

Test Zod validation schemas with various input cases.

**Examples:**

- `booleanStringSchema` - Boolean string validation
- `dateSchema` - Date validation
- `orderBySchema` - Sort order validation

### 3. Controller Tests

Test API controllers with mocked context and dependencies.

**Examples:**

- `entityCreateController.test.ts` - Create operations
- `entityUpdateController.test.ts` - Update operations
- `entityFindManyController.test.ts` - List/query operations

### 4. Integration Tests

Test database operations with real Prisma client and test data.

**Examples:**

- `invitationLifecycle.test.ts` - Multi-step integration flows
- `chatbotLockService.test.ts` - Concurrent request handling

## Example Test Files

Real-world unit test examples from the codebase:

- `sendEmail.fallback.test.ts` - Email service tests
- `entityCreateController.test.ts` - Create controller tests
- `entityUpdateController.test.ts` - Update controller tests
- `entityDeleteManyController.test.ts` - Bulk delete controller tests
- `entityArchiveManyController.test.ts` - Bulk archive controller tests
- `entityRestoreManyController.test.ts` - Bulk restore controller tests
- `entityFindManyController.test.ts` - List/query controller tests
- `entityAutocompleteController.test.ts` - Autocomplete controller tests
- `entityImporterController.test.ts` - CSV import controller tests
- `invitationLifecycle.test.ts` - Multi-step integration tests
- `chatbotLockService.test.ts` - Concurrent request protection tests
- `subscriptionWebhook.test.ts` - Stripe webhook handler tests
- `authTrustedOrigins.test.ts` - CORS and origin validation tests

## Unit Test Best Practices

1. **Test in Isolation**: Test business logic, utilities, and schemas without external dependencies
2. **Mock Context**: Use `createAuthenticatedContext()` for controller tests
3. **Use Factories**: Leverage test factories for consistent test data setup
4. **Clean State**: Use `cleanTestDatabase()` between tests for isolation
5. **Organization Isolation**: Always test multi-tenancy with multiple organizations
6. **Mock External Services**: Mock Stripe, email, storage services in unit tests
7. **RLS Bypass**: Tests use `prismaDangerouslyBypassRLS` for easier setup
8. **Serial Execution**: Run tests serially to avoid DB race conditions
9. **Clear Assertions**: Use descriptive expect statements
10. **Fast Execution**: Keep unit tests fast by avoiding unnecessary DB operations

## Creating Test Data

**IMPORTANT**: Before creating test mocks or fixtures, always read `packages/backend/src/prisma/schema.prisma` to understand the current data model. Schema fields change over time, and test data must match required fields.

Example workflow:

1. Check the Prisma model for required fields
2. Create test data with all required fields
3. Use appropriate types (Decimal fields need numeric values)

### Prisma Decimal Fields

Prisma `Decimal` fields return `Decimal` objects, not JavaScript numbers. This preserves precision for financial/monetary values.

```typescript
// Wrong - will fail with Object.is equality
expect(result.totalPrice).toBe(100000);

// Correct - convert Decimal to number first
expect(Number(result.totalPrice)).toBe(100000);
```

## Writing Unit Tests for New Features

### 1. Start with Utility Tests

Test pure functions in isolation:

- Test with edge cases
- Validate input/output transformations
- Mock external dependencies

### 2. Add Schema Tests

Test Zod validation schemas:

- Valid inputs
- Invalid inputs
- Edge cases (empty strings, null, undefined)
- Type coercion

### 3. Write Controller Tests

Test business logic with mocked authentication:

```typescript
import { createAuthenticatedContext } from '../../../test/testUtils';
import { entityCreateController } from '../controllers/entityCreateController';

it('should create an entity', async () => {
  const { user, organization, member } = await createTestUserWithOrganization();
  const context = createAuthenticatedContext(user, organization, member);
  const result = await entityCreateController(data, context);
  expect(result.id).toBeDefined();
});
```

### 4. Write Integration Tests

Test database operations with real database:

```typescript
import { testPrismaClient } from '../../../test/testPrismaClient';

it('should retrieve entities by organization', async () => {
  const prisma = testPrismaClient();
  const entities = await prisma.entity.findMany({
    where: { organizationId: organization.id },
  });
  expect(entities).toHaveLength(2);
});
```

### 5. Test Organization Isolation

For all multi-tenant features:

- Create records in multiple organizations
- Verify data is properly scoped
- Test with both application-level and RLS filtering

### 6. Use Test Factories

For consistency:

- `createTestUserWithOrganization()` - Complete auth setup
- Create custom factories for feature-specific entities as needed

## Running Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Open Vitest UI in browser
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```
