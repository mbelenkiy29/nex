import type { CourseAiJobType } from './courseAiSchemas';

export type CourseAiQualitySeverity = 'info' | 'warning' | 'critical';

export type CourseAiQualityIssueCode =
  | 'missingSources'
  | 'outlineEmpty'
  | 'outlineThin'
  | 'emptyTitle'
  | 'questionInvalidCorrectCount'
  | 'questionTooFewOptions'
  | 'questionMissingExplanation'
  | 'questionMissingDomain'
  | 'duplicateQuestion'
  | 'flashcardsThin'
  | 'lessonNoBlocks';

export type CourseAiQualityIssue = {
  code: CourseAiQualityIssueCode;
  severity: CourseAiQualitySeverity;
  target?: string;
  detail?: string;
};

export type CourseAiQualityReport = {
  issues: CourseAiQualityIssue[];
  summary: Record<CourseAiQualitySeverity, number>;
};

export function courseAiBuildQualityReport(input: {
  jobType: CourseAiJobType;
  output: unknown;
  existingQuestionTexts?: string[];
}): CourseAiQualityReport {
  const output = isRecord(input.output) ? input.output : {};
  const issues: CourseAiQualityIssue[] = [];

  if (!hasSources(output.sources)) {
    issues.push({ code: 'missingSources', severity: 'warning' });
  }

  if (input.jobType === 'generateOutline') {
    issues.push(...outlineIssues(output));
  }

  if (input.jobType === 'generateQuiz') {
    issues.push(...questionIssues(output, input.existingQuestionTexts || []));
  }

  if (input.jobType === 'generateFlashcards') {
    issues.push(...flashcardIssues(output));
  }

  if (input.jobType === 'generateLesson' || input.jobType === 'improveLesson') {
    issues.push(...lessonIssues(output));
  }

  return {
    issues,
    summary: {
      info: issues.filter((issue) => issue.severity === 'info').length,
      warning: issues.filter((issue) => issue.severity === 'warning').length,
      critical: issues.filter((issue) => issue.severity === 'critical').length,
    },
  };
}

function outlineIssues(
  output: Record<string, unknown>,
): CourseAiQualityIssue[] {
  const modules = Array.isArray(output.modules) ? output.modules : [];
  const issues: CourseAiQualityIssue[] = [];
  if (!modules.length) {
    issues.push({ code: 'outlineEmpty', severity: 'critical' });
    return issues;
  }

  const lessonCount = modules.reduce<number>((total, rawModule) => {
    const module = isRecord(rawModule) ? rawModule : {};
    return total + (Array.isArray(module.lessons) ? module.lessons.length : 0);
  }, 0);
  if (modules.length < 2 || lessonCount < 4) {
    issues.push({ code: 'outlineThin', severity: 'warning' });
  }

  modules.forEach((rawModule, moduleIndex) => {
    const module = isRecord(rawModule) ? rawModule : {};
    if (!stringValue(module.title)) {
      issues.push({
        code: 'emptyTitle',
        severity: 'warning',
        target: `module:${moduleIndex + 1}`,
      });
    }

    const lessons = Array.isArray(module.lessons) ? module.lessons : [];
    lessons.forEach((rawLesson, lessonIndex) => {
      const lesson = isRecord(rawLesson) ? rawLesson : {};
      if (!stringValue(lesson.title)) {
        issues.push({
          code: 'emptyTitle',
          severity: 'warning',
          target: `module:${moduleIndex + 1}:lesson:${lessonIndex + 1}`,
        });
      }
    });
  });

  return issues;
}

function questionIssues(
  output: Record<string, unknown>,
  existingQuestionTexts: string[],
) {
  const questions = Array.isArray(output.questions) ? output.questions : [];
  const issues: CourseAiQualityIssue[] = [];
  const seen = new Set<string>();
  const existing = new Set(existingQuestionTexts.map(normalizeQuestionText));

  questions.forEach((rawQuestion, index) => {
    const question = isRecord(rawQuestion) ? rawQuestion : {};
    const target = `question:${index + 1}`;
    const text = stringValue(question.questionText);
    const normalized = normalizeQuestionText(text);
    if (normalized && (seen.has(normalized) || existing.has(normalized))) {
      issues.push({
        code: 'duplicateQuestion',
        severity: 'warning',
        target,
      });
    }
    if (normalized) {
      seen.add(normalized);
    }

    const answers = Array.isArray(question.answers) ? question.answers : [];
    const correct = answers.filter(
      (answer) => isRecord(answer) && Boolean(answer.isCorrect),
    ).length;
    if (correct !== 1) {
      issues.push({
        code: 'questionInvalidCorrectCount',
        severity: 'critical',
        target,
      });
    }
    if (answers.length < 3) {
      issues.push({
        code: 'questionTooFewOptions',
        severity: 'warning',
        target,
      });
    }
    if (!stringValue(question.explanation)) {
      issues.push({
        code: 'questionMissingExplanation',
        severity: 'warning',
        target,
      });
    }
    if (!stringValue(question.examDomain)) {
      issues.push({
        code: 'questionMissingDomain',
        severity: 'warning',
        target,
      });
    }
  });

  return issues;
}

function flashcardIssues(
  output: Record<string, unknown>,
): CourseAiQualityIssue[] {
  const cards = Array.isArray(output.cards) ? output.cards : [];
  return cards.length < 5
    ? [{ code: 'flashcardsThin', severity: 'warning' as const }]
    : [];
}

function lessonIssues(output: Record<string, unknown>): CourseAiQualityIssue[] {
  const blocks = Array.isArray(output.blocks) ? output.blocks : [];
  return blocks.length
    ? []
    : [{ code: 'lessonNoBlocks', severity: 'critical' as const }];
}

function hasSources(value: unknown) {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.some((source) => {
    if (!isRecord(source)) {
      return typeof source === 'string' && source.trim().length > 0;
    }

    return Boolean(
      stringValue(source.title) ||
      stringValue(source.url) ||
      stringValue(source.note),
    );
  });
}

function normalizeQuestionText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
