import { Prisma } from '../../prisma/generated/client';
import { prisma } from '../../prisma';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error404 } from '../../shared/errors/Error404';
import type { FileUploaded } from '../file/fileSchemas';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { authGuardPlatformAdminBackend } from '../platformAdmin/platformAdminGuard';
import { platformAdminListInputSchema } from '../platformAdmin/platformAdminSchemas';
import {
  creatorApplicationReviewInputSchema,
  creatorApplicationUpsertInputSchema,
  payoutOnboardingActionInputSchema,
} from './creatorApplicationSchemas';
import { trustSafetyRequirePolicyAcceptance } from '../trustSafety/trustSafetyService';

const defaultTake = 25;
const supportedIdentityFileTypes = ['image/', 'application/pdf'];

function requireSignedIn(context: AppContext) {
  if (!context.currentUser) {
    throw new Error401();
  }

  return { currentUser: context.currentUser };
}

/**
 * Computes a creator's verification state from a `CreatorApplication`.
 *
 * `eligible` means the creator has cleared every gate required to be granted
 * the "Nex Verified" badge — an approved application, an admin-verified
 * identity, and a completed payout onboarding. `nexVerified` is the separate
 * admin-granted badge itself (a human still decides, even once eligible).
 */
export function creatorVerificationEligibility(
  application: {
    status: string;
    identityStatus: string;
    payoutOnboardingStatus: string;
    nexVerified: boolean;
  } | null,
) {
  const applicationApproved = application?.status === 'approved';
  const identityVerified = application?.identityStatus === 'verified';
  const payoutComplete = application?.payoutOnboardingStatus === 'complete';

  return {
    applicationApproved,
    identityVerified,
    payoutComplete,
    eligible: applicationApproved && identityVerified && payoutComplete,
    nexVerified: application?.nexVerified === true,
  };
}

export async function creatorApplicationMeController(context: AppContext) {
  const { currentUser } = requireSignedIn(context);
  const application = await prisma.creatorApplication.findUnique({
    where: { userId: currentUser.id },
  });

  return {
    application,
    eligibility: creatorVerificationEligibility(application),
  };
}

function creatorApplicationFiles(value: Prisma.JsonValue | null | undefined) {
  return Array.isArray(value) ? (value as unknown as FileUploaded[]) : [];
}

function creatorApplicationIdentityInitialStatus(
  files: FileUploaded[],
  hasConsent: boolean,
) {
  if (!files.length || !hasConsent) {
    return 'needsDocuments';
  }

  return 'notStarted';
}

function creatorApplicationIdentityFileKeys(files: FileUploaded[]) {
  return files.map((file) => file.key).sort().join('|');
}

/**
 * Runs an AUTOMATED PRE-SCREEN of a creator's identity submission — NOT a real
 * identity / KYC verification.
 *
 * It only performs heuristic checks (consent recorded, document present, file
 * type/count, legal name shape). An `identityScanStatus` of `'passed'` means
 * the submission cleared these basic checks and is ready for a HUMAN to review
 * — it does not mean the person's identity was verified. Genuine verification
 * (document authenticity, liveness, government-ID matching) would require
 * integrating a dedicated KYC provider.
 */
function creatorApplicationRunIdentityScan(application: {
  legalName?: string | null;
  identityDocumentFiles?: Prisma.JsonValue | null;
  identityVerificationConsent: boolean;
}) {
  const files = creatorApplicationFiles(application.identityDocumentFiles);
  const checks: string[] = [];
  let hasBlockingIssue = false;
  let needsManualAttention = false;

  if (application.identityVerificationConsent) {
    checks.push('consent_recorded');
  } else {
    checks.push('consent_missing');
    hasBlockingIssue = true;
  }

  if (files.length > 0) {
    checks.push('document_uploaded');
  } else {
    checks.push('document_missing');
    hasBlockingIssue = true;
  }

  if (files.length > 3) {
    checks.push('too_many_documents');
    hasBlockingIssue = true;
  }

  const unsupportedFile = files.find(
    (file) =>
      file.type &&
      !supportedIdentityFileTypes.some((type) => file.type?.startsWith(type)),
  );

  if (unsupportedFile) {
    checks.push('file_type_needs_review');
    needsManualAttention = true;
  } else if (files.length > 0) {
    checks.push('file_type_supported');
  }

  const nameParts = application.legalName?.trim().split(/\s+/) || [];
  if (nameParts.length >= 2) {
    checks.push('legal_name_present');
  } else {
    checks.push('legal_name_needs_review');
    needsManualAttention = true;
  }

  if (hasBlockingIssue) {
    return {
      identityStatus: 'needsDocuments',
      identityScanStatus: 'failed',
      identityScanChecks: checks,
    };
  }

  if (needsManualAttention) {
    return {
      identityStatus: 'needsDocuments',
      identityScanStatus: 'needsReview',
      identityScanChecks: checks,
    };
  }

  return {
    identityStatus: 'readyForReview',
    identityScanStatus: 'passed',
    identityScanChecks: [...checks, 'manual_review_required'],
  };
}

export async function creatorApplicationUpsertController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const data = creatorApplicationUpsertInputSchema.parse(body);
  const oldData = await prisma.creatorApplication.findUnique({
    where: { userId: currentUser.id },
  });
  const filesChanged =
    creatorApplicationIdentityFileKeys(
      creatorApplicationFiles(oldData?.identityDocumentFiles),
    ) !== creatorApplicationIdentityFileKeys(data.identityDocumentFiles);
  const identityStatus =
    oldData && !filesChanged
      ? oldData.identityStatus
      : creatorApplicationIdentityInitialStatus(
          data.identityDocumentFiles,
          data.identityVerificationConsent,
        );

  const application = await prisma.creatorApplication.upsert({
    where: { userId: currentUser.id },
    create: {
      ...data,
      userId: currentUser.id,
      memberId: context.currentMember?.id || null,
      status: 'pending',
      identityStatus,
      identityScanStatus: 'notStarted',
      identityScanChecks: [],
    },
    update: {
      ...data,
      memberId: context.currentMember?.id || null,
      status: 'pending',
      adminNotes: null,
      reviewedByUserId: null,
      reviewedAt: null,
      identityStatus,
      identityScanStatus: filesChanged ? 'notStarted' : undefined,
      identityScanSummary: filesChanged ? null : undefined,
      identityScanChecks: filesChanged ? [] : undefined,
      identityScannedAt: filesChanged ? null : undefined,
      identityReviewedByUserId: filesChanged ? null : undefined,
      identityReviewedAt: filesChanged ? null : undefined,
      // Editing the application sends it back to `pending` review, so the
      // admin-granted "Nex Verified" badge is revoked until it is re-reviewed.
      nexVerified: false,
      nexVerifiedAt: null,
      nexVerifiedByUserId: null,
    },
  });

  await auditLogCreate({
    entityId: application.id,
    entityName: 'CreatorApplication',
    operation: oldData ? auditLogOperations.update : auditLogOperations.create,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: application,
  });

  return { application };
}

export async function creatorApplicationIdentityScanController(
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const oldData = await prisma.creatorApplication.findUnique({
    where: { userId: currentUser.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const scan = creatorApplicationRunIdentityScan(oldData);
  const application = await prisma.creatorApplication.update({
    where: { userId: currentUser.id },
    data: {
      identityStatus: scan.identityStatus,
      identityScanStatus: scan.identityScanStatus,
      identityScanChecks: scan.identityScanChecks,
      identityScanSummary: null,
      identityScannedAt: new Date(),
      // A re-scan re-evaluates identity (it can never land on `verified`), so
      // any prior admin identity verification — and the "Nex Verified" badge
      // that depends on it — is revoked until an admin reviews again.
      nexVerified: false,
      nexVerifiedAt: null,
      nexVerifiedByUserId: null,
    },
  });

  await auditLogCreate({
    entityId: application.id,
    entityName: 'CreatorApplication',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: application,
  });

  return { application };
}

/**
 * Creator-driven payout onboarding transitions. There is no Stripe Connect
 * integration — this only advances a tracked status the creator and an admin
 * read together (`begin` -> inProgress, `submit` -> submitted). An admin then
 * resolves `submitted` to `complete` or `actionRequired` via the review route.
 */
export async function creatorApplicationPayoutOnboardingController(
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = requireSignedIn(context);
  const { action } = payoutOnboardingActionInputSchema.parse(body);
  const oldData = await prisma.creatorApplication.findUnique({
    where: { userId: currentUser.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  let payoutOnboardingStatus: string;

  if (action === 'begin') {
    if (
      oldData.payoutOnboardingStatus !== 'notStarted' &&
      oldData.payoutOnboardingStatus !== 'actionRequired'
    ) {
      throw new Error400(
        context.dictionary.creatorApplication.errors.payoutOnboardingInvalid,
      );
    }
    payoutOnboardingStatus = 'inProgress';
  } else {
    await trustSafetyRequirePolicyAcceptance('teacherTerms', context);

    if (
      oldData.payoutOnboardingStatus !== 'inProgress' &&
      oldData.payoutOnboardingStatus !== 'actionRequired'
    ) {
      throw new Error400(
        context.dictionary.creatorApplication.errors.payoutOnboardingInvalid,
      );
    }
    if (!oldData.payoutContact?.trim()) {
      throw new Error400(
        context.dictionary.creatorApplication.errors.payoutContactRequired,
      );
    }
    payoutOnboardingStatus = 'submitted';
  }

  const application = await prisma.creatorApplication.update({
    where: { userId: currentUser.id },
    data: {
      payoutOnboardingStatus,
      payoutOnboardingUpdatedAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: application.id,
    entityName: 'CreatorApplication',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    memberId: context.currentMember?.id || null,
    oldData,
    newData: application,
  });

  return {
    application,
    eligibility: creatorVerificationEligibility(application),
  };
}

export async function platformAdminCreatorApplicationListController(
  query: unknown,
  context: AppContext,
) {
  authGuardPlatformAdminBackend(context);
  const data = platformAdminListInputSchema.parse(query);
  const status = data.filter?.status?.trim();
  const search = data.filter?.search?.trim();
  const whereAnd: Array<Prisma.CreatorApplicationWhereInput> = [];

  if (status && status !== 'all') {
    whereAnd.push({ status });
  }

  if (search) {
    whereAnd.push({
      OR: [
        { displayName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { credentials: { contains: search, mode: 'insensitive' } },
        { expertise: { contains: search, mode: 'insensitive' } },
        { legalName: { contains: search, mode: 'insensitive' } },
        { professionalTitle: { contains: search, mode: 'insensitive' } },
        { audience: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  const where: Prisma.CreatorApplicationWhereInput = whereAnd.length
    ? { AND: whereAnd }
    : {};
  const [count, applications] = await Promise.all([
    prisma.creatorApplication.count({ where }),
    prisma.creatorApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: data.skip || 0,
      take: data.take || defaultTake,
    }),
  ]);

  return {
    count,
    applications: applications.map((application) => ({
      ...application,
      eligibility: creatorVerificationEligibility(application),
    })),
  };
}

export async function platformAdminCreatorApplicationReviewController(
  params: { id: string },
  body: unknown,
  context: AppContext,
) {
  const { currentUser } = authGuardPlatformAdminBackend(context);
  const data = creatorApplicationReviewInputSchema.parse(body);
  const oldData = await prisma.creatorApplication.findUnique({
    where: { id: params.id },
  });

  if (!oldData) {
    throw new Error404();
  }

  const nextIdentityStatus = data.identityStatus || oldData.identityStatus;
  const nextPayoutStatus =
    data.payoutOnboardingStatus || oldData.payoutOnboardingStatus;

  if (data.status === 'approved' && nextIdentityStatus !== 'verified') {
    throw new Error400();
  }

  const projectedEligible = creatorVerificationEligibility({
    status: data.status,
    identityStatus: nextIdentityStatus,
    payoutOnboardingStatus: nextPayoutStatus,
    nexVerified: false,
  }).eligible;

  // Granting "Nex Verified" requires the creator to be fully eligible: an
  // approved application, a verified identity, and completed payout onboarding.
  if (data.nexVerified === true && !projectedEligible) {
    throw new Error400(
      context.dictionary.creatorApplication.errors.nexVerifiedNotEligible,
    );
  }

  // The badge can only persist while the creator stays eligible: a rejection
  // or any regression in identity/payout state revokes it automatically, even
  // when the admin did not explicitly touch the `nexVerified` flag.
  const nextNexVerified =
    data.nexVerified ?? (oldData.nexVerified && projectedEligible);
  const becameVerified = nextNexVerified && !oldData.nexVerified;
  const lostVerified = !nextNexVerified;

  const application = await prisma.creatorApplication.update({
    where: { id: params.id },
    data: {
      status: data.status,
      adminNotes: data.adminNotes || null,
      identityStatus: nextIdentityStatus,
      identityReviewedByUserId: data.identityStatus ? currentUser.id : undefined,
      identityReviewedAt: data.identityStatus ? new Date() : undefined,
      payoutOnboardingStatus: data.payoutOnboardingStatus || undefined,
      payoutOnboardingNotes:
        data.payoutOnboardingNotes !== undefined
          ? data.payoutOnboardingNotes
          : undefined,
      payoutOnboardingUpdatedAt: data.payoutOnboardingStatus
        ? new Date()
        : undefined,
      nexVerified: nextNexVerified,
      nexVerifiedAt: becameVerified
        ? new Date()
        : lostVerified
          ? null
          : undefined,
      nexVerifiedByUserId: becameVerified
        ? currentUser.id
        : lostVerified
          ? null
          : undefined,
      reviewedByUserId: currentUser.id,
      reviewedAt: new Date(),
    },
  });

  await auditLogCreate({
    entityId: application.id,
    entityName: 'CreatorApplication',
    operation: auditLogOperations.update,
    organizationId: null,
    userId: currentUser.id,
    oldData,
    newData: application,
  });

  return {
    application,
    eligibility: creatorVerificationEligibility(application),
  };
}
