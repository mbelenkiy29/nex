import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CourseStudyAiQuizResult,
  CourseStudyAiSubmitInput,
} from '@project/backend/features/courseStudyAi/courseStudyAiSchemas';
import type { AiTrustSignal } from '@project/backend/features/aiTrust/aiTrustSchemas';
import { apiClient, HTTPError } from '@/shared/lib/apiClient';

export interface DomainWeakness {
  domain: string;
  correct: number;
  total: number;
  percent: number;
}

export interface WeaknessReport {
  domains: Array<DomainWeakness>;
  totalAnswered: number;
  hasData: boolean;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  description: string | null;
  plannedForDate: string | null;
  status: string;
  source: string;
  trustSignals: AiTrustSignal | null;
  completedAt: string | null;
}

export interface StudyPlanResponse {
  items: Array<StudyPlanItem>;
  trust: AiTrustSignal | null;
}

export interface ExamDate {
  targetExamDate: string | null;
  examName: string | null;
}

export interface AiQuizSubmitResult {
  attemptId: string;
  scorePercent: number;
  passed: boolean;
  correct: number;
  total: number;
  domainScores: Array<{
    domain: string;
    correct: number;
    total: number;
    percent: number;
  }>;
}

export type StudyAiErrorCode = 'limit' | 'busy' | 'generic';

/**
 * Maps a failed study AI request to a short error code the UI can localize.
 * 429 = daily token cap hit, 409 = another study request already running.
 */
export function resolveStudyAiError(error: unknown): StudyAiErrorCode {
  if (error instanceof HTTPError) {
    if (error.response.status === 429) {
      return 'limit';
    }
    if (error.response.status === 409) {
      return 'busy';
    }
  }
  return 'generic';
}

const weaknessKey = (courseId: string) =>
  ['courseStudyAi', 'weaknesses', courseId] as const;
const studyPlanKey = (courseId: string) =>
  ['courseStudyAi', 'studyPlan', courseId] as const;
const examDateKey = (courseId: string) =>
  ['courseStudyAi', 'examDate', courseId] as const;

// "Quiz me from this module" — a short (~5 question) interactive quiz.
export function useGenerateAiQuiz(courseId: string) {
  return useMutation({
    mutationFn: (input: { moduleId: string }) =>
      apiClient
        .post(`api/course-study-ai/${courseId}/quiz`, { json: input })
        .json<CourseStudyAiQuizResult>(),
  });
}

// "Generate practice questions" — a larger module-scoped set.
export function useGenerateAiPractice(courseId: string) {
  return useMutation({
    mutationFn: (input: { moduleId: string; count?: number }) =>
      apiClient
        .post(`api/course-study-ai/${courseId}/practice`, { json: input })
        .json<CourseStudyAiQuizResult>(),
  });
}

// Persists a completed AI quiz attempt so it feeds weakness detection.
// Fired in the background — the UI already shows in-memory grading.
export function useSubmitAiQuiz(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CourseStudyAiSubmitInput) =>
      apiClient
        .post(`api/course-study-ai/${courseId}/quiz/submit`, { json: input })
        .json<AiQuizSubmitResult>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: weaknessKey(courseId) }),
  });
}

// --- Weakness detection, recommendations, study plan -----------------------

export function useWeaknesses(courseId: string) {
  return useQuery({
    queryKey: weaknessKey(courseId),
    queryFn: () =>
      apiClient
        .get(`api/course-study-ai/${courseId}/weaknesses`)
        .json<WeaknessReport>(),
  });
}

export function useStudyPlan(courseId: string) {
  return useQuery({
    queryKey: studyPlanKey(courseId),
    queryFn: () =>
      apiClient
        .get(`api/course-study-ai/${courseId}/study-plan`)
        .json<StudyPlanResponse>(),
  });
}

export function useExamDate(courseId: string) {
  return useQuery({
    queryKey: examDateKey(courseId),
    queryFn: () =>
      apiClient
        .get(`api/course-study-ai/${courseId}/exam-date`)
        .json<ExamDate>(),
  });
}

// "What should I study next?" — on-demand AI recommendation.
export function useGenerateNext(courseId: string) {
  return useMutation({
    mutationFn: () =>
      apiClient
        .get(`api/course-study-ai/${courseId}/next`)
        .json<{ recommendation: string }>(),
  });
}

export function useSetExamDate(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ExamDate) =>
      apiClient
        .put(`api/course-study-ai/${courseId}/exam-date`, { json: input })
        .json<ExamDate>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: examDateKey(courseId) }),
  });
}

export function useGenerateStudyPlan(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/course-study-ai/${courseId}/study-plan/generate`)
        .json<StudyPlanResponse>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studyPlanKey(courseId) }),
  });
}

export function useCreateStudyPlanItem(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      title: string;
      description?: string | null;
      plannedForDate?: string | null;
    }) =>
      apiClient
        .post(`api/course-study-ai/${courseId}/study-plan`, { json: input })
        .json<{ item: StudyPlanItem }>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studyPlanKey(courseId) }),
  });
}

export function useUpdateStudyPlanItem(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      ...input
    }: {
      itemId: string;
      status?: 'todo' | 'completed';
      title?: string;
    }) =>
      apiClient
        .patch(`api/course-study-ai/${courseId}/study-plan/${itemId}`, {
          json: input,
        })
        .json<{ item: StudyPlanItem }>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studyPlanKey(courseId) }),
  });
}

export function useDeleteStudyPlanItem(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      apiClient
        .delete(`api/course-study-ai/${courseId}/study-plan/${itemId}`)
        .json<{ ok: boolean }>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studyPlanKey(courseId) }),
  });
}
