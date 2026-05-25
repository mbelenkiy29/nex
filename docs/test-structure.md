# Test Structure

This document provides an overview of testing in the project. For detailed information, see the specialized guides:

- **[Unit Test Structure](unit-test-structure.md)** - Vitest configuration, utilities, patterns, and examples
- **[E2E Test Structure](e2e-test-structure.md)** - Playwright configuration, patterns, and end-to-end testing guide

## Overview

The project has comprehensive test coverage with both unit tests (Vitest) and end-to-end tests (Playwright).

### Unit Tests (Vitest)

- **Purpose**: Test business logic, utilities, schemas, and controllers in isolation
- **Location**: Colocated with source in `__tests__/` directories
- **Naming**: Named after controller (e.g., `featureCreateController.test.ts`)
- **Framework**: Vitest with TypeScript support
- **See**: [Unit Test Structure](unit-test-structure.md) for complete guide

### E2E Tests (Playwright)

- **Purpose**: Test complete user flows from UI through to database
- **Location**: In `__e2e__/` directories within features
- **Naming**: Named after page (e.g., `featureNew.spec.ts`)
- **Framework**: Playwright for full-stack testing
- **See**: [E2E Test Structure](e2e-test-structure.md) for complete guide

## Test Best Practices

1. **Unit Tests**: Test business logic, utilities, schemas in isolation
2. **Controller Tests**: Mock context, test request/response handling
3. **Integration Tests**: Test database operations with real Prisma client
4. **E2E Tests**: Test complete user flows from UI to database
5. **Clean State**: Use `cleanTestDatabase()` between tests (fast truncate)
6. **Factories**: Use test factories for consistent test data
7. **Organization Isolation**: Test multi-tenancy with multiple orgs
8. **Mocking**: Mock external services (Stripe, email, storage) in unit tests
9. **Test Data**: Use `data-testid` attributes for E2E element selection
10. **Serial Execution**: Run tests serially to avoid DB race conditions
11. **RLS Bypass**: Tests use `prismaDangerouslyBypassRLS` for easier setup
12. **Test Database Safety**: Test DB URLs must contain `-test` or `_test`
13. **Schema First**: Read `schema.prisma` before creating test data to understand required fields
14. **Decimal Types**: Prisma `Decimal` fields return objects, use `Number(value)` for comparisons

## Running Tests

### Unit Tests

```bash
pnpm test                  # Run once
pnpm test:watch            # Watch mode
pnpm test:ui               # Vitest UI
pnpm test:coverage         # With coverage
```

### E2E Tests

```bash
pnpm test:e2e              # Run headless
pnpm test:e2e:ui           # Playwright UI
pnpm test:e2e:headed       # With visible browser
```

## Quick Start Guide

### Writing Your First Unit Test

1. Create test file in `__tests__/` directory
2. Name it after the controller: `myFeatureController.test.ts`
3. Follow the pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { createTestUserWithOrganization } from '../../../test/testFactories';

describe('MyFeatureController', () => {
  it('should perform action', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);

    // Test your controller
    const result = await myFeatureController(data, context);

    expect(result).toBeDefined();
  });
});
```

**See [Unit Test Structure](unit-test-structure.md) for detailed guide.**

### Writing Your First E2E Test

1. Create test file in `__e2e__/` directory
2. Name it after the page: `myFeaturePage.spec.ts`
3. Follow the pattern:

```typescript
import { test, expect } from '@playwright/test';
import { cleanTestDatabase } from '../../../test/testPrismaClient';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';

test.describe('My Feature Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  test('page loads and displays data', async ({ page }) => {
    await signUpAndSignIn(page);
    await page.goto('/my-feature');

    await expect(page.getByTestId('page-header-title')).toBeVisible();
  });
});
```

**See [E2E Test Structure](e2e-test-structure.md) for detailed guide.**
