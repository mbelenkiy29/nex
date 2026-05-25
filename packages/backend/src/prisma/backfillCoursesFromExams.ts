// bypass-RLS: one-off migration script runs from the CLI with no HTTP
// request, no session, and intentionally touches every org's data.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from './index';
import { pathToFileURL } from 'url';

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'course';
}

async function uniqueCourseSlug(title: string, seed: string) {
  const base = `${slugify(title)}-${seed.slice(0, 8)}`;
  let slug = base;
  let index = 2;

  while (
    await prismaDangerouslyBypassRLS.course.findUnique({ where: { slug } })
  ) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

async function ensureExamCourse(examId: string) {
  return await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const exam = await tx.exam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        organizationId: true,
        createdByUserId: true,
        updatedByUserId: true,
        courseId: true,
      },
    });

    if (!exam) {
      return null;
    }

    let courseId = exam.courseId;

    if (!courseId) {
      const course = await tx.course.create({
        data: {
          title: exam.name,
          slug: await uniqueCourseSlug(exam.name, exam.id),
          description: exam.description,
          category: exam.code,
          status: 'draft',
          accessType: 'free',
          nexVerified: false,
          creatorOrganizationId: exam.organizationId,
          createdByUserId: exam.createdByUserId,
          updatedByUserId: exam.updatedByUserId || exam.createdByUserId,
        },
        select: { id: true },
      });

      courseId = course.id;

      await tx.exam.update({
        where: { id: exam.id },
        data: { courseId },
      });
    }

    await Promise.all([
      tx.chapter.updateMany({
        where: { examId: exam.id, courseId: null },
        data: { courseId },
      }),
      tx.concept.updateMany({
        where: { examId: exam.id, courseId: null },
        data: { courseId },
      }),
      tx.examType.updateMany({
        where: { examId: exam.id, courseId: null },
        data: { courseId },
      }),
      tx.documentUpload.updateMany({
        where: { examId: exam.id, courseId: null },
        data: { courseId },
      }),
      tx.lesson.updateMany({
        where: { chapter: { examId: exam.id }, courseId: null },
        data: { courseId },
      }),
      tx.practiceQuestion.updateMany({
        where: { chapter: { examId: exam.id }, courseId: null },
        data: { courseId },
      }),
      tx.examInstance.updateMany({
        where: { examType: { examId: exam.id }, courseId: null },
        data: { courseId },
      }),
      tx.studyNote.updateMany({
        where: {
          courseId: null,
          OR: [
            { chapter: { examId: exam.id } },
            { lesson: { chapter: { examId: exam.id } } },
          ],
        },
        data: { courseId },
      }),
    ]);

    return courseId;
  });
}

export async function backfillCoursesFromExams() {
  const exams = await prismaDangerouslyBypassRLS.exam.findMany({
    select: { id: true },
    orderBy: { createdAt: 'asc' },
  });

  let linked = 0;

  for (const exam of exams) {
    const courseId = await ensureExamCourse(exam.id);
    if (courseId) {
      linked += 1;
    }
  }

  return { linked };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await backfillCoursesFromExams();
  console.log(`Backfilled course links for ${result.linked} exams.`);
  await prismaDangerouslyBypassRLS.$disconnect();
}
