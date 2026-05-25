import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, Link, useParams } from '@tanstack/react-router';
import { LuArrowLeft, LuBrain, LuCircleCheck, LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import {
  offlineQueueMutation,
  useOfflineLearningStatus,
} from '@/shared/lib/offlineLearning';
import type { Dictionary } from '@/features/auth/authStore';
import type {
  StudentPracticeAttempt,
  StudentPracticeQuestion,
  StudentPracticeResponse,
} from '../studentExperienceTypes';

export const studentCoursePracticeLazyRoute = createLazyRoute(
  '/student/course/$courseId/practice',
)({
  component: StudentPracticePage,
});

export function StudentPracticePage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const { courseId } = useParams({
    from: '/student/course/$courseId/practice',
  });
  const queryClient = useQueryClient();
  const [attempt, setAttempt] = useState<StudentPracticeAttempt | null>(null);
  const offlineStatus = useOfflineLearningStatus(courseId);
  const practiceQuery = useQuery({
    queryKey: ['studentExperience', 'course', courseId, 'practice'],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/student/course/${courseId}/practice`, { signal })
        .json<StudentPracticeResponse>(),
  });

  useEffect(() => {
    if (practiceQuery.data?.activeAttempt) {
      setAttempt(practiceQuery.data.activeAttempt);
    }
  }, [practiceQuery.data?.activeAttempt]);

  const startMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/student/course/${courseId}/practice/start`, {
          json: { questionCount: 5 },
        })
        .json<{ attempt: StudentPracticeAttempt }>(),
    onSuccess: (data) => {
      setAttempt(data.attempt);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const answerMutation = useMutation({
    mutationFn: (input: { questionId: string; selectedAnswerIndex: number }) =>
      apiClient
        .post(`api/student/practice-attempt/${attempt?.id}/answer`, {
          json: input,
        })
        .json<{ answer: StudentPracticeQuestion }>(),
    onSuccess: (data) => {
      setAttempt((current) =>
        current
          ? {
              ...current,
              questions: current.questions.map((question) =>
                question.questionId === data.answer.questionId
                  ? data.answer
                  : question,
              ),
            }
          : current,
      );
      toast.success(dictionary.studentExperience.success.answerSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/student/practice-attempt/${attempt?.id}/complete`)
        .json<{ attempt: StudentPracticeAttempt }>(),
    onSuccess: async (data) => {
      setAttempt(data.attempt);
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'course', courseId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'dashboard'],
      });
      toast.success(dictionary.studentExperience.success.practiceCompleted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const answeredCount = useMemo(
    () =>
      attempt?.questions.filter(
        (question) => question.selectedAnswerIndex != null,
      ).length || 0,
    [attempt],
  );
  const progress = attempt?.questions.length
    ? Math.round((answeredCount / attempt.questions.length) * 100)
    : 0;

  function handlePracticeAnswer(input: {
    questionId: string;
    selectedAnswerIndex: number;
  }) {
    if (offlineStatus.isOffline && attempt) {
      setAttempt((current) =>
        current
          ? {
              ...current,
              questions: current.questions.map((question) =>
                question.questionId === input.questionId
                  ? {
                      ...question,
                      selectedAnswerIndex: input.selectedAnswerIndex,
                    }
                  : question,
              ),
            }
          : current,
      );
      offlineQueueMutation({
        type: 'practiceAnswer',
        courseId,
        attemptId: attempt.id,
        questionId: input.questionId,
        selectedAnswerIndex: input.selectedAnswerIndex,
      });
      toast.success(dictionary.studentExperience.mobile.savedOffline);
      return;
    }

    answerMutation.mutate(input);
  }

  if (practiceQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          nativeButton={false}
          render={<Link to="/student/course/$courseId" params={{ courseId }} />}
          variant="outline"
          className="h-10 rounded-xl bg-white/70"
        >
          <LuArrowLeft className="size-4" />
          {dictionary.studentExperience.menu.courseOverview}
        </Button>
        {attempt?.status === 'completed' && (
          <Badge className="rounded-xl">
            {dictionaryFormat(
              dictionary.studentExperience.score,
              attempt.scorePercent || 0,
            )}
          </Badge>
        )}
      </div>

      <OfflinePracticeStatus status={offlineStatus.status} />

      <section className="nex-glass-card nex-gradient-hero rounded-3xl p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-nexexam-ink flex items-center gap-3 text-3xl font-extrabold tracking-normal dark:text-white">
              <LuBrain className="text-primary size-8" />
              {dictionary.studentExperience.practiceQuestions}
            </h1>
            <p className="text-muted-foreground mt-2">
              {dictionaryFormat(
                dictionary.studentExperience.availableQuestionCount,
                practiceQuery.data?.availableQuestions || 0,
              )}
            </p>
          </div>
          {!attempt && (
            <Button
              data-testid="student-practice-start-button"
              type="button"
              className="h-11 rounded-xl"
              disabled={
                startMutation.isPending ||
                !practiceQuery.data?.availableQuestions
              }
              onClick={() => startMutation.mutate()}
            >
              {startMutation.isPending ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                dictionary.studentExperience.startPractice
              )}
            </Button>
          )}
        </div>
      </section>

      {attempt ? (
        <section
          data-testid="student-practice-session"
          className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="space-y-4">
            {attempt.questions.map((question, index) => (
              <PracticeQuestionCard
                key={question.questionId}
                index={index}
                question={question}
                dictionary={dictionary}
                disabled={
                  answerMutation.isPending || attempt.status === 'completed'
                }
                onAnswer={(selectedAnswerIndex) =>
                  handlePracticeAnswer({
                    questionId: question.questionId,
                    selectedAnswerIndex,
                  })
                }
              />
            ))}
          </div>
          <Card className="nex-glass-card h-fit rounded-2xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="font-extrabold">
                {dictionary.studentExperience.progress}
              </h2>
              <Progress value={progress} className="mt-4 h-2" />
              <p className="text-muted-foreground mt-3 text-sm">
                {dictionaryFormat(
                  dictionary.studentExperience.answeredProgress,
                  answeredCount,
                  attempt.questions.length,
                )}
              </p>
              {attempt.status === 'completed' ? (
                <div
                  data-testid="student-practice-score"
                  className="bg-primary/10 text-primary mt-5 rounded-2xl p-4 text-center text-3xl font-extrabold"
                >
                  {dictionaryFormat(
                    dictionary.studentExperience.score,
                    attempt.scorePercent || 0,
                  )}
                </div>
              ) : (
                <Button
                  data-testid="student-practice-complete-button"
                  type="button"
                  className="mt-5 h-10 w-full rounded-xl"
                  disabled={
                    completeMutation.isPending ||
                    answeredCount < attempt.questions.length
                  }
                  onClick={() => completeMutation.mutate()}
                >
                  {completeMutation.isPending ? (
                    <LuLoader className="size-4 animate-spin" />
                  ) : (
                    dictionary.studentExperience.completePractice
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
      ) : (
        <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
          <CardContent className="text-muted-foreground p-6 text-sm">
            {practiceQuery.data?.availableQuestions
              ? dictionary.studentExperience.emptyPracticeAttempt
              : dictionary.studentExperience.noPractice}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function OfflinePracticeStatus({
  status,
}: {
  status: ReturnType<typeof useOfflineLearningStatus>['status'];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const label = dictionary.studentExperience.mobile.offlineStatus[status];

  if (status === 'online' || !label) {
    return null;
  }

  return (
    <div className="border-nexexam-line text-muted-foreground rounded-2xl border bg-white/82 px-4 py-3 text-sm font-semibold shadow-sm backdrop-blur md:hidden dark:border-white/10 dark:bg-white/8">
      {label}
    </div>
  );
}

function PracticeQuestionCard({
  question,
  index,
  dictionary,
  disabled,
  onAnswer,
}: {
  question: StudentPracticeQuestion;
  index: number;
  dictionary: Dictionary;
  disabled: boolean;
  onAnswer: (selectedAnswerIndex: number) => void;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-xl">
              {question.difficulty}
            </Badge>
            <h2 className="mt-3 text-lg font-extrabold">
              {index + 1}. {question.questionText}
            </h2>
          </div>
          {question.isCorrect != null && (
            <Badge
              variant={question.isCorrect ? 'secondary' : 'destructive'}
              className="rounded-xl"
            >
              <LuCircleCheck className="size-3.5" />
              {question.isCorrect
                ? dictionary.studentExperience.homeworkStatus.complete
                : dictionary.studentExperience.homeworkStatus.needsRevision}
            </Badge>
          )}
        </div>
        <div className="mt-5 grid gap-2">
          {question.answerOptions.map((option, optionIndex) => {
            const isSelected = question.selectedAnswerIndex === optionIndex;

            return (
              <button
                key={`${question.questionId}-${optionIndex}`}
                data-testid="student-practice-answer-option"
                type="button"
                disabled={disabled || question.selectedAnswerIndex != null}
                onClick={() => onAnswer(optionIndex)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:border-primary/30 bg-white/72 dark:bg-white/8'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {question.explanation && (
          <div className="bg-nexexam-soft mt-4 rounded-xl p-4 text-sm">
            <div className="font-bold">
              {dictionary.studentExperience.explanation}
            </div>
            <p className="text-muted-foreground mt-1">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
