import type {
  Course,
  CourseAssignmentRubricCriterion,
  CourseFile,
  CourseLessonBlockType,
  CourseQuestionDifficulty,
  CourseQuestionType,
  CourseQuestionStatus,
  CourseVisibility,
} from '@/features/course/courseTypes';

// ----- builder form types (flat arrays, mirror courseBuilderManageInputSchema) -----

export type BuilderModule = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
};

export type BuilderLesson = {
  id: string;
  moduleId: string | null;
  title: string;
  description: string;
  content: string;
  videoFiles: CourseFile[];
  videoUrl: string;
  resourceFiles: CourseFile[];
  videoDurationSeconds: number | null;
  isPreview: boolean;
  isHidden: boolean;
  orderIndex: number;
};

export type BuilderAssignment = {
  id: string;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  prompt: string;
  dueDaysAfterEnroll: number | null;
  rubric: CourseAssignmentRubricCriterion[];
  allowResubmissions: boolean;
  maxAttempts: number | null;
  orderIndex: number;
};

export type BuilderTextItem = {
  id: string;
  text: string;
  orderIndex: number;
};

export type BuilderFlashcardSet = {
  id: string;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  description: string;
  orderIndex: number;
};

export type BuilderFlashcard = {
  id: string;
  flashcardSetId: string;
  front: string;
  back: string;
  hint: string;
  orderIndex: number;
};

export type BuilderBlock = {
  id: string;
  lessonId: string;
  blockType: CourseLessonBlockType;
  content: Record<string, unknown>;
  orderIndex: number;
};

// A reusable question-bank entry held in the builder form.
export type BuilderQuestionAnswer = {
  id: string;
  answerText: string;
  isCorrect: boolean;
  matchText: string;
  explanation: string;
  orderIndex: number;
};

export type BuilderQuestion = {
  id: string;
  questionText: string;
  questionType: CourseQuestionType;
  explanation: string;
  difficulty: CourseQuestionDifficulty;
  examDomain: string;
  tags: string[];
  source: string;
  aiGenerated: boolean;
  status: CourseQuestionStatus;
  answers: BuilderQuestionAnswer[];
};

export type BuilderQuiz = {
  id: string;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  description: string;
  passingScore: number | null;
  timeLimitMinutes: number | null;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showExplanations: boolean;
  allowRetries: boolean;
  maxAttempts: number | null;
  orderIndex: number;
};

// Join row linking a bank question into a quiz.
export type BuilderQuizLink = {
  id: string;
  quizId: string;
  questionId: string;
  orderIndex: number;
  points: number;
};

export type BuilderPracticeExamRule = {
  id: string;
  practiceExamId: string;
  examDomain: string;
  questionCount: number;
  difficulty: CourseQuestionDifficulty | null;
  orderIndex: number;
};

export type BuilderPracticeExam = {
  id: string;
  title: string;
  description: string;
  examType: string;
  totalQuestions: number;
  timeLimitMinutes: number | null;
  passingScore: number | null;
  randomizeQuestions: boolean;
  simulateRealExam: boolean;
  orderIndex: number;
};

export type CourseBuilderForm = {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  // CourseCategory.id when the creator picks from the curated dropdown.
  // Empty string = "no category selected" so the dropdown can stay
  // controlled. The build-payload step converts '' → null.
  categoryId: string;
  examType: string;
  difficulty: string;
  language: string;
  visibility: CourseVisibility;
  audience: string[];
  certificateEnabled: boolean;
  thumbnail: CourseFile[];
  introVideoFiles: CourseFile[];
  promoVideoFiles: CourseFile[];
  modules: BuilderModule[];
  lessons: BuilderLesson[];
  assignments: BuilderAssignment[];
  questions: BuilderQuestion[];
  quizzes: BuilderQuiz[];
  quizQuestions: BuilderQuizLink[];
  practiceExams: BuilderPracticeExam[];
  practiceExamRules: BuilderPracticeExamRule[];
  outcomes: BuilderTextItem[];
  requirements: BuilderTextItem[];
  flashcardSets: BuilderFlashcardSet[];
  flashcards: BuilderFlashcard[];
  blocks: BuilderBlock[];
};

export type CourseBuilderSection =
  | 'goals'
  | 'landing-page'
  | 'curriculum'
  | 'practice-exams'
  | 'flashcards'
  | 'ai-assistant'
  | 'submit';

// Functional updater shared by every builder component — mirrors the signature
// of the original page's `setForm`/`mutate` so components are context-agnostic.
export type BuilderSetForm = (
  updater: (form: CourseBuilderForm) => CourseBuilderForm,
) => void;

// Default `content` payload for a freshly-added block of a given type.
export function emptyBlockContent(
  blockType: CourseLessonBlockType,
): Record<string, unknown> {
  switch (blockType) {
    case 'heading':
      return { level: 2, text: '' };
    case 'paragraph':
    case 'aiTutorPrompt':
      return { text: '' };
    case 'callout':
      return { variant: 'info', text: '' };
    case 'bulletList':
    case 'numberedList':
      return { items: [''] };
    case 'image':
    case 'video':
    case 'pdf':
      return { files: [], url: '' };
    case 'quizEmbed':
      return { quizId: '' };
    case 'flashcardSet':
      return { flashcardSetId: '' };
    case 'divider':
    case 'table':
    default:
      return {};
  }
}

// ----- helpers -----

export function newId() {
  return crypto.randomUUID();
}

// Recompute orderIndex from array position. Pure — exported for unit testing.
export function reindexOrder<T extends { orderIndex: number }>(
  items: T[],
): T[] {
  return items.map((item, index) => ({ ...item, orderIndex: index }));
}

// Replace the items matching `inGroup` with `reordered`, keeping every other
// item in its original slot. Pure — exported for unit testing.
export function reorderWithinGroup<T>(
  all: T[],
  inGroup: (item: T) => boolean,
  reordered: T[],
): T[] {
  let cursor = 0;
  return all.map((item) =>
    inGroup(item) ? (reordered[cursor++] ?? item) : item,
  );
}

// Insert `newItem` into the flat array `all` at `position` within the subset
// matching `inGroup` (0 = before the group's first member, group.length = after
// its last). Non-group items keep their relative slots. Pure — unit tested.
export function insertIntoGroup<T>(
  all: T[],
  inGroup: (item: T) => boolean,
  newItem: T,
  position: number,
): T[] {
  const result: T[] = [];
  let seen = 0;
  let inserted = false;
  for (const item of all) {
    if (inGroup(item)) {
      if (seen === position) {
        result.push(newItem);
        inserted = true;
      }
      seen += 1;
    }
    result.push(item);
  }
  if (!inserted) {
    result.push(newItem);
  }
  return result;
}

// Converts a YouTube / Vimeo link into an embeddable iframe URL.
// Returns null when the link is empty or not recognised. Pure — unit tested.
export function parseVideoEmbedUrl(
  url: string | null | undefined,
): string | null {
  const trimmed = (url || '').trim();
  if (!trimmed) {
    return null;
  }

  const youtube = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) {
    return `https://www.youtube.com/embed/${youtube[1]}`;
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  return null;
}

export function emptyBuilderForm(): CourseBuilderForm {
  return {
    title: '',
    subtitle: '',
    description: '',
    category: '',
    categoryId: '',
    examType: '',
    difficulty: '',
    language: '',
    visibility: 'private',
    audience: [],
    certificateEnabled: true,
    thumbnail: [],
    introVideoFiles: [],
    promoVideoFiles: [],
    modules: [],
    lessons: [],
    assignments: [],
    questions: [],
    quizzes: [],
    quizQuestions: [],
    practiceExams: [],
    practiceExamRules: [],
    outcomes: [],
    requirements: [],
    flashcardSets: [],
    flashcards: [],
    blocks: [],
  };
}

export function defaultQuestionAnswers(
  type: CourseQuestionType,
): BuilderQuestionAnswer[] {
  if (type === 'trueFalse') {
    return [
      {
        id: newId(),
        answerText: 'True',
        isCorrect: true,
        matchText: '',
        explanation: '',
        orderIndex: 0,
      },
      {
        id: newId(),
        answerText: 'False',
        isCorrect: false,
        matchText: '',
        explanation: '',
        orderIndex: 1,
      },
    ];
  }
  return [0, 1].map((orderIndex) => ({
    id: newId(),
    answerText: '',
    isCorrect: orderIndex === 0,
    matchText: '',
    explanation: '',
    orderIndex,
  }));
}

export function emptyBuilderQuestion(): BuilderQuestion {
  return {
    id: newId(),
    questionText: '',
    questionType: 'multipleChoice',
    explanation: '',
    difficulty: 'medium',
    examDomain: '',
    tags: [],
    source: '',
    aiGenerated: false,
    status: 'approved',
    answers: defaultQuestionAnswers('multipleChoice'),
  };
}

export function courseToBuilderForm(course: Course): CourseBuilderForm {
  return {
    title: course.title,
    subtitle: course.subtitle || '',
    description: course.description || '',
    category: course.category || '',
    categoryId: course.categoryId || '',
    examType: course.examType || '',
    difficulty: course.difficulty || '',
    language: course.language || '',
    visibility: course.visibility || 'private',
    audience: course.audience || [],
    certificateEnabled: course.certificateEnabled ?? true,
    thumbnail: course.thumbnail || [],
    introVideoFiles: course.introVideoFiles || [],
    promoVideoFiles: course.promoVideoFiles || [],
    modules: (course.modules || []).map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      orderIndex: module.orderIndex,
    })),
    lessons: (course.lessons || []).map((lesson) => ({
      id: lesson.id,
      moduleId: lesson.moduleId || null,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      videoFiles: lesson.videoFiles || [],
      videoUrl: lesson.videoUrl || '',
      resourceFiles: lesson.resourceFiles || [],
      videoDurationSeconds: lesson.videoDurationSeconds ?? null,
      isPreview: lesson.isPreview,
      isHidden: lesson.isHidden ?? false,
      orderIndex: lesson.orderIndex,
    })),
    assignments: (course.assignments || []).map((assignment) => ({
      id: assignment.id,
      moduleId: assignment.moduleId || null,
      lessonId: assignment.lessonId || null,
      title: assignment.title,
      prompt: assignment.prompt,
      dueDaysAfterEnroll: assignment.dueDaysAfterEnroll ?? null,
      rubric: assignment.rubric || [],
      allowResubmissions: assignment.allowResubmissions ?? true,
      maxAttempts: assignment.maxAttempts ?? null,
      orderIndex: assignment.orderIndex,
    })),
    questions: (course.questions || []).map((question) => ({
      id: question.id,
      questionText: question.questionText,
      questionType: question.questionType,
      explanation: question.explanation || '',
      difficulty: question.difficulty,
      examDomain: question.examDomain || '',
      tags: question.tags || [],
      source: question.source || '',
      aiGenerated: question.aiGenerated,
      status: question.status,
      answers: (question.answers || []).map((answer) => ({
        id: answer.id,
        answerText: answer.answerText,
        isCorrect: Boolean(answer.isCorrect),
        matchText: answer.matchText || '',
        explanation: answer.explanation || '',
        orderIndex: answer.orderIndex,
      })),
    })),
    quizzes: (course.quizzes || []).map((quiz) => ({
      id: quiz.id,
      moduleId: quiz.moduleId || null,
      lessonId: quiz.lessonId || null,
      title: quiz.title,
      description: quiz.description || '',
      passingScore: quiz.passingScore ?? null,
      timeLimitMinutes: quiz.timeLimitMinutes ?? null,
      randomizeQuestions: quiz.randomizeQuestions,
      randomizeAnswers: quiz.randomizeAnswers,
      showExplanations: quiz.showExplanations,
      allowRetries: quiz.allowRetries,
      maxAttempts: quiz.maxAttempts ?? null,
      orderIndex: quiz.orderIndex,
    })),
    quizQuestions: (course.quizzes || []).flatMap((quiz) =>
      (quiz.questions || []).map((link) => ({
        id: link.id,
        quizId: quiz.id,
        questionId: link.questionId,
        orderIndex: link.orderIndex,
        points: link.points,
      })),
    ),
    practiceExams: (course.practiceExams || []).map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description || '',
      examType: exam.examType || '',
      totalQuestions: exam.totalQuestions,
      timeLimitMinutes: exam.timeLimitMinutes ?? null,
      passingScore: exam.passingScore ?? null,
      randomizeQuestions: exam.randomizeQuestions,
      simulateRealExam: exam.simulateRealExam,
      orderIndex: exam.orderIndex,
    })),
    practiceExamRules: (course.practiceExams || []).flatMap((exam) =>
      (exam.rules || []).map((rule) => ({
        id: rule.id,
        practiceExamId: exam.id,
        examDomain: rule.examDomain,
        questionCount: rule.questionCount,
        difficulty: rule.difficulty ?? null,
        orderIndex: rule.orderIndex,
      })),
    ),
    outcomes: (course.outcomes || []).map((outcome) => ({
      id: outcome.id,
      text: outcome.text,
      orderIndex: outcome.orderIndex,
    })),
    requirements: (course.requirements || []).map((requirement) => ({
      id: requirement.id,
      text: requirement.text,
      orderIndex: requirement.orderIndex,
    })),
    flashcardSets: (course.flashcardSets || []).map((set) => ({
      id: set.id,
      moduleId: set.moduleId || null,
      lessonId: set.lessonId || null,
      title: set.title,
      description: set.description || '',
      orderIndex: set.orderIndex,
    })),
    flashcards: (course.flashcardSets || []).flatMap((set) =>
      (set.cards || []).map((card) => ({
        id: card.id,
        flashcardSetId: set.id,
        front: card.front,
        back: card.back,
        hint: card.hint || '',
        orderIndex: card.orderIndex,
      })),
    ),
    blocks: (course.lessons || []).flatMap((lesson) =>
      (lesson.blocks || []).map((block) => ({
        id: block.id,
        lessonId: lesson.id,
        blockType: block.blockType,
        content: block.content || {},
        orderIndex: block.orderIndex,
      })),
    ),
  };
}

// Normalises the form into the API payload, regrouping arrays so orderIndex
// (assigned by array position) is monotonic within each module/quiz/exam.
export function builderFormToPayload(form: CourseBuilderForm) {
  const orderedModules = reindexOrder(form.modules);
  const moduleOrder = [
    ...orderedModules.map((module) => module.id),
    null,
  ] as Array<string | null>;

  const orderedLessons = reindexOrder(
    moduleOrder.flatMap((moduleId) =>
      form.lessons.filter((lesson) => (lesson.moduleId || null) === moduleId),
    ),
  );
  const orderedAssignments = reindexOrder(
    moduleOrder.flatMap((moduleId) =>
      form.assignments.filter(
        (assignment) => (assignment.moduleId || null) === moduleId,
      ),
    ),
  );
  const orderedQuizzes = reindexOrder(
    moduleOrder.flatMap((moduleId) =>
      form.quizzes.filter((quiz) => (quiz.moduleId || null) === moduleId),
    ),
  );
  const orderedQuizQuestions = orderedQuizzes.flatMap((quiz) =>
    reindexOrder(form.quizQuestions.filter((link) => link.quizId === quiz.id)),
  );
  const orderedExams = reindexOrder(form.practiceExams);
  const orderedExamRules = orderedExams.flatMap((exam) =>
    reindexOrder(
      form.practiceExamRules.filter((rule) => rule.practiceExamId === exam.id),
    ),
  );
  const orderedFlashcardSets = reindexOrder(form.flashcardSets);
  const orderedFlashcards = orderedFlashcardSets.flatMap((set) =>
    reindexOrder(
      form.flashcards.filter((card) => card.flashcardSetId === set.id),
    ),
  );

  return {
    title: form.title.trim(),
    subtitle: form.subtitle.trim() || null,
    description: form.description.trim() || null,
    category: form.category.trim() || null,
    categoryId: form.categoryId || null,
    examType: form.examType.trim() || null,
    difficulty: form.difficulty.trim() || null,
    language: form.language.trim() || null,
    visibility: form.visibility,
    audience: form.audience.map((item) => item.trim()).filter(Boolean),
    certificateEnabled: form.certificateEnabled,
    thumbnail: form.thumbnail,
    introVideoFiles: form.introVideoFiles,
    promoVideoFiles: form.promoVideoFiles,
    modules: orderedModules,
    lessons: orderedLessons.map((lesson) => ({
      ...lesson,
      videoUrl: lesson.videoUrl.trim() || null,
    })),
    assignments: orderedAssignments.map((assignment) => ({
      ...assignment,
      rubric: reindexOrder(assignment.rubric),
    })),
    questions: form.questions.map((question) => ({
      ...question,
      answers: reindexOrder(question.answers),
    })),
    quizzes: orderedQuizzes,
    quizQuestions: orderedQuizQuestions,
    practiceExams: orderedExams,
    practiceExamRules: orderedExamRules,
    outcomes: reindexOrder(form.outcomes),
    requirements: reindexOrder(form.requirements),
    flashcardSets: orderedFlashcardSets,
    flashcards: orderedFlashcards,
    blocks: orderedLessons.flatMap((lesson) =>
      reindexOrder(form.blocks.filter((block) => block.lessonId === lesson.id)),
    ),
  };
}

function checkpointArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function checkpointString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function checkpointNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function checkpointBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function courseBuilderPayloadToForm(
  payload: unknown,
): CourseBuilderForm {
  const data =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : {};

  return {
    ...emptyBuilderForm(),
    title: checkpointString(data.title),
    subtitle: checkpointString(data.subtitle),
    description: checkpointString(data.description),
    category: checkpointString(data.category),
    categoryId: checkpointString(data.categoryId),
    examType: checkpointString(data.examType),
    difficulty: checkpointString(data.difficulty),
    language: checkpointString(data.language),
    visibility:
      data.visibility === 'unlisted' || data.visibility === 'public'
        ? data.visibility
        : 'private',
    audience: checkpointArray<string>(data.audience).filter(Boolean),
    certificateEnabled:
      typeof data.certificateEnabled === 'boolean'
        ? data.certificateEnabled
        : true,
    thumbnail: checkpointArray<CourseFile>(data.thumbnail),
    introVideoFiles: checkpointArray<CourseFile>(data.introVideoFiles),
    promoVideoFiles: checkpointArray<CourseFile>(data.promoVideoFiles),
    modules: checkpointArray<Partial<BuilderModule>>(data.modules).map(
      (module, index) => ({
        id: module.id || newId(),
        title: checkpointString(module.title),
        description: checkpointString(module.description),
        orderIndex: checkpointNumberOrNull(module.orderIndex) ?? index,
      }),
    ),
    lessons: checkpointArray<Partial<BuilderLesson>>(data.lessons).map(
      (lesson, index) => ({
        id: lesson.id || newId(),
        moduleId: lesson.moduleId || null,
        title: checkpointString(lesson.title),
        description: checkpointString(lesson.description),
        content: checkpointString(lesson.content),
        videoFiles: checkpointArray<CourseFile>(lesson.videoFiles),
        videoUrl: checkpointString(lesson.videoUrl),
        resourceFiles: checkpointArray<CourseFile>(lesson.resourceFiles),
        videoDurationSeconds: checkpointNumberOrNull(
          lesson.videoDurationSeconds,
        ),
        isPreview: checkpointBoolean(lesson.isPreview),
        isHidden: checkpointBoolean(lesson.isHidden),
        orderIndex: checkpointNumberOrNull(lesson.orderIndex) ?? index,
      }),
    ),
    assignments: checkpointArray<Partial<BuilderAssignment>>(
      data.assignments,
    ).map((assignment, index) => ({
      id: assignment.id || newId(),
      moduleId: assignment.moduleId || null,
      lessonId: assignment.lessonId || null,
      title: checkpointString(assignment.title),
      prompt: checkpointString(assignment.prompt),
      dueDaysAfterEnroll: checkpointNumberOrNull(assignment.dueDaysAfterEnroll),
      rubric: checkpointArray<CourseAssignmentRubricCriterion>(
        assignment.rubric,
      ),
      allowResubmissions: checkpointBoolean(
        assignment.allowResubmissions,
        true,
      ),
      maxAttempts: checkpointNumberOrNull(assignment.maxAttempts),
      orderIndex: checkpointNumberOrNull(assignment.orderIndex) ?? index,
    })),
    questions: checkpointArray<Partial<BuilderQuestion>>(data.questions).map(
      (question) => ({
        id: question.id || newId(),
        questionText: checkpointString(question.questionText),
        questionType: question.questionType || 'multipleChoice',
        explanation: checkpointString(question.explanation),
        difficulty: question.difficulty || 'medium',
        examDomain: checkpointString(question.examDomain),
        tags: checkpointArray<string>(question.tags),
        source: checkpointString(question.source),
        aiGenerated: checkpointBoolean(question.aiGenerated),
        status: question.status || 'draft',
        answers: checkpointArray<Partial<BuilderQuestionAnswer>>(
          question.answers,
        ).map((answer, index) => ({
          id: answer.id || newId(),
          answerText: checkpointString(answer.answerText),
          isCorrect: checkpointBoolean(answer.isCorrect),
          matchText: checkpointString(answer.matchText),
          explanation: checkpointString(answer.explanation),
          orderIndex: checkpointNumberOrNull(answer.orderIndex) ?? index,
        })),
      }),
    ),
    quizzes: checkpointArray<Partial<BuilderQuiz>>(data.quizzes).map(
      (quiz, index) => ({
        id: quiz.id || newId(),
        moduleId: quiz.moduleId || null,
        lessonId: quiz.lessonId || null,
        title: checkpointString(quiz.title),
        description: checkpointString(quiz.description),
        passingScore: checkpointNumberOrNull(quiz.passingScore),
        timeLimitMinutes: checkpointNumberOrNull(quiz.timeLimitMinutes),
        randomizeQuestions: checkpointBoolean(quiz.randomizeQuestions),
        randomizeAnswers: checkpointBoolean(quiz.randomizeAnswers),
        showExplanations: checkpointBoolean(quiz.showExplanations, true),
        allowRetries: checkpointBoolean(quiz.allowRetries, true),
        maxAttempts: checkpointNumberOrNull(quiz.maxAttempts),
        orderIndex: checkpointNumberOrNull(quiz.orderIndex) ?? index,
      }),
    ),
    quizQuestions: checkpointArray<Partial<BuilderQuizLink>>(
      data.quizQuestions,
    ).map((link, index) => ({
      id: link.id || newId(),
      quizId: checkpointString(link.quizId),
      questionId: checkpointString(link.questionId),
      orderIndex: checkpointNumberOrNull(link.orderIndex) ?? index,
      points: checkpointNumberOrNull(link.points) ?? 1,
    })),
    practiceExams: checkpointArray<Partial<BuilderPracticeExam>>(
      data.practiceExams,
    ).map((exam, index) => ({
      id: exam.id || newId(),
      title: checkpointString(exam.title),
      description: checkpointString(exam.description),
      examType: checkpointString(exam.examType),
      totalQuestions: checkpointNumberOrNull(exam.totalQuestions) ?? 0,
      timeLimitMinutes: checkpointNumberOrNull(exam.timeLimitMinutes),
      passingScore: checkpointNumberOrNull(exam.passingScore),
      randomizeQuestions: checkpointBoolean(exam.randomizeQuestions, true),
      simulateRealExam: checkpointBoolean(exam.simulateRealExam),
      orderIndex: checkpointNumberOrNull(exam.orderIndex) ?? index,
    })),
    practiceExamRules: checkpointArray<Partial<BuilderPracticeExamRule>>(
      data.practiceExamRules,
    ).map((rule, index) => ({
      id: rule.id || newId(),
      practiceExamId: checkpointString(rule.practiceExamId),
      examDomain: checkpointString(rule.examDomain),
      questionCount: checkpointNumberOrNull(rule.questionCount) ?? 0,
      difficulty: rule.difficulty || null,
      orderIndex: checkpointNumberOrNull(rule.orderIndex) ?? index,
    })),
    outcomes: checkpointArray<Partial<BuilderTextItem>>(data.outcomes).map(
      (item, index) => ({
        id: item.id || newId(),
        text: checkpointString(item.text),
        orderIndex: checkpointNumberOrNull(item.orderIndex) ?? index,
      }),
    ),
    requirements: checkpointArray<Partial<BuilderTextItem>>(
      data.requirements,
    ).map((item, index) => ({
      id: item.id || newId(),
      text: checkpointString(item.text),
      orderIndex: checkpointNumberOrNull(item.orderIndex) ?? index,
    })),
    flashcardSets: checkpointArray<Partial<BuilderFlashcardSet>>(
      data.flashcardSets,
    ).map((set, index) => ({
      id: set.id || newId(),
      moduleId: set.moduleId || null,
      lessonId: set.lessonId || null,
      title: checkpointString(set.title),
      description: checkpointString(set.description),
      orderIndex: checkpointNumberOrNull(set.orderIndex) ?? index,
    })),
    flashcards: checkpointArray<Partial<BuilderFlashcard>>(data.flashcards).map(
      (card, index) => ({
        id: card.id || newId(),
        flashcardSetId: checkpointString(card.flashcardSetId),
        front: checkpointString(card.front),
        back: checkpointString(card.back),
        hint: checkpointString(card.hint),
        orderIndex: checkpointNumberOrNull(card.orderIndex) ?? index,
      }),
    ),
    blocks: checkpointArray<Partial<BuilderBlock>>(data.blocks).map(
      (block, index) => ({
        id: block.id || newId(),
        lessonId: checkpointString(block.lessonId),
        blockType: block.blockType || 'paragraph',
        content:
          block.content && typeof block.content === 'object'
            ? (block.content as Record<string, unknown>)
            : {},
        orderIndex: checkpointNumberOrNull(block.orderIndex) ?? index,
      }),
    ),
  };
}

// One publish-checklist requirement. `key` indexes `course.builder.checklist`
// for the label; `section` is the builder route to fix it on.
export type PublishChecklistItem = {
  key: string;
  met: boolean;
  section: CourseBuilderSection;
  severity?: 'blocking' | 'warning';
};

// Mirrors the backend submit checklist (courseBuilderSubmitForReviewController)
// so the creator sees what's missing before submitting. Pure — unit tested.
// Intentionally as-strict-or-stricter than the server: the client never lets
// through a course the server would reject.
export function evaluatePublishChecklist(
  form: CourseBuilderForm,
): PublishChecklistItem[] {
  return [
    {
      key: 'titleItem',
      section: 'goals',
      met: form.title.trim().length > 0,
      severity: 'blocking',
    },
    {
      key: 'descriptionItem',
      section: 'goals',
      met: form.description.trim().length > 0,
      severity: 'blocking',
    },
    {
      key: 'thumbnailItem',
      section: 'landing-page',
      met: form.thumbnail.length > 0,
      severity: 'blocking',
    },
    {
      key: 'moduleItem',
      section: 'curriculum',
      met: form.modules.length >= 1,
      severity: 'blocking',
    },
    {
      key: 'lessonsItem',
      section: 'curriculum',
      met: form.lessons.length >= 3,
      severity: 'blocking',
    },
    {
      key: 'assessmentItem',
      section: 'curriculum',
      met: form.quizzes.length >= 1 || form.practiceExams.length >= 1,
      severity: 'blocking',
    },
    {
      key: 'outcomeItem',
      section: 'goals',
      met: form.outcomes.some((outcome) => outcome.text.trim().length > 0),
      severity: 'blocking',
    },
    {
      key: 'audienceItem',
      section: 'goals',
      met: form.audience.some((item) => item.trim().length > 0),
      severity: 'warning',
    },
    {
      key: 'requirementItem',
      section: 'goals',
      met: form.requirements.some((item) => item.text.trim().length > 0),
      severity: 'warning',
    },
    {
      key: 'lessonContentItem',
      section: 'curriculum',
      met: form.lessons.some(
        (lesson) =>
          lesson.content.trim().length > 0 ||
          lesson.videoUrl.trim().length > 0 ||
          lesson.videoFiles.length > 0 ||
          form.blocks.some((block) => block.lessonId === lesson.id),
      ),
      severity: 'warning',
    },
    {
      key: 'flashcardRecommendedItem',
      section: 'flashcards',
      met: form.flashcardSets.length > 0,
      severity: 'warning',
    },
  ];
}

export function courseBuilderCompletion(form: CourseBuilderForm) {
  const items = evaluatePublishChecklist(form);
  const met = items.filter((item) => item.met).length;

  return {
    met,
    total: items.length,
    percent: items.length ? Math.round((met / items.length) * 100) : 0,
  };
}

export function courseBuilderNextStep(form: CourseBuilderForm) {
  return (
    evaluatePublishChecklist(form).find(
      (item) => !item.met && item.severity !== 'warning',
    ) || null
  );
}

export function courseBuilderSectionCompletion(
  form: CourseBuilderForm,
  section: CourseBuilderSection,
) {
  const items = evaluatePublishChecklist(form).filter((item) =>
    section === 'submit'
      ? item.severity !== 'warning'
      : item.section === section,
  );
  const met = items.filter((item) => item.met).length;
  const blocking = items.filter(
    (item) => !item.met && item.severity !== 'warning',
  );
  const warnings = items.filter(
    (item) => !item.met && item.severity === 'warning',
  );

  return {
    section,
    met,
    total: items.length,
    percent: items.length ? Math.round((met / items.length) * 100) : 0,
    blocking,
    warnings,
  };
}

export function courseBuilderValidationSummary(form: CourseBuilderForm) {
  const items = evaluatePublishChecklist(form);
  const blockingIssues = items.filter(
    (item) => !item.met && item.severity !== 'warning',
  );
  const warnings = items.filter(
    (item) => !item.met && item.severity === 'warning',
  );

  return {
    completion: courseBuilderCompletion(form),
    blockingIssues,
    warnings,
    nextStep: courseBuilderNextStep(form),
  };
}

export type CourseBuilderTemplateKey =
  | 'examPrep'
  | 'skillCourse'
  | 'miniCourse';

export type CourseBuilderTemplateCopy = {
  outcomes: string[];
  requirements: string[];
  modules: Array<{
    title: string;
    description: string;
    lessons: string[];
    quizTitle: string;
    assignmentTitle?: string;
    assignmentPrompt?: string;
  }>;
};

export type CourseBuilderTemplateBase = Pick<
  CourseBuilderForm,
  'title' | 'subtitle' | 'categoryId' | 'examType' | 'difficulty' | 'language'
>;

export function courseBuilderTemplateToForm(
  base: CourseBuilderTemplateBase,
  template: CourseBuilderTemplateCopy,
): CourseBuilderForm {
  const moduleIds = template.modules.map(() => newId());
  const quizIds = template.modules.map(() => newId());

  return {
    ...emptyBuilderForm(),
    ...base,
    visibility: 'private',
    modules: template.modules.map((module, index) => ({
      id: moduleIds[index],
      title: module.title,
      description: module.description,
      orderIndex: index,
    })),
    lessons: template.modules.flatMap((module, moduleIndex) =>
      module.lessons.map((lessonTitle, lessonIndex) => ({
        id: newId(),
        moduleId: moduleIds[moduleIndex],
        title: lessonTitle,
        description: '',
        content: '',
        videoFiles: [],
        videoUrl: '',
        resourceFiles: [],
        videoDurationSeconds: null,
        isPreview: moduleIndex === 0 && lessonIndex === 0,
        isHidden: false,
        orderIndex: lessonIndex,
      })),
    ),
    assignments: template.modules.reduce<BuilderAssignment[]>(
      (items, module, moduleIndex) => {
        if (!module.assignmentTitle) {
          return items;
        }

        items.push({
          id: newId(),
          moduleId: moduleIds[moduleIndex],
          lessonId: null,
          title: module.assignmentTitle,
          prompt: module.assignmentPrompt || '',
          dueDaysAfterEnroll: null,
          rubric: [],
          allowResubmissions: true,
          maxAttempts: null,
          orderIndex: moduleIndex,
        });
        return items;
      },
      [],
    ),
    quizzes: template.modules.map((module, index) => ({
      id: quizIds[index],
      moduleId: moduleIds[index],
      lessonId: null,
      title: module.quizTitle,
      description: '',
      passingScore: null,
      timeLimitMinutes: null,
      randomizeQuestions: false,
      randomizeAnswers: false,
      showExplanations: true,
      allowRetries: true,
      maxAttempts: null,
      orderIndex: index,
    })),
    outcomes: template.outcomes.map((text, index) => ({
      id: newId(),
      text,
      orderIndex: index,
    })),
    requirements: template.requirements.map((text, index) => ({
      id: newId(),
      text,
      orderIndex: index,
    })),
  };
}
