import { beforeEach, describe, expect, it } from 'vitest';
import {
  courseAssignmentSubmissionController,
  courseBuildAiContext,
  courseCatalogController,
  courseEnrollController,
  courseLearnController,
  courseLessonCompleteController,
  courseMyLearningController,
  platformAdminCourseCreateController,
} from '../courseControllers';
import { examCreateController } from '../../exam/controllers/examCreateController';
import { chapterCreateController } from '../../chapter/controllers/chapterCreateController';
import { chapterFindManyController } from '../../chapter/controllers/chapterFindManyController';
import { practiceQuestionCreateController } from '../../practiceQuestion/controllers/practiceQuestionCreateController';
import { practiceQuestionAutocompleteController } from '../../practiceQuestion/controllers/practiceQuestionAutocompleteController';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { Error400 } from '../../../shared/errors/Error400';
import { Error403 } from '../../../shared/errors/Error403';
import { Error404 } from '../../../shared/errors/Error404';
import { env } from '../../../env';
import { backfillCoursesFromExams } from '../../../prisma/backfillCoursesFromExams';

async function createCourseSeed(
  overrides: Partial<{
    title: string;
    status: string;
    accessType: string;
    slug: string;
  }> = {},
) {
  const prisma = testPrismaClient();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const course = await prisma.course.create({
    data: {
      title: overrides.title || `Course ${suffix}`,
      slug: overrides.slug || `course-${suffix}`,
      subtitle: 'Exam prep foundations',
      description: 'Course description for authorization tests',
      category: 'Certification',
      status: overrides.status || 'published',
      accessType: overrides.accessType || 'free',
      nexVerified: true,
      publishedAt:
        (overrides.status || 'published') === 'published' ? new Date() : null,
    },
  });
  const module = await prisma.courseModule.create({
    data: {
      title: 'Module 1',
      description: 'Foundations',
      orderIndex: 0,
      courseId: course.id,
    },
  });
  const lesson = await prisma.courseLesson.create({
    data: {
      title: 'Lesson 1',
      description: 'First lesson',
      content: 'Course-aware AI should be able to use this lesson content.',
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
    },
  });
  const assignment = await prisma.courseAssignment.create({
    data: {
      title: 'Homework 1',
      prompt: 'Explain the core concept in your own words.',
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
      lessonId: lesson.id,
    },
  });

  return { course, module, lesson, assignment };
}

function ensurePlatformAdmin(email: string) {
  const normalized = email.toLowerCase();
  if (!env.PLATFORM_ADMIN_EMAILS.includes(normalized)) {
    env.PLATFORM_ADMIN_EMAILS.push(normalized);
  }
}

describe('course controllers', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it('shows only published catalog courses and marks enrolled courses', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const published = await createCourseSeed({ title: 'Published Course' });
    await createCourseSeed({ title: 'Draft Course', status: 'draft' });
    await testPrismaClient().courseEnrollment.create({
      data: {
        courseId: published.course.id,
        userId: user.id,
        memberId: member.id,
        status: 'active',
      },
    });

    const result = await courseCatalogController(
      {},
      createAuthenticatedContext(user, organization, member),
    );

    expect(result.count).toBe(1);
    expect(result.courses).toHaveLength(1);
    expect(result.courses[0].title).toBe('Published Course');
    expect(result.courses[0].isEnrolled).toBe(true);
  });

  it('enrolls or reactivates users only for free published courses', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    const freeCourse = await createCourseSeed({ title: 'Free Course' });
    const manualCourse = await createCourseSeed({
      title: 'Manual Course',
      accessType: 'manual',
    });
    const paidCourse = await createCourseSeed({
      title: 'Paid Course',
      accessType: 'paid',
    });
    const subscriptionCourse = await createCourseSeed({
      title: 'Subscription Course',
      accessType: 'subscription',
    });
    const draftCourse = await createCourseSeed({
      title: 'Draft Course',
      status: 'draft',
    });

    const firstEnrollment = await courseEnrollController(
      { id: freeCourse.course.id },
      context,
    );

    await testPrismaClient().courseEnrollment.update({
      where: {
        courseId_userId: {
          courseId: freeCourse.course.id,
          userId: user.id,
        },
      },
      data: { status: 'cancelled', completedAt: new Date() },
    });

    const reactivated = await courseEnrollController(
      { id: freeCourse.course.id },
      context,
    );

    await expect(
      courseEnrollController({ id: manualCourse.course.id }, context),
    ).rejects.toBeInstanceOf(Error400);
    await expect(
      courseEnrollController({ id: paidCourse.course.id }, context),
    ).rejects.toBeInstanceOf(Error400);
    await expect(
      courseEnrollController({ id: subscriptionCourse.course.id }, context),
    ).rejects.toBeInstanceOf(Error400);
    await expect(
      courseEnrollController({ id: draftCourse.course.id }, context),
    ).rejects.toBeInstanceOf(Error404);
    expect(firstEnrollment.enrollment.status).toBe('active');
    expect(reactivated.enrollment.status).toBe('active');
    expect(reactivated.enrollment.completedAt).toBeNull();
  });

  it('validates Phase 2 course metadata in admin management', async () => {
    const admin = await createTestUserWithOrganization({
      email: `phase2-admin-${Date.now()}@example.com`,
    });
    ensurePlatformAdmin(admin.user.email);
    const context = createAuthenticatedContext(
      admin.user,
      admin.organization,
      admin.member,
    );

    const result = await platformAdminCourseCreateController(
      {
        title: 'Paid Metadata Course',
        slug: 'paid-metadata-course',
        subtitle: 'Phase 2 metadata',
        description: 'Paid course metadata without checkout.',
        category: 'Certification',
        examType: 'SIE',
        thumbnail: [],
        introVideoFiles: [
          {
            key: 'course/videos/intro.mp4',
            name: 'intro.mp4',
            size: 4,
            type: 'video/mp4',
          },
        ],
        status: 'draft',
        accessType: 'paid',
        priceCents: 19900,
        currency: 'usd',
        stripePriceId: 'price_phase2',
        subscriptionPlanKey: null,
        creatorRevenueShareBps: 6500,
        nexVerified: false,
        creatorUserId: null,
        creatorMemberId: null,
        creatorOrganizationId: null,
        modules: [],
        lessons: [],
        assignments: [],
      },
      context,
    );

    await expect(
      platformAdminCourseCreateController(
        {
          ...result.course,
          slug: 'invalid-revenue-share',
          creatorRevenueShareBps: 10001,
          modules: [],
          lessons: [],
          assignments: [],
        },
        context,
      ),
    ).rejects.toThrow();
    expect(result.course.accessType).toBe('paid');
    expect(result.course.priceCents).toBe(19900);
    expect(result.course.currency).toBe('USD');
    expect(result.course.creatorRevenueShareBps).toBe(6500);
  });

  it('links legacy learning entities to courses and filters by course', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    const prisma = testPrismaClient();
    const course = await prisma.course.create({
      data: {
        title: 'Legacy Linked Course',
        slug: `legacy-linked-course-${Date.now()}`,
        status: 'draft',
        accessType: 'free',
        creatorOrganizationId: organization.id,
      },
    });

    const exam = await examCreateController(
      {
        name: 'Linked Exam',
        code: `LEX${Date.now()}`,
        description: 'Exam linked to a course.',
        iconUrl: null,
        course: { id: course.id },
        isActive: true,
      },
      context,
    );
    const chapter = await chapterCreateController(
      {
        title: 'Linked Chapter',
        chapterNumber: 1,
        description: 'Course-linked chapter.',
        aiTutorPrompt: null,
        xpReward: 10,
        orderIndex: 1,
        workflowStatus: 'draft',
        isPublished: false,
        version: 1,
        objectives: ['Understand course scope'],
        course: { id: course.id },
        exam: { id: exam.id },
      },
      context,
    );
    await practiceQuestionCreateController(
      {
        questionText: 'What does this course link prove?',
        correctAnswerIndex: 0,
        explanation: 'It proves course filtering works.',
        difficulty: 'easy',
        category: 'Course links',
        isActive: true,
        tags: ['course'],
        course: { id: course.id },
        chapter: { id: chapter.id },
        concepts: [],
      },
      context,
    );

    const chapters = await chapterFindManyController(
      { filter: { course: { id: course.id } } },
      context,
    );
    const questions = await practiceQuestionAutocompleteController(
      { course: course.id },
      context,
    );

    expect(exam.courseId).toBe(course.id);
    expect(chapters.count).toBe(1);
    expect(chapters.chapters[0].courseId).toBe(course.id);
    expect(questions).toHaveLength(1);
  });

  it('backfills draft courses from existing exams idempotently', async () => {
    const { organization } = await createTestUserWithOrganization();
    const prisma = testPrismaClient();
    const exam = await prisma.exam.create({
      data: {
        organizationId: organization.id,
        name: 'Backfill Exam',
        code: `BFE${Date.now()}`,
        description: 'Existing exam without a course.',
        isActive: true,
      },
    });
    const chapter = await prisma.chapter.create({
      data: {
        organizationId: organization.id,
        title: 'Backfill Chapter',
        chapterNumber: 1,
        orderIndex: 1,
        workflowStatus: 'draft',
        isPublished: false,
        examId: exam.id,
      },
    });
    const lesson = await prisma.lesson.create({
      data: {
        organizationId: organization.id,
        title: 'Backfill Lesson',
        lessonNumber: 1,
        workflowStatus: 'draft',
        isPublished: false,
        chapterId: chapter.id,
      },
    });

    await backfillCoursesFromExams();
    await backfillCoursesFromExams();

    const updatedExam = await prisma.exam.findUniqueOrThrow({
      where: { id: exam.id },
    });
    const courses = await prisma.course.findMany({
      where: { creatorOrganizationId: organization.id, title: 'Backfill Exam' },
    });
    const updatedLesson = await prisma.lesson.findUniqueOrThrow({
      where: { id: lesson.id },
    });

    expect(courses).toHaveLength(1);
    expect(courses[0].status).toBe('draft');
    expect(updatedExam.courseId).toBe(courses[0].id);
    expect(updatedLesson.courseId).toBe(courses[0].id);
  });

  it('guards learn/progress/submission ownership and accepts non-empty homework', async () => {
    const enrolledUser = await createTestUserWithOrganization();
    const unenrolledUser = await createTestUserWithOrganization();
    const seed = await createCourseSeed();
    const enrolledContext = createAuthenticatedContext(
      enrolledUser.user,
      enrolledUser.organization,
      enrolledUser.member,
    );
    const unenrolledContext = createAuthenticatedContext(
      unenrolledUser.user,
      unenrolledUser.organization,
      unenrolledUser.member,
    );

    await courseEnrollController({ id: seed.course.id }, enrolledContext);
    await expect(
      courseLearnController({ id: seed.course.id }, unenrolledContext),
    ).rejects.toBeInstanceOf(Error403);

    const learn = await courseLearnController(
      { id: seed.course.id },
      enrolledContext,
    );
    const completion = await courseLessonCompleteController(
      { id: seed.course.id, lessonId: seed.lesson.id },
      enrolledContext,
    );

    await expect(
      courseAssignmentSubmissionController(
        { id: seed.course.id, assignmentId: seed.assignment.id },
        { text: '   ', files: [] },
        enrolledContext,
      ),
    ).rejects.toBeInstanceOf(Error400);

    const submission = await courseAssignmentSubmissionController(
      { id: seed.course.id, assignmentId: seed.assignment.id },
      { text: 'This is my homework response.', files: [] },
      enrolledContext,
    );

    expect(learn.course.id).toBe(seed.course.id);
    expect(completion.progress.lessonId).toBe(seed.lesson.id);
    expect(submission.submission.userId).toBe(enrolledUser.user.id);
    expect(submission.submission.status).toBe('submitted');
  });

  it('returns real my-learning stats and unenrolled recommendations', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const enrolled = await createCourseSeed({ title: 'Enrolled Course' });
    const recommended = await createCourseSeed({
      title: 'Recommended Course',
      slug: 'recommended-course',
    });
    const context = createAuthenticatedContext(user, organization, member);

    await courseEnrollController({ id: enrolled.course.id }, context);
    await courseLessonCompleteController(
      { id: enrolled.course.id, lessonId: enrolled.lesson.id },
      context,
    );
    await courseAssignmentSubmissionController(
      { id: enrolled.course.id, assignmentId: enrolled.assignment.id },
      { text: 'Submitted homework', files: [] },
      context,
    );

    const result = await courseMyLearningController(context);

    expect(result.enrolledCourses).toHaveLength(1);
    expect(result.enrolledCourses[0].course.title).toBe('Enrolled Course');
    expect(result.enrolledCourses[0].progress.percent).toBe(100);
    expect(result.stats.completedLessons).toBe(1);
    expect(result.stats.submittedAssignments).toBe(1);
    expect(result.recommendedCourses.map((course) => course.id)).toContain(
      recommended.course.id,
    );
    expect(result.recommendedCourses.map((course) => course.id)).not.toContain(
      enrolled.course.id,
    );
  });

  it('authorizes course-aware AI only for enrolled users and platform admins', async () => {
    const enrolledUser = await createTestUserWithOrganization();
    const unenrolledUser = await createTestUserWithOrganization();
    const adminUser = await createTestUserWithOrganization({
      email: 'phase1-admin@example.com',
    });
    ensurePlatformAdmin(adminUser.user.email);
    const seed = await createCourseSeed({ title: 'AI Context Course' });
    const enrolledContext = createAuthenticatedContext(
      enrolledUser.user,
      enrolledUser.organization,
      enrolledUser.member,
    );
    const unenrolledContext = createAuthenticatedContext(
      unenrolledUser.user,
      unenrolledUser.organization,
      unenrolledUser.member,
    );
    const adminContext = createAuthenticatedContext(
      adminUser.user,
      adminUser.organization,
      adminUser.member,
    );

    await courseEnrollController({ id: seed.course.id }, enrolledContext);
    const legacyExam = await testPrismaClient().exam.create({
      data: {
        organizationId: enrolledUser.organization.id,
        courseId: seed.course.id,
        name: 'AI Linked Exam',
        code: `AIL${Date.now()}`,
        description: 'Legacy exam content linked to the course.',
        isActive: true,
      },
    });
    const legacyChapter = await testPrismaClient().chapter.create({
      data: {
        organizationId: enrolledUser.organization.id,
        courseId: seed.course.id,
        title: 'AI Linked Chapter',
        chapterNumber: 1,
        orderIndex: 1,
        workflowStatus: 'draft',
        isPublished: true,
        examId: legacyExam.id,
      },
    });
    await testPrismaClient().practiceQuestion.create({
      data: {
        organizationId: enrolledUser.organization.id,
        courseId: seed.course.id,
        questionText: 'Which legacy resource is available to the AI tutor?',
        correctAnswerIndex: 0,
        explanation: 'Course-linked practice questions are included.',
        difficulty: 'easy',
        isActive: true,
        chapterId: legacyChapter.id,
      },
    });

    const enrolledContextText = await courseBuildAiContext(
      seed.course.id,
      seed.lesson.id,
      enrolledContext,
    );
    const adminContextText = await courseBuildAiContext(
      seed.course.id,
      seed.lesson.id,
      adminContext,
    );

    await expect(
      courseBuildAiContext(seed.course.id, seed.lesson.id, unenrolledContext),
    ).rejects.toBeInstanceOf(Error403);
    expect(enrolledContextText).toContain('AI Context Course');
    expect(enrolledContextText).toContain('AI Linked Exam');
    expect(enrolledContextText).toContain(
      'Which legacy resource is available to the AI tutor?',
    );
    expect(adminContextText).toContain('AI Context Course');
  });
});
