import { FileUploaded } from '@project/backend/features/file/fileSchemas';

export type CourseFile = FileUploaded & { downloadUrl?: string };

export type CourseStatus =
  | 'draft'
  | 'inReview'
  | 'published'
  | 'archived'
  | 'rejected';
export type CourseAccessType = 'free' | 'manual' | 'paid' | 'subscription';
export type CourseSubmissionStatus = 'submitted' | 'complete' | 'needsRevision';

export type CourseRating = {
  id: string;
  courseId: string;
  userId: string;
  memberId?: string | null;
  rating: number;
  comment?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseRatingSummary = {
  average: number;
  count: number;
};

export type CourseAssignmentRubricCriterion = {
  id: string;
  title: string;
  description?: string | null;
  maxPoints: number;
  orderIndex: number;
};

export type CourseAssignmentRubricScore = {
  criterionId: string;
  score: number;
  feedback?: string | null;
};

export type CourseModule = {
  id: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  lessons?: CourseLesson[];
  assignments?: CourseAssignment[];
};

export type CourseLesson = {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  videoFiles?: CourseFile[] | null;
  videoUrl?: string | null;
  resourceFiles?: CourseFile[] | null;
  videoDurationSeconds?: number | null;
  orderIndex: number;
  isPreview: boolean;
  isHidden?: boolean;
  moduleId?: string | null;
  assignments?: CourseAssignment[];
  blocks?: CourseLessonBlock[];
};

export type CourseLessonBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'pdf'
  | 'callout'
  | 'quizEmbed'
  | 'flashcardSet'
  | 'aiTutorPrompt'
  | 'table'
  | 'divider'
  | 'bulletList'
  | 'numberedList';

export type CourseLessonBlock = {
  id: string;
  blockType: CourseLessonBlockType;
  content: Record<string, unknown>;
  orderIndex: number;
};

export type CourseVisibility = 'private' | 'unlisted' | 'public';

export type CourseOutcome = { id: string; text: string; orderIndex: number };

export type CourseRequirement = {
  id: string;
  text: string;
  orderIndex: number;
};

export type CourseFlashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string | null;
  orderIndex: number;
};

export type CourseFlashcardSet = {
  id: string;
  title: string;
  description?: string | null;
  moduleId?: string | null;
  lessonId?: string | null;
  orderIndex: number;
  cards: CourseFlashcard[];
};

export type CourseQuestionType =
  | 'multipleChoice'
  | 'multiSelect'
  | 'trueFalse'
  | 'shortAnswer'
  | 'ordering'
  | 'matching'
  | 'caseStudy';

export type CourseQuestionDifficulty = 'easy' | 'medium' | 'hard';

export type CourseQuestionStatus =
  | 'draft'
  | 'approved'
  | 'flagged'
  | 'archived';

// A reusable question-bank answer. isCorrect/explanation are only present in
// builder/admin payloads — stripped from student-facing responses.
export type CourseQuestionAnswer = {
  id: string;
  answerText: string;
  isCorrect?: boolean;
  matchText?: string | null;
  explanation?: string | null;
  orderIndex: number;
};

export type CourseQuestion = {
  id: string;
  questionText: string;
  questionType: CourseQuestionType;
  explanation?: string | null;
  difficulty: CourseQuestionDifficulty;
  examDomain?: string | null;
  tags: string[];
  source?: string | null;
  aiGenerated: boolean;
  status: CourseQuestionStatus;
  meta?: unknown;
  answers: CourseQuestionAnswer[];
};

// Join row: a bank question placed in a quiz (with order + points).
export type CourseQuizQuestionLink = {
  id: string;
  quizId: string;
  questionId: string;
  orderIndex: number;
  points: number;
  question?: CourseQuestion;
};

export type CourseQuiz = {
  id: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  passingScore?: number | null;
  timeLimitMinutes?: number | null;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showExplanations: boolean;
  allowRetries: boolean;
  maxAttempts?: number | null;
  moduleId?: string | null;
  lessonId?: string | null;
  questions: CourseQuizQuestionLink[];
};

export type CourseQuizAttempt = {
  id: string;
  quizId: string | null;
  courseId: string;
  scorePercent: number;
  passed: boolean;
  submittedAt: string;
};

export type CoursePracticeExamRule = {
  id: string;
  examDomain: string;
  questionCount: number;
  difficulty?: CourseQuestionDifficulty | null;
  orderIndex: number;
};

export type CoursePracticeExam = {
  id: string;
  title: string;
  description?: string | null;
  examType?: string | null;
  totalQuestions: number;
  timeLimitMinutes?: number | null;
  passingScore?: number | null;
  randomizeQuestions: boolean;
  simulateRealExam: boolean;
  orderIndex: number;
  rules: CoursePracticeExamRule[];
};

export type CourseAssignment = {
  id: string;
  title: string;
  prompt: string;
  orderIndex: number;
  dueDaysAfterEnroll?: number | null;
  rubric?: CourseAssignmentRubricCriterion[] | null;
  allowResubmissions: boolean;
  maxAttempts?: number | null;
  moduleId?: string | null;
  lessonId?: string | null;
  submissions?: CourseAssignmentSubmission[];
};

export type CourseAssignmentSubmission = {
  id: string;
  assignmentId: string;
  courseId: string;
  userId: string;
  text?: string | null;
  files?: CourseFile[] | null;
  attemptNumber: number;
  status: CourseSubmissionStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  feedback?: string | null;
  rubricScores?: CourseAssignmentRubricScore[] | null;
  score?: number | null;
  maxScore?: number | null;
  studentUser?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  } | null;
};

export type CourseEnrollment = {
  id: string;
  courseId: string;
  userId: string;
  status: string;
  enrolledAt: string;
};

export type CourseLessonProgress = {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  completedAt: string;
};

export type CourseLearningSession = {
  id: string;
  courseId: string;
  lessonId?: string | null;
  practiceAttemptId?: string | null;
  lastRoute?: string | null;
  lastPositionSeconds?: number | null;
  lastScrollPercent?: number | null;
  lastActivityAt: string;
  deviceType?: string | null;
  metadata?: unknown;
  updatedAt: string;
};

export type CourseCategoryRef = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
};

export type CourseBuilderCheckpointSource =
  | 'autosave'
  | 'manual'
  | 'restore'
  | 'submitSnapshot';

export type CourseBuilderCheckpoint = {
  id: string;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  userId: string;
  source: CourseBuilderCheckpointSource;
  label?: string | null;
  payload: Record<string, unknown>;
};

export type CourseAiJobType =
  | 'generateOutline'
  | 'generateQuiz'
  | 'generateFlashcards'
  | 'generateLesson'
  | 'improveLesson';

export type CourseAiGenerationStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed';

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

export type CourseAiGenerationJob = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  courseId?: string | null;
  jobType: CourseAiJobType;
  status: CourseAiGenerationStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown> | null;
  qualityReport?: CourseAiQualityReport | null;
  progressPercent: number;
  progressStage?: string | null;
  errorMessage?: string | null;
  queuedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
};

export type Course = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  category?: string | null;
  // FK to CourseCategory (the curated taxonomy). The legacy freeform
  // `category` string still ships as a read-only mirror in v1.
  categoryId?: string | null;
  categoryRef?: CourseCategoryRef | null;
  examType?: string | null;
  thumbnail?: CourseFile[] | null;
  introVideoFiles?: CourseFile[] | null;
  status: CourseStatus;
  accessType: CourseAccessType;
  priceCents?: number | null;
  currency: string;
  stripePriceId?: string | null;
  subscriptionPlanKey?: string | null;
  creatorRevenueShareBps: number;
  nexVerified: boolean;
  certificateEnabled?: boolean;
  creatorUserId?: string | null;
  creatorMemberId?: string | null;
  creatorOrganizationId?: string | null;
  publishedAt?: string | null;
  submittedForReviewAt?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  safetyHold?: boolean;
  safetyHoldReason?: string | null;
  safetyHoldAt?: string | null;
  difficulty?: string | null;
  language?: string | null;
  visibility?: CourseVisibility;
  promoVideoFiles?: CourseFile[] | null;
  audience?: string[];
  modules: CourseModule[];
  lessons: CourseLesson[];
  assignments: CourseAssignment[];
  quizzes?: CourseQuiz[];
  questions?: CourseQuestion[];
  practiceExams?: CoursePracticeExam[];
  outcomes?: CourseOutcome[];
  requirements?: CourseRequirement[];
  flashcardSets?: CourseFlashcardSet[];
  enrollments?: CourseEnrollment[];
  counts?: {
    modules: number;
    lessons: number;
    assignments: number;
    enrollments: number;
    quizzes?: number;
    practiceExams?: number;
  };
  _count?: {
    modules: number;
    lessons: number;
    assignments: number;
    enrollments: number;
  };
  isEnrolled?: boolean;
  isSaved?: boolean;
  durationSeconds?: number | null;
  socialProof?: {
    enrollmentCount: number;
    ratingAverage: number;
    ratingCount: number;
  };
  ratingSummary?: CourseRatingSummary;
  myRating?: CourseRating | null;
  creatorUser?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  } | null;
};

export type CourseWishlistItem = {
  id: string;
  createdAt: string;
  courseId: string;
  course: Course;
};

export type CourseWishlist = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  isDefault: boolean;
  items: CourseWishlistItem[];
};

export type CourseBundle = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnail?: CourseFile[] | null;
  status: 'draft' | 'published' | 'archived';
  priceCents?: number | null;
  currency: string;
  creatorUserId?: string | null;
  publishedAt?: string | null;
  courses?: Course[];
  counts?: { courses: number };
};

export type CourseCertificate = {
  id: string;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  enrollmentId: string;
  userId: string;
  certificateNumber: string;
  verificationCode: string;
  issuedAt: string;
  revokedAt?: string | null;
  artifactUrl?: string | null;
  course?: Pick<Course, 'id' | 'title' | 'slug' | 'thumbnail'>;
  user?: { id: string; name: string };
};

export type CourseMyLearningItem = {
  enrollment: Pick<
    CourseEnrollment,
    'id' | 'courseId' | 'status' | 'enrolledAt'
  >;
  course: Pick<
    Course,
    | 'id'
    | 'title'
    | 'slug'
    | 'subtitle'
    | 'category'
    | 'thumbnail'
    | 'nexVerified'
    | 'creatorUser'
    | 'ratingSummary'
    | 'myRating'
  >;
  counts: {
    lessons: number;
    assignments: number;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    submittedAssignments: number;
    totalAssignments: number;
    percent: number;
  };
  nextLesson: {
    id: string;
    title: string;
    moduleId?: string | null;
  } | null;
};

export type CourseRecommendation = Pick<
  Course,
  | 'id'
  | 'title'
  | 'slug'
  | 'subtitle'
  | 'category'
  | 'thumbnail'
  | 'nexVerified'
  | 'creatorUser'
  | 'ratingSummary'
> & {
  counts: {
    modules: number;
    lessons: number;
    assignments: number;
    enrollments: number;
  };
};

export type CourseMyLearningResponse = {
  enrolledCourses: CourseMyLearningItem[];
  recommendedCourses: CourseRecommendation[];
  stats: {
    enrolledCourses: number;
    completedLessons: number;
    totalLessons: number;
    submittedAssignments: number;
    totalAssignments: number;
    averageProgress: number;
  };
};

export type CourseManageForm = {
  id?: string;
  title: string;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  category?: string | null;
  categoryId?: string | null;
  examType?: string | null;
  thumbnail?: CourseFile[] | null;
  introVideoFiles?: CourseFile[] | null;
  status: CourseStatus;
  accessType: CourseAccessType;
  priceCents?: number | null;
  currency: string;
  stripePriceId?: string | null;
  subscriptionPlanKey?: string | null;
  creatorRevenueShareBps: number;
  nexVerified: boolean;
  certificateEnabled?: boolean;
  creatorUserId?: string | null;
  creatorMemberId?: string | null;
  creatorOrganizationId?: string | null;
  modules: Array<
    Partial<CourseModule> & {
      clientId: string;
    }
  >;
  lessons: Array<
    Partial<CourseLesson> & {
      clientId: string;
    }
  >;
  assignments: Array<
    Partial<CourseAssignment> & {
      clientId: string;
    }
  >;
};
