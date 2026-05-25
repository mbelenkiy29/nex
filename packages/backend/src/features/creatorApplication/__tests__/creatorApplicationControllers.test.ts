import { beforeEach, describe, expect, it } from 'vitest';
import {
  creatorApplicationIdentityScanController,
  creatorApplicationMeController,
  creatorApplicationPayoutOnboardingController,
  creatorApplicationUpsertController,
  creatorVerificationEligibility,
  platformAdminCreatorApplicationReviewController,
} from '../creatorApplicationControllers';
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

function baseApplicationInput(overrides: Record<string, unknown> = {}) {
  return {
    legalName: 'Nex Teacher',
    displayName: 'Nex Teacher',
    professionalTitle: 'Exam Prep Instructor',
    bio: 'I help students prepare for exams.',
    credentials: 'Certified educator',
    expertise: 'Math, certification prep',
    teachingExperience: 'Five years of tutoring.',
    audience: 'Certification students',
    courseTopics: ['Math foundations'],
    sampleLessonPlan: 'Weekly lesson plan with practice review.',
    links: [],
    payoutContact: 'teacher@example.com',
    identityDocumentFiles: [
      {
        key: 'identity/nex-teacher.pdf',
        name: 'nex-teacher.pdf',
        size: 1000,
        type: 'application/pdf',
      },
    ],
    identityVerificationConsent: true,
    ...overrides,
  };
}

describe('creatorVerificationEligibility', () => {
  it('returns all-false for a missing application', () => {
    const result = creatorVerificationEligibility(null);
    expect(result.eligible).toBe(false);
    expect(result.nexVerified).toBe(false);
  });

  it('is eligible only when application, identity, and payout are all done', () => {
    expect(
      creatorVerificationEligibility({
        status: 'approved',
        identityStatus: 'verified',
        payoutOnboardingStatus: 'complete',
        nexVerified: false,
      }).eligible,
    ).toBe(true);

    expect(
      creatorVerificationEligibility({
        status: 'approved',
        identityStatus: 'verified',
        payoutOnboardingStatus: 'submitted',
        nexVerified: false,
      }).eligible,
    ).toBe(false);

    expect(
      creatorVerificationEligibility({
        status: 'pending',
        identityStatus: 'verified',
        payoutOnboardingStatus: 'complete',
        nexVerified: false,
      }).eligible,
    ).toBe(false);
  });
});

describe('creator application controllers', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  it('lets a user create and update a pending application', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);

    const created = await creatorApplicationUpsertController(
      {
        legalName: 'Nex Teacher',
        displayName: 'Nex Teacher',
        professionalTitle: 'Exam Prep Instructor',
        bio: 'I help students prepare for exams.',
        credentials: 'Certified educator',
        expertise: 'Math, certification prep',
        teachingExperience: 'Five years of tutoring.',
        audience: 'Certification students',
        courseTopics: ['Math foundations'],
        sampleLessonPlan: 'Weekly lesson plan with practice review.',
        links: ['https://example.com/profile'],
        payoutContact: 'teacher@example.com',
        identityVerificationConsent: false,
      },
      context,
    );
    const updated = await creatorApplicationUpsertController(
      {
        legalName: 'Nex Teacher',
        displayName: 'Nex Teacher Updated',
        professionalTitle: 'Senior Exam Prep Instructor',
        bio: 'I help students prepare for certification exams.',
        credentials: 'Certified educator and tutor',
        expertise: 'Math, certification prep',
        teachingExperience: 'Six years of tutoring.',
        audience: 'Certification students',
        courseTopics: [],
        sampleLessonPlan: 'Updated weekly plan.',
        links: [],
        payoutContact: null,
        identityVerificationConsent: false,
      },
      context,
    );
    const me = await creatorApplicationMeController(context);

    expect(created.application.status).toBe('pending');
    expect(updated.application.id).toBe(created.application.id);
    expect(updated.application.status).toBe('pending');
    expect(updated.application.adminNotes).toBeNull();
    expect(me.application?.displayName).toBe('Nex Teacher Updated');
  });

  it('lets a platform admin approve or reject and stores review metadata', async () => {
    const applicant = await createTestUserWithOrganization();
    const admin = await createTestUserWithOrganization({
      email: 'creator-review-admin@example.com',
    });
    ensurePlatformAdmin(admin.user.email);
    const application = await creatorApplicationUpsertController(
      {
        displayName: 'Review Teacher',
        legalName: 'Review Teacher',
        professionalTitle: 'Nursing Instructor',
        bio: 'Experienced prep instructor',
        credentials: 'Ten years of teaching',
        expertise: 'Nursing exam prep',
        teachingExperience: 'Ten years of exam prep.',
        audience: 'Nursing candidates',
        courseTopics: ['Nursing exam prep'],
        sampleLessonPlan: 'Diagnostic, lesson, practice, and review.',
        links: [],
        payoutContact: 'pay@example.com',
        identityDocumentFiles: [
          {
            key: 'identity/review-teacher.pdf',
            name: 'review-teacher.pdf',
            size: 1000,
            type: 'application/pdf',
          },
        ],
        identityVerificationConsent: true,
      },
      createAuthenticatedContext(
        applicant.user,
        applicant.organization,
        applicant.member,
      ),
    );
    await creatorApplicationIdentityScanController(
      createAuthenticatedContext(
        applicant.user,
        applicant.organization,
        applicant.member,
      ),
    );
    const adminContext = createAuthenticatedContext(
      admin.user,
      admin.organization,
      admin.member,
    );

    const approved = await platformAdminCreatorApplicationReviewController(
      { id: application.application.id },
      {
        status: 'approved',
        identityStatus: 'verified',
        adminNotes: 'Approved for phase 1.',
      },
      adminContext,
    );
    const rejected = await platformAdminCreatorApplicationReviewController(
      { id: application.application.id },
      {
        status: 'rejected',
        identityStatus: 'rejected',
        adminNotes: 'Needs updated credentials.',
      },
      adminContext,
    );
    const stored =
      await testPrismaClient().creatorApplication.findUniqueOrThrow({
        where: { id: application.application.id },
      });

    expect(approved.application.status).toBe('approved');
    expect(rejected.application.status).toBe('rejected');
    expect(stored.reviewedByUserId).toBe(admin.user.id);
    expect(stored.reviewedAt).toBeInstanceOf(Date);
    expect(stored.adminNotes).toBe('Needs updated credentials.');
  });

  it('advances payout onboarding through begin and submit', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    await creatorApplicationUpsertController(baseApplicationInput(), context);

    const begun = await creatorApplicationPayoutOnboardingController(
      { action: 'begin' },
      context,
    );
    expect(begun.application.payoutOnboardingStatus).toBe('inProgress');

    const submitted = await creatorApplicationPayoutOnboardingController(
      { action: 'submit' },
      context,
    );
    expect(submitted.application.payoutOnboardingStatus).toBe('submitted');
  });

  it('rejects payout submit when no payout contact is recorded', async () => {
    const { user, organization, member } =
      await createTestUserWithOrganization();
    const context = createAuthenticatedContext(user, organization, member);
    await creatorApplicationUpsertController(
      baseApplicationInput({ payoutContact: null }),
      context,
    );
    await creatorApplicationPayoutOnboardingController(
      { action: 'begin' },
      context,
    );

    await expect(
      creatorApplicationPayoutOnboardingController(
        { action: 'submit' },
        context,
      ),
    ).rejects.toMatchObject({ code: 400 });
  });

  it('only grants Nex Verified once the creator is fully eligible', async () => {
    const applicant = await createTestUserWithOrganization();
    const admin = await createTestUserWithOrganization({
      email: 'creator-nexverified-admin@example.com',
    });
    ensurePlatformAdmin(admin.user.email);
    const applicantContext = createAuthenticatedContext(
      applicant.user,
      applicant.organization,
      applicant.member,
    );
    const adminContext = createAuthenticatedContext(
      admin.user,
      admin.organization,
      admin.member,
    );

    const created = await creatorApplicationUpsertController(
      baseApplicationInput(),
      applicantContext,
    );
    const applicationId = created.application.id;

    // Approved with a verified identity, but payout onboarding is incomplete —
    // granting Nex Verified must be rejected.
    await platformAdminCreatorApplicationReviewController(
      { id: applicationId },
      { status: 'approved', identityStatus: 'verified' },
      adminContext,
    );
    await expect(
      platformAdminCreatorApplicationReviewController(
        { id: applicationId },
        { status: 'approved', nexVerified: true },
        adminContext,
      ),
    ).rejects.toMatchObject({ code: 400 });

    // Complete payout onboarding, then the grant succeeds.
    await platformAdminCreatorApplicationReviewController(
      { id: applicationId },
      { status: 'approved', payoutOnboardingStatus: 'complete' },
      adminContext,
    );
    const granted = await platformAdminCreatorApplicationReviewController(
      { id: applicationId },
      { status: 'approved', nexVerified: true },
      adminContext,
    );

    expect(granted.application.nexVerified).toBe(true);
    expect(granted.eligibility.eligible).toBe(true);
    expect(granted.eligibility.nexVerified).toBe(true);

    // Editing the application sends it back to pending review, which revokes
    // the Nex Verified badge until an admin reviews it again.
    const reEdited = await creatorApplicationUpsertController(
      baseApplicationInput({ bio: 'Updated bio after being verified.' }),
      applicantContext,
    );
    expect(reEdited.application.nexVerified).toBe(false);
    expect(reEdited.application.status).toBe('pending');
  });
});
