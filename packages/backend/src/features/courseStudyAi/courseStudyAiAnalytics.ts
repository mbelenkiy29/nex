import { prisma } from '../../prisma';
import { mergeDomainScores } from './courseStudyAiGrading';
import type { WeaknessReport } from './courseStudyAiGrading';

export type { DomainWeakness, WeaknessReport } from './courseStudyAiGrading';

/**
 * Per-topic strengths/gaps for a student in one course — deterministic, no AI.
 * Loads the stored per-domain breakdowns of practice-exam and AI-quiz attempts
 * and merges them via the pure `mergeDomainScores`. Unsubmitted practice
 * attempts carry empty domainScores, so they naturally contribute nothing.
 */
export async function computeWeaknesses(
  courseId: string,
  userId: string,
): Promise<WeaknessReport> {
  const [practiceAttempts, aiAttempts] = await Promise.all([
    prisma.coursePracticeExamAttempt.findMany({
      where: { courseId, userId },
      select: { domainScores: true },
    }),
    prisma.courseAiQuizAttempt.findMany({
      where: { courseId, userId },
      select: { domainScores: true },
    }),
  ]);

  return mergeDomainScores([...practiceAttempts, ...aiAttempts]);
}

/**
 * Whole days from now until an ISO date string. Negative if the date is past;
 * null if unparseable.
 */
export function daysUntilDate(isoDate: string): number | null {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) {
    return null;
  }
  const ms = target.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
