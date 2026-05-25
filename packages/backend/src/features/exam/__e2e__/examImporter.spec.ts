import { expect, test } from '@playwright/test';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';
import { cleanTestDatabase } from '../../../test/testPrismaClient';

test.describe('Exam Importer Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  test('exam importer page loads when authenticated', async ({ page }) => {
    await signUpAndSignIn(page);

    await page.goto('/exam/importer');
    await expect(page).toHaveURL(new RegExp(`\\/${'exam'}\\/importer`));
    await expect(page.getByTestId('page-header-title')).toBeVisible();
  });

  test('redirects to sign in when not authenticated', async ({ page }) => {
    await page.goto('/exam/importer');
    await page.waitForURL('**/auth/sign-in**');
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
