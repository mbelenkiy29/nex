import { prismaDangerouslyBypassRLS } from '../../prisma';
import type { AppContext } from '../../shared/controller/appContext';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';

export async function courseReviewDecisionCreate(
  input: {
    courseId: string;
    decision: string;
    reviewNotes?: string | null;
    reviewedByUserId?: string | null;
    previousStatus: string;
    nextStatus: string;
  },
  context: AppContext,
) {
  const decision = await prismaDangerouslyBypassRLS.courseReviewDecision.create(
    {
      data: {
        courseId: input.courseId,
        decision: input.decision,
        reviewNotes: input.reviewNotes || null,
        reviewedByUserId: input.reviewedByUserId || null,
        previousStatus: input.previousStatus,
        nextStatus: input.nextStatus,
      },
    },
  );

  await auditLogCreate({
    entityId: decision.id,
    entityName: 'CourseReviewDecision',
    operation: auditLogOperations.create,
    organizationId: null,
    userId: input.reviewedByUserId || context.currentUser?.id || null,
    memberId: context.currentMember?.id || null,
    newData: decision,
  });

  return decision;
}

export async function courseReviewDecisionFindMany(courseId: string) {
  return await prismaDangerouslyBypassRLS.courseReviewDecision.findMany({
    where: { courseId },
    include: {
      reviewedByUser: { select: { id: true, name: true, email: true } },
    },
    orderBy: { reviewedAt: 'desc' },
    take: 100,
  });
}
