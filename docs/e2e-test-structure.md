# E2E Test Structure

This document provides comprehensive guidelines for writing end-to-end tests with Playwright.

## Framework and Configuration

**Framework**: Playwright for full-stack E2E testing.

**Configuration** (`packages/backend/playwright.config.ts`):

- Test files: `src/**/__e2e__/**/*.spec.ts`
- Base URL: `http://localhost:5173` (frontend)
- Single worker (serial execution to avoid DB conflicts)
- 30-second timeout per test, 10-second for assertions
- Automatic server startup (backend on :3011, frontend on :5173)
- Global setup/teardown for DB initialization

## Test Helpers

**E2E Test Helpers** (`packages/backend/src/test/testE2eHelpers.ts`):

- `signUpAndSignIn(page)` - Sign up new user and complete onboarding flow via UI (handles both single and multi-organization modes)

## Test Environment

- Uses `.env.test` for configuration
- Separate test database (configured via `DATABASE_BYPASS_RLS_URL` in `.env.test`)
- Redis connection for session storage and queues
- Row Level Security enabled on test database

## E2E Test Example

```typescript
// E2E test example: src/features/auth/__e2e__/signIn.spec.ts
// Note: E2E test files must be named after the page name (signIn.spec.ts for Sign In page)
import { test, expect } from '@playwright/test';
import { cleanTestDatabase } from '../../../test/testPrismaClient';

test.describe('Sign In Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  test('sign in page loads', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page).toHaveTitle(/Sign In/i);
    await expect(page.getByTestId('auth-signin-submit-button')).toBeVisible();
  });
});
```

## Key Patterns

- **Clean state**: Use `cleanTestDatabase()` in `beforeEach` for test isolation
- **Use data-testid**: Select elements via `data-testid` attributes
- **Test user flows**: Navigate through complete user interactions
- **Descriptive test blocks**: Use `test.describe()` to group related tests
- **Playwright assertions**: Leverage Playwright's async assertion methods

## File Naming Conventions

- **E2E tests**: Named after the **page name** (e.g., `entityNew.spec.ts`)
- Tests located in `__e2e__/` directory within feature directories
- Use `.spec.ts` extension for E2E tests

## E2E Test Categories

1. **Authentication**: Sign in/up, password reset, email verification, OAuth
2. **Authorization**: Permission checks, role-based access
3. **CRUD Operations**: Create, read, update, delete flows
4. **Forms**: Form validation, submission, error handling
5. **Navigation**: Route transitions, breadcrumbs, redirects
6. **Data Tables**: Filtering, sorting, pagination, bulk operations
7. **CSV Import**: File upload, validation, import processing
8. **Subscription**: Stripe checkout, customer portal
9. **Multi-tenancy**: Organization switching, member invitations

## E2E Test Files

Test files organized by feature (named after page names):

### Authentication (`auth/`)

- `signIn.spec.ts` - Sign in page
- `signUp.spec.ts` - Sign up page
- `signOut.spec.ts` - Sign out flow
- `passwordResetRequest.spec.ts` - Password reset request
- `passwordResetConfirm.spec.ts` - Password reset confirmation
- `passwordChange.spec.ts` - Password change
- `emailChange.spec.ts` - Email change
- `profile.spec.ts` - Profile page
- `profileOnboard.spec.ts` - Profile onboarding
- `organization.spec.ts` - Organization selection
- `invitation.spec.ts` - Invitation acceptance
- `verifyEmailRequest.spec.ts` - Email verification request
- `verifyEmailConfirm.spec.ts` - Email verification confirmation

### Organization (`organization/`)

- `organizationNew.spec.ts` - Create organization
- `organizationEdit.spec.ts` - Edit organization

### Entity (`entity/`)

- `entityList.spec.ts` - Entity list page
- `entityNew.spec.ts` - Create entity
- `entityEdit.spec.ts` - Edit entity
- `entityView.spec.ts` - Entity detail page
- `entityImporter.spec.ts` - CSV import

### Member (`member/`)

- `memberList.spec.ts` - Member list page
- `memberNew.spec.ts` - Invite member
- `memberEdit.spec.ts` - Edit member
- `memberView.spec.ts` - Member detail page
- `memberImporter.spec.ts` - CSV import

### Other Features

- `invitation/invitationView.spec.ts` - Invitation detail
- `apiKey/apiKeyList.spec.ts` - API key list
- `apiKey/apiKeyNew.spec.ts` - Create API key
- `apiKey/apiKeyEdit.spec.ts` - Edit API key
- `auditLog/auditLogList.spec.ts` - Audit log viewer
- `subscription/subscription.spec.ts` - Subscription management
- `dashboard/dashboard.spec.ts` - Dashboard
- `apiDocs/apiDocs.spec.ts` - API documentation
- `mcp/mcpDocs.spec.ts` - MCP documentation

## E2E Test Best Practices

1. **Test Complete User Flows**: Test from UI through to database
2. **Clean State**: Use `cleanTestDatabase()` in `beforeEach` for test isolation
3. **Use Test IDs**: Add `data-testid` attributes for reliable element selection
4. **Test User Journeys**: Focus on real user scenarios and workflows
5. **Serial Execution**: Run E2E tests serially to avoid DB conflicts
6. **Test Helpers**: Use `signUpAndSignIn(page)` for authenticated test setup
7. **Descriptive Tests**: Use clear test descriptions that explain the user action
8. **Assertions First**: Use Playwright's built-in async assertions (auto-retry)
9. **Avoid Timeouts**: Use Playwright's waiting mechanisms instead of fixed delays
10. **Test Data Cleanup**: Ensure tests clean up after themselves

## Creating Test Data

**IMPORTANT**: Before creating test fixtures or seed data, always read `packages/backend/src/prisma/schema.prisma` to understand the current data model. Schema fields change over time, and test data must include all required fields.

## Writing E2E Tests for New Features

### 1. Setup Test File

Create test file in `__e2e__/` directory, named after the page:

```typescript
import { test, expect } from '@playwright/test';
import { cleanTestDatabase } from '../../../test/testPrismaClient';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';

test.describe('Feature Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  // Tests go here
});
```

### 2. Test Page Load

Verify page loads and displays key elements:

```typescript
test('feature page loads', async ({ page }) => {
  await signUpAndSignIn(page);
  await page.goto('/feature');
  await expect(page.getByTestId('page-header-title')).toBeVisible();
  await expect(page.getByTestId('feature-list-table')).toBeVisible();
});
```

### 3. Test Create Flow

Test creating new records:

```typescript
test('create new feature', async ({ page }) => {
  await signUpAndSignIn(page);
  await page.goto('/feature');

  // Click create button
  await page.getByTestId('feature-new-button').click();
  await expect(page).toHaveURL('/feature/new');

  // Fill form
  await page.getByTestId('feature-name-input').fill('Test Feature');
  await page.getByTestId('feature-description-input').fill('Test Description');

  // Submit
  await page.getByTestId('feature-submit-button').click();

  // Verify redirect and success
  await expect(page).toHaveURL(/\/feature\/[a-f0-9-]+/);
  await expect(page.getByText('Feature created successfully')).toBeVisible();
});
```

### 4. Test Edit Flow

Test editing existing records:

```typescript
test('edit existing feature', async ({ page }) => {
  await signUpAndSignIn(page);

  // Create test data first (or use existing)
  await page.goto('/feature/new');
  await page.getByTestId('feature-name-input').fill('Original Name');
  await page.getByTestId('feature-submit-button').click();

  // Navigate to edit
  await page.getByTestId('feature-actions-edit').click();
  await expect(page).toHaveURL(/\/feature\/[a-f0-9-]+\/edit/);

  // Update data
  await page.getByTestId('feature-name-input').fill('Updated Name');
  await page.getByTestId('feature-submit-button').click();

  // Verify update
  await expect(page.getByText('Feature updated successfully')).toBeVisible();
  await expect(page.getByText('Updated Name')).toBeVisible();
});
```

### 5. Test Delete Flow

Test deleting records:

```typescript
test('delete feature', async ({ page }) => {
  await signUpAndSignIn(page);

  // Create test data
  await page.goto('/feature/new');
  await page.getByTestId('feature-name-input').fill('To Delete');
  await page.getByTestId('feature-submit-button').click();

  // Delete
  await page.getByTestId('feature-actions-delete').click();
  await page.getByTestId('confirm-dialog-confirm').click();

  // Verify deletion
  await expect(page.getByText('Feature deleted successfully')).toBeVisible();
  await expect(page).toHaveURL('/feature');
});
```

### 6. Test Validation

Test form validation and error handling:

```typescript
test('validates required fields', async ({ page }) => {
  await signUpAndSignIn(page);
  await page.goto('/feature/new');

  // Submit without filling required fields
  await page.getByTestId('feature-submit-button').click();

  // Verify error messages
  await expect(page.getByText('Name is required')).toBeVisible();
});
```

### 7. Test Data Tables

Test filtering, sorting, pagination:

```typescript
test('filters feature list', async ({ page }) => {
  await signUpAndSignIn(page);
  await page.goto('/feature');

  // Apply filter
  await page.getByTestId('feature-filter-name').fill('Test');
  await page.getByTestId('feature-filter-submit').click();

  // Verify filtered results
  await expect(page.getByTestId('feature-list-table')).toBeVisible();
  await expect(page.getByText('Test Feature')).toBeVisible();
});
```

## Running E2E Tests

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Open Playwright UI
pnpm test:e2e:ui

# Run E2E tests with browser visible
pnpm test:e2e:headed
```

## Debugging E2E Tests

### Using Playwright UI

The Playwright UI provides a visual debugger:

```bash
pnpm test:e2e:ui
```

### Running with Headed Browser

See the browser during test execution:

```bash
pnpm test:e2e:headed
```

### Using Debug Mode

Step through tests interactively:

```bash
npx playwright test --debug
```

### Screenshots and Videos

Playwright automatically captures:

- Screenshots on test failure
- Videos of test execution (in CI)
- Traces for debugging

### Common Issues

**Issue**: Test timeout
**Solution**: Increase timeout or use proper waiting mechanisms

**Issue**: Element not found
**Solution**: Verify `data-testid` attributes, check element visibility

**Issue**: Flaky tests
**Solution**: Use Playwright's auto-waiting, avoid fixed timeouts

**Issue**: Database conflicts
**Solution**: Ensure `cleanTestDatabase()` in `beforeEach`, run serially
