import { expect, test } from '@playwright/test';
import { cleanTestDatabase } from '../../../test/testPrismaClient';

test.describe('StudyNote View Page', () => {
  test.beforeEach(async () => {
    await cleanTestDatabase();
  });

  test('redirects to sign in when not authenticated', async ({ page }) => {
    await page.goto('/study-note/test-id/view');
    await page.waitForURL('**/auth/sign-in**');
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
