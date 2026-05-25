import { expect, test, type Page, type Route } from '@playwright/test';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';

async function seedPublishedCourse(
  title: string,
  overrides: Partial<{
    accessType: 'free' | 'manual' | 'paid' | 'subscription';
    priceCents: number;
    currency: string;
    examType: string;
  }> = {},
) {
  const prisma = testPrismaClient();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const course = await prisma.course.create({
    data: {
      title,
      slug: `e2e-course-${suffix}`,
      subtitle: 'E2E exam prep course',
      description: 'Published course for the student happy path.',
      category: 'Certification',
      examType: overrides.examType || null,
      status: 'published',
      accessType: overrides.accessType || 'free',
      priceCents: overrides.priceCents ?? null,
      currency: overrides.currency || 'USD',
      nexVerified: true,
      publishedAt: new Date(),
    },
  });
  const module = await prisma.courseModule.create({
    data: {
      title: 'Orientation',
      orderIndex: 0,
      courseId: course.id,
    },
  });
  const lesson = await prisma.courseLesson.create({
    data: {
      title: 'Welcome lesson',
      content: 'Review the course goals and complete the opening homework.',
      videoFiles: [
        {
          key: 'course/videos/e2e/welcome.mp4',
          name: 'welcome.mp4',
          signedUrl: 'data:video/mp4;base64,AAAA',
          size: 4,
          type: 'video/mp4',
        },
      ],
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
    },
  });
  const assignment = await prisma.courseAssignment.create({
    data: {
      title: 'Opening reflection',
      prompt: 'Summarize your study goal.',
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
      lessonId: lesson.id,
    },
  });

  return { course, lesson, assignment };
}

async function mockCourseVideoUpload(page: Page) {
  await page.route('**/api/file/upload', async (route: Route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    const body = request.postDataJSON();
    if (body.route !== 'courseVideos') {
      await route.continue();
      return;
    }

    const files = body.files || [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        files: files.map((file: any) => ({
          signedUrl: `http://localhost:5173/__e2e-upload/${file.name}`,
          file: {
            ...file,
            objectInfo: {
              key: `course/videos/e2e/${file.name}`,
              metadata: {},
            },
          },
          headers: {},
        })),
        metadata: {
          files: files.map((file: any) => ({
            key: `course/videos/e2e/${file.name}`,
            name: file.name,
            signedUrl: 'data:video/mp4;base64,AAAA',
            size: file.size,
            type: file.type,
          })),
        },
      }),
    });
  });

  await page.route('**/__e2e-upload/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      headers: { etag: '"e2e-upload"' },
      body: '',
    });
  });
}

test.beforeEach(async () => {
  await cleanTestDatabase();
});

test('student signs up, enrolls, completes a lesson, submits homework, and opens the AI tutor', async ({
  page,
}) => {
  const title = `Student Happy Path ${Date.now()}`;
  const paidTitle = `Paid Metadata Path ${Date.now()}`;
  await seedPublishedCourse(title);
  await seedPublishedCourse(paidTitle, {
    accessType: 'paid',
    priceCents: 4900,
    examType: 'Paid certification',
  });
  await signUpAndSignIn(page);

  await page.goto('/course');
  const paidCourseCard = page.getByTestId('course-catalog-card').filter({
    hasText: paidTitle,
  });
  await expect(paidCourseCard).toBeVisible();
  await expect(paidCourseCard).toContainText('$49.00');
  await expect(
    paidCourseCard.getByTestId('course-catalog-enroll-button'),
  ).toBeDisabled();

  const courseCard = page.getByTestId('course-catalog-card').filter({
    hasText: title,
  });
  await expect(courseCard).toBeVisible();
  await courseCard.getByTestId('course-catalog-enroll-button').click();

  await expect(page).toHaveURL(/\/course\/.+\/learn/);
  await expect(page.locator('video')).toBeVisible();
  await page.getByTestId('course-learn-complete-lesson-button').click();
  await expect(
    page.getByTestId('course-learn-complete-lesson-button'),
  ).toBeDisabled();

  await page
    .getByTestId('course-learn-assignment-textarea')
    .fill('My study goal is to finish the full course loop.');
  await page.getByTestId('course-learn-submit-assignment-button').click();
  await expect(
    page.getByTestId('course-learn-submit-assignment-button'),
  ).toBeDisabled();

  await expect(page.getByTestId('course-learn-tutor-input')).toBeVisible();
  await page
    .getByTestId('course-learn-tutor-input')
    .fill('Help me study this lesson.');
  await expect(page.getByTestId('course-learn-tutor-button')).toBeEnabled();
});

test('platform admin creates a published course, reviews creator/homework items, and creates a payout', async ({
  page,
}) => {
  const prisma = testPrismaClient();
  const courseTitle = `Admin Course ${Date.now()}`;

  await mockCourseVideoUpload(page);
  const adminCredentials = await signUpAndSignIn(page, {
    email: 'platform-admin@example.com',
  });
  const adminAccount = await prisma.user.findUniqueOrThrow({
    where: { email: adminCredentials.email },
    include: { members: true },
  });
  const organizationId = adminAccount.members[0].organizationId;
  await page.goto('/admin/courses');

  await page.getByTestId('admin-course-new-button').click();
  await page.getByTestId('admin-course-title-input').fill(courseTitle);
  await page
    .getByTestId('admin-course-status-select')
    .selectOption('published');
  await page
    .getByTestId('admin-course-exam-type-input')
    .fill('Professional certification');
  await page.getByTestId('admin-course-access-select').selectOption('paid');
  await page.getByTestId('admin-course-price-cents-input').fill('19900');
  await page.getByTestId('admin-course-stripe-price-input').fill('price_e2e');
  await page.getByTestId('admin-course-revenue-share-input').fill('7500');
  await page
    .getByTestId('admin-course-intro-video-upload')
    .locator('input[type="file"]')
    .setInputFiles({
      name: 'intro-uploaded.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from([0, 0, 0, 0]),
    });
  await expect(page.getByText('intro-uploaded.mp4')).toBeVisible();
  await page.getByTestId('admin-course-add-module-button').click();
  await page
    .getByTestId('admin-course-module-title-input')
    .last()
    .fill('Module A');
  await page.getByTestId('admin-course-add-lesson-button').click();
  await page
    .getByTestId('admin-course-lesson-title-input')
    .last()
    .fill('Lesson A');
  await page
    .getByTestId('admin-course-lesson-content-input')
    .last()
    .fill('Lesson content created by the admin.');
  await page
    .getByTestId('admin-course-lesson-video-upload')
    .locator('input[type="file"]')
    .setInputFiles({
      name: 'admin-uploaded.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from([0, 0, 0, 0]),
    });
  await expect(page.getByText('admin-uploaded.mp4')).toBeVisible();
  await page.getByTestId('admin-course-add-assignment-button').click();
  await page
    .getByTestId('admin-course-assignment-title-input')
    .last()
    .fill('Homework A');
  await page
    .getByTestId('admin-course-assignment-prompt-input')
    .last()
    .fill('Submit one study reflection.');
  await page.getByTestId('admin-course-save-button').click();

  await expect
    .poll(async () => {
      return await prisma.course.findFirst({
        where: { title: courseTitle, status: 'published' },
      });
    })
    .not.toBeNull();

  const course = await prisma.course.findFirstOrThrow({
    where: { title: courseTitle },
    include: { assignments: true, lessons: true },
  });
  expect(course.accessType).toBe('paid');
  expect(course.priceCents).toBe(19900);
  expect(course.stripePriceId).toBe('price_e2e');
  expect(course.examType).toBe('Professional certification');
  expect(course.creatorRevenueShareBps).toBe(7500);
  expect((course.introVideoFiles as any[])[0].name).toBe(
    'intro-uploaded.mp4',
  );

  const legacyExam = await prisma.exam.create({
    data: {
      organizationId,
      name: 'Linked exam',
      code: `linked-${Date.now()}`,
      isActive: true,
      courseId: course.id,
    },
  });
  const legacyChapter = await prisma.chapter.create({
    data: {
      organizationId,
      title: 'Linked chapter',
      chapterNumber: 1,
      xpReward: 10,
      orderIndex: 0,
      workflowStatus: 'draft',
      isPublished: false,
      courseId: course.id,
      examId: legacyExam.id,
    },
  });
  await prisma.practiceQuestion.create({
    data: {
      organizationId,
      questionText: 'Linked question?',
      correctAnswerIndex: 0,
      explanation: 'Linked to a Phase 2 course.',
      difficulty: 'easy',
      category: 'Linked content',
      isActive: true,
      courseId: course.id,
      chapterId: legacyChapter.id,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: `student-${Date.now()}@example.com`,
      name: 'Student Reviewer',
      emailVerified: true,
    },
  });
  await prisma.courseEnrollment.create({
    data: {
      courseId: course.id,
      userId: student.id,
      status: 'active',
    },
  });
  await prisma.courseAssignmentSubmission.create({
    data: {
      courseId: course.id,
      assignmentId: course.assignments[0].id,
      userId: student.id,
      text: 'Ready for review.',
      status: 'submitted',
    },
  });

  const creator = await prisma.user.create({
    data: {
      email: `creator-${Date.now()}@example.com`,
      name: 'Creator Applicant',
      emailVerified: true,
    },
  });
  const application = await prisma.creatorApplication.create({
    data: {
      userId: creator.id,
      displayName: 'Creator Applicant',
      bio: 'Course professional',
      credentials: 'Certified teacher',
      expertise: 'Certification exams',
      links: [],
      payoutContact: 'creator@example.com',
      status: 'pending',
    },
  });

  await page.goto('/admin/courses');
  const adminCourse = page.getByTestId('admin-course-list-item').filter({
    hasText: courseTitle,
  });
  await adminCourse.click();
  await expect(page.getByText('admin-uploaded.mp4')).toBeVisible();
  await expect(
    page.getByTestId('admin-course-linked-count-exams'),
  ).toContainText('1');
  await expect(
    page.getByTestId('admin-course-linked-count-chapters'),
  ).toContainText('1');
  await expect(
    page.getByTestId('admin-course-linked-count-practice-questions'),
  ).toContainText('1');
  await page
    .getByTestId('admin-course-review-status-select')
    .selectOption('complete');
  await page
    .getByTestId('admin-course-review-feedback-input')
    .fill('Reviewed and complete.');
  await page.getByTestId('admin-course-review-submission-button').click();
  await expect
    .poll(async () => {
      const stored = await prisma.courseAssignmentSubmission.findFirst({
        where: { courseId: course.id, userId: student.id },
      });
      return stored?.status;
    })
    .toBe('complete');

  await page.goto('/admin/creator-applications');
  await expect(
    page.getByTestId('admin-creator-application-card'),
  ).toBeVisible();
  await page
    .getByTestId('admin-creator-application-notes-input')
    .fill('Approved for Phase 1.');
  await page.getByTestId('admin-creator-application-approve-button').click();
  await expect
    .poll(async () => {
      const stored = await prisma.creatorApplication.findUnique({
        where: { id: application.id },
      });
      return stored?.status;
    })
    .toBe('approved');

  await page.goto('/admin');
  await page.getByTestId('admin-payout-creator-input').fill(creator.id);
  await page.getByTestId('admin-payout-amount-input').fill('125');
  await page
    .getByTestId('admin-payout-description-input')
    .fill('Manual payout for reviewed course support.');
  await page.getByTestId('admin-payout-create-button').click();
  await expect
    .poll(async () => {
      return await prisma.creatorPayout.count({
        where: { creatorUserId: creator.id, amount: 125 },
      });
    })
    .toBe(1);
});
