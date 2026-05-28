import type { CourseStudyAiQuestion } from './courseStudyAiSchemas';

export interface AiQuizDomainScore {
  domain: string;
  correct: number;
  total: number;
  percent: number;
}

export interface AiQuizGrade {
  correct: number;
  total: number;
  scorePercent: number;
  passed: boolean;
  domainScores: Array<AiQuizDomainScore>;
}

// A self-study quiz has no real passing bar; 70% is used purely for the
// encouraging pass/fail message and the stored `passed` flag.
export const AI_QUIZ_PASS_THRESHOLD = 70;

/**
 * Grades an AI quiz attempt and tallies a per-topic (examDomain) breakdown.
 * Pure - the controller persists the result; weakness detection reads the
 * stored domainScores. Unanswered questions count as incorrect.
 */
export function gradeAiQuiz(
  questions: Array<CourseStudyAiQuestion>,
  answers: Array<{ questionIndex: number; selectedOptionIndex: number }>,
): AiQuizGrade {
  const selectedByIndex = new Map(
    answers.map((answer) => [answer.questionIndex, answer.selectedOptionIndex]),
  );
  const domainMap = new Map<string, { correct: number; total: number }>();
  let correct = 0;

  questions.forEach((question, index) => {
    const selected = selectedByIndex.get(index);
    const isCorrect =
      selected !== undefined && question.options[selected]?.isCorrect === true;
    if (isCorrect) {
      correct += 1;
    }

    const domain = question.examDomain || 'General';
    const entry = domainMap.get(domain) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (isCorrect) {
      entry.correct += 1;
    }
    domainMap.set(domain, entry);
  });

  const total = questions.length;
  const scorePercent = total ? Math.round((correct / total) * 100) : 0;
  const domainScores: Array<AiQuizDomainScore> = [...domainMap.entries()].map(
    ([domain, value]) => ({
      domain,
      correct: value.correct,
      total: value.total,
      percent: Math.round((value.correct / value.total) * 100),
    }),
  );

  return {
    correct,
    total,
    scorePercent,
    passed: scorePercent >= AI_QUIZ_PASS_THRESHOLD,
    domainScores,
  };
}

export interface DomainWeakness {
  domain: string;
  correct: number;
  total: number;
  percent: number;
}

export interface WeaknessReport {
  domains: Array<DomainWeakness>;
  totalAnswered: number;
}

/**
 * Pure core of weakness detection: folds the stored `domainScores` JSON of a
 * set of attempts into one per-topic tally, weakest-first. Kept DB-free (the
 * query lives in courseStudyAiAnalytics) so it is directly unit-testable.
 * Malformed rows/entries are skipped rather than throwing.
 */
export function mergeDomainScores(
  rows: Array<{ domainScores: unknown }>,
): WeaknessReport {
  const tally = new Map<string, { correct: number; total: number }>();

  for (const row of rows) {
    const scores = Array.isArray(row.domainScores)
      ? (row.domainScores as Array<any>)
      : [];
    for (const score of scores) {
      if (!score || typeof score.domain !== 'string') {
        continue;
      }
      const entry = tally.get(score.domain) ?? { correct: 0, total: 0 };
      entry.correct += Number(score.correct) || 0;
      entry.total += Number(score.total) || 0;
      tally.set(score.domain, entry);
    }
  }

  const domains: Array<DomainWeakness> = [...tally.entries()]
    .filter(([, value]) => value.total > 0)
    .map(([domain, value]) => ({
      domain,
      correct: value.correct,
      total: value.total,
      percent: Math.round((value.correct / value.total) * 100),
    }))
    .sort((a, b) => a.percent - b.percent);

  return {
    domains,
    totalAnswered: domains.reduce((sum, item) => sum + item.total, 0),
  };
}
