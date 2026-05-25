import { describe, expect, it } from 'vitest';
import {
  platformAdminTrustSafetyCreatorStatusController,
  platformAdminTrustSafetyReportUpdateController,
  platformAdminTrustSafetyRiskFlagCreateController,
  platformAdminTrustSafetyRiskFlagUpdateController,
  trustSafetyPoliciesController,
  trustSafetyPolicyAcceptController,
  trustSafetyReportCreateController,
} from '../trustSafetyControllers';
import {
  createTestCourseSeed,
  createTestPlatformAdmin,
  createTestUserWithOrganization,
  createTestVerifiedCreator,
} from '../../../test/testFactories';
import { createAuthenticatedContext } from '../../../test/testUtils';
import { testPrismaClient } from '../../../test/testPrismaClient';

describe('trust and safety controllers', () => {
  it('accepts active policy versions and reports accepted status per user', async () => {
    const account = await createTestUserWithOrganization();
    const context = createAuthenticatedContext(
      account.user,
      account.organization,
      account.member,
    );
    await testPrismaClient().trustSafetyPolicyVersion.createMany({
      data: [
        {
          type: 'studentTerms',
          version: '2026-01',
          contentKey: 'student-terms-2026-01',
          isActive: true,
        },
        {
          type: 'teacherTerms',
          version: '2026-01',
          contentKey: 'teacher-terms-2026-01',
          isActive: true,
        },
      ],
    });

    const before = await trustSafetyPoliciesController(context);
    await trustSafetyPolicyAcceptController(
      { policyType: 'studentTerms' },
      context,
    );
    const after = await trustSafetyPoliciesController(context);

    expect(
      before.policies.find((item) => item.type === 'studentTerms')?.accepted,
    ).toBe(false);
    expect(
      after.policies.find((item) => item.type === 'studentTerms')?.accepted,
    ).toBe(true);
    expect(
      after.policies.find((item) => item.type === 'teacherTerms')?.accepted,
    ).toBe(false);
  });

  it('creates course and rating reports, then raises a repeated-report risk flag', async () => {
    const creator = await createTestVerifiedCreator();
    const { course } = await createTestCourseSeed({ creator });
    const reporterAccounts = [];
    for (const index of [1, 2, 3]) {
      reporterAccounts.push(
        await createTestUserWithOrganization(
          {
            email: `reporter-${index}-${Date.now()}@example.com`,
          },
          {
            name: `Reporter Org ${index}`,
            slug: `reporter-org-${index}-${Date.now()}`,
          },
        ),
      );
    }

    for (const account of reporterAccounts) {
      await trustSafetyReportCreateController(
        {
          targetType: 'course',
          courseId: course.id,
          reason: 'misleadingContent',
          details: 'The course claims need review.',
        },
        createAuthenticatedContext(
          account.user,
          account.organization,
          account.member,
        ),
      );
    }

    const flag = await testPrismaClient().trustSafetyRiskFlag.findFirst({
      where: {
        courseId: course.id,
        source: 'rule',
        reason: 'repeatedReports',
      },
    });
    const rating = await testPrismaClient().courseRating.create({
      data: {
        courseId: course.id,
        userId: reporterAccounts[0].user.id,
        memberId: reporterAccounts[0].member.id,
        rating: 1,
        comment: 'Needs review.',
      },
    });
    const ratingReport = await trustSafetyReportCreateController(
      {
        targetType: 'courseRating',
        ratingId: rating.id,
        reason: 'abusiveReview',
      },
      createAuthenticatedContext(
        reporterAccounts[1].user,
        reporterAccounts[1].organization,
        reporterAccounts[1].member,
      ),
    );

    expect(flag?.severity).toBe('high');
    expect(ratingReport.report.courseId).toBe(course.id);
    expect(ratingReport.report.teacherUserId).toBe(creator.user.id);
  });

  it('lets platform admins resolve reports and manage manual risk flags', async () => {
    const admin = await createTestPlatformAdmin('trust-safety-admin@test.dev');
    const reporter = await createTestUserWithOrganization();
    const { course } = await createTestCourseSeed();
    const report = await trustSafetyReportCreateController(
      {
        targetType: 'course',
        courseId: course.id,
        reason: 'qualityIssue',
        details: 'Needs review.',
      },
      createAuthenticatedContext(
        reporter.user,
        reporter.organization,
        reporter.member,
      ),
    );

    const resolved = await platformAdminTrustSafetyReportUpdateController(
      { id: report.report.id },
      { status: 'resolvedActionTaken', adminNotes: 'Reviewed.' },
      admin.context,
    );
    const flag = await platformAdminTrustSafetyRiskFlagCreateController(
      {
        targetType: 'course',
        courseId: course.id,
        severity: 'critical',
        reason: 'Manual quality hold',
        adminNotes: 'Escalated.',
      },
      admin.context,
    );
    const updatedFlag = await platformAdminTrustSafetyRiskFlagUpdateController(
      { id: flag.flag.id },
      {
        status: 'resolved',
        severity: 'high',
        adminNotes: 'Resolved after creator update.',
      },
      admin.context,
    );

    expect(resolved.report.status).toBe('resolvedActionTaken');
    expect(resolved.report.resolvedByUserId).toBe(admin.user.id);
    expect(updatedFlag.flag.status).toBe('resolved');
    expect(updatedFlag.flag.resolvedByUserId).toBe(admin.user.id);
    expect(updatedFlag.flag.resolvedAt).toBeTruthy();
  });

  it('disables a creator, removes verification, and places published courses on safety hold', async () => {
    const admin = await createTestPlatformAdmin(
      'creator-safety-admin@test.dev',
    );
    const creator = await createTestVerifiedCreator();
    const { course } = await createTestCourseSeed({ creator });

    const result = await platformAdminTrustSafetyCreatorStatusController(
      { userId: creator.user.id },
      {
        disabled: true,
        reason: 'Identity review failed.',
        holdCourses: true,
      },
      admin.context,
    );
    const heldCourse = await testPrismaClient().course.findUniqueOrThrow({
      where: { id: course.id },
    });

    expect(result.application.safetyStatus).toBe('disabled');
    expect(result.application.nexVerified).toBe(false);
    expect(heldCourse.safetyHold).toBe(true);
    expect(heldCourse.safetyHoldReason).toBe('Identity review failed.');
  });
});
