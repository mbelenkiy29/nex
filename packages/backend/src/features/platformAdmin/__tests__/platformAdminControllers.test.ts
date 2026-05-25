import { beforeEach, describe, expect, it } from 'vitest';
import {
  creatorPayoutCreateController,
  creatorPayoutListController,
  creatorPayoutStatusController,
} from '../controllers/platformAdminControllers';
import {
  platformAdminAssignmentSubmissionReviewController,
  platformAdminCourseCreateController,
  platformAdminCourseEnrollController,
  platformAdminCourseUpdateController,
} from '../../course/courseControllers';
import {
  cleanTestDatabase,
  testPrismaClient,
} from '../../../test/testPrismaClient';
import { createTestUserWithOrganization } from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { Error403 } from '../../../shared/errors/Error403';
import { env } from '../../../env';

function ensurePlatformAdmin(email: string) {
  const normalized = email.toLowerCase();
  if (!env.PLATFORM_ADMIN_EMAILS.includes(normalized)) {
    env.PLATFORM_ADMIN_EMAILS.push(normalized);
  }
}

async function createAdminContext(email = `admin-${Date.now()}@example.com`) {
  const admin = await createTestUserWithOrganization({ email });
  ensurePlatformAdmin(admin.user.email);

  return {
    ...admin,
    context: createAuthenticatedContext(
      admin.user,
      admin.organization,
      admin.member,
    ),
  };
}

function courseManageBody(title: string, overrides: Record<string, any> = {}) {
  return {
    title,
    slug: null,
    subtitle: 'Phase 1 course',
    description: 'Course managed by a platform admin.',
    category: 'Certification',
    thumbnail: [],
    status: 'draft',
    accessType: 'free',
    nexVerified: true,
    creatorUserId: null,
    creatorMemberId: null,
    creatorOrganizationId: null,
    modules: [
      {
        title: 'Module A',
        description: 'Foundations',
        orderIndex: 0,
      },
    ],
    lessons: [
      {
        title: 'Lesson A',
        description: 'Start here',
        content: 'Lesson content for the managed course.',
        videoFiles: [],
        videoDurationSeconds: null,
        orderIndex: 0,
        isPreview: false,
        moduleId: null,
      },
    ],
    assignments: [
      {
        title: 'Homework A',
        prompt: 'Submit a study reflection.',
        orderIndex: 0,
        dueDaysAfterEnroll: null,
        moduleId: null,
        lessonId: null,
      },
    ],
    ...overrides,
  };
}

describe('platform admin controllers', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it('requires platform admin access', async () => {
    const { user, organization, member } = await createTestUserWithOrganization(
      {
        email: `not-admin-${Date.now()}@example.com`,
      },
    );
    const context = createAuthenticatedContext(user, organization, member);

    await expect(
      platformAdminCourseCreateController(
        courseManageBody('Blocked Course'),
        context,
      ),
    ).rejects.toBeInstanceOf(Error403);
    await expect(
      creatorPayoutListController({}, context),
    ).rejects.toBeInstanceOf(Error403);
  });

  it('creates and updates courses with audit logs', async () => {
    const prisma = testPrismaClient();
    const admin = await createAdminContext();
    const created = await platformAdminCourseCreateController(
      courseManageBody('Admin Managed Course'),
      admin.context,
    );
    const updated = await platformAdminCourseUpdateController(
      { id: created.course.id },
      courseManageBody('Admin Managed Course Updated', {
        status: 'published',
        lessons: [
          {
            id: created.course.lessons[0].id,
            title: 'Lesson A Updated',
            description: 'Updated lesson',
            content: 'Updated lesson content.',
            videoFiles: [],
            videoDurationSeconds: null,
            orderIndex: 0,
            isPreview: false,
            moduleId: null,
          },
        ],
        assignments: [
          {
            id: created.course.assignments[0].id,
            title: 'Homework A Updated',
            prompt: 'Submit an updated study reflection.',
            orderIndex: 0,
            dueDaysAfterEnroll: null,
            moduleId: null,
            lessonId: null,
          },
        ],
      }),
      admin.context,
    );
    const courseAudits = await prisma.auditLog.findMany({
      where: { entityName: 'Course', entityId: created.course.id },
      orderBy: { timestamp: 'asc' },
    });

    expect(created.course.modules).toHaveLength(1);
    expect(created.course.lessons).toHaveLength(1);
    expect(created.course.assignments).toHaveLength(1);
    expect(updated.course.title).toBe('Admin Managed Course Updated');
    expect(updated.course.status).toBe('published');
    expect(updated.course.publishedAt).toBeInstanceOf(Date);
    expect(courseAudits.map((audit) => audit.operation)).toEqual(['C', 'U']);
  });

  it('manually enrolls and reactivates a student with audit logs', async () => {
    const prisma = testPrismaClient();
    const admin = await createAdminContext();
    const student = await createTestUserWithOrganization({
      email: `student-${Date.now()}@example.com`,
    });
    const created = await platformAdminCourseCreateController(
      courseManageBody('Manual Enrollment Course', {
        status: 'published',
        accessType: 'manual',
      }),
      admin.context,
    );

    const firstEnrollment = await platformAdminCourseEnrollController(
      { id: created.course.id },
      { email: student.user.email },
      admin.context,
    );
    await prisma.courseEnrollment.update({
      where: {
        courseId_userId: {
          courseId: created.course.id,
          userId: student.user.id,
        },
      },
      data: { status: 'cancelled', completedAt: new Date() },
    });
    const reactivated = await platformAdminCourseEnrollController(
      { id: created.course.id },
      { email: student.user.email },
      admin.context,
    );
    const enrollmentAudits = await prisma.auditLog.findMany({
      where: {
        entityName: 'CourseEnrollment',
        entityId: firstEnrollment.enrollment.id,
      },
    });

    expect(reactivated.enrollment.id).toBe(firstEnrollment.enrollment.id);
    expect(reactivated.enrollment.status).toBe('active');
    expect(reactivated.enrollment.completedAt).toBeNull();
    expect(enrollmentAudits).toHaveLength(2);
  });

  it('reviews assignment submissions with reviewer metadata and audit logs', async () => {
    const prisma = testPrismaClient();
    const admin = await createAdminContext();
    const student = await createTestUserWithOrganization();
    const created = await platformAdminCourseCreateController(
      courseManageBody('Submission Review Course', { status: 'published' }),
      admin.context,
    );
    const submission = await prisma.courseAssignmentSubmission.create({
      data: {
        courseId: created.course.id,
        assignmentId: created.course.assignments[0].id,
        userId: student.user.id,
        memberId: student.member.id,
        text: 'Ready for review.',
        status: 'submitted',
      },
    });

    const reviewed = await platformAdminAssignmentSubmissionReviewController(
      { id: submission.id },
      { status: 'needsRevision', feedback: 'Please add more detail.' },
      admin.context,
    );
    const audit = await prisma.auditLog.findFirst({
      where: {
        entityName: 'CourseAssignmentSubmission',
        entityId: submission.id,
      },
    });

    expect(reviewed.submission.status).toBe('needsRevision');
    expect(reviewed.submission.feedback).toBe('Please add more detail.');
    expect(reviewed.submission.reviewerUserId).toBe(admin.user.id);
    expect(reviewed.submission.reviewedAt).toBeInstanceOf(Date);
    expect(audit?.operation).toBe('U');
  });

  it('creates, lists, and updates creator payouts with audit logs', async () => {
    const prisma = testPrismaClient();
    const admin = await createAdminContext();
    const creator = await createTestUserWithOrganization({
      email: `creator-${Date.now()}@example.com`,
    });
    const course = await platformAdminCourseCreateController(
      courseManageBody('Payout Course', { status: 'published' }),
      admin.context,
    );

    const created = await creatorPayoutCreateController(
      {
        organizationId: null,
        creatorUserId: creator.user.id,
        creatorMemberId: null,
        courseId: course.course.id,
        amount: 125.5,
        currency: 'usd',
        description: 'Phase 1 manual payout.',
      },
      admin.context,
    );
    const listed = await creatorPayoutListController(
      { filter: { status: 'pending' } },
      admin.context,
    );
    const paid = await creatorPayoutStatusController(
      { id: created.payout.id },
      { status: 'paid' },
      admin.context,
    );
    const cancelled = await creatorPayoutStatusController(
      { id: created.payout.id },
      { status: 'cancelled' },
      admin.context,
    );
    const stored = await prisma.creatorPayout.findUniqueOrThrow({
      where: { id: created.payout.id },
    });
    const payoutAudits = await prisma.auditLog.findMany({
      where: { entityName: 'CreatorPayout', entityId: created.payout.id },
      orderBy: { timestamp: 'asc' },
    });

    expect(created.payout.amount).toBe(125.5);
    expect(created.payout.currency).toBe('USD');
    expect(listed.payouts.map((payout) => payout.id)).toContain(
      created.payout.id,
    );
    expect(paid.payout.status).toBe('paid');
    expect(cancelled.payout.status).toBe('cancelled');
    expect(stored.cancelledAt).toBeInstanceOf(Date);
    expect(payoutAudits.map((audit) => audit.operation)).toEqual([
      'C',
      'U',
      'U',
    ]);
  });
});
