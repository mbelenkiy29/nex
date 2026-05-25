import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  Link,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import {
  LuActivity,
  LuBookOpen,
  LuBrain,
  LuCalendar,
  LuCircleCheck,
  LuFileText,
  LuLayers,
  LuMap,
  LuNotebookPen,
  LuPlay,
  LuRotateCcw,
  LuSparkles,
  LuTarget,
  LuTimer,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { useAuthStore } from '@/features/auth/authStore';
import { useChatbotStore } from '@/features/chatbot/chatbotStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import type { Dictionary } from '@/features/auth/authStore';
import type {
  StudentDiagnosticAttempt,
  StudentDueFlashcard,
  StudentCourseOverviewResponse,
  StudentHomeworkItem,
  StudentStudyPlanItem,
  StudentStudyPlanSuggestion,
} from '../studentExperienceTypes';

export const studentCourseOverviewLazyRoute = createLazyRoute(
  '/student/course/$courseId',
)({
  component: StudentCourseOverviewPage,
});

export function StudentCourseOverviewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const { courseId } = useParams({ from: '/student/course/$courseId' });
  const search = useSearch({ strict: false }) as {
    focus?: string;
    itemId?: string;
  };
  const queryClient = useQueryClient();
  const setChatbotOpen = useChatbotStore((state) => state.setIsOpen);
  const setChatbotContext = useChatbotStore((state) => state.setContext);
  const overviewQuery = useQuery({
    queryKey: ['studentExperience', 'course', courseId],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/student/course/${courseId}/overview`, { signal })
        .json<StudentCourseOverviewResponse>(),
  });
  const overview = overviewQuery.data;

  useEffect(() => {
    if (!overview || !search.focus) {
      return;
    }

    const targetId =
      search.focus === 'study-plan'
        ? 'student-course-study-plan'
        : search.focus === 'flashcards'
          ? 'student-course-flashcards'
          : null;

    if (targetId) {
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 120);
    }
  }, [overview, search.focus, search.itemId]);

  const invalidateOverview = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['studentExperience', 'course', courseId],
    });
    await queryClient.invalidateQueries({
      queryKey: ['studentExperience', 'dashboard'],
    });
  };

  const noteMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      apiClient
        .post(`api/student/course/${courseId}/notes`, { json: data })
        .json(),
    onSuccess: async () => {
      await invalidateOverview();
      toast.success(dictionary.studentExperience.success.noteSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const studyPlanMutation = useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      apiClient
        .post(`api/student/course/${courseId}/study-plan`, { json: data })
        .json(),
    onSuccess: async () => {
      await invalidateOverview();
      toast.success(dictionary.studentExperience.success.studyPlanSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const studyPlanUpdateMutation = useMutation({
    mutationFn: (item: StudentStudyPlanItem) =>
      apiClient
        .patch(`api/student/course/${courseId}/study-plan/${item.id}`, {
          json: {
            status: item.status === 'complete' ? 'todo' : 'complete',
          },
        })
        .json(),
    onSuccess: async () => {
      await invalidateOverview();
      toast.success(dictionary.studentExperience.success.studyPlanUpdated);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const adaptivePlanMutation = useMutation({
    mutationFn: (data: {
      targetExamDate?: string | null;
      examName?: string | null;
    }) =>
      apiClient
        .post(`api/student/course/${courseId}/adaptive-plan`, { json: data })
        .json<{ message?: string; items: StudentStudyPlanItem[] }>(),
    onSuccess: async (data) => {
      await invalidateOverview();
      toast.success(
        data.message ||
          dictionary.studentExperience.success.adaptivePlanGenerated,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const diagnosticStartMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/student/course/${courseId}/diagnostic/start`, {
          json: { questionCount: 8 },
        })
        .json(),
    onSuccess: async () => {
      await invalidateOverview();
      toast.success(dictionary.studentExperience.success.diagnosticStarted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const diagnosticAnswerMutation = useMutation({
    mutationFn: (data: {
      attemptId: string;
      answerId: string;
      selectedAnswerIndex: number;
    }) =>
      apiClient
        .post(
          `api/student/course/${courseId}/diagnostic/${data.attemptId}/answer`,
          {
            json: {
              answerId: data.answerId,
              selectedAnswerIndex: data.selectedAnswerIndex,
            },
          },
        )
        .json(),
    onSuccess: invalidateOverview,
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const diagnosticCompleteMutation = useMutation({
    mutationFn: (attemptId: string) =>
      apiClient
        .post(`api/student/course/${courseId}/diagnostic/${attemptId}/complete`)
        .json(),
    onSuccess: async () => {
      await invalidateOverview();
      toast.success(dictionary.studentExperience.success.diagnosticCompleted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const flashcardReviewMutation = useMutation({
    mutationFn: (data: {
      flashcardId: string;
      rating: 'again' | 'hard' | 'good' | 'easy';
    }) =>
      apiClient
        .post(
          `api/student/course/${courseId}/flashcards/${data.flashcardId}/review`,
          {
            json: { rating: data.rating },
          },
        )
        .json(),
    onSuccess: async () => {
      await invalidateOverview();
      toast.success(dictionary.studentExperience.success.flashcardReviewed);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const remediationMutation = useMutation({
    mutationFn: (domain?: string | null) =>
      apiClient
        .post(`api/student/course/${courseId}/remediation`, {
          json: { domain: domain || null },
        })
        .json<{ message?: string }>(),
    onSuccess: async (data) => {
      await invalidateOverview();
      toast.success(
        data.message ||
          dictionary.studentExperience.success.remediationGenerated,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  if (overviewQuery.isLoading || !overview) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const openTutor = () => {
    setChatbotContext({
      courseId: overview.course.id,
      lessonId: overview.nextLesson?.id || undefined,
      courseTitle: overview.course.title,
    });
    setChatbotOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <section
        data-testid="student-course-overview"
        className="nex-glass-card nex-gradient-hero rounded-3xl p-7 lg:p-9"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {overview.course.category && (
                <Badge variant="secondary" className="rounded-xl">
                  {overview.course.category}
                </Badge>
              )}
              {overview.course.examType && (
                <Badge variant="outline" className="rounded-xl bg-white/70">
                  {overview.course.examType}
                </Badge>
              )}
            </div>
            <h1 className="text-nexexam-ink mt-4 text-4xl font-extrabold tracking-normal dark:text-white">
              {overview.course.title}
            </h1>
            {overview.course.subtitle && (
              <p className="text-muted-foreground mt-3 text-lg">
                {overview.course.subtitle}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              nativeButton={false}
              render={
                <Link
                  to="/course/$id/learn"
                  params={{ id: overview.course.id }}
                  search={
                    overview.resume?.lessonId
                      ? { lessonId: overview.resume.lessonId }
                      : undefined
                  }
                />
              }
              className="h-11 rounded-xl"
            >
              <LuPlay className="size-4" />
              {overview.resume?.lessonId
                ? dictionary.studentExperience.mobile.continueLearning
                : dictionary.studentExperience.viewCoursePlayer}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={openTutor}
              className="h-11 rounded-xl bg-white/70"
            >
              <LuSparkles className="size-4" />
              {dictionary.studentExperience.askCourseTutor}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <ProgressOverview overview={overview} dictionary={dictionary} />
          <HomeworkOverview
            homework={overview.homework.items}
            dictionary={dictionary}
          />
          <NotesEditor
            overview={overview}
            dictionary={dictionary}
            isSaving={noteMutation.isPending}
            onSave={(data) => noteMutation.mutate(data)}
          />
        </div>
        <div className="space-y-5">
          <ReadinessSummary overview={overview} dictionary={dictionary} />
          <div id="student-course-flashcards">
            <LearningOutcomesPanel
              overview={overview}
              dictionary={dictionary}
              isStartingDiagnostic={diagnosticStartMutation.isPending}
              isAnsweringDiagnostic={diagnosticAnswerMutation.isPending}
              isCompletingDiagnostic={diagnosticCompleteMutation.isPending}
              isReviewingFlashcard={flashcardReviewMutation.isPending}
              isGeneratingRemediation={remediationMutation.isPending}
              onStartDiagnostic={() => diagnosticStartMutation.mutate()}
              onAnswerDiagnostic={(data) =>
                diagnosticAnswerMutation.mutate(data)
              }
              onCompleteDiagnostic={(attemptId) =>
                diagnosticCompleteMutation.mutate(attemptId)
              }
              onReviewFlashcard={(data) => flashcardReviewMutation.mutate(data)}
              onGenerateRemediation={(domain) =>
                remediationMutation.mutate(domain)
              }
            />
          </div>
          <AdaptivePlanCard
            overview={overview}
            dictionary={dictionary}
            isGenerating={adaptivePlanMutation.isPending}
            onGenerate={(data) => adaptivePlanMutation.mutate(data)}
          />
          <PracticeOverview overview={overview} dictionary={dictionary} />
          <div id="student-course-study-plan">
            <StudyPlanEditor
              overview={overview}
              dictionary={dictionary}
              isSaving={studyPlanMutation.isPending}
              isUpdating={studyPlanUpdateMutation.isPending}
              onSave={(data) => studyPlanMutation.mutate(data)}
              onToggle={(item) => studyPlanUpdateMutation.mutate(item)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgressOverview({
  overview,
  dictionary,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-extrabold">
            <LuBookOpen className="text-primary size-5" />
            {dictionary.studentExperience.progress}
          </h2>
          <span className="text-lg font-extrabold">
            {dictionaryFormat(
              dictionary.studentExperience.score,
              overview.progress.percent,
            )}
          </span>
        </div>
        <Progress value={overview.progress.percent} className="mt-4 h-2" />
        <p className="text-muted-foreground mt-3 text-sm">
          {dictionaryFormat(
            dictionary.studentExperience.lessonsProgress,
            overview.progress.completedLessons,
            overview.progress.totalLessons,
          )}
        </p>
        {overview.nextLesson && (
          <Button
            nativeButton={false}
            render={
              <Link
                to="/course/$id/learn"
                params={{ id: overview.course.id }}
              />
            }
            className="mt-5 h-10 rounded-xl"
          >
            {dictionaryFormat(
              dictionary.studentExperience.nextAction.lesson,
              overview.nextLesson.title,
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function HomeworkOverview({
  homework,
  dictionary,
}: {
  homework: StudentHomeworkItem[];
  dictionary: Dictionary;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuFileText className="text-primary size-5" />
          {dictionary.studentExperience.upcomingHomework}
        </h2>
        <div className="mt-4 space-y-3">
          {homework.length ? (
            homework.map((item) => (
              <div
                key={item.id}
                data-testid="student-homework-item"
                className="rounded-xl border bg-white/72 p-4 dark:bg-white/8"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {item.prompt}
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.status === 'overdue' ? 'destructive' : 'secondary'
                    }
                  >
                    {dictionary.studentExperience.homeworkStatus[item.status]}
                  </Badge>
                </div>
                {item.dueDate && (
                  <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
                    <LuCalendar className="size-4" />
                    {formatDate(item.dueDate, dictionary)}
                  </div>
                )}
                {item.submission?.score != null &&
                  item.submission.maxScore != null && (
                    <div className="text-muted-foreground mt-3 text-sm font-semibold">
                      {dictionary.course.fields.score}: {item.submission.score}/
                      {item.submission.maxScore}
                    </div>
                  )}
                {item.submission?.feedback && (
                  <p className="bg-nexexam-primary/10 text-nexexam-primary mt-3 rounded-xl p-3 text-sm">
                    {item.submission.feedback}
                  </p>
                )}
                {item.attemptCount > 0 && (
                  <p className="text-muted-foreground mt-3 text-xs">
                    {dictionary.course.fields.attempts}: {item.attemptCount}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground rounded-xl border bg-white/72 p-4 text-sm dark:bg-white/8">
              {dictionary.studentExperience.noHomework}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesEditor({
  overview,
  dictionary,
  isSaving,
  onSave,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
  isSaving: boolean;
  onSave: (data: { title: string; content: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuNotebookPen className="text-primary size-5" />
          {dictionary.studentExperience.notes}
        </h2>
        <div className="mt-4 grid gap-3">
          <Input
            data-testid="student-note-title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={dictionary.studentExperience.noteTitlePlaceholder}
            className="rounded-xl bg-white/80 dark:bg-white/8"
          />
          <Textarea
            data-testid="student-note-content-input"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={dictionary.studentExperience.noteContentPlaceholder}
            className="min-h-28 rounded-xl bg-white/80 dark:bg-white/8"
          />
          <Button
            data-testid="student-note-submit-button"
            type="button"
            className="h-10 rounded-xl"
            disabled={isSaving || !title.trim() || !content.trim()}
            onClick={() => {
              onSave({ title, content });
              setTitle('');
              setContent('');
            }}
          >
            {dictionary.studentExperience.saveNote}
          </Button>
        </div>
        <div className="mt-5 space-y-3">
          {overview.notes.items.length ? (
            overview.notes.items.slice(0, 4).map((note) => (
              <div
                key={note.id}
                className="rounded-xl border bg-white/72 p-3 dark:bg-white/8"
              >
                <div className="font-bold">{note.title}</div>
                <div className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {note.content}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              {dictionary.studentExperience.noNotes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AdaptivePlanCard({
  overview,
  dictionary,
  isGenerating,
  onGenerate,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
  isGenerating: boolean;
  onGenerate: (data: {
    targetExamDate?: string | null;
    examName?: string | null;
  }) => void;
}) {
  const [targetExamDate, setTargetExamDate] = useState(
    overview.enrollment?.targetExamDate || '',
  );
  const [examName, setExamName] = useState(
    overview.enrollment?.examName || overview.course.examType || '',
  );
  const weakAreas = overview.practice.weakAreas.slice(0, 3);
  const fieldId = `adaptive-plan-${overview.course.id}`;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-extrabold">
              <LuSparkles className="text-primary size-5" />
              {dictionary.studentExperience.adaptivePlan.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {dictionary.studentExperience.adaptivePlan.body}
            </p>
          </div>
          <Badge variant="secondary" className="rounded-xl">
            {dictionary.studentExperience.adaptivePlan.badge}
          </Badge>
        </div>

        <div className="mt-5 grid gap-3">
          <label
            className="text-muted-foreground text-xs font-semibold"
            htmlFor={`${fieldId}-exam-name`}
          >
            {dictionary.studentExperience.adaptivePlan.examNameLabel}
          </label>
          <Input
            id={`${fieldId}-exam-name`}
            value={examName}
            onChange={(event) => setExamName(event.target.value)}
            placeholder={
              dictionary.studentExperience.adaptivePlan.examNamePlaceholder
            }
            className="rounded-xl bg-white/80 dark:bg-white/8"
          />

          <label
            className="text-muted-foreground text-xs font-semibold"
            htmlFor={`${fieldId}-target-date`}
          >
            {dictionary.studentExperience.adaptivePlan.targetExamDateLabel}
          </label>
          <Input
            id={`${fieldId}-target-date`}
            type="date"
            value={targetExamDate}
            onChange={(event) => setTargetExamDate(event.target.value)}
            className="rounded-xl bg-white/80 dark:bg-white/8"
          />
        </div>

        <div className="mt-5">
          <div className="text-muted-foreground text-xs font-semibold">
            {dictionary.studentExperience.adaptivePlan.weakAreasLabel}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {weakAreas.length ? (
              weakAreas.map((area) => (
                <Badge key={area} variant="outline" className="rounded-xl">
                  {area}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">
                {dictionary.studentExperience.adaptivePlan.noWeakAreas}
              </span>
            )}
          </div>
        </div>

        <Button
          type="button"
          className="mt-5 h-10 w-full rounded-xl"
          disabled={isGenerating}
          onClick={() =>
            onGenerate({
              targetExamDate: targetExamDate || null,
              examName: examName || null,
            })
          }
        >
          <LuSparkles className="size-4" />
          {overview.studyPlan.items.some((item) => item.source === 'adaptive')
            ? dictionary.studentExperience.adaptivePlan.regenerate
            : dictionary.studentExperience.adaptivePlan.generate}
        </Button>
      </CardContent>
    </Card>
  );
}

function ReadinessSummary({
  overview,
  dictionary,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuTarget className="text-primary size-5" />
          {dictionary.studentExperience.readinessScore}
        </h2>
        <div className="mt-5 flex items-center gap-4">
          <div className="bg-primary/10 text-primary grid size-20 place-items-center rounded-2xl text-2xl font-extrabold">
            {overview.readiness.score}
          </div>
          <div className="flex-1 space-y-2">
            {(overview.readiness.signals || []).map((signal) => (
              <div key={signal.key}>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    {dictionary.studentExperience.signals[signal.key]}
                  </span>
                  <span>{signal.score ?? 0}%</span>
                </div>
                <Progress value={signal.score || 0} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LearningOutcomesPanel({
  overview,
  dictionary,
  isStartingDiagnostic,
  isAnsweringDiagnostic,
  isCompletingDiagnostic,
  isReviewingFlashcard,
  isGeneratingRemediation,
  onStartDiagnostic,
  onAnswerDiagnostic,
  onCompleteDiagnostic,
  onReviewFlashcard,
  onGenerateRemediation,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
  isStartingDiagnostic: boolean;
  isAnsweringDiagnostic: boolean;
  isCompletingDiagnostic: boolean;
  isReviewingFlashcard: boolean;
  isGeneratingRemediation: boolean;
  onStartDiagnostic: () => void;
  onAnswerDiagnostic: (data: {
    attemptId: string;
    answerId: string;
    selectedAnswerIndex: number;
  }) => void;
  onCompleteDiagnostic: (attemptId: string) => void;
  onReviewFlashcard: (data: {
    flashcardId: string;
    rating: 'again' | 'hard' | 'good' | 'easy';
  }) => void;
  onGenerateRemediation: (domain?: string | null) => void;
}) {
  const text = dictionary.studentExperience.learningOutcomes;
  const outcomes = overview.learningOutcomes;

  return (
    <Card className="nex-glass-card overflow-hidden rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-0">
        <div className="border-b bg-white/55 p-5 dark:bg-white/8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-extrabold">
                <LuMap className="text-primary size-5" />
                {text.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">{text.body}</p>
            </div>
            <Badge variant="secondary" className="rounded-xl">
              {text.badge}
            </Badge>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniMetric
              label={text.summary.masteryAverage}
              value={
                outcomes.mastery.averageScore != null
                  ? dictionaryFormat(
                      dictionary.studentExperience.score,
                      outcomes.mastery.averageScore,
                    )
                  : dictionaryFormat(dictionary.studentExperience.score, 0)
              }
            />
            <MiniMetric
              label={text.summary.dueFlashcards}
              value={String(outcomes.flashcards.dueCards)}
            />
            <MiniMetric
              label={text.summary.streak}
              value={dictionaryFormat(
                text.streak.dayCount,
                outcomes.streak.currentStreak,
              )}
            />
            <MiniMetric
              label={text.summary.mockExam}
              value={
                outcomes.mockExams.bestScore != null
                  ? dictionaryFormat(
                      dictionary.studentExperience.score,
                      outcomes.mockExams.bestScore,
                    )
                  : String(outcomes.mockExams.availableExams)
              }
            />
          </div>
        </div>

        <div className="grid gap-4 p-5">
          <DiagnosticCheckpoint
            attempt={outcomes.diagnostic.activeAttempt || null}
            lastAttempt={outcomes.diagnostic.lastAttempt || null}
            availableQuestions={outcomes.diagnostic.availableQuestions}
            dictionary={dictionary}
            isStarting={isStartingDiagnostic}
            isAnswering={isAnsweringDiagnostic}
            isCompleting={isCompletingDiagnostic}
            onStart={onStartDiagnostic}
            onAnswer={onAnswerDiagnostic}
            onComplete={onCompleteDiagnostic}
          />
          <MasteryMap
            domains={outcomes.mastery.domains}
            dictionary={dictionary}
          />
          <FlashcardReviewQueue
            courseId={overview.course.id}
            cards={outcomes.flashcards.cards}
            dueCards={outcomes.flashcards.dueCards}
            totalCards={outcomes.flashcards.totalCards}
            nextDueAt={outcomes.flashcards.nextDueAt}
            dictionary={dictionary}
            isReviewing={isReviewingFlashcard}
            onReview={onReviewFlashcard}
          />
          <RemediationPanel
            weakDomains={outcomes.remediation.weakDomains}
            activePlan={outcomes.remediation.activePlan}
            dictionary={dictionary}
            isGenerating={isGeneratingRemediation}
            onGenerate={onGenerateRemediation}
          />
          <SchedulePreview
            items={outcomes.schedule.preview}
            dictionary={dictionary}
          />
          <MockExamSummary
            courseId={overview.course.id}
            mockExams={outcomes.mockExams}
            dictionary={dictionary}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function DiagnosticCheckpoint({
  attempt,
  lastAttempt,
  availableQuestions,
  dictionary,
  isStarting,
  isAnswering,
  isCompleting,
  onStart,
  onAnswer,
  onComplete,
}: {
  attempt: StudentDiagnosticAttempt | null;
  lastAttempt: StudentDiagnosticAttempt | null;
  availableQuestions: number;
  dictionary: Dictionary;
  isStarting: boolean;
  isAnswering: boolean;
  isCompleting: boolean;
  onStart: () => void;
  onAnswer: (data: {
    attemptId: string;
    answerId: string;
    selectedAnswerIndex: number;
  }) => void;
  onComplete: (attemptId: string) => void;
}) {
  const text = dictionary.studentExperience.learningOutcomes.diagnostic;
  const currentQuestion =
    attempt?.questions.find(
      (question) => question.selectedAnswerIndex == null,
    ) ||
    attempt?.questions[0] ||
    null;
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    currentQuestion?.selectedAnswerIndex ?? null,
  );

  useEffect(() => {
    setSelectedAnswerIndex(currentQuestion?.selectedAnswerIndex ?? null);
  }, [currentQuestion?.answerId, currentQuestion?.selectedAnswerIndex]);

  if (!availableQuestions) {
    return (
      <OutcomeSection
        icon={<LuBrain className="text-primary size-4" />}
        title={text.title}
      >
        <p className="text-muted-foreground text-sm">{text.noQuestions}</p>
      </OutcomeSection>
    );
  }

  if (!attempt) {
    return (
      <OutcomeSection
        icon={<LuBrain className="text-primary size-4" />}
        title={text.title}
      >
        <p className="text-muted-foreground text-sm">{text.body}</p>
        {lastAttempt?.scorePercent != null && (
          <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm font-semibold dark:bg-white/8">
            {dictionaryFormat(
              text.lastScore,
              lastAttempt.scorePercent,
              lastAttempt.totalQuestions,
            )}
          </div>
        )}
        <Button
          type="button"
          className="mt-3 h-10 w-full rounded-xl"
          disabled={isStarting}
          onClick={onStart}
        >
          <LuActivity className="size-4" />
          {lastAttempt ? text.restart : text.start}
        </Button>
      </OutcomeSection>
    );
  }

  const answeredCount = attempt.questions.filter(
    (question) => question.selectedAnswerIndex != null,
  ).length;
  const allAnswered = answeredCount === attempt.questions.length;

  return (
    <OutcomeSection
      icon={<LuBrain className="text-primary size-4" />}
      title={text.title}
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">
          {dictionaryFormat(
            text.answered,
            answeredCount,
            attempt.questions.length,
          )}
        </span>
        <Badge variant="outline" className="rounded-xl bg-white/70">
          {currentQuestion?.domain}
        </Badge>
      </div>
      {currentQuestion && (
        <div className="mt-3 rounded-xl border bg-white/70 p-3 dark:bg-white/8">
          <p className="text-sm font-semibold">
            {currentQuestion.questionText}
          </p>
          <div className="mt-3 grid gap-2">
            {currentQuestion.answerOptions.map((option, index) => {
              const selected = selectedAnswerIndex === index;
              return (
                <button
                  key={`${currentQuestion.answerId}-${option}`}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selected
                      ? 'border-nexexam-primary bg-nexexam-primary/10 text-nexexam-primary'
                      : 'hover:border-nexexam-primary/40 bg-white/80 dark:bg-white/10'
                  }`}
                  onClick={() => setSelectedAnswerIndex(index)}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <Button
            type="button"
            className="mt-3 h-9 w-full rounded-xl"
            disabled={selectedAnswerIndex == null || isAnswering}
            onClick={() => {
              if (selectedAnswerIndex == null) return;
              onAnswer({
                attemptId: attempt.id,
                answerId: currentQuestion.answerId,
                selectedAnswerIndex,
              });
            }}
          >
            {text.submit}
          </Button>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        className="mt-3 h-10 w-full rounded-xl bg-white/70 dark:bg-white/8"
        disabled={!allAnswered || isCompleting}
        onClick={() => onComplete(attempt.id)}
      >
        <LuCircleCheck className="size-4" />
        {text.complete}
      </Button>
    </OutcomeSection>
  );
}

function MasteryMap({
  domains,
  dictionary,
}: {
  domains: StudentCourseOverviewResponse['learningOutcomes']['mastery']['domains'];
  dictionary: Dictionary;
}) {
  const text = dictionary.studentExperience.learningOutcomes.mastery;
  const confidenceLabels = text.confidence as Record<string, string>;
  const actionLabels = text.actions as Record<string, string>;

  return (
    <OutcomeSection
      icon={<LuTarget className="text-primary size-4" />}
      title={text.title}
    >
      {domains.length ? (
        <div className="grid gap-3">
          {domains.slice(0, 5).map((domain) => (
            <div
              key={domain.domain}
              className="rounded-xl border bg-white/70 p-3 dark:bg-white/8"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{domain.domain}</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {dictionaryFormat(text.evidence, domain.evidenceCount)} ·{' '}
                    {confidenceLabels[domain.confidence] ||
                      confidenceLabels.low}
                  </div>
                </div>
                <span className="text-sm font-extrabold">
                  {dictionaryFormat(
                    dictionary.studentExperience.score,
                    domain.scorePercent,
                  )}
                </span>
              </div>
              <Progress value={domain.scorePercent} className="mt-3 h-2" />
              <div className="text-muted-foreground mt-2 text-xs">
                {actionLabels[domain.recommendedAction] ||
                  actionLabels.practice}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{text.empty}</p>
      )}
    </OutcomeSection>
  );
}

function FlashcardReviewQueue({
  courseId,
  cards,
  dueCards,
  totalCards,
  nextDueAt,
  dictionary,
  isReviewing,
  onReview,
}: {
  courseId: string;
  cards: StudentDueFlashcard[];
  dueCards: number;
  totalCards: number;
  nextDueAt?: string | null;
  dictionary: Dictionary;
  isReviewing: boolean;
  onReview: (data: {
    flashcardId: string;
    rating: 'again' | 'hard' | 'good' | 'easy';
  }) => void;
}) {
  const text = dictionary.studentExperience.learningOutcomes.flashcards;
  const [showBack, setShowBack] = useState(false);
  const card = cards[0] || null;

  useEffect(() => {
    setShowBack(false);
  }, [card?.id]);

  return (
    <OutcomeSection
      icon={<LuLayers className="text-primary size-4" />}
      title={text.title}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-xl">
          {dictionaryFormat(text.dueCount, dueCards, totalCards)}
        </Badge>
        {nextDueAt && (
          <Badge variant="outline" className="rounded-xl bg-white/70">
            {dictionaryFormat(text.nextDue, formatDate(nextDueAt, dictionary))}
          </Badge>
        )}
      </div>
      {card ? (
        <div className="mt-3 rounded-xl border bg-white/70 p-3 dark:bg-white/8">
          <div className="text-muted-foreground text-xs">
            {dictionaryFormat(text.inSet, card.setTitle)}
          </div>
          <button
            type="button"
            className="mt-2 min-h-24 w-full rounded-xl border bg-white p-4 text-center text-sm font-semibold dark:bg-white/10"
            onClick={() => setShowBack((value) => !value)}
          >
            {showBack ? card.back : card.front}
          </button>
          <Button
            type="button"
            variant="outline"
            className="mt-3 h-9 w-full rounded-xl bg-white/70 dark:bg-white/8"
            onClick={() => setShowBack((value) => !value)}
          >
            <LuRotateCcw className="size-4" />
            {text.flip}
          </Button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(['again', 'hard', 'good', 'easy'] as const).map((rating) => (
              <Button
                key={rating}
                type="button"
                variant={rating === 'good' ? 'default' : 'outline'}
                className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
                disabled={isReviewing}
                onClick={() => onReview({ flashcardId: card.id, rating })}
              >
                {text.ratings[rating]}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border bg-white/70 p-3 dark:bg-white/8">
          <span className="text-muted-foreground text-sm">{text.empty}</span>
          <Button
            nativeButton={false}
            render={<Link to="/course/$id/learn" params={{ id: courseId }} />}
            variant="outline"
            className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
          >
            {text.openPlayer}
          </Button>
        </div>
      )}
    </OutcomeSection>
  );
}

function RemediationPanel({
  weakDomains,
  activePlan,
  dictionary,
  isGenerating,
  onGenerate,
}: {
  weakDomains: string[];
  activePlan: StudentCourseOverviewResponse['learningOutcomes']['remediation']['activePlan'];
  dictionary: Dictionary;
  isGenerating: boolean;
  onGenerate: (domain?: string | null) => void;
}) {
  const text = dictionary.studentExperience.learningOutcomes.remediation;
  const targetDomain = weakDomains[0] || activePlan?.domain || null;

  return (
    <OutcomeSection
      icon={<LuSparkles className="text-primary size-4" />}
      title={text.title}
    >
      <p className="text-muted-foreground text-sm">{text.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {weakDomains.length ? (
          weakDomains.slice(0, 4).map((domain) => (
            <Badge
              key={domain}
              variant="outline"
              className="rounded-xl bg-white/70"
            >
              {domain}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">
            {text.noWeakDomains}
          </span>
        )}
      </div>
      {activePlan && (
        <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm dark:bg-white/8">
          <div className="font-semibold">{activePlan.title}</div>
          {activePlan.description && (
            <div className="text-muted-foreground mt-1">
              {activePlan.description}
            </div>
          )}
        </div>
      )}
      <Button
        type="button"
        className="mt-3 h-10 w-full rounded-xl"
        disabled={isGenerating}
        onClick={() => onGenerate(targetDomain)}
      >
        <LuSparkles className="size-4" />
        {activePlan ? text.refresh : text.generate}
      </Button>
    </OutcomeSection>
  );
}

function SchedulePreview({
  items,
  dictionary,
}: {
  items: StudentCourseOverviewResponse['learningOutcomes']['schedule']['preview'];
  dictionary: Dictionary;
}) {
  const text = dictionary.studentExperience.learningOutcomes.schedule;

  return (
    <OutcomeSection
      icon={<LuCalendar className="text-primary size-4" />}
      title={text.title}
    >
      {items.length ? (
        <div className="grid gap-2">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-start justify-between gap-3 rounded-xl border bg-white/70 p-3 dark:bg-white/8"
            >
              <div>
                <div className="font-semibold">
                  {item.type === 'flashcards'
                    ? dictionaryFormat(text.flashcardsTitle, item.title)
                    : item.title}
                </div>
                {item.description && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    {item.description}
                  </div>
                )}
              </div>
              {item.plannedForDate && (
                <span className="text-muted-foreground text-xs font-semibold">
                  {formatDate(item.plannedForDate, dictionary)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{text.empty}</p>
      )}
    </OutcomeSection>
  );
}

function MockExamSummary({
  courseId,
  mockExams,
  dictionary,
}: {
  courseId: string;
  mockExams: StudentCourseOverviewResponse['learningOutcomes']['mockExams'];
  dictionary: Dictionary;
}) {
  const text = dictionary.studentExperience.learningOutcomes.mockExams;

  return (
    <OutcomeSection
      icon={<LuTimer className="text-primary size-4" />}
      title={text.title}
    >
      {mockExams.availableExams ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <MiniMetric
              label={text.available}
              value={String(mockExams.availableExams)}
            />
            <MiniMetric
              label={text.simulations}
              value={String(mockExams.simulatedExams)}
            />
            <MiniMetric
              label={text.bestScore}
              value={
                mockExams.bestScore != null
                  ? dictionaryFormat(
                      dictionary.studentExperience.score,
                      mockExams.bestScore,
                    )
                  : dictionaryFormat(dictionary.studentExperience.score, 0)
              }
            />
            <MiniMetric
              label={text.lastScore}
              value={
                mockExams.lastScore != null
                  ? dictionaryFormat(
                      dictionary.studentExperience.score,
                      mockExams.lastScore,
                    )
                  : dictionaryFormat(dictionary.studentExperience.score, 0)
              }
            />
          </div>
          <Button
            nativeButton={false}
            render={<Link to="/course/$id/learn" params={{ id: courseId }} />}
            className="mt-3 h-10 w-full rounded-xl"
          >
            <LuPlay className="size-4" />
            {text.openPlayer}
          </Button>
        </>
      ) : (
        <p className="text-muted-foreground text-sm">{text.noExams}</p>
      )}
    </OutcomeSection>
  );
}

function OutcomeSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white/55 p-4 dark:bg-white/8">
      <h3 className="flex items-center gap-2 font-extrabold">
        {icon}
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PracticeOverview({
  overview,
  dictionary,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuBrain className="text-primary size-5" />
          {dictionary.studentExperience.practiceQuestions}
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniMetric
            label={dictionary.studentExperience.answerOptions}
            value={String(overview.practice.availableQuestions)}
          />
          <MiniMetric
            label={dictionary.studentExperience.progress}
            value={
              overview.practice.averageAccuracy != null
                ? dictionaryFormat(
                    dictionary.studentExperience.score,
                    overview.practice.averageAccuracy,
                  )
                : dictionaryFormat(dictionary.studentExperience.score, 0)
            }
          />
        </div>
        <Button
          nativeButton={false}
          render={
            <Link
              to="/student/course/$courseId/practice"
              params={{ courseId: overview.course.id }}
            />
          }
          className="mt-5 h-10 w-full rounded-xl"
          disabled={!overview.practice.availableQuestions}
        >
          {dictionary.studentExperience.startPractice}
        </Button>
      </CardContent>
    </Card>
  );
}

function StudyPlanEditor({
  overview,
  dictionary,
  isSaving,
  isUpdating,
  onSave,
  onToggle,
}: {
  overview: StudentCourseOverviewResponse;
  dictionary: Dictionary;
  isSaving: boolean;
  isUpdating: boolean;
  onSave: (data: { title: string; description?: string }) => void;
  onToggle: (item: StudentStudyPlanItem) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuCircleCheck className="text-primary size-5" />
          {dictionary.studentExperience.studyPlan}
        </h2>
        <div className="mt-4 grid gap-3">
          <Input
            data-testid="student-study-plan-title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={dictionary.studentExperience.studyPlanTitlePlaceholder}
            className="rounded-xl bg-white/80 dark:bg-white/8"
          />
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={
              dictionary.studentExperience.studyPlanDescriptionPlaceholder
            }
            className="rounded-xl bg-white/80 dark:bg-white/8"
          />
          <Button
            data-testid="student-study-plan-submit-button"
            type="button"
            className="h-10 rounded-xl"
            disabled={isSaving || !title.trim()}
            onClick={() => {
              onSave({ title, description });
              setTitle('');
              setDescription('');
            }}
          >
            {dictionary.studentExperience.saveStudyPlanItem}
          </Button>
        </div>
        <div className="mt-5 space-y-3">
          {overview.studyPlan.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-xl border bg-white/72 p-3 dark:bg-white/8"
            >
              <div>
                <div className="font-bold">{item.title}</div>
                {item.description && (
                  <div className="text-muted-foreground mt-1 text-sm">
                    {item.description}
                  </div>
                )}
              </div>
              <Button
                data-testid="student-study-plan-complete-button"
                type="button"
                size="sm"
                variant={item.status === 'complete' ? 'secondary' : 'outline'}
                disabled={isUpdating}
                onClick={() => onToggle(item)}
                className="rounded-xl"
              >
                {dictionary.studentExperience.markComplete}
              </Button>
            </div>
          ))}
          {!overview.studyPlan.items.length &&
            overview.studyPlan.suggestions.map((suggestion) => (
              <StudyPlanSuggestionCard
                key={`${suggestion.kind}-${suggestion.targetId || suggestion.courseId}`}
                suggestion={suggestion}
                dictionary={dictionary}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StudyPlanSuggestionCard({
  suggestion,
  dictionary,
}: {
  suggestion: StudentStudyPlanSuggestion;
  dictionary: Dictionary;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-white/50 p-3 text-sm dark:bg-white/8">
      {dictionaryFormat(
        dictionary.studentExperience.suggestions[suggestion.kind],
        suggestion.targetTitle,
      )}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white/72 p-3 dark:bg-white/8">
      <div className="text-lg font-extrabold">{value}</div>
      <div className="text-muted-foreground text-xs font-semibold">{label}</div>
    </div>
  );
}
