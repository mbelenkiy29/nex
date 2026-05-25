import { testPrismaClient } from './testPrismaClient';
import { createAuthenticatedContext } from './testUtils';
import { env } from '../env';
import type {
  Course,
  CourseAssignment,
  CourseLesson,
  CourseModule,
  CreatorApplication,
  Member,
  Organization,
  User,
} from '../prisma/generated/client';

export async function createTestUser(
  overrides: Partial<User> = {},
): Promise<User> {
  const prisma = testPrismaClient();
  const timestamp = Date.now();

  return await prisma.user.create({
    data: {
      email: `test-${timestamp}@example.com`,
      name: 'Test User',
      emailVerified: true,
      ...overrides,
    } as any,
  });
}

export async function createTestOrganization(
  overrides: Partial<Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>> = {},
): Promise<Organization> {
  const prisma = testPrismaClient();
  const timestamp = Date.now();

  return await prisma.organization.create({
    data: {
      name: `Test Organization ${timestamp}`,
      slug: `test-org-${timestamp}`,
      ...overrides,
    } as any,
  });
}

export async function createTestMember(
  userId: string,
  organizationId: string,
  overrides: Partial<Omit<Member, 'id' | 'createdAt' | 'updatedAt'>> = {},
): Promise<Member> {
  const prisma = testPrismaClient();

  return await prisma.member.create({
    data: {
      userId,
      organizationId,
      role: 'admin',
      ...overrides,
    } as any,
  });
}

export async function createTestUserWithOrganization(
  userOverrides: Partial<User> = {},
  orgOverrides: Partial<Organization> = {},
  memberOverrides: Partial<Omit<Member, 'id' | 'createdAt' | 'updatedAt'>> = {},
): Promise<{ user: User; organization: Organization; member: Member }> {
  const user = await createTestUser(userOverrides);
  const organization = await createTestOrganization(orgOverrides);
  const member = await createTestMember(
    user.id,
    organization.id,
    memberOverrides,
  );

  return { user, organization, member };
}

export function ensureTestPlatformAdmin(email: string) {
  const normalized = email.toLowerCase();
  if (!env.PLATFORM_ADMIN_EMAILS.includes(normalized)) {
    env.PLATFORM_ADMIN_EMAILS.push(normalized);
  }
}

export async function createTestPlatformAdmin(email?: string) {
  const account = await createTestUserWithOrganization({
    email: email || `platform-admin-${Date.now()}@example.com`,
  });
  ensureTestPlatformAdmin(account.user.email);

  return {
    ...account,
    context: createAuthenticatedContext(
      account.user,
      account.organization,
      account.member,
    ),
  };
}

export async function createTestVerifiedCreator(email?: string) {
  const account = await createTestUserWithOrganization({
    email: email || `creator-${Date.now()}@example.com`,
  });
  const application = await testPrismaClient().creatorApplication.create({
    data: {
      userId: account.user.id,
      memberId: account.member.id,
      legalName: 'Test Creator',
      displayName: 'Test Creator',
      professionalTitle: 'Exam Prep Instructor',
      bio: 'I help students prepare for certification exams.',
      credentials: 'Certified educator',
      expertise: 'Certification prep',
      teachingExperience: 'Five years of teaching.',
      audience: 'Certification candidates',
      courseTopics: ['Exam readiness'],
      sampleLessonPlan: 'Diagnostic, lesson, practice, and review.',
      payoutContact: 'creator@example.com',
      payoutOnboardingStatus: 'complete',
      identityDocumentFiles: [
        {
          key: 'identity/test-creator.pdf',
          name: 'test-creator.pdf',
          size: 1000,
          type: 'application/pdf',
        },
      ],
      identityVerificationConsent: true,
      identityStatus: 'verified',
      identityScanStatus: 'passed',
      status: 'approved',
      nexVerified: true,
      nexVerifiedAt: new Date(),
    },
  });

  return {
    ...account,
    application,
    context: createAuthenticatedContext(
      account.user,
      account.organization,
      account.member,
    ),
  };
}

export async function createTestCourseSeed(
  overrides: Partial<{
    title: string;
    slug: string;
    status: string;
    accessType: string;
    priceCents: number | null;
    currency: string;
    stripePriceId: string | null;
    creator: {
      user: User;
      member: Member;
      organization: Organization;
      application?: CreatorApplication;
    } | null;
    lessonCount: number;
    certificateEnabled: boolean;
    safetyHold: boolean;
  }> = {},
): Promise<{
  course: Course;
  module: CourseModule;
  lessons: CourseLesson[];
  lesson: CourseLesson;
  assignment: CourseAssignment;
}> {
  const prisma = testPrismaClient();
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const status = overrides.status || 'published';
  const creator = overrides.creator;
  const course = await prisma.course.create({
    data: {
      title: overrides.title || `Test Course ${suffix}`,
      slug: overrides.slug || `test-course-${suffix}`,
      subtitle: 'Exam prep foundations',
      description: 'A focused course for test coverage.',
      category: 'Certification',
      status,
      accessType: overrides.accessType || 'free',
      priceCents: overrides.priceCents ?? null,
      currency: overrides.currency || 'USD',
      stripePriceId: overrides.stripePriceId ?? null,
      creatorRevenueShareBps: 7000,
      nexVerified: Boolean(creator),
      creatorUserId: creator?.user.id ?? null,
      creatorMemberId: creator?.member.id ?? null,
      creatorOrganizationId: creator?.organization.id ?? null,
      certificateEnabled: overrides.certificateEnabled ?? true,
      safetyHold: overrides.safetyHold ?? false,
      publishedAt: status === 'published' ? new Date() : null,
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
  const lessonCount = overrides.lessonCount ?? 1;
  const lessons = [];
  for (let index = 0; index < lessonCount; index += 1) {
    lessons.push(
      await prisma.courseLesson.create({
        data: {
          title: `Lesson ${index + 1}`,
          content: `Lesson ${index + 1} content for test coverage.`,
          orderIndex: index,
          courseId: course.id,
          moduleId: module.id,
        },
      }),
    );
  }
  const assignment = await prisma.courseAssignment.create({
    data: {
      title: 'Homework 1',
      prompt: 'Submit a short reflection.',
      orderIndex: 0,
      courseId: course.id,
      moduleId: module.id,
      lessonId: lessons[0]?.id ?? null,
    },
  });

  return { course, module, lessons, lesson: lessons[0], assignment };
}

export async function createTestEnrolledStudent(courseId: string) {
  const account = await createTestUserWithOrganization({
    email: `student-${Date.now()}@example.com`,
  });
  const enrollment = await testPrismaClient().courseEnrollment.create({
    data: {
      courseId,
      userId: account.user.id,
      memberId: account.member.id,
      status: 'active',
    },
  });

  return {
    ...account,
    enrollment,
    context: createAuthenticatedContext(
      account.user,
      account.organization,
      account.member,
    ),
  };
}

export async function createTestApiKey(
  userId: string,
  overrides: Partial<any> = {},
) {
  const prisma = testPrismaClient();
  const timestamp = Date.now();

  return await prisma.apiKey.create({
    data: {
      name: `Test API Key ${timestamp}`,
      key: 'test-key-hash-' + timestamp,
      prefix: 'test',
      start: 'test',
      user: { connect: { id: userId } },
      enabled: true,
      ...overrides,
    },
  });
}

export async function createTestAuditLog(
  organizationId: string,
  memberId: string,
  overrides: Partial<any> = {},
) {
  const prisma = testPrismaClient();
  const timestamp = Date.now();

  return await prisma.auditLog.create({
    data: {
      entityName: 'Exam',
      entityId: `entity-${timestamp}`,
      operation: 'create',
      organizationId,
      memberId,
      ...overrides,
    },
  });
}
