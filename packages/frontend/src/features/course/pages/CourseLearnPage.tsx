import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { storage } from '@project/backend/features/permissions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import {
  LuBrain,
  LuAward,
  LuCalendar,
  LuCheck,
  LuClipboardList,
  LuFlag,
  LuFileText,
  LuLayers,
  LuListChecks,
  LuSparkles,
  LuStar,
  LuX,
} from 'react-icons/lu';
import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import {
  Course,
  CourseAssignment,
  CourseAssignmentSubmission,
  CourseCertificate,
  CourseEnrollment,
  CourseFlashcardSet,
  CourseLearningSession,
  CourseLessonProgress,
  CoursePracticeExam,
  CourseQuestion,
  CourseQuiz,
  CourseQuizAttempt,
} from '@/features/course/courseTypes';
import { CourseLearningPlayer } from '@/features/course/components/player/CourseLearningPlayer';
import { LessonAiActions } from '@/features/courseStudyAi/LessonAiActions';
import { StudyCoachPanel } from '@/features/courseStudyAi/StudyCoachPanel';
import { OneOnOneEntryCard } from '@/features/oneOnOneCall/OneOnOneEntryCard';
import { ReportDialog } from '@/features/trustSafety/ReportDialog';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { useAuthStore } from '@/features/auth/authStore';
import { useChatbotStore } from '@/features/chatbot/chatbotStore';
import { useAiTutorCreateConversation } from '@/features/aiTutor/hooks/useAiTutorCreateConversation';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import {
  offlineLearningCacheGet,
  offlineLearningCachePut,
  offlineQueueMutation,
  useOfflineLearningStatus,
} from '@/shared/lib/offlineLearning';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export const courseLearnLazyRoute = createLazyRoute('/course/$id/learn')({
  component: CourseLearnPage,
});

export function CourseLearnPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const { id } = useParams({ from: '/course/$id/learn' });
  const search = useSearch({ strict: false }) as {
    lessonId?: string;
    activation?: string;
  };
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [cachedLearnData, setCachedLearnData] =
    useState<CourseLearnResponse | null>(null);
  const [assignmentDrafts, setAssignmentDrafts] = useState<
    Record<string, { text: string; files: FileUploaded[] }>
  >({});
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const offlineStatus = useOfflineLearningStatus(id);

  const learnQuery = useQuery({
    queryKey: [
      'course',
      'learn',
      id,
      search.activation === '1' ? 'activation' : 'standard',
    ],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/course/${id}/learn${search.activation === '1' ? '?activation=1' : ''}`,
          { signal },
        )
        .json<CourseLearnResponse>(),
  });

  const learnData = learnQuery.data || cachedLearnData;
  const course = learnData?.course;
  const lessons = useMemo(() => course?.lessons || [], [course]);
  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];
  const progress = learnData?.progress || [];
  const submissions = learnData?.submissions || [];
  const quizAttempts = learnData?.quizAttempts || [];
  const certificate = learnData?.certificate;
  const completedLessonIds = new Set(progress.map((item) => item.lessonId));
  const quizSectionId = `course-learn-quizzes-${id}`;
  const noteSectionId = `course-learn-notes-${id}`;
  const completionPercent =
    lessons.length > 0
      ? Math.round((completedLessonIds.size / lessons.length) * 100)
      : 0;

  useEffect(() => {
    offlineLearningCacheGet(id).then((cached) => {
      if (cached?.payload) {
        setCachedLearnData(cached.payload as CourseLearnResponse);
      }
    });
  }, [id]);

  useEffect(() => {
    if (learnQuery.data?.course) {
      offlineLearningCachePut({
        courseId: id,
        payload: learnQuery.data,
        cachedAt: new Date().toISOString(),
      });
    }
  }, [id, learnQuery.data]);

  useEffect(() => {
    if (
      search.lessonId &&
      lessons.some((lesson) => lesson.id === search.lessonId)
    ) {
      setSelectedLessonId(search.lessonId);
    }
  }, [lessons, search.lessonId]);

  useEffect(() => {
    if (!selectedLessonId && lessons[0]) {
      setSelectedLessonId(learnData?.resume?.lessonId || lessons[0].id);
    }
  }, [learnData?.resume?.lessonId, lessons, selectedLessonId]);

  const resumeMutation = useMutation({
    mutationFn: (data: {
      lessonId?: string | null;
      practiceAttemptId?: string | null;
      lastRoute?: string | null;
      lastScrollPercent?: number | null;
    }) =>
      apiClient
        .put(`api/student/course/${id}/resume`, {
          json: {
            ...data,
            deviceType: window.isNativeApp ? window.nativePlatform : 'web',
          },
        })
        .json(),
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) =>
      apiClient.post(`api/course/${id}/lesson/${lessonId}/complete`).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course', 'learn', id],
      });
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'course', id],
      });
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'dashboard'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'masteryMap'],
      });
      toast.success(dictionary.course.success.lessonCompleted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const cacheLessonComplete = (lessonId: string) => {
    queryClient.setQueryData<CourseLearnResponse>(
      ['course', 'learn', id],
      (current) => {
        if (!current) {
          return current;
        }
        if (current.progress.some((item) => item.lessonId === lessonId)) {
          return current;
        }

        return {
          ...current,
          progress: [
            ...current.progress,
            {
              id: `offline-${lessonId}`,
              courseId: id,
              lessonId,
              userId: current.enrollment?.userId || '',
              completedAt: new Date().toISOString(),
            },
          ],
        };
      },
    );
  };

  const updateResume = (lessonId: string) => {
    const payload = {
      lessonId,
      lastRoute: `/course/${id}/learn?lessonId=${lessonId}`,
      lastScrollPercent: Math.round(
        (window.scrollY /
          Math.max(
            1,
            document.documentElement.scrollHeight - window.innerHeight,
          )) *
          100,
      ),
    };

    if (offlineStatus.isOffline) {
      offlineQueueMutation({
        type: 'resumeUpdate',
        courseId: id,
        resume: {
          ...payload,
          deviceType: window.isNativeApp ? window.nativePlatform : 'web',
        },
      });
      return;
    }

    resumeMutation.mutate(payload);
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    updateResume(lessonId);
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (offlineStatus.isOffline) {
      cacheLessonComplete(lessonId);
      offlineQueueMutation({
        type: 'lessonComplete',
        courseId: id,
        lessonId,
      });
      toast.success(dictionary.course.mobile.savedOffline);
      return;
    }

    completeMutation.mutate(lessonId);
  };

  const submitMutation = useMutation({
    mutationFn: ({
      assignmentId,
      draft,
    }: {
      assignmentId: string;
      draft: { text: string; files: FileUploaded[] };
    }) =>
      apiClient
        .post(`api/course/${id}/assignment/${assignmentId}/submission`, {
          json: {
            text: draft.text,
            files: draft.files,
          },
        })
        .json(),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['course', 'learn', id],
      });
      setAssignmentDrafts((current) => ({
        ...current,
        [variables.assignmentId]: { text: '', files: [] },
      }));
      toast.success(dictionary.course.success.assignmentSubmitted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const selectedAssignments = useMemo(() => {
    if (!course || !selectedLesson) {
      return [];
    }

    return course.assignments.filter(
      (assignment) =>
        assignment.lessonId === selectedLesson.id ||
        assignment.moduleId === selectedLesson.moduleId,
    );
  }, [course, selectedLesson]);

  const selectedQuizzes = useMemo(() => {
    if (!course || !selectedLesson) {
      return [];
    }
    return (course.quizzes || []).filter(
      (quiz) =>
        quiz.lessonId === selectedLesson.id ||
        (Boolean(quiz.moduleId) && quiz.moduleId === selectedLesson.moduleId),
    );
  }, [course, selectedLesson]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.course.list.title, '/course'],
          [course?.title || dictionary.course.learn.title],
        ]}
      />

      <OfflineStatusBanner status={offlineStatus.status} />

      {course && selectedLesson && (
        <CourseLearningPlayer
          course={course}
          selectedLesson={selectedLesson}
          completedLessonIds={completedLessonIds}
          completionPercent={completionPercent}
          onSelectLesson={handleSelectLesson}
          onCompleteLesson={handleCompleteLesson}
          completeLessonPending={completeMutation.isPending}
          hasSelectedQuiz={selectedQuizzes.length > 0}
          quizSectionId={quizSectionId}
          noteSectionId={noteSectionId}
          afterLessonContent={
            <LessonAiActions
              courseId={course.id}
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
              moduleId={selectedLesson.moduleId}
              moduleTitle={
                course.modules.find(
                  (module) => module.id === selectedLesson.moduleId,
                )?.title
              }
            />
          }
          activityContent={
            <>
              <AssignmentsPanel
                assignments={selectedAssignments}
                submissions={submissions}
                enrollment={learnData?.enrollment || null}
                drafts={assignmentDrafts}
                setDrafts={setAssignmentDrafts}
                isSubmitting={submitMutation.isPending}
                onSubmit={(assignmentId, draft) =>
                  submitMutation.mutate({ assignmentId, draft })
                }
              />

              <div id={quizSectionId}>
                <QuizPanel
                  courseId={course.id}
                  quizzes={selectedQuizzes}
                  attempts={quizAttempts}
                />
              </div>

              <PracticeExamPanel
                courseId={course.id}
                exams={course.practiceExams || []}
              />

              <FlashcardPanel sets={course.flashcardSets || []} />
            </>
          }
          supportContent={
            <>
              <CourseRatingCard course={course} />
              {certificate && (
                <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
                  <CardContent className="p-5">
                    <Button
                      nativeButton={false}
                      render={
                        <Link
                          to="/course/$id/certificate"
                          params={{ id: course.id }}
                        />
                      }
                      variant="outline"
                      className="h-10 w-full rounded-xl bg-white/70"
                    >
                      <LuAward className="size-4" />
                      {dictionary.course.certificate.view}
                    </Button>
                  </CardContent>
                </Card>
              )}
              <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
                <CardContent className="p-5">
                  <Button
                    variant="outline"
                    className="h-10 w-full rounded-xl bg-white/70"
                    onClick={() => setReportDialogOpen(true)}
                  >
                    <LuFlag className="size-4" />
                    {dictionary.trustSafety.report.reportCourse}
                  </Button>
                </CardContent>
              </Card>
              <CourseAiTutor
                courseId={course.id}
                courseTitle={course.title}
                lessonId={selectedLesson.id}
              />
              <StudyCoachPanel courseId={course.id} />
              <OneOnOneEntryCard courseId={course.id} />
              <div id={noteSectionId}>
                <LessonNoteQuickAdd
                  key={selectedLesson.id}
                  courseId={course.id}
                  lessonId={selectedLesson.id}
                  lessonTitle={selectedLesson.title}
                />
              </div>
              <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
                <CardContent className="p-5">
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/student/course/$courseId/practice"
                        params={{ courseId: course.id }}
                      />
                    }
                    variant="outline"
                    className="h-10 w-full rounded-xl bg-white/70"
                  >
                    <LuBrain className="size-4" />
                    {dictionary.studentExperience.startPractice}
                  </Button>
                </CardContent>
              </Card>
            </>
          }
        />
      )}

      {course && selectedLesson && (
        <>
          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            target={{
              targetType: 'course',
              courseId: course.id,
              teacherUserId: course.creatorUserId,
            }}
          />
        </>
      )}
    </div>
  );
}

type CourseLearnResponse = {
  course: Course;
  enrollment: CourseEnrollment | null;
  progress: CourseLessonProgress[];
  submissions: CourseAssignmentSubmission[];
  quizAttempts: CourseQuizAttempt[];
  certificate: CourseCertificate | null;
  resume?: CourseLearningSession | null;
};

function OfflineStatusBanner({
  status,
}: {
  status: ReturnType<typeof useOfflineLearningStatus>['status'];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const label = dictionary.course.mobile.offlineStatus[status];

  if (status === 'online' || !label) {
    return null;
  }

  return (
    <div className="border-nexexam-line text-muted-foreground rounded-2xl border bg-white/82 px-4 py-3 text-sm font-semibold shadow-sm backdrop-blur md:hidden dark:border-white/10 dark:bg-white/8">
      {label}
    </div>
  );
}

function CourseRatingCard({ course }: { course: Course }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(course.myRating?.rating || 0);
  const [comment, setComment] = useState(course.myRating?.comment || '');
  const ratingSummary = course.ratingSummary;

  useEffect(() => {
    setRating(course.myRating?.rating || 0);
    setComment(course.myRating?.comment || '');
  }, [course.myRating?.comment, course.myRating?.rating]);

  const mutation = useMutation({
    mutationFn: () =>
      apiClient
        .put(`api/course/${course.id}/rating`, {
          json: {
            rating,
            comment: comment || null,
            isPublic: true,
          },
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course', 'learn', course.id],
      });
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.success.ratingSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span className="bg-nexexam-accent text-nexexam-primary grid size-10 place-items-center rounded-xl">
            <LuStar className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold">
              {dictionary.course.ratings.title}
            </h2>
            <p className="text-muted-foreground text-xs">
              {ratingSummary?.count
                ? dictionary.course.ratings.summary
                    .replace(
                      '{0}',
                      new Intl.NumberFormat(locale, {
                        maximumFractionDigits: 1,
                      }).format(ratingSummary.average),
                    )
                    .replace(
                      '{1}',
                      new Intl.NumberFormat(locale).format(ratingSummary.count),
                    )
                : dictionary.course.ratings.noRatings}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              variant={value <= rating ? 'default' : 'outline'}
              size="icon"
              className="size-9 rounded-xl"
              aria-label={dictionary.course.ratings.starLabel.replace(
                '{0}',
                String(value),
              )}
              onClick={() => setRating(value)}
            >
              <LuStar className="size-4" />
            </Button>
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={dictionary.course.ratings.commentPlaceholder}
          className="min-h-20 rounded-xl bg-white/80 dark:bg-white/8"
        />
        <Button
          type="button"
          className="h-10 w-full rounded-xl"
          disabled={mutation.isPending || rating < 1}
          onClick={() => mutation.mutate()}
        >
          {dictionary.course.ratings.save}
        </Button>
      </CardContent>
    </Card>
  );
}

function AssignmentsPanel({
  assignments,
  submissions,
  enrollment,
  drafts,
  setDrafts,
  isSubmitting,
  onSubmit,
}: {
  assignments: CourseAssignment[];
  submissions: CourseAssignmentSubmission[];
  enrollment: CourseEnrollment | null;
  drafts: Record<string, { text: string; files: FileUploaded[] }>;
  setDrafts: Dispatch<
    SetStateAction<Record<string, { text: string; files: FileUploaded[] }>>
  >;
  isSubmitting: boolean;
  onSubmit: (
    assignmentId: string,
    draft: { text: string; files: FileUploaded[] },
  ) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const submissionsByAssignmentId = new Map(
    submissions.map((submission) => [submission.assignmentId, submission]),
  );
  const attemptsByAssignmentId = submissions.reduce((map, submission) => {
    if (!map.has(submission.assignmentId)) {
      map.set(submission.assignmentId, []);
    }
    map.get(submission.assignmentId)!.push(submission);
    return map;
  }, new Map<string, CourseAssignmentSubmission[]>());

  if (!assignments.length) {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-5 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuFileText className="text-primary size-5" />
          {dictionary.course.learn.assignments}
        </h2>
        {assignments.map((assignment) => {
          const draft = drafts[assignment.id] || { text: '', files: [] };
          const submission = submissionsByAssignmentId.get(assignment.id);
          const attempts = attemptsByAssignmentId.get(assignment.id) || [];
          const dueDate =
            enrollment?.enrolledAt && assignment.dueDaysAfterEnroll != null
              ? new Date(enrollment.enrolledAt)
              : null;
          if (dueDate && assignment.dueDaysAfterEnroll != null) {
            dueDate.setDate(dueDate.getDate() + assignment.dueDaysAfterEnroll);
          }
          const maxAttemptsReached =
            assignment.maxAttempts != null &&
            attempts.length >= assignment.maxAttempts;
          const canSubmit =
            !submission ||
            (submission.status === 'needsRevision' &&
              assignment.allowResubmissions &&
              !maxAttemptsReached);
          const submitDisabled =
            isSubmitting ||
            !canSubmit ||
            (!draft.text.trim() && !draft.files.length);

          return (
            <div
              key={assignment.id}
              className="rounded-2xl border bg-white/74 p-4 dark:bg-white/8"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold">{assignment.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                    {assignment.prompt}
                  </p>
                  {dueDate && (
                    <p className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                      <LuCalendar className="size-3.5" />
                      {dictionary.course.fields.dueDate}:{' '}
                      {formatDate(dueDate, dictionary)}
                    </p>
                  )}
                </div>
                {submission && (
                  <Badge variant="outline" className="rounded-xl">
                    {dictionaryEnumerator(
                      dictionary.course.enumerators.submissionStatus,
                      submission.status,
                    )}
                  </Badge>
                )}
              </div>
              {submission?.feedback && (
                <div className="bg-nexexam-primary/10 text-nexexam-primary mt-3 rounded-xl p-3 text-sm">
                  {submission.feedback}
                </div>
              )}
              {submission?.score != null && submission.maxScore != null && (
                <div className="text-muted-foreground mt-3 text-sm font-semibold">
                  {dictionary.course.fields.score}: {submission.score}/
                  {submission.maxScore}
                </div>
              )}
              {assignment.rubric?.length ? (
                <div className="mt-3 rounded-xl border bg-white/70 p-3 dark:bg-white/8">
                  <div className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                    {dictionary.course.fields.rubric}
                  </div>
                  <div className="mt-2 grid gap-2">
                    {assignment.rubric.map((criterion) => (
                      <div key={criterion.id} className="text-sm">
                        <div className="font-semibold">
                          {criterion.title} - {criterion.maxPoints}{' '}
                          {dictionary.course.fields.points}
                        </div>
                        {criterion.description && (
                          <p className="text-muted-foreground mt-1">
                            {criterion.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {attempts.length > 0 && (
                <div className="text-muted-foreground mt-3 flex flex-wrap gap-2 text-xs">
                  {attempts.map((attempt) => (
                    <Badge
                      key={attempt.id}
                      variant="secondary"
                      className="rounded-xl"
                    >
                      {dictionary.course.fields.attempt} {attempt.attemptNumber}{' '}
                      -{' '}
                      {dictionaryEnumerator(
                        dictionary.course.enumerators.submissionStatus,
                        attempt.status,
                      )}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-4 space-y-3">
                <Textarea
                  data-testid="course-learn-assignment-textarea"
                  value={draft.text}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [assignment.id]: {
                        ...draft,
                        text: event.target.value,
                      },
                    }))
                  }
                  placeholder={dictionary.course.fields.submissionText}
                  className="min-h-28 rounded-xl bg-white/80 dark:bg-white/8"
                />
                <FilesUploadDropzone
                  storage={storage.courseAssignmentSubmissions}
                  value={draft.files}
                  onChange={(files) =>
                    setDrafts((current) => ({
                      ...current,
                      [assignment.id]: {
                        ...draft,
                        files: files || [],
                      },
                    }))
                  }
                />
                <Button
                  data-testid="course-learn-submit-assignment-button"
                  className="h-10 rounded-xl"
                  disabled={submitDisabled}
                  onClick={() => onSubmit(assignment.id, draft)}
                >
                  {submission?.status === 'needsRevision'
                    ? dictionary.course.learn.resubmitAssignment
                    : dictionary.course.learn.submitAssignment}
                </Button>
                {submission?.status === 'submitted' && (
                  <p className="text-muted-foreground text-xs">
                    {dictionary.course.learn.pendingReview}
                  </p>
                )}
                {submission?.status === 'complete' && (
                  <p className="text-muted-foreground text-xs">
                    {dictionary.course.learn.homeworkComplete}
                  </p>
                )}
                {submission?.status === 'needsRevision' &&
                  !assignment.allowResubmissions && (
                    <p className="text-muted-foreground text-xs">
                      {dictionary.course.learn.resubmissionClosed}
                    </p>
                  )}
                {submission?.status === 'needsRevision' &&
                  assignment.allowResubmissions &&
                  maxAttemptsReached && (
                    <p className="text-muted-foreground text-xs">
                      {dictionary.course.learn.maxAttemptsReached}
                    </p>
                  )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function CourseAiTutor({
  courseId,
  courseTitle,
  lessonId,
}: {
  courseId: string;
  courseTitle: string;
  lessonId: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const createConversation = useAiTutorCreateConversation();
  // Kept so existing telemetry/keyboard-shortcuts that read the store still
  // see a context value the moment the user hits the tutor button — the
  // Sheet modal will not actually open since we're navigating away.
  const setChatbotContext = useChatbotStore((state) => state.setContext);

  const openTutor = async (initialMessage?: string) => {
    setChatbotContext({ courseId, lessonId, courseTitle });
    const result = await createConversation.mutateAsync({
      courseId,
      lessonId,
      initialMessage,
    });
    await navigate({
      to: '/student/ai-tutor/$conversationId',
      params: { conversationId: result.conversation.id },
    });
  };

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <span className="bg-nexexam-accent text-nexexam-primary grid size-10 place-items-center rounded-xl">
            <LuSparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold">{dictionary.course.learn.tutor}</h2>
            <p className="text-muted-foreground text-xs">
              {dictionary.aiTutor.subtitle}
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {dictionary.studentExperience.aiPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={createConversation.isPending}
              onClick={() => openTutor(prompt)}
              className="hover:border-primary/30 hover:text-primary w-full rounded-xl border bg-white/74 px-3 py-2 text-left text-sm font-semibold transition disabled:opacity-60 dark:bg-white/8"
            >
              {prompt}
            </button>
          ))}
        </div>
        <Button
          data-testid="course-learn-tutor-button"
          type="button"
          className="mt-4 h-10 w-full rounded-xl"
          disabled={createConversation.isPending}
          onClick={() => openTutor()}
        >
          {dictionary.studentExperience.askCourseTutor}
        </Button>
      </CardContent>
    </Card>
  );
}

function LessonNoteQuickAdd({
  courseId,
  lessonId,
  lessonTitle,
}: {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(lessonTitle);
  const [content, setContent] = useState('');
  const mutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/student/course/${courseId}/notes`, {
          json: { title, content, lessonId },
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'course', courseId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'dashboard'],
      });
      setContent('');
      toast.success(dictionary.studentExperience.success.noteSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuFileText className="text-primary size-5" />
          {dictionary.studentExperience.addNote}
        </h2>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={dictionary.studentExperience.noteTitlePlaceholder}
          className="rounded-xl bg-white/80 dark:bg-white/8"
        />
        <Textarea
          data-testid="course-learn-note-content-input"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={dictionary.studentExperience.noteContentPlaceholder}
          className="min-h-24 rounded-xl bg-white/80 dark:bg-white/8"
        />
        <Button
          data-testid="course-learn-note-submit-button"
          type="button"
          className="h-10 w-full rounded-xl"
          disabled={mutation.isPending || !title.trim() || !content.trim()}
          onClick={() => mutation.mutate()}
        >
          {dictionary.studentExperience.saveNote}
        </Button>
      </CardContent>
    </Card>
  );
}

type QuizGradeResult = {
  scorePercent: number;
  passed: boolean;
  earnedPoints: number;
  totalPoints: number;
  questions: Array<{
    questionId: string;
    isCorrect: boolean;
    correctOptionIds: string[];
    explanation?: string | null;
  }>;
};

function QuizPanel({
  courseId,
  quizzes,
  attempts,
}: {
  courseId: string;
  quizzes: CourseQuiz[];
  attempts: CourseQuizAttempt[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (!quizzes.length) {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-5 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuListChecks className="text-primary size-5" />
          {dictionary.course.learn.quizzes}
        </h2>
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            courseId={courseId}
            quiz={quiz}
            attempts={attempts.filter((attempt) => attempt.quizId === quiz.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function QuizCard({
  courseId,
  quiz,
  attempts,
}: {
  courseId: string;
  quiz: CourseQuiz;
  attempts: CourseQuizAttempt[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const quizText = dictionary.course.quiz;
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<QuizGradeResult | null>(null);
  const questions = quiz.questions
    .map((link) => link.question)
    .filter((question): question is CourseQuestion => Boolean(question));

  const attemptMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/course/${courseId}/quiz/${quiz.id}/attempt`, {
          json: {
            answers: questions.map((question) => ({
              questionId: question.id,
              selectedOptionIds: answers[question.id] || [],
            })),
          },
        })
        .json<{ result: QuizGradeResult }>(),
    onSuccess: async (data) => {
      setResult(data.result);
      await queryClient.invalidateQueries({
        queryKey: ['course', 'learn', courseId],
      });
      toast.success(dictionary.course.success.quizSubmitted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const toggleOption = (questionId: string, type: string, optionId: string) => {
    if (result) {
      return;
    }
    setAnswers((current) => {
      const previous = current[questionId] || [];
      if (type === 'multiSelect') {
        return {
          ...current,
          [questionId]: previous.includes(optionId)
            ? previous.filter((id) => id !== optionId)
            : [...previous, optionId],
        };
      }
      return { ...current, [questionId]: [optionId] };
    });
  };

  const allAnswered = questions.every(
    (question) => (answers[question.id] || []).length > 0,
  );
  const resultByQuestion = new Map(
    (result?.questions || []).map((item) => [item.questionId, item]),
  );
  const lastAttempt = attempts[0];

  if (!questions.length) {
    return (
      <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
        <h3 className="font-extrabold">{quiz.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{quizText.empty}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-extrabold">{quiz.title}</h3>
        <div className="flex items-center gap-2">
          {quiz.passingScore != null && (
            <Badge variant="outline" className="rounded-lg">
              {quizText.passingScore}: {quiz.passingScore}%
            </Badge>
          )}
          {lastAttempt && (
            <Badge variant="secondary" className="rounded-lg">
              {quizText.lastScore}: {lastAttempt.scorePercent}%
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {questions.map((question, index) => {
          const graded = resultByQuestion.get(question.id);
          const selected = new Set(answers[question.id] || []);

          return (
            <div
              key={question.id}
              className="rounded-xl border bg-white/80 p-3 dark:bg-white/10"
            >
              <p className="text-sm font-semibold">
                {index + 1}. {question.questionText}
              </p>
              <div className="mt-2 grid gap-1">
                {question.answers.map((option) => {
                  const isSelected = selected.has(option.id);
                  const isCorrect = graded?.correctOptionIds.includes(
                    option.id,
                  );

                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-testid="course-learn-quiz-option"
                      disabled={Boolean(result)}
                      onClick={() =>
                        toggleOption(
                          question.id,
                          question.questionType,
                          option.id,
                        )
                      }
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        graded && isCorrect
                          ? 'border-nexexam-success bg-nexexam-success/10'
                          : graded && isSelected
                            ? 'border-nexexam-warning bg-nexexam-warning/10'
                            : isSelected
                              ? 'border-nexexam-primary bg-nexexam-primary/10'
                              : 'bg-white/70 dark:bg-white/8'
                      }`}
                    >
                      <span className="grid size-4 shrink-0 place-items-center rounded border">
                        {isSelected && <LuCheck className="size-3" />}
                      </span>
                      <span>{option.answerText}</span>
                    </button>
                  );
                })}
              </div>
              {graded && (
                <p
                  className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                    graded.isCorrect
                      ? 'text-nexexam-success'
                      : 'text-nexexam-warning'
                  }`}
                >
                  {graded.isCorrect ? (
                    <LuCheck className="size-3.5" />
                  ) : (
                    <LuX className="size-3.5" />
                  )}
                  {graded.isCorrect ? quizText.correct : quizText.incorrect}
                </p>
              )}
              {graded?.explanation && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {quizText.explanation}: {graded.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {result ? (
        <div className="bg-nexexam-primary/10 mt-3 rounded-xl p-3 text-sm font-semibold">
          {quizText.yourScore}: {result.scorePercent}% —{' '}
          {result.passed ? quizText.passed : quizText.failed}
        </div>
      ) : (
        <>
          {!allAnswered && (
            <p className="text-muted-foreground mt-3 text-xs">
              {quizText.answerAll}
            </p>
          )}
          <Button
            data-testid="course-learn-submit-quiz-button"
            className="mt-2 h-10 rounded-xl"
            disabled={attemptMutation.isPending || !allAnswered}
            onClick={() => attemptMutation.mutate()}
          >
            {quizText.submit}
          </Button>
        </>
      )}
    </div>
  );
}

type ExamQuestion = {
  id: string;
  questionText: string;
  questionType: string;
  examDomain?: string | null;
  answers: { id: string; answerText: string }[];
};

type ExamResult = {
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
};

function PracticeExamPanel({
  courseId,
  exams,
}: {
  courseId: string;
  exams: CoursePracticeExam[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (!exams.length) {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-5 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuClipboardList className="text-primary size-5" />
          {dictionary.course.practiceExam.heading}
        </h2>
        {exams.map((exam) => (
          <PracticeExamRunner key={exam.id} courseId={courseId} exam={exam} />
        ))}
      </CardContent>
    </Card>
  );
}

function PracticeExamRunner({
  courseId,
  exam,
}: {
  courseId: string;
  exam: CoursePracticeExam;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const text = dictionary.course.practiceExam;
  const [session, setSession] = useState<{
    attemptId: string;
    questions: ExamQuestion[];
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<ExamResult | null>(null);

  const startMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/course/${courseId}/practice-exam/${exam.id}/start`)
        .json<{ attempt: { id: string }; questions: ExamQuestion[] }>(),
    onSuccess: (data) => {
      setSession({ attemptId: data.attempt.id, questions: data.questions });
      setAnswers({});
      setResult(null);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(
          `api/course/${courseId}/practice-exam/${exam.id}/attempt/${session?.attemptId}/submit`,
          {
            json: {
              answers: (session?.questions || []).map((question) => ({
                questionId: question.id,
                selectedOptionIds: answers[question.id] || [],
              })),
            },
          },
        )
        .json<{ result: ExamResult }>(),
    onSuccess: (data) => setResult(data.result),
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const toggle = (question: ExamQuestion, optionId: string) => {
    setAnswers((current) => {
      const previous = current[question.id] || [];
      if (question.questionType === 'multiSelect') {
        return {
          ...current,
          [question.id]: previous.includes(optionId)
            ? previous.filter((id) => id !== optionId)
            : [...previous, optionId],
        };
      }
      return { ...current, [question.id]: [optionId] };
    });
  };

  const allAnswered =
    session?.questions.every(
      (question) => (answers[question.id] || []).length > 0,
    ) ?? false;

  return (
    <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-extrabold">{exam.title}</h3>
        <div className="flex items-center gap-2">
          {exam.timeLimitMinutes != null && (
            <Badge variant="outline" className="rounded-lg">
              {exam.timeLimitMinutes} min
            </Badge>
          )}
          {exam.passingScore != null && (
            <Badge variant="outline" className="rounded-lg">
              {dictionary.course.quiz.passingScore}: {exam.passingScore}%
            </Badge>
          )}
        </div>
      </div>

      {!session && !result && (
        <Button
          data-testid="course-learn-start-exam-button"
          className="mt-3 h-10 rounded-xl"
          disabled={startMutation.isPending}
          onClick={() => startMutation.mutate()}
        >
          {text.start}
        </Button>
      )}

      {session && !result && (
        <div className="mt-3 grid gap-3">
          {session.questions.length === 0 && (
            <p className="text-muted-foreground text-sm">{text.empty}</p>
          )}
          {session.questions.map((question, index) => {
            const selected = new Set(answers[question.id] || []);
            return (
              <div
                key={question.id}
                className="rounded-xl border bg-white/80 p-3 dark:bg-white/10"
              >
                <p className="text-sm font-semibold">
                  {index + 1}. {question.questionText}
                </p>
                <div className="mt-2 grid gap-1">
                  {question.answers.map((option) => {
                    const isSelected = selected.has(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        data-testid="course-learn-exam-option"
                        onClick={() => toggle(question, option.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                          isSelected
                            ? 'border-nexexam-primary bg-nexexam-primary/10'
                            : 'bg-white/70 dark:bg-white/8'
                        }`}
                      >
                        <span className="grid size-4 shrink-0 place-items-center rounded border">
                          {isSelected && <LuCheck className="size-3" />}
                        </span>
                        <span>{option.answerText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {session.questions.length > 0 && (
            <>
              {!allAnswered && (
                <p className="text-muted-foreground text-xs">
                  {text.answerAll}
                </p>
              )}
              <Button
                data-testid="course-learn-submit-exam-button"
                className="h-10 rounded-xl"
                disabled={submitMutation.isPending || !allAnswered}
                onClick={() => submitMutation.mutate()}
              >
                {text.submit}
              </Button>
            </>
          )}
        </div>
      )}

      {result && (
        <div className="mt-3 grid gap-2">
          <div className="bg-nexexam-primary/10 rounded-xl p-3 text-sm font-semibold">
            {text.yourScore}: {result.scorePercent}% —{' '}
            {result.passed ? text.passed : text.failed}
          </div>
          {result.domainScores.length > 0 && (
            <div className="rounded-xl border p-3 text-sm dark:bg-white/8">
              <p className="font-bold">{text.domainBreakdown}</p>
              <div className="mt-2 grid gap-1">
                {result.domainScores.map((domain) => (
                  <div
                    key={domain.domain}
                    className="flex justify-between gap-3"
                  >
                    <span>{domain.domain}</span>
                    <span className="text-muted-foreground">
                      {domain.correct}/{domain.total} ({domain.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className="h-9 justify-self-start rounded-xl bg-white/70 dark:bg-white/8"
            onClick={() => {
              setSession(null);
              setResult(null);
              setAnswers({});
            }}
          >
            {text.retake}
          </Button>
        </div>
      )}
    </div>
  );
}

function FlashcardPanel({ sets }: { sets: CourseFlashcardSet[] }) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (!sets.length) {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-5 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuLayers className="text-primary size-5" />
          {dictionary.course.flashcards.heading}
        </h2>
        {sets.map((set) => (
          <FlashcardDeck key={set.id} set={set} />
        ))}
      </CardContent>
    </Card>
  );
}

function FlashcardDeck({ set }: { set: CourseFlashcardSet }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const text = dictionary.course.flashcards;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const cards = set.cards || [];

  if (!cards.length) {
    return (
      <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
        <h3 className="font-extrabold">{set.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{text.empty}</p>
      </div>
    );
  }

  const card = cards[Math.min(index, cards.length - 1)];
  const go = (delta: number) => {
    setIndex((current) => (current + delta + cards.length) % cards.length);
    setFlipped(false);
    setShowHint(false);
  };

  return (
    <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-extrabold">{set.title}</h3>
        <span className="text-muted-foreground text-xs">
          {text.cardLabel} {index + 1} / {cards.length}
        </span>
      </div>
      <button
        type="button"
        data-testid="course-learn-flashcard"
        onClick={() => setFlipped((value) => !value)}
        className="hover:border-nexexam-primary/40 mt-3 grid min-h-32 w-full place-items-center rounded-2xl border bg-white p-6 text-center text-lg font-semibold transition dark:bg-white/10"
      >
        {flipped ? card.back : card.front}
      </button>
      {card.hint &&
        (showHint ? (
          <p className="text-muted-foreground mt-2 text-sm">{card.hint}</p>
        ) : (
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="text-primary mt-2 text-xs font-semibold"
          >
            {text.showHint}
          </button>
        ))}
      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
          onClick={() => go(-1)}
        >
          {text.previous}
        </Button>
        <Button
          variant="outline"
          className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
          onClick={() => setFlipped((value) => !value)}
        >
          {text.flip}
        </Button>
        <Button
          variant="outline"
          className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
          onClick={() => go(1)}
        >
          {text.next}
        </Button>
      </div>
    </div>
  );
}
