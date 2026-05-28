// Frontend mirror of the backend `chatbotTools.StudyToolWidget` union. Kept
// in sync by convention — adding a new widget kind requires updating both
// sides (backend chatbotTools.ts + frontend WidgetSwitch).
// We import the backend `CourseStudyAiQuestion` shape directly to avoid
// duplicating the option/difficulty types.
import type { CourseStudyAiQuestion } from '@project/backend/features/courseStudyAi/courseStudyAiSchemas';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import type { AiTrustSignal } from '@project/backend/features/aiTrust/aiTrustSchemas';

export type ChatbotMessageRole = 'user' | 'assistant';

export type AiTutorAttachment = FileUploaded & {
  extractionStatus?: 'ready' | 'failed';
  extractedText?: string;
  extractionError?: string;
};

export interface AiTutorWidgetBase {
  kind: string;
  payload: Record<string, unknown>;
}

export interface LessonExplainCardWidget extends AiTutorWidgetBase {
  kind: 'lessonExplainCard';
  payload: {
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    summary: string;
    keyPoints: string[];
    trust?: AiTrustSignal;
  };
}

export interface LessonSummaryCardWidget extends AiTutorWidgetBase {
  kind: 'lessonSummaryCard';
  payload: {
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    summary: string;
    keyPoints: string[];
    trust?: AiTrustSignal;
  };
}

export interface QuizCarouselWidget extends AiTutorWidgetBase {
  kind: 'quizCarousel';
  payload: {
    moduleId: string;
    moduleTitle: string;
    courseId: string;
    courseTitle: string;
    questions: CourseStudyAiQuestion[];
    trust?: AiTrustSignal;
  };
}

export interface PracticeCarouselWidget extends AiTutorWidgetBase {
  kind: 'practiceCarousel';
  payload: {
    moduleId: string;
    moduleTitle: string;
    courseId: string;
    courseTitle: string;
    questions: CourseStudyAiQuestion[];
    trust?: AiTrustSignal;
  };
}

export interface StudyPlanListWidget extends AiTutorWidgetBase {
  kind: 'studyPlanList';
  payload: {
    courseId: string;
    courseTitle: string;
    examName: string | null;
    daysUntil: number | null;
    items: Array<{ title: string; description: string }>;
    trust?: AiTrustSignal;
  };
}

export type AiTutorWidget =
  | LessonExplainCardWidget
  | LessonSummaryCardWidget
  | QuizCarouselWidget
  | PracticeCarouselWidget
  | StudyPlanListWidget;

export interface AiTutorMessage {
  id: string;
  createdAt: string;
  role: ChatbotMessageRole;
  content: string;
  attachments: AiTutorAttachment[] | null;
  widgets: AiTutorWidget[] | null;
  trustSignals: AiTrustSignal | null;
}

export interface AiTutorConversationSummary {
  id: string;
  title: string;
  courseId: string | null;
  lessonId: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiTutorConversationDetail extends AiTutorConversationSummary {
  // Detail responses inline the messages array.
  messages: AiTutorMessage[];
}

export interface AiTutorAlertRow {
  id: string; // ephemeral id (client only — alerts are not persisted)
  kind:
    | 'limitDaily'
    | 'limitOrg'
    | 'limitGlobal'
    | 'concurrentRequest'
    | 'networkError';
  message?: string;
}
