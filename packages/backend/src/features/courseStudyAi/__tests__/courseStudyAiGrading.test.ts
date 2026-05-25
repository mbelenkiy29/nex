import { describe, expect, it } from 'vitest';
import {
  AI_QUIZ_PASS_THRESHOLD,
  gradeAiQuiz,
  mergeDomainScores,
} from '../courseStudyAiGrading';
import type { CourseStudyAiQuestion } from '../courseStudyAiSchemas';

// Builds a 4-option question; option `correctIndex` is the only correct one.
function question(
  examDomain: string,
  correctIndex: number,
): CourseStudyAiQuestion {
  return {
    questionText: 'Question?',
    explanation: 'Because.',
    examDomain,
    difficulty: 'medium',
    options: [0, 1, 2, 3].map((index) => ({
      text: `Option ${index}`,
      isCorrect: index === correctIndex,
    })),
  };
}

// Picks `selectedOptionIndex` for each question by position.
function answers(selected: Array<number>) {
  return selected.map((selectedOptionIndex, questionIndex) => ({
    questionIndex,
    selectedOptionIndex,
  }));
}

describe('gradeAiQuiz', () => {
  it('scores a fully correct attempt at 100% and passed', () => {
    const questions = [question('Algebra', 0), question('Algebra', 2)];
    const grade = gradeAiQuiz(questions, answers([0, 2]));
    expect(grade.correct).toBe(2);
    expect(grade.total).toBe(2);
    expect(grade.scorePercent).toBe(100);
    expect(grade.passed).toBe(true);
  });

  it('scores a fully incorrect attempt at 0% and not passed', () => {
    const questions = [question('Algebra', 0), question('Algebra', 2)];
    const grade = gradeAiQuiz(questions, answers([1, 1]));
    expect(grade.correct).toBe(0);
    expect(grade.scorePercent).toBe(0);
    expect(grade.passed).toBe(false);
  });

  it('rounds the percentage and passes at or above the threshold', () => {
    const questions = [
      question('Algebra', 0),
      question('Algebra', 0),
      question('Algebra', 0),
      question('Algebra', 0),
    ];
    const grade = gradeAiQuiz(questions, answers([0, 0, 0, 1]));
    expect(grade.correct).toBe(3);
    expect(grade.scorePercent).toBe(75);
    expect(grade.scorePercent).toBeGreaterThanOrEqual(AI_QUIZ_PASS_THRESHOLD);
    expect(grade.passed).toBe(true);
  });

  it('does not pass below the threshold', () => {
    const questions = [
      question('Algebra', 0),
      question('Algebra', 0),
      question('Algebra', 0),
      question('Algebra', 0),
    ];
    const grade = gradeAiQuiz(questions, answers([0, 1, 1, 1]));
    expect(grade.scorePercent).toBe(25);
    expect(grade.passed).toBe(false);
  });

  it('counts an unanswered question as incorrect', () => {
    const questions = [question('Algebra', 0), question('Algebra', 0)];
    // Only the first question is answered.
    const grade = gradeAiQuiz(questions, [
      { questionIndex: 0, selectedOptionIndex: 0 },
    ]);
    expect(grade.correct).toBe(1);
    expect(grade.total).toBe(2);
    expect(grade.scorePercent).toBe(50);
  });

  it('tallies a per-topic (examDomain) breakdown', () => {
    const questions = [
      question('Algebra', 0),
      question('Algebra', 1),
      question('Geometry', 2),
    ];
    const grade = gradeAiQuiz(questions, answers([0, 0, 2]));
    const algebra = grade.domainScores.find((d) => d.domain === 'Algebra');
    const geometry = grade.domainScores.find((d) => d.domain === 'Geometry');
    expect(algebra).toEqual({
      domain: 'Algebra',
      correct: 1,
      total: 2,
      percent: 50,
    });
    expect(geometry).toEqual({
      domain: 'Geometry',
      correct: 1,
      total: 1,
      percent: 100,
    });
  });

  it('buckets a blank examDomain under "General"', () => {
    const grade = gradeAiQuiz([question('', 0)], answers([0]));
    expect(grade.domainScores).toHaveLength(1);
    expect(grade.domainScores[0].domain).toBe('General');
  });

  it('handles an empty question set without dividing by zero', () => {
    const grade = gradeAiQuiz([], []);
    expect(grade).toEqual({
      correct: 0,
      total: 0,
      scorePercent: 0,
      passed: false,
      domainScores: [],
    });
  });
});

describe('mergeDomainScores', () => {
  it('returns an empty report for no attempts', () => {
    expect(mergeDomainScores([])).toEqual({ domains: [], totalAnswered: 0 });
  });

  it('reads the stored domainScores of a single attempt', () => {
    const report = mergeDomainScores([
      { domainScores: [{ domain: 'Algebra', correct: 3, total: 5 }] },
    ]);
    expect(report.domains).toEqual([
      { domain: 'Algebra', correct: 3, total: 5, percent: 60 },
    ]);
    expect(report.totalAnswered).toBe(5);
  });

  it('sums the same domain across multiple attempts', () => {
    const report = mergeDomainScores([
      { domainScores: [{ domain: 'Algebra', correct: 2, total: 4 }] },
      { domainScores: [{ domain: 'Algebra', correct: 4, total: 6 }] },
    ]);
    expect(report.domains).toEqual([
      { domain: 'Algebra', correct: 6, total: 10, percent: 60 },
    ]);
  });

  it('orders domains weakest (lowest percent) first', () => {
    const report = mergeDomainScores([
      {
        domainScores: [
          { domain: 'Strong', correct: 9, total: 10 },
          { domain: 'Weak', correct: 1, total: 10 },
          { domain: 'Mid', correct: 5, total: 10 },
        ],
      },
    ]);
    expect(report.domains.map((d) => d.domain)).toEqual([
      'Weak',
      'Mid',
      'Strong',
    ]);
  });

  it('skips attempts whose domainScores is not an array', () => {
    const report = mergeDomainScores([
      { domainScores: null },
      { domainScores: '[]' },
      { domainScores: [{ domain: 'Algebra', correct: 1, total: 2 }] },
    ]);
    expect(report.domains).toHaveLength(1);
    expect(report.totalAnswered).toBe(2);
  });

  it('skips entries that are missing a domain', () => {
    const report = mergeDomainScores([
      {
        domainScores: [
          { correct: 1, total: 2 },
          { domain: 'Algebra', correct: 1, total: 2 },
        ],
      },
    ]);
    expect(report.domains).toHaveLength(1);
    expect(report.domains[0].domain).toBe('Algebra');
  });

  it('drops domains with a zero total', () => {
    const report = mergeDomainScores([
      { domainScores: [{ domain: 'Empty', correct: 0, total: 0 }] },
    ]);
    expect(report.domains).toEqual([]);
    expect(report.totalAnswered).toBe(0);
  });

  it('rounds the merged percentage', () => {
    const report = mergeDomainScores([
      { domainScores: [{ domain: 'Algebra', correct: 1, total: 3 }] },
    ]);
    expect(report.domains[0].percent).toBe(33);
  });
});
