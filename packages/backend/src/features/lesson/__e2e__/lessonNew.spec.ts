import { expect, test } from '@playwright/test';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';
import { cleanTestDatabase } from '../../../test/testPrismaClient';

test.describe('Lesson New Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  test('lesson new page loads when authenticated', async ({ page }) => {
    await signUpAndSignIn(page);

    await page.goto('/lesson/new');
    await expect(page).toHaveURL(new RegExp(`\\/${'lesson'}\\/new`));
    await expect(page.getByTestId('page-header-title')).toBeVisible();
  });

  test('redirects to sign in when not authenticated', async ({ page }) => {
    await page.goto('/lesson/new');
    await page.waitForURL('**/auth/sign-in**');
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
