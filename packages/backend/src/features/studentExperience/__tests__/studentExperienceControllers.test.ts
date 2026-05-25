import { beforeEach, describe, expect, it } from 'vitest';
import { env } from '../../../env';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { Error403 } from '../../../shared/errors/Error403';
import {
  studentExperienceCourseOverviewController,
  studentExperienceDashboardController,
  studentExperienceNoteCreateController,
  studentExperienceNoteDeleteController,
  studentExperienceNotesListController,
  studentExperiencePracticeAnswerController,
  studentExperiencePracticeCompleteController,
  studentExperiencePracticeStartController,
  studentExperienceStudyPlanCreateController,
  studentExperienceStudyPlanUpdateController,
} from '../studentExperienceControllers';

async function seedStudentCourse(input: {
  organizationId: string;
  memberId: string;
  userId: string;
  status?: string;
  enroll?: boolean;
}) {
  const prisma = testPrismaClient();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const course = await prisma.course.create({
    data: {
      title: `Student Experience ${suffix}`,
      slug: `student-experience-${suffix}`,
      category: 'Certification',
      status: input.status || 'published',
      accessType: 'free',
      publishedAt:
        (input.status || 'published') === 'published' ? new Date() : null,
    },
  });
  const module = await prisma.courseModule.create({
    data: {
      title: 'Module 1',
      orderIndex: 0,
      courseId: course.id,
    },
  });
  const lesson = await prisma.courseLesson.create({
    data: {
      title: 'Lesson 1',
      content: 'Course lesson content',
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
    },
  });
  const assignment = await prisma.courseAssignment.create({
    data: {
      title: 'Homework 1',
      prompt: 'Submit a reflection.',
      dueDaysAfterEnroll: 0,
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
      lessonId: lesson.id,
    },
  });
  const exam = await prisma.exam.create({
    data: {
      organizationId: input.organizationId,
      name: `Exam ${suffix}`,
      code: `EX-${suffix}`,
      isActive: true,
      courseId: course.id,
    },
  });
  const chapter = await prisma.chapter.create({
    data: {
      organizationId: input.organizationId,
      title: `Chapter ${suffix}`,
      chapterNumber: 1,
      orderIndex: 0,
      workflowStatus: 'published',
      isPublished: true,
      examId: exam.id,
      courseId: course.id,
    },
  });
  const question = await prisma.practiceQuestion.create({
    data: {
      organizationId: input.organizationId,
      questionText: 'Which answer is correct for this course?',
      correctAnswerIndex: 1,
      answerOptions: ['Option A', 'Option B', 'Option C'],
      explanation: 'Option B is correct.',
      difficulty: 'easy',
      category: 'Foundations',
      isActive: true,
      chapterId: chapter.id,
      courseId: course.id,
    },
  });

  if (input.enroll ?? true) {
    await prisma.courseEnrollment.create({
      data: {
        courseId: course.id,
        userId: input.userId,
        memberId: input.memberId,
        status: 'active',
        enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  return { course, module, lesson, assignment, question };
}

function ensurePlatformAdmin(email: string) {
  const normalized = email.toLowerCase();
  if (!env.PLATFORM_ADMIN_EMAILS.includes(normalized)) {
    env.PLATFORM_ADMIN_EMAILS.push(normalized);
  }
}

describe('student experience controllers', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it('aggregates only enrolled published courses on the dashboard', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    const published = await seedStudentCourse({
      organizationId: organization.id,
      memberId: member.id,
      userId: user.id,
    });
    await seedStudentCourse({
      organizationId: organization.id,
      memberId: member.id,
      userId: user.id,
      status: 'draft',
      enroll: true,
    });
    await testPrismaClient().courseLessonProgress.create({
      data: {
        courseId: published.course.id,
        lessonId: published.lesson.id,
        userId: user.id,
      },
    });

    const dashboard = await studentExperienceDashboardController(context);

    expect(dashboard.courses).toHaveLength(1);
    expect(dashboard.summary.enrolledCourses).toBe(1);
    expect(dashboard.summary.completedLessons).toBe(1);
    expect(dashboard.upcomingHomework[0].status).toBe('overdue');
  });

  it('rejects unenrolled users and allows platform admin preview', async () => {
    const owner = await createTestUserWithOrganization();
    const student = await createTestUserWithOrganization();
    const admin = await createTestUserWithOrganization({
      email: `student-admin-${Date.now()}@example.com`,
    });
    ensurePlatformAdmin(admin.user.email);
    const seeded = await seedStudentCourse({
      organizationId: owner.organization.id,
      memberId: owner.member.id,
      userId: owner.user.id,
      enroll: false,
    });

    await expect(
      studentExperienceCourseOverviewController(
        { courseId: seeded.course.id },
        createAuthenticatedContext(
          student.user,
          student.organization,
          student.member,
        ),
      ),
    ).rejects.toBeInstanceOf(Error403);

    const preview = await studentExperienceCourseOverviewController(
      { courseId: seeded.course.id },
      createAuthenticatedContext(admin.user, admin.organization, admin.member),
    );

    expect(preview.course.id).toBe(seeded.course.id);
  });

  it('starts, answers, and completes student-owned practice attempts', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    const seeded = await seedStudentCourse({
      organizationId: organization.id,
      memberId: member.id,
      userId: user.id,
    });

    const started = await studentExperiencePracticeStartController(
      { courseId: seeded.course.id },
      { questionCount: 1 },
      context,
    );
    const question = started.attempt.questions[0];
    const answered = await studentExperiencePracticeAnswerController(
      { attemptId: started.attempt.id },
      { questionId: question.questionId, selectedAnswerIndex: 1 },
      context,
    );
    const completed = await studentExperiencePracticeCompleteController(
      { attemptId: started.attempt.id },
      context,
    );

    expect(answered.answer.isCorrect).toBe(true);
    expect(completed.attempt.status).toBe('completed');
    expect(completed.attempt.scorePercent).toBe(100);
  });

  it('keeps notes and study-plan items owned by the signed-in student', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const other = await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    const otherContext = createAuthenticatedContext(
      other.user,
      other.organization,
      other.member,
    );
    const seeded = await seedStudentCourse({
      organizationId: organization.id,
      memberId: member.id,
      userId: user.id,
    });
    await testPrismaClient().courseEnrollment.create({
      data: {
        courseId: seeded.course.id,
        userId: other.user.id,
        memberId: other.member.id,
        status: 'active',
      },
    });

    const note = await studentExperienceNoteCreateController(
      { courseId: seeded.course.id },
      {
        lessonId: seeded.lesson.id,
        title: 'My note',
        content: 'Remember this concept.',
      },
      context,
    );
    await studentExperienceNoteCreateController(
      { courseId: seeded.course.id },
      { title: 'Other note', content: 'Private note.' },
      otherContext,
    );
    const notes = await studentExperienceNotesListController(
      { courseId: seeded.course.id },
      context,
    );
    const item = await studentExperienceStudyPlanCreateController(
      { courseId: seeded.course.id },
      { title: 'Review module', status: 'todo' },
      context,
    );
    const updated = await studentExperienceStudyPlanUpdateController(
      { courseId: seeded.course.id, itemId: item.item.id },
      { status: 'complete' },
      context,
    );
    await studentExperienceNoteDeleteController(
      { courseId: seeded.course.id, noteId: note.note.id },
      context,
    );

    expect(notes.items).toHaveLength(1);
    expect(notes.items[0].title).toBe('My note');
    expect(updated.item.status).toBe('complete');
    expect(updated.item.completedAt).toBeTruthy();
  });
});
