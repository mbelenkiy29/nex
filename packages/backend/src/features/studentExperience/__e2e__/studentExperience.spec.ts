import { expect, test } from '@playwright/test';
import { signUpAndSignIn } from '../../../test/testE2eHelpers';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';

async function seedStudentExperienceCourse() {
  const prisma = testPrismaClient();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const organization = await prisma.organization.create({
    data: {
      name: `Student E2E Org ${suffix}`,
      slug: `student-e2e-org-${suffix}`,
    },
  });
  const course = await prisma.course.create({
    data: {
      title: `Student Experience E2E ${suffix}`,
      slug: `student-experience-e2e-${suffix}`,
      subtitle: 'Student dashboard course',
      category: 'Certification',
      status: 'published',
      accessType: 'free',
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
      title: 'Student dashboard lesson',
      content: 'Complete this lesson before starting practice.',
      videoFiles: [
        {
          key: 'course/videos/e2e/student-dashboard.mp4',
          name: 'student-dashboard.mp4',
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
  await prisma.courseAssignment.create({
    data: {
      title: 'Student dashboard homework',
      prompt: 'Submit one reflection for the dashboard flow.',
      dueDaysAfterEnroll: 0,
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
      lessonId: lesson.id,
    },
  });
  const exam = await prisma.exam.create({
    data: {
      organizationId: organization.id,
      name: `Student E2E Exam ${suffix}`,
      code: `SEE-${suffix}`,
      isActive: true,
      courseId: course.id,
    },
  });
  const chapter = await prisma.chapter.create({
    data: {
      organizationId: organization.id,
      title: `Student E2E Chapter ${suffix}`,
      chapterNumber: 1,
      orderIndex: 0,
      workflowStatus: 'published',
      isPublished: true,
      examId: exam.id,
      courseId: course.id,
    },
  });
  await prisma.practiceQuestion.create({
    data: {
      organizationId: organization.id,
      questionText: 'Which option should be selected in this E2E practice?',
      correctAnswerIndex: 1,
      answerOptions: ['First option', 'Correct option', 'Third option'],
      explanation: 'The second option is marked as correct.',
      difficulty: 'easy',
      category: 'Dashboard',
      isActive: true,
      chapterId: chapter.id,
      courseId: course.id,
    },
  });

  return { course };
}

test.beforeEach(async () => {
  await cleanTestDatabase();
});

test('student dashboard course experience supports learning, homework, notes, study plan, practice, and AI entry', async ({
  page,
}) => {
  const { course } = await seedStudentExperienceCourse();
  await signUpAndSignIn(page);

  await page.goto('/course');
  const courseCard = page.getByTestId('course-catalog-card').filter({
    hasText: course.title,
  });
  await courseCard.getByTestId('course-catalog-enroll-button').click();
  await expect(page).toHaveURL(/\/course\/.+\/learn/);

  await page.getByTestId('course-learn-complete-lesson-button').click();
  await page
    .getByTestId('course-learn-assignment-textarea')
    .fill('My homework reflection for the student dashboard.');
  await page.getByTestId('course-learn-submit-assignment-button').click();
  await page
    .getByTestId('course-learn-note-content-input')
    .fill('This is a lesson-scoped note.');
  await page.getByTestId('course-learn-note-submit-button').click();

  await page.goto('/student');
  await expect(
    page.getByTestId('student-dashboard-course-card').filter({
      hasText: course.title,
    }),
  ).toBeVisible();
  await page
    .getByTestId('student-dashboard-course-card')
    .filter({ hasText: course.title })
    .getByRole('link', { name: course.title })
    .click();
  await expect(page.getByTestId('student-course-overview')).toBeVisible();

  await page
    .getByTestId('student-note-title-input')
    .fill('Overview note');
  await page
    .getByTestId('student-note-content-input')
    .fill('A note created from the overview page.');
  await page.getByTestId('student-note-submit-button').click();
  await page
    .getByTestId('student-study-plan-title-input')
    .fill('Review practice answers');
  await page.getByTestId('student-study-plan-submit-button').click();
  await page.getByTestId('student-study-plan-complete-button').first().click();

  await page.goto(`/student/course/${course.id}/practice`);
  await page.getByTestId('student-practice-start-button').click();
  await page.getByTestId('student-practice-answer-option').nth(1).click();
  await page.getByTestId('student-practice-complete-button').click();
  await expect(page.getByTestId('student-practice-score')).toContainText('100');

  await page.goto('/student');
  await page.getByRole('button', { name: /Ask course tutor/i }).first().click();
  await expect(page.getByText('AI Chat')).toBeVisible();
});
