import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  courseBuilderCreateController,
  courseBuilderGetController,
  courseBuilderSubmitForReviewController,
  courseBuilderUpdateController,
  courseBuilderWithdrawController,
} from '../courseBuilderControllers';
import {
  courseEnrollController,
  courseQuizAttemptController,
  platformAdminCourseReviewController,
} from '../courseControllers';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { env } from '../../../env';

function ensurePlatformAdmin(email: string) {
  const normalized = email.toLowerCase();
  if (!env.PLATFORM_ADMIN_EMAILS.includes(normalized)) {
    env.PLATFORM_ADMIN_EMAILS.push(normalized);
  }
}

async function createVerifiedCreator(email?: string) {
  const account = await createTestUserWithOrganization(
    email ? { email } : undefined,
  );
  await testPrismaClient().creatorApplication.create({
    data: {
      userId: account.user.id,
      displayName: 'Test Creator',
      bio: 'Creator bio',
      credentials: 'Credentials',
      expertise: 'Expertise',
      status: 'approved',
      nexVerified: true,
    },
  });
  return {
    ...account,
    context: createAuthenticatedContext(
      account.user,
      account.organization,
      account.member,
    ),
  };
}

function courseInput(overrides: Record<string, unknown> = {}) {
  const moduleId = randomUUID();
  return {
    title: 'My Course',
    modules: [{ id: moduleId, title: 'Module 1', orderIndex: 0 }],
    lessons: [
      { id: randomUUID(), moduleId, title: 'Lesson 1', orderIndex: 0 },
    ],
    ...overrides,
  };
}

describe('course builder controllers', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it('creates a draft course owned by the verified creator', async () => {
    const creator = await createVerifiedCreator();
    const { course } = await courseBuilderCreateController(
      courseInput(),
      creator.context,
    );

    expect(course.status).toBe('draft');
    expect(course.creatorUserId).toBe(creator.user.id);
    expect(course.modules).toHaveLength(1);
    expect(course.lessons).toHaveLength(1);
  });

  it('rejects course creation for a user who is not a verified creator', async () => {
    const account = await createTestUserWithOrganization();
    const context = createAuthenticatedContext(
      account.user,
      account.organization,
      account.member,
    );

    await expect(
      courseBuilderCreateController(courseInput(), context),
    ).rejects.toMatchObject({ code: 403 });
  });

  it('prevents a creator from reading another creator’s course', async () => {
    const creatorA = await createVerifiedCreator();
    const creatorB = await createVerifiedCreator('course-builder-b@example.com');
    const { course } = await courseBuilderCreateController(
      courseInput(),
      creatorA.context,
    );

    await expect(
      courseBuilderGetController({ id: course.id }, creatorB.context),
    ).rejects.toMatchObject({ code: 404 });
  });

  it('runs the submit / review / withdraw lifecycle', async () => {
    const creator = await createVerifiedCreator();
    const admin = await createVerifiedCreator(
      'course-builder-admin@example.com',
    );
    ensurePlatformAdmin(admin.user.email);

    // submit-for-review requires at least one module and lesson
    const empty = await courseBuilderCreateController(
      { title: 'Empty course', modules: [], lessons: [] },
      creator.context,
    );
    await expect(
      courseBuilderSubmitForReviewController(
        { id: empty.course.id },
        creator.context,
      ),
    ).rejects.toMatchObject({ code: 400 });

    const { course } = await courseBuilderCreateController(
      courseInput(),
      creator.context,
    );
    const submitted = await courseBuilderSubmitForReviewController(
      { id: course.id },
      creator.context,
    );
    expect(submitted.course.status).toBe('inReview');

    // a non-draft course can no longer be edited
    await expect(
      courseBuilderUpdateController(
        { id: course.id },
        courseInput(),
        creator.context,
      ),
    ).rejects.toMatchObject({ code: 400 });

    const changes = await platformAdminCourseReviewController(
      { id: course.id },
      { decision: 'requestChanges', reviewNotes: 'Add more lessons.' },
      admin.context,
    );
    expect(changes.course.status).toBe('draft');
    expect(changes.course.reviewNotes).toBe('Add more lessons.');

    await courseBuilderSubmitForReviewController(
      { id: course.id },
      creator.context,
    );
    const approved = await platformAdminCourseReviewController(
      { id: course.id },
      { decision: 'approve' },
      admin.context,
    );
    expect(approved.course.status).toBe('published');
    expect(approved.course.publishedAt).toBeTruthy();

    const withdrawn = await courseBuilderWithdrawController(
      { id: course.id },
      creator.context,
    );
    expect(withdrawn.course.status).toBe('draft');
  });

  it('grades a quiz attempt server-side', async () => {
    const creator = await createVerifiedCreator();
    const admin = await createVerifiedCreator(
      'course-builder-quiz-admin@example.com',
    );
    ensurePlatformAdmin(admin.user.email);
    const student = await createTestUserWithOrganization({
      email: 'course-builder-quiz-student@example.com',
    });
    const studentContext = createAuthenticatedContext(
      student.user,
      student.organization,
      student.member,
    );

    const moduleId = randomUUID();
    const lessonId = randomUUID();
    const quizId = randomUUID();
    const questionId = randomUUID();
    const linkId = randomUUID();
    const correctAnswerId = randomUUID();
    const wrongAnswerId = randomUUID();
    const created = await courseBuilderCreateController(
      {
        title: 'Quiz Course',
        modules: [{ id: moduleId, title: 'Module', orderIndex: 0 }],
        lessons: [
          { id: lessonId, moduleId, title: 'Lesson', orderIndex: 0 },
        ],
        questions: [
          {
            id: questionId,
            questionText: 'What is 2 + 2?',
            questionType: 'multipleChoice',
            difficulty: 'medium',
            status: 'approved',
            answers: [
              {
                id: wrongAnswerId,
                answerText: '3',
                isCorrect: false,
                orderIndex: 0,
              },
              {
                id: correctAnswerId,
                answerText: '4',
                isCorrect: true,
                orderIndex: 1,
              },
            ],
          },
        ],
        quizzes: [
          {
            id: quizId,
            moduleId,
            title: 'Quiz',
            orderIndex: 0,
            passingScore: 50,
          },
        ],
        quizQuestions: [
          { id: linkId, quizId, questionId, orderIndex: 0, points: 1 },
        ],
      },
      creator.context,
    );
    const courseId = created.course.id;
    const quiz = created.course.quizzes[0];
    expect(quiz.questions).toHaveLength(1);

    await courseBuilderSubmitForReviewController(
      { id: courseId },
      creator.context,
    );
    await platformAdminCourseReviewController(
      { id: courseId },
      { decision: 'approve' },
      admin.context,
    );
    await courseEnrollController({ id: courseId }, studentContext);

    const correct = await courseQuizAttemptController(
      { id: courseId, quizId: quiz.id },
      {
        answers: [{ questionId, selectedOptionIds: [correctAnswerId] }],
      },
      studentContext,
    );
    expect(correct.result.scorePercent).toBe(100);
    expect(correct.result.passed).toBe(true);

    const wrong = await courseQuizAttemptController(
      { id: courseId, quizId: quiz.id },
      {
        answers: [{ questionId, selectedOptionIds: [wrongAnswerId] }],
      },
      studentContext,
    );
    expect(wrong.result.scorePercent).toBe(0);
    expect(wrong.result.passed).toBe(false);
  });
});
