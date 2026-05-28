// bypass-RLS: user completes onboarding before a membership row exists
// with the right org context. Scoped to the current user's id only.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../../prisma';
import { AppContext } from '../../../shared/controller/appContext';
import { Error403 } from '../../../shared/errors/Error403';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { invalidateMember } from '../../auth/authCache';
import { filePopulateDownloadUrlInTree } from '../../file/fileService';

/**
 * Sets `Member.onboardingCompletedAt = now()` for the current member.
 * Idempotent: if the timestamp is already set, returns the existing member
 * unchanged. This is the gate the auth guard checks to allow access past
 * `/welcome/courses` — the signup course selector page calls this on
 * both Skip and Continue.
 *
 * The Member must already exist; this controller never auto-creates one.
 * (Better Auth's session-create hook handles Member auto-provisioning at
 * signup time.)
 */
export async function memberCompleteOnboardingController(context: AppContext) {
  if (!context.currentMember) {
    throw new Error403();
  }

  return await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const oldMember = await tx.member.findUniqueOrThrow({
      where: { id: context.currentMember!.id },
    });
    const oldProfile = await tx.studentOnboardingProfile.findUnique({
      where: {
        userId_organizationId: {
          userId: context.currentUser!.id,
          organizationId: context.currentOrganization!.id,
        },
      },
    });
    const completedAt = oldMember.onboardingCompletedAt || new Date();

    if (oldProfile && !oldProfile.completedAt) {
      const updatedProfile = await tx.studentOnboardingProfile.update({
        where: { id: oldProfile.id },
        data: {
          completedAt,
          updatedByUserId: context.currentUser?.id,
          updatedByMemberId: context.currentMember?.id,
        },
      });

      await auditLogCreate({
        entityId: oldProfile.id,
        entityName: 'StudentOnboardingProfile',
        operation: auditLogOperations.update,
        context,
        tx,
        oldData: { completedAt: oldProfile.completedAt },
        newData: { completedAt: updatedProfile.completedAt },
      });
    }

    // Idempotent — second call returns the same row without writing.
    if (oldMember.onboardingCompletedAt) {
      const member = await filePopulateDownloadUrlInTree(oldMember);
      return member;
    }

    const updatedMember = await tx.member.update({
      where: { id: context.currentMember!.id },
      data: {
        onboardingCompletedAt: completedAt,
        updatedByUserId: context.currentUser?.id,
        updatedByMemberId: context.currentMember?.id,
      },
    });

    await auditLogCreate({
      entityId: context.currentMember!.id,
      entityName: 'Member',
      operation: auditLogOperations.update,
      context,
      tx,
      oldData: { onboardingCompletedAt: oldMember.onboardingCompletedAt },
      newData: { onboardingCompletedAt: updatedMember.onboardingCompletedAt },
    });

    await invalidateMember(
      context.currentUser!.id,
      context.currentOrganization!.id,
    );

    const member = await filePopulateDownloadUrlInTree(updatedMember);
    return member;
  });
}
