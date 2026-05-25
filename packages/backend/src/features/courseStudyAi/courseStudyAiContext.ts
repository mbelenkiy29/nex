import { AppContext } from '../../shared/controller/appContext';
import { Error404 } from '../../shared/errors/Error404';
import { courseEnsureLearningAccess } from '../course/courseControllers';

// Caps so a single course never blows past a reasonable prompt size.
const MAX_LESSON_CHARS = 9000;
const MAX_MODULE_CHARS = 16000;
const MAX_LESSON_IN_MODULE = 2200;

/**
 * Flattens the modern block-editor content (CourseLessonBlock[]) into plain
 * text the model can read. The legacy `courseBuildAiContext` only reads the
 * old `CourseLesson.content` markdown — this also covers block-based lessons.
 */
function flattenBlocks(blocks: Array<{ blockType: string; content: any }>) {
  const parts: Array<string> = [];
  for (const block of blocks || []) {
    const content = (block.content || {}) as Record<string, any>;
    switch (block.blockType) {
      case 'heading':
        if (content.text) parts.push(`## ${content.text}`);
        break;
      case 'paragraph':
        if (content.text) parts.push(String(content.text));
        break;
      case 'callout':
        if (content.text) parts.push(`> ${content.text}`);
        break;
      case 'list':
        if (Array.isArray(content.items)) {
          parts.push(
            content.items
              .map(
                (item: any) =>
                  `- ${typeof item === 'string' ? item : (item?.text ?? '')}`,
              )
              .join('\n'),
          );
        }
        break;
      case 'codeBlock':
        if (content.code) parts.push(`\`\`\`\n${content.code}\n\`\`\``);
        break;
      default:
        // image / video / pdf / quizEmbed / flashcardSet / table / aiTutorPrompt
        // carry no prose worth feeding the model.
        break;
    }
  }
  return parts.join('\n\n').trim();
}

// Combined block text + legacy markdown for one lesson.
function lessonText(lesson: any) {
  const blockText = flattenBlocks(lesson.blocks || []);
  const legacy = String(lesson.content || '').trim();
  return [blockText, legacy].filter(Boolean).join('\n\n').trim();
}

/**
 * Builds a focused, single-lesson context for the explain / summarize features.
 * Throws 401/403/404 via courseEnsureLearningAccess when the student is not
 * enrolled or the course is not published.
 */
export async function buildLessonContext(
  courseId: string,
  lessonId: string,
  context: AppContext,
) {
  const { course } = await courseEnsureLearningAccess(courseId, context);
  const lesson = (course.lessons as Array<any>).find(
    (item) => item.id === lessonId,
  );
  if (!lesson) {
    throw new Error404();
  }
  const module = (course.modules as Array<any>).find(
    (item) => item.id === lesson.moduleId,
  );

  const body = lessonText(lesson).slice(0, MAX_LESSON_CHARS);
  const text = [
    `Course: ${course.title}`,
    module ? `Module: ${module.title}` : null,
    `Lesson: ${lesson.title}`,
    lesson.description ? `Lesson summary: ${lesson.description}` : null,
    '',
    body || '(This lesson has no written content yet.)',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return { course, lesson, module, text, hasContent: Boolean(body) };
}

/**
 * Builds a module-scoped context for quiz / practice generation. Module-scoped
 * (not whole-course) to keep the prompt — and the token cost — bounded.
 */
export async function buildModuleContext(
  courseId: string,
  moduleId: string,
  context: AppContext,
) {
  const { course } = await courseEnsureLearningAccess(courseId, context);
  const module = (course.modules as Array<any>).find(
    (item) => item.id === moduleId,
  );
  if (!module) {
    throw new Error404();
  }
  const lessons = (course.lessons as Array<any>).filter(
    (item) => item.moduleId === moduleId,
  );

  const lines: Array<string> = [
    `Course: ${course.title}`,
    `Module: ${module.title}`,
  ];
  if (module.description) {
    lines.push(`Module description: ${module.description}`);
  }
  lines.push('');

  let hasContent = false;
  for (const lesson of lessons) {
    lines.push(`### Lesson: ${lesson.title}`);
    const body = lessonText(lesson);
    if (body) {
      hasContent = true;
      lines.push(body.slice(0, MAX_LESSON_IN_MODULE));
    }
  }

  return {
    course,
    module,
    lessons,
    text: lines.join('\n\n').slice(0, MAX_MODULE_CHARS),
    hasContent,
  };
}

/**
 * Plain-text context shared by the "what to study next" and study-plan
 * features: topic performance + lesson progress (+ days until the exam).
 * Outline only — no lesson body text — to keep these analytical calls cheap.
 */
export function buildStudyAnalyticsText(
  course: any,
  weaknesses: {
    domains: Array<{
      domain: string;
      correct: number;
      total: number;
      percent: number;
    }>;
  },
  completedLessonIds: Set<string>,
  examInfo?: { examName?: string | null; daysUntil?: number | null },
): string {
  const lines: Array<string> = [`Course: ${course.title}`];

  if (examInfo?.daysUntil != null && examInfo.daysUntil >= 0) {
    lines.push(
      `Days until the exam: ${examInfo.daysUntil}${
        examInfo.examName ? ` (${examInfo.examName})` : ''
      }`,
    );
  }

  if (weaknesses.domains.length) {
    lines.push('', 'Topic performance (weakest first):');
    for (const domain of weaknesses.domains) {
      lines.push(
        `- ${domain.domain}: ${domain.percent}% (${domain.correct}/${domain.total})`,
      );
    }
  } else {
    lines.push('', 'No quiz or practice results recorded yet.');
  }

  const lessons = (course.lessons as Array<any>) || [];
  const modules = (course.modules as Array<any>) || [];
  const incomplete = lessons.filter(
    (lesson) => !completedLessonIds.has(lesson.id),
  );
  lines.push(
    '',
    `Lesson progress: ${lessons.length - incomplete.length} of ${lessons.length} lessons complete.`,
  );
  if (incomplete.length) {
    lines.push('Lessons not yet completed:');
    for (const lesson of incomplete.slice(0, 40)) {
      const module = modules.find((item) => item.id === lesson.moduleId);
      lines.push(`- ${module ? `${module.title} / ` : ''}${lesson.title}`);
    }
  }

  return lines.join('\n');
}
