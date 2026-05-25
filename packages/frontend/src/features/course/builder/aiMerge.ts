import {
  newId,
  type BuilderBlock,
  type BuilderQuestion,
  type BuilderQuizLink,
  type BuilderSetForm,
} from '@/features/course/courseBuilderUtils';
import type {
  CourseAiJobType,
  CourseAiQualityReport,
  CourseLessonBlockType,
} from '@/features/course/courseTypes';

// Merge helpers for the AI assistant. Each takes a raw AI JSON `output` and
// folds it into the builder form as DRAFT content — AI questions arrive
// `flagged` and nothing is ever auto-published.

export type AiResult = {
  jobType: CourseAiJobType;
  output: Record<string, unknown>;
  qualityReport?: CourseAiQualityReport | null;
  lessonId?: string | null;
};

export function mergeAiOutline(
  output: Record<string, unknown>,
  setForm: BuilderSetForm,
) {
  const modules = Array.isArray(output.modules) ? output.modules : [];
  setForm((current) => {
    const nextModules = [...current.modules];
    const nextLessons = [...current.lessons];
    for (const rawModule of modules) {
      const moduleData = (rawModule || {}) as Record<string, unknown>;
      const moduleId = newId();
      nextModules.push({
        id: moduleId,
        title: String(moduleData.title || ''),
        description: String(moduleData.description || ''),
        orderIndex: nextModules.length,
      });
      const lessons = Array.isArray(moduleData.lessons)
        ? moduleData.lessons
        : [];
      for (const rawLesson of lessons) {
        const lessonData = (rawLesson || {}) as Record<string, unknown>;
        nextLessons.push({
          id: newId(),
          moduleId,
          title: String(lessonData.title || ''),
          description: String(lessonData.summary || ''),
          content: '',
          videoFiles: [],
          videoUrl: '',
          resourceFiles: [],
          videoDurationSeconds: null,
          isPreview: false,
          isHidden: false,
          orderIndex: nextLessons.length,
        });
      }
    }
    return { ...current, modules: nextModules, lessons: nextLessons };
  });
}

export function mergeAiFlashcards(
  output: Record<string, unknown>,
  setForm: BuilderSetForm,
  labels: { title: string },
) {
  const cards = Array.isArray(output.cards) ? output.cards : [];
  setForm((current) => {
    const setId = newId();
    return {
      ...current,
      flashcardSets: [
        ...current.flashcardSets,
        {
          id: setId,
          moduleId: null,
          lessonId: null,
          title: labels.title,
          description: '',
          orderIndex: current.flashcardSets.length,
        },
      ],
      flashcards: [
        ...current.flashcards,
        ...cards.map((rawCard, index) => {
          const card = (rawCard || {}) as Record<string, unknown>;
          return {
            id: newId(),
            flashcardSetId: setId,
            front: String(card.front || ''),
            back: String(card.back || ''),
            hint: String(card.hint || ''),
            orderIndex: index,
          };
        }),
      ],
    };
  });
}

export function mergeAiQuiz(
  output: Record<string, unknown>,
  setForm: BuilderSetForm,
  labels: { moduleTitle: string; quizTitle: string; questionSource: string },
) {
  const questions = Array.isArray(output.questions) ? output.questions : [];
  setForm((current) => {
    let modules = current.modules;
    let moduleId = modules[0]?.id;
    if (!moduleId) {
      moduleId = newId();
      modules = [
        ...modules,
        {
          id: moduleId,
          title: labels.moduleTitle,
          description: '',
          orderIndex: modules.length,
        },
      ];
    }
    const quizId = newId();
    const newQuestions: BuilderQuestion[] = [];
    const newLinks: BuilderQuizLink[] = [];
    questions.forEach((rawQuestion, index) => {
      const question = (rawQuestion || {}) as Record<string, unknown>;
      const questionId = newId();
      const answers = Array.isArray(question.answers) ? question.answers : [];
      const difficulty = String(question.difficulty || 'medium');
      newQuestions.push({
        id: questionId,
        questionText: String(question.questionText || ''),
        questionType: 'multipleChoice',
        explanation: String(question.explanation || ''),
        difficulty:
          difficulty === 'easy' || difficulty === 'hard'
            ? difficulty
            : 'medium',
        examDomain: String(question.examDomain || ''),
        tags: [],
        source: labels.questionSource,
        aiGenerated: true,
        // AI questions arrive flagged — they must be reviewed before going live.
        status: 'flagged',
        answers: answers.map((rawAnswer, answerIndex) => {
          const answer = (rawAnswer || {}) as Record<string, unknown>;
          return {
            id: newId(),
            answerText: String(answer.answerText || ''),
            isCorrect: Boolean(answer.isCorrect),
            matchText: '',
            explanation: '',
            orderIndex: answerIndex,
          };
        }),
      });
      newLinks.push({
        id: newId(),
        quizId,
        questionId,
        orderIndex: index,
        points: 1,
      });
    });
    return {
      ...current,
      modules,
      quizzes: [
        ...current.quizzes,
        {
          id: quizId,
          moduleId,
          lessonId: null,
          title: labels.quizTitle,
          description: '',
          passingScore: null,
          timeLimitMinutes: null,
          randomizeQuestions: false,
          randomizeAnswers: false,
          showExplanations: true,
          allowRetries: true,
          maxAttempts: null,
          orderIndex: current.quizzes.length,
        },
      ],
      questions: [...current.questions, ...newQuestions],
      quizQuestions: [...current.quizQuestions, ...newLinks],
    };
  });
}

export function mergeAiLesson(
  output: Record<string, unknown>,
  setForm: BuilderSetForm,
  labels: {
    lessonId?: string | null;
    moduleTitle: string;
    lessonTitle: string;
  },
) {
  const blocks = parseLessonBlocks(output);
  const generatedTitle = stringValue(output.lessonTitle);
  const generatedSummary = stringValue(output.lessonSummary);

  setForm((current) => {
    const existingLesson = labels.lessonId
      ? current.lessons.find((lesson) => lesson.id === labels.lessonId)
      : null;

    if (existingLesson) {
      return {
        ...current,
        lessons: current.lessons.map((lesson) =>
          lesson.id === existingLesson.id
            ? {
                ...lesson,
                title: generatedTitle || lesson.title,
                description: generatedSummary || lesson.description,
              }
            : lesson,
        ),
        blocks: [
          ...current.blocks.filter(
            (block) => block.lessonId !== existingLesson.id,
          ),
          ...blocks.map((block, index) => ({
            ...block,
            lessonId: existingLesson.id,
            orderIndex: index,
          })),
        ],
      };
    }

    let modules = current.modules;
    let moduleId = modules[0]?.id;
    if (!moduleId) {
      moduleId = newId();
      modules = [
        ...modules,
        {
          id: moduleId,
          title: labels.moduleTitle,
          description: '',
          orderIndex: modules.length,
        },
      ];
    }

    const lessonId = newId();
    return {
      ...current,
      modules,
      lessons: [
        ...current.lessons,
        {
          id: lessonId,
          moduleId,
          title: generatedTitle || labels.lessonTitle,
          description: generatedSummary,
          content: '',
          videoFiles: [],
          videoUrl: '',
          resourceFiles: [],
          videoDurationSeconds: null,
          isPreview: false,
          isHidden: false,
          orderIndex: current.lessons.length,
        },
      ],
      blocks: [
        ...current.blocks,
        ...blocks.map((block, index) => ({
          ...block,
          lessonId,
          orderIndex: index,
        })),
      ],
    };
  });
}

function parseLessonBlocks(output: Record<string, unknown>): BuilderBlock[] {
  const rawBlocks = Array.isArray(output.blocks) ? output.blocks : [];
  const blocks: BuilderBlock[] = [];
  rawBlocks.forEach((rawBlock) => {
    const block = toRecord(rawBlock);
    const blockType = normalizeBlockType(block.blockType);
    if (!blockType) {
      return;
    }

    blocks.push({
      id: newId(),
      lessonId: '',
      blockType,
      content: normalizeBlockContent(blockType, block.content),
      orderIndex: 0,
    });
  });
  return blocks;
}

function normalizeBlockType(value: unknown): CourseLessonBlockType | null {
  const blockType = String(value || '');
  if (
    blockType === 'heading' ||
    blockType === 'paragraph' ||
    blockType === 'callout' ||
    blockType === 'bulletList' ||
    blockType === 'numberedList' ||
    blockType === 'divider'
  ) {
    return blockType;
  }
  return null;
}

function normalizeBlockContent(
  blockType: CourseLessonBlockType,
  value: unknown,
): Record<string, unknown> {
  const content = toRecord(value);
  if (blockType === 'heading') {
    const level = Number(content.level);
    return {
      level: Number.isFinite(level) && level >= 1 && level <= 4 ? level : 2,
      text: stringValue(content.text),
    };
  }
  if (blockType === 'paragraph') {
    return { text: stringValue(content.text) };
  }
  if (blockType === 'callout') {
    const variant = String(content.variant || 'info');
    return {
      variant:
        variant === 'warning' || variant === 'success' ? variant : 'info',
      text: stringValue(content.text),
    };
  }
  if (blockType === 'bulletList' || blockType === 'numberedList') {
    const items = Array.isArray(content.items) ? content.items : [];
    return {
      items: items.map((item) => String(item || '')).filter(Boolean),
    };
  }
  return {};
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
