import { expect, test } from '@playwright/test';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';

test.beforeEach(async () => {
  await cleanTestDatabase();
});

test('creator applicant creates, views, and updates their pending application', async ({
  page,
}) => {
  const prisma = testPrismaClient();
  const { email } = await signUpAndSignIn(page);
  const firstDisplayName = `Creator Applicant ${Date.now()}`;
  const updatedDisplayName = `${firstDisplayName} Updated`;

  await page.goto('/creator-application');
  await page
    .getByTestId('creator-application-legal-name')
    .fill('Creator Applicant');
  await page
    .getByTestId('creator-application-display-name')
    .fill(firstDisplayName);
  await page
    .getByTestId('creator-application-expertise')
    .fill('Certification exam preparation');
  await page
    .getByTestId('creator-application-bio')
    .fill('I coach students through high-stakes certification exams.');
  await page
    .getByTestId('creator-application-credentials')
    .fill('Certified educator with ten years of tutoring experience.');
  await page
    .getByLabel('Teaching experience')
    .fill('Ten years teaching certification prep.');
  await page
    .getByLabel('Target students')
    .fill('Students preparing for certification exams.');
  await page
    .getByLabel('Sample lesson plan')
    .fill('Warmup, guided lesson, practice set, homework review.');
  await page.getByTestId('creator-application-submit-button').click();

  await expect
    .poll(async () => {
      const user = await prisma.user.findUnique({ where: { email } });
      const application = user
        ? await prisma.creatorApplication.findUnique({
            where: { userId: user.id },
          })
        : null;

      return application?.displayName === firstDisplayName
        ? application.id
        : null;
    })
    .not.toBeNull();
  const creatorUser = await prisma.user.findUniqueOrThrow({ where: { email } });
  const createdApplication = await prisma.creatorApplication.findUniqueOrThrow({
    where: { userId: creatorUser.id },
  });
  const createdApplicationId = createdApplication.id;

  await page.reload();
  await expect(
    page.getByTestId('creator-application-display-name'),
  ).toHaveValue(firstDisplayName);
  await expect(page.getByTestId('creator-application-expertise')).toHaveValue(
    'Certification exam preparation',
  );

  await page
    .getByTestId('creator-application-display-name')
    .fill(updatedDisplayName);
  await page
    .getByTestId('creator-application-bio')
    .fill('I coach students and build structured weekly study plans.');
  await page.getByTestId('creator-application-submit-button').click();

  await expect
    .poll(async () => {
      const user = await prisma.user.findUnique({ where: { email } });
      const application = user
        ? await prisma.creatorApplication.findUnique({
            where: { userId: user.id },
          })
        : null;

      return application
        ? {
            id: application.id,
            displayName: application.displayName,
            status: application.status,
          }
        : null;
    })
    .toEqual({
      id: createdApplicationId,
      displayName: updatedDisplayName,
      status: 'pending',
    });
});
