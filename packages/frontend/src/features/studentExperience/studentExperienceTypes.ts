import { CourseFile } from '@/features/course/courseTypes';

export type StudentHomeworkStatus =
  | 'open'
  | 'dueSoon'
  | 'overdue'
  | 'submitted'
  | 'complete'
  | 'needsRevision';

export type StudentReadinessSignalKey =
  | 'courseProgress'
  | 'homework'
  | 'practice'
  | 'exam'
  | 'recentActivity';

export type StudentCourseSummary = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  category?: string | null;
  examType?: string | null;
  thumbnail?: CourseFile[] | null;
  nexVerified: boolean;
  accessType: string;
  priceCents?: number | null;
  currency: string;
};

export type StudentReadiness = {
  score: number;
  insufficientData: boolean;
  signals?: Array<{
    key: StudentReadinessSignalKey;
    weight: number;
    score: number | null;
    available: boolean;
  }>;
};

export type StudentLessonSummary = {
  id: string;
  title: string;
  description?: string | null;
  moduleId?: string | null;
  orderIndex?: number;
};

export type StudentHomeworkItem = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  prompt: string;
  dueDate?: string | null;
  dueDaysAfterEnroll?: number | null;
  moduleId?: string | null;
  lessonId?: string | null;
  attemptCount: number;
  status: StudentHomeworkStatus;
  submission?: {
    id: string;
    status: string;
    submittedAt: string;
    reviewedAt?: string | null;
    feedback?: string | null;
    attemptNumber: number;
    score?: number | null;
    maxScore?: number | null;
  } | null;
};

export type StudentPracticeAttemptSummary = {
  id: string;
  courseId: string;
  status: 'active' | 'completed' | string;
  startedAt: string;
  completedAt?: string | null;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent?: number | null;
};

export type StudentPracticeQuestion = {
  answerId: string;
  questionId: string;
  questionText: string;
  answerOptions: string[];
  difficulty: string;
  category?: string | null;
  tags: string[];
  selectedAnswerIndex?: number | null;
  isCorrect?: boolean | null;
  correctAnswerIndex?: number | null;
  explanation?: string | null;
  answeredAt?: string | null;
};

export type StudentPracticeAttempt = StudentPracticeAttemptSummary & {
  questions: StudentPracticeQuestion[];
};

export type StudentNote = {
  id: string;
  courseId: string;
  lessonId?: string | null;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type StudentStudyPlanItem = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  plannedForDate?: string | null;
  status: 'todo' | 'complete' | string;
  source: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  isDueToday?: boolean;
};

export type StudentStudyPlanSuggestion = {
  kind: 'lesson' | 'homework' | 'practice';
  courseId: string;
  targetId?: string | null;
  targetTitle: string;
  dueDate?: string | null;
  priority: number;
};

export type StudentDiagnosticQuestion = {
  answerId: string;
  questionId: string;
  source: string;
  questionText: string;
  answerOptions: string[];
  difficulty: string;
  domain: string;
  selectedAnswerIndex?: number | null;
  isCorrect?: boolean | null;
  correctAnswerIndex?: number | null;
  explanation?: string | null;
  answeredAt?: string | null;
};

export type StudentDiagnosticAttempt = StudentPracticeAttemptSummary & {
  domainScores: Array<{
    domain: string;
    correct: number;
    total: number;
    percent: number;
  }>;
  questions: StudentDiagnosticQuestion[];
};

export type StudentMasteryDomain = {
  domain: string;
  scorePercent: number;
  confidence: 'low' | 'medium' | 'high' | string;
  evidenceCount: number;
  lastPracticedAt?: string | null;
  recommendedAction:
    | 'diagnose'
    | 'remediate'
    | 'practice'
    | 'maintain'
    | string;
};

export type StudentFlashcardReview = {
  id: string;
  flashcardId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
  lastReviewedAt?: string | null;
  lastRating?: string | null;
};

export type StudentDueFlashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string | null;
  setId: string;
  setTitle: string;
  review?: StudentFlashcardReview | null;
};

export type StudentRemediationPlan = {
  id: string;
  courseId: string;
  domain: string;
  status: string;
  title: string;
  description?: string | null;
  items: unknown[];
  source: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
};

export type StudentSchedulePreviewItem = {
  id: string;
  type: 'studyPlan' | 'flashcards' | 'remediation' | string;
  title: string;
  description?: string | null;
  plannedForDate?: string | null;
  source: string;
};

export type StudentCourseResume = {
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

export type StudentReminderPreference = {
  id: string;
  userId: string;
  courseId?: string | null;
  enabled: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  timezone: string;
  channels: string[];
  smartRemindersEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StudentLearningOutcomes = {
  diagnostic: {
    availableQuestions: number;
    activeAttempt?: StudentDiagnosticAttempt | null;
    lastAttempt?: StudentDiagnosticAttempt | null;
  };
  mastery: {
    domains: StudentMasteryDomain[];
    averageScore?: number | null;
  };
  flashcards: {
    totalCards: number;
    dueCards: number;
    nextDueAt?: string | null;
    cards: StudentDueFlashcard[];
  };
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: string | null;
  };
  remediation: {
    activePlan?: StudentRemediationPlan | null;
    weakDomains: string[];
  };
  schedule: {
    preview: StudentSchedulePreviewItem[];
  };
  mockExams: {
    availableExams: number;
    simulatedExams: number;
    bestScore?: number | null;
    lastScore?: number | null;
    recentAttempts: Array<{
      id: string;
      practiceExamId?: string | null;
      scorePercent: number;
      passed: boolean;
      startedAt: string;
      submittedAt?: string | null;
    }>;
    exams: Array<{
      id: string;
      title: string;
      timeLimitMinutes?: number | null;
      passingScore?: number | null;
      totalQuestions: number;
      simulateRealExam: boolean;
    }>;
  };
};

export type StudentCourseCard = {
  course: StudentCourseSummary;
  enrollment: {
    id: string;
    courseId: string;
    status: string;
    enrolledAt: string;
    targetExamDate?: string | null;
    examName?: string | null;
  } | null;
  progress: {
    completedLessons: number;
    totalLessons: number;
    percent: number;
  };
  homework: {
    total: number;
    open: number;
    dueSoon: number;
    overdue: number;
    submitted: number;
    complete: number;
    needsRevision: number;
  };
  practice: {
    availableQuestions: number;
    completedAttempts: number;
    averageAccuracy?: number | null;
    lastScore?: number | null;
  };
  notes: { count: number };
  studyPlan: { openItems: number; dueToday: number };
  readiness: StudentReadiness;
  nextLesson?: StudentLessonSummary | null;
};

export type StudentDashboardResponse = {
  summary: {
    enrolledCourses: number;
    completedLessons: number;
    totalLessons: number;
    upcomingHomework: number;
    overdueHomework: number;
    notes: number;
    studyPlanDueToday: number;
    averageReadiness: number;
  };
  readiness: StudentReadiness;
  nextAction?: {
    type: 'lesson' | 'homework' | 'practice';
    courseId: string;
    title: string;
    lessonId?: string | null;
    assignmentId?: string | null;
  } | null;
  courses: StudentCourseCard[];
  upcomingHomework: StudentHomeworkItem[];
  practice: {
    availableQuestions: number;
    recentAttempts: StudentPracticeAttemptSummary[];
    averageAccuracy?: number | null;
    weakAreas: string[];
  };
  notes: StudentNote[];
  studyPlan: StudentStudyPlanItem[];
};

export type StudentCourseOverviewResponse = {
  course: StudentCourseSummary;
  enrollment: StudentCourseCard['enrollment'];
  courseCard: StudentCourseCard;
  progress: {
    completedLessons: number;
    totalLessons: number;
    percent: number;
    completedLessonIds: string[];
  };
  nextLesson?: StudentLessonSummary | null;
  homework: {
    items: StudentHomeworkItem[];
    summary: StudentCourseCard['homework'];
  };
  practice: {
    availableQuestions: number;
    recentAttempts: StudentPracticeAttemptSummary[];
    averageAccuracy?: number | null;
    weakAreas: string[];
  };
  notes: {
    items: StudentNote[];
    count: number;
  };
  studyPlan: {
    items: StudentStudyPlanItem[];
    suggestions: StudentStudyPlanSuggestion[];
  };
  resume?: StudentCourseResume | null;
  readiness: StudentReadiness;
  learningOutcomes: StudentLearningOutcomes;
};

export type StudentPracticeResponse = {
  availableQuestions: number;
  sampleQuestions: Array<{
    id: string;
    questionText: string;
    answerOptions: string[];
    difficulty: string;
    category?: string | null;
    tags: string[];
  }>;
  activeAttempt?: StudentPracticeAttempt | null;
  recentAttempts: StudentPracticeAttemptSummary[];
  averageAccuracy?: number | null;
  weakAreas: string[];
};
