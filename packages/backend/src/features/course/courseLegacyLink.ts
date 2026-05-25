import { Prisma } from '../../prisma/generated/client';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { prisma } from '../../prisma';

type CourseLookupClient = Pick<Prisma.TransactionClient, 'course'>;

export async function courseLegacyLinkValidate(
  courseId: string | null | undefined,
  context: AppContext,
  tx: CourseLookupClient = prisma as unknown as CourseLookupClient,
) {
  if (!courseId) {
    return;
  }

  const currentOrganization = context.currentOrganization;
  const course = await tx.course.findFirst({
    where: {
      id: courseId,
      OR: [
        { creatorOrganizationId: null },
        ...(currentOrganization
          ? [{ creatorOrganizationId: currentOrganization.id }]
          : []),
      ],
    },
    select: { id: true },
  });

  if (!course) {
    throw new Error400(context.dictionary.course.errors.invalidCourseLink);
  }
}
