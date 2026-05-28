import { useQuery } from '@tanstack/react-query';
import {
  createLazyRoute,
  Link,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBookOpen,
  LuBrain,
  LuCircleCheck,
  LuClipboardList,
  LuMap,
  LuNotebookPen,
  LuPlay,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { useAuthStore } from '@/features/auth/authStore';
import { useAiTutorCreateConversation } from '@/features/aiTutor/hooks/useAiTutorCreateConversation';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import type { Dictionary } from '@/features/auth/authStore';
import type {
  StudentCourseCard,
  StudentDashboardResponse,
  StudentHomeworkItem,
  StudentMasteryMapResponse,
  StudentReadiness,
  StudentStudyPlanItem,
} from '../studentExperienceTypes';

export const studentDashboardLazyRoute = createLazyRoute('/student')({
  component: StudentDashboardPage,
});

export const studentMyCoursesLazyRoute = createLazyRoute('/student/my-courses')(
  {
    component: StudentDashboardPage,
  },
);

export const studentPracticeHomeLazyRoute = createLazyRoute(
  '/student/practice',
)({
  component: StudentDashboardPage,
});

export const studentNotesHomeLazyRoute = createLazyRoute('/student/notes')({
  component: StudentDashboardPage,
});

export function StudentDashboardPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const currentMember = useAuthStore((state) => state.currentMember);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const createAiTutorConversation = useAiTutorCreateConversation();
  const dashboardQuery = useQuery({
    queryKey: ['studentExperience', 'dashboard'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/student/dashboard', { signal })
        .json<StudentDashboardResponse>(),
  });
  const masteryMapQuery = useQuery({
    queryKey: ['studentExperience', 'masteryMap'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/student/mastery-map', { signal })
        .json<StudentMasteryMapResponse>(),
  });
  const dashboard = dashboardQuery.data;
  const masteryMap = masteryMapQuery.data;
  const firstName =
    currentMember?.firstName ||
    currentMember?.fullName?.split(' ')[0] ||
    dictionary.dashboard.fallbackName;
  const nextCourse = dashboard?.courses.find(
    (course) => course.course.id === dashboard.nextAction?.courseId,
  );
  const activeView = studentDashboardView(pathname);

  const openTutor = async (initialMessage?: string) => {
    const course = nextCourse || dashboard?.courses[0];
    if (!course) {
      navigate({ to: '/student/ai-tutor' });
      return;
    }

    const result = await createAiTutorConversation.mutateAsync({
      courseId: course.course.id,
      lessonId: course.nextLesson?.id || undefined,
      initialMessage,
    });
    navigate({
      to: '/student/ai-tutor/$conversationId',
      params: { conversationId: result.conversation.id },
    });
  };

  if (dashboardQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="nex-dashboard-shell flex flex-1 flex-col gap-6 px-4 py-6 lg:px-7">
      {activeView === 'overview' ? (
        <>
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="nex-glass-card nex-gradient-hero relative overflow-hidden rounded-3xl p-7 lg:p-9">
              <div className="relative z-10 max-w-3xl">
                <p className="text-muted-foreground text-base">
                  {dictionary.dashboard.welcome.replace('{0}', firstName)}
                </p>
                <h1 className="text-nexexam-ink mt-5 text-4xl leading-tight font-extrabold tracking-normal md:text-[44px] dark:text-white">
                  {dictionary.studentExperience.heroTitle}
                </h1>
                <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
                  {dictionary.studentExperience.heroSubtitle}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    nativeButton={false}
                    render={<Link {...nextActionLink(dashboard)} />}
                    size="lg"
                    className="h-12 rounded-xl px-6 shadow-[var(--nexexam-glow)]"
                  >
                    <LuPlay className="size-4" />
                    {nextActionLabel(dashboard, dictionary)}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => void openTutor()}
                    disabled={createAiTutorConversation.isPending}
                    className="border-primary/25 text-primary hover:bg-primary/5 h-12 rounded-xl bg-white/70 px-6 dark:bg-white/8"
                  >
                    <LuSparkles className="size-4" />
                    {dictionary.studentExperience.askCourseTutor}
                  </Button>
                </div>
              </div>
              <div className="pointer-events-none absolute right-8 bottom-8 hidden h-44 w-44 rounded-full border border-white/70 bg-white/30 shadow-[inset_0_0_60px_var(--nexexam-accent)] backdrop-blur-xl lg:block" />
            </div>

            <ReadinessCard
              readiness={dashboard?.readiness}
              dictionary={dictionary}
            />
          </section>

          {!dashboard?.courses.length ? (
            <EmptyCourses dictionary={dictionary} />
          ) : (
            <StudentOverview
              dashboard={dashboard}
              masteryMap={masteryMap}
              dictionary={dictionary}
              onOpenTutor={openTutor}
              isOpeningTutor={createAiTutorConversation.isPending}
            />
          )}
        </>
      ) : (
        <FocusedStudentView
          view={activeView}
          dashboard={dashboard}
          masteryMap={masteryMap}
          dictionary={dictionary}
          onOpenTutor={openTutor}
          isOpeningTutor={createAiTutorConversation.isPending}
        />
      )}
    </div>
  );
}

type StudentDashboardView = 'overview' | 'courses' | 'practice' | 'notes';

function studentDashboardView(pathname: string): StudentDashboardView {
  if (pathname.endsWith('/student/my-courses')) {
    return 'courses';
  }
  if (pathname.endsWith('/student/practice')) {
    return 'practice';
  }
  if (pathname.endsWith('/student/notes')) {
    return 'notes';
  }

  return 'overview';
}

function StudentOverview({
  dashboard,
  masteryMap,
  dictionary,
  onOpenTutor,
  isOpeningTutor,
}: {
  dashboard: StudentDashboardResponse;
  masteryMap?: StudentMasteryMapResponse;
  dictionary: Dictionary;
  onOpenTutor: (initialMessage?: string) => void;
  isOpeningTutor: boolean;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        <SectionHeader
          title={dictionary.studentExperience.myCourses}
          action={dictionary.course.list.menu}
          to="/course"
        />
        <CourseGrid courses={dashboard.courses} dictionary={dictionary} />

        <div className="grid gap-5 lg:grid-cols-2">
          <HomeworkPanel
            homework={dashboard.upcomingHomework}
            dictionary={dictionary}
          />
          <PracticePanel dashboard={dashboard} dictionary={dictionary} />
        </div>
      </div>

      <div className="space-y-5">
        <MasteryMapPreviewPanel
          masteryMap={masteryMap}
          dictionary={dictionary}
        />
        <NextUnlockPanel dashboard={dashboard} dictionary={dictionary} />
        <NotesPanel dashboard={dashboard} dictionary={dictionary} />
        <StudyPlanPanel items={dashboard.studyPlan} dictionary={dictionary} />
        <AiTutorPanel
          dashboard={dashboard}
          dictionary={dictionary}
          onOpen={onOpenTutor}
          isOpening={isOpeningTutor}
        />
      </div>
    </section>
  );
}

function MasteryMapPreviewPanel({
  masteryMap,
  dictionary,
}: {
  masteryMap?: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap.preview;
  const score = masteryMap?.summary.readinessScore ?? 0;
  const weakest = masteryMap?.weakSkills[0];
  const milestone = masteryMap?.summary.nextMilestone;
  const milestoneLabels = dictionary.studentExperience.masteryMap
    .milestoneLabels as Record<string, string>;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
              <LuMap className="size-3.5" />
              {t.badge}
            </Badge>
            <h2 className="mt-3 font-extrabold">{t.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{t.body}</p>
          </div>
          <div className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
            <LuTarget className="size-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PreviewStat
            label={t.readiness}
            value={dictionaryFormat(dictionary.studentExperience.score, score)}
          />
          <PreviewStat
            label={t.streak}
            value={dictionaryFormat(
              dictionary.studentExperience.masteryMap.streakValue,
              masteryMap?.summary.currentStreak ?? 0,
            )}
          />
        </div>

        <div className="rounded-xl border bg-white/72 p-3 dark:bg-white/8">
          <div className="text-muted-foreground text-xs">{t.weakestSkill}</div>
          <div className="mt-1 text-sm font-bold">
            {weakest?.domain || t.noWeakSkill}
          </div>
        </div>

        <div className="rounded-xl border bg-white/72 p-3 dark:bg-white/8">
          <div className="text-muted-foreground text-xs">{t.nextMilestone}</div>
          <div className="mt-1 text-sm font-bold">
            {milestone
              ? milestoneLabels[milestone.key] || milestoneLabels.mastered
              : t.noMilestone}
          </div>
        </div>

        <Button
          nativeButton={false}
          render={<Link to="/student/mastery-map" />}
          className="h-10 w-full rounded-xl"
        >
          {t.cta}
          <LuArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white/72 p-3 dark:bg-white/8">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  );
}

function NextUnlockPanel({
  dashboard,
  dictionary,
}: {
  dashboard: StudentDashboardResponse;
  dictionary: Dictionary;
}) {
  const currentSubscription = useAuthStore(
    (state) => state.currentSubscription,
  );
  const config = useAuthStore((state) => state.config);
  const hasSubscription = Boolean(currentSubscription);
  const canSubscribe = config?.subscriptionMode !== 'disabled';
  const t = dictionary.studentExperience.nextUnlock;
  const firstCourse = dashboard.courses[0];

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
              <LuSparkles className="size-3.5" />
              {hasSubscription ? t.activeBadge : t.badge}
            </Badge>
            <h2 className="mt-3 font-extrabold">
              {hasSubscription ? t.activeTitle : t.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {hasSubscription ? t.activeBody : t.body}
            </p>
          </div>
          <div className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
            <LuSparkles className="size-5" />
          </div>
        </div>

        <div className="grid gap-2">
          <UnlockRow title={t.aiPlanTitle} body={t.aiPlanBody} />
          <UnlockRow title={t.practiceTitle} body={t.practiceBody} />
          <UnlockRow title={t.certificateTitle} body={t.certificateBody} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {hasSubscription ? (
            <Button
              nativeButton={false}
              render={<Link to="/student/ai-tutor" />}
              className="h-10 rounded-xl"
            >
              {t.aiTutorCta}
            </Button>
          ) : canSubscribe ? (
            <Button
              nativeButton={false}
              render={<Link to="/subscription" />}
              className="h-10 rounded-xl"
            >
              {t.subscriptionCta}
            </Button>
          ) : null}
          <Button
            nativeButton={false}
            variant="outline"
            render={
              firstCourse ? (
                <Link
                  to="/student/course/$courseId"
                  params={{ courseId: firstCourse.course.id }}
                />
              ) : (
                <Link to="/course" />
              )
            }
            className="h-10 rounded-xl bg-white/70 dark:bg-white/8"
          >
            {t.coursesCta}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UnlockRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-white/72 p-3 dark:bg-white/8">
      <div className="flex items-center gap-2 text-sm font-bold">
        <LuCircleCheck className="text-primary size-4" />
        {title}
      </div>
      <p className="text-muted-foreground mt-1 text-xs">{body}</p>
    </div>
  );
}

function FocusedStudentView({
  view,
  dashboard,
  masteryMap,
  dictionary,
  onOpenTutor,
  isOpeningTutor,
}: {
  view: Exclude<StudentDashboardView, 'overview'>;
  dashboard: StudentDashboardResponse | undefined;
  masteryMap?: StudentMasteryMapResponse;
  dictionary: Dictionary;
  onOpenTutor: (initialMessage?: string) => void;
  isOpeningTutor: boolean;
}) {
  const title =
    view === 'courses'
      ? dictionary.studentExperience.menu.myCourses
      : view === 'practice'
        ? dictionary.studentExperience.menu.practice
        : dictionary.studentExperience.menu.notesStudyPlan;

  if (!dashboard?.courses.length) {
    return (
      <>
        <FocusedHeader
          title={title}
          description={dictionary.studentExperience.subtitle}
        />
        <EmptyCourses dictionary={dictionary} />
      </>
    );
  }

  if (view === 'courses') {
    return (
      <>
        <FocusedHeader
          title={title}
          description={dictionary.studentExperience.subtitle}
        />
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <SectionHeader
              title={dictionary.studentExperience.myCourses}
              action={dictionary.course.list.menu}
              to="/course"
            />
            <CourseGrid courses={dashboard.courses} dictionary={dictionary} />
          </div>
          <div className="space-y-5">
            <MasteryMapPreviewPanel
              masteryMap={masteryMap}
              dictionary={dictionary}
            />
            <ReadinessCard
              readiness={dashboard.readiness}
              dictionary={dictionary}
            />
            <HomeworkPanel
              homework={dashboard.upcomingHomework}
              dictionary={dictionary}
            />
          </div>
        </section>
      </>
    );
  }

  if (view === 'practice') {
    return (
      <>
        <FocusedHeader
          title={title}
          description={dictionary.studentExperience.heroSubtitle}
        />
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <PracticePanel dashboard={dashboard} dictionary={dictionary} />
            <CourseGrid courses={dashboard.courses} dictionary={dictionary} />
          </div>
          <div className="space-y-5">
            <AiTutorPanel
              dashboard={dashboard}
              dictionary={dictionary}
              onOpen={onOpenTutor}
              isOpening={isOpeningTutor}
            />
            <StudyPlanPanel
              items={dashboard.studyPlan}
              dictionary={dictionary}
            />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <FocusedHeader
        title={title}
        description={dictionary.studentExperience.subtitle}
      />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <NotesPanel dashboard={dashboard} dictionary={dictionary} />
          <StudyPlanPanel items={dashboard.studyPlan} dictionary={dictionary} />
        </div>
        <div className="space-y-5">
          <ReadinessCard
            readiness={dashboard.readiness}
            dictionary={dictionary}
          />
          <AiTutorPanel
            dashboard={dashboard}
            dictionary={dictionary}
            onOpen={onOpenTutor}
            isOpening={isOpeningTutor}
          />
        </div>
      </section>
    </>
  );
}

function FocusedHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="nex-glass-card rounded-3xl border-white/70 p-6 dark:border-white/10">
      <h1 className="text-nexexam-ink text-3xl font-extrabold tracking-normal dark:text-white">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
        {description}
      </p>
    </section>
  );
}

function CourseGrid({
  courses,
  dictionary,
}: {
  courses: StudentCourseCard[];
  dictionary: Dictionary;
}) {
  return (
    <div
      data-testid="student-dashboard-my-courses"
      className="grid gap-4 lg:grid-cols-2"
    >
      {courses.map((course) => (
        <CourseCard
          key={course.course.id}
          course={course}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}

function SectionHeader({
  title,
  action,
  to,
}: {
  title: string;
  action: string;
  to: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-nexexam-ink text-xl font-extrabold tracking-normal dark:text-white">
        {title}
      </h2>
      <Link
        to={to}
        className="text-primary inline-flex items-center gap-2 text-sm font-semibold"
      >
        {action}
        <LuArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function ReadinessCard({
  readiness,
  dictionary,
}: {
  readiness?: StudentReadiness;
  dictionary: Dictionary;
}) {
  const score = readiness?.score || 0;

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold">
              {dictionary.studentExperience.readinessScore}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {readiness?.insufficientData
                ? dictionary.studentExperience.readinessInsufficient
                : dictionary.studentExperience.readinessReady}
            </p>
          </div>
          <LuTarget className="text-primary size-6" />
        </div>
        <div className="mt-6 flex items-center gap-5">
          <div
            className="grid size-32 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--nexexam-primary) ${score}%, var(--nexexam-soft) 0)`,
            }}
          >
            <div className="dark:bg-nexexam-surface grid size-24 place-items-center rounded-full bg-white text-3xl font-extrabold">
              {score}
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            {(readiness?.signals || []).map((signal) => (
              <div key={signal.key}>
                <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold">
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

function CourseCard({
  course,
  dictionary,
}: {
  course: StudentCourseCard;
  dictionary: Dictionary;
}) {
  return (
    <Card
      data-testid="student-dashboard-course-card"
      className="nex-glass-card overflow-hidden rounded-2xl border-white/70 p-0 transition hover:-translate-y-0.5 hover:shadow-[var(--nexexam-glow)] dark:border-white/10"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {course.course.nexVerified && (
                <Badge className="rounded-xl">
                  <LuBadgeCheck className="size-3.5" />
                  {dictionary.course.fields.nexVerified}
                </Badge>
              )}
              {course.course.category && (
                <Badge variant="secondary" className="rounded-xl">
                  {course.course.category}
                </Badge>
              )}
            </div>
            <Link
              to="/student/course/$courseId"
              params={{ courseId: course.course.id }}
              className="hover:text-nexexam-primary line-clamp-2 text-lg leading-snug font-extrabold"
            >
              {course.course.title}
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              {course.nextLesson
                ? dictionaryFormat(
                    dictionary.studentExperience.nextAction.lesson,
                    course.nextLesson.title,
                  )
                : dictionary.dashboard.noLessons}
            </p>
          </div>
          <div className="bg-primary/10 text-primary grid size-16 shrink-0 place-items-center rounded-2xl text-lg font-extrabold">
            {course.readiness.score}
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">
                {dictionary.studentExperience.progress}
              </span>
              <span>
                {dictionaryFormat(
                  dictionary.studentExperience.lessonsProgress,
                  course.progress.completedLessons,
                  course.progress.totalLessons,
                )}
              </span>
            </div>
            <Progress value={course.progress.percent} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <MiniStat
              label={dictionary.studentExperience.homework}
              value={String(course.homework.overdue + course.homework.dueSoon)}
            />
            <MiniStat
              label={dictionary.studentExperience.menu.practice}
              value={String(course.practice.availableQuestions)}
            />
            <MiniStat
              label={dictionary.studentExperience.notes}
              value={String(course.notes.count)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white/72 p-3 dark:bg-white/8">
      <div className="text-base font-extrabold">{value}</div>
      <div className="text-muted-foreground truncate">{label}</div>
    </div>
  );
}

function HomeworkPanel({
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
          <LuClipboardList className="text-primary size-5" />
          {dictionary.studentExperience.upcomingHomework}
        </h2>
        <div className="mt-4 space-y-3">
          {homework.length ? (
            homework.map((item) => (
              <Link
                key={item.id}
                to="/course/$id/learn"
                params={{ id: item.courseId }}
                className="hover:border-primary/30 block rounded-xl border bg-white/72 p-3 transition dark:bg-white/8"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-sm font-bold">
                      {item.title}
                    </div>
                    <div className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                      {item.courseTitle}
                    </div>
                  </div>
                  <HomeworkStatusBadge
                    status={item.status}
                    dictionary={dictionary}
                  />
                </div>
                {item.dueDate && (
                  <div className="text-muted-foreground mt-2 text-xs">
                    {formatDate(item.dueDate, dictionary)}
                  </div>
                )}
              </Link>
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

function PracticePanel({
  dashboard,
  dictionary,
}: {
  dashboard: StudentDashboardResponse;
  dictionary: Dictionary;
}) {
  const firstCourse = dashboard.courses.find(
    (course) => course.practice.availableQuestions > 0,
  );

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuBrain className="text-primary size-5" />
          {dictionary.studentExperience.practiceQuestions}
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniStat
            label={dictionary.studentExperience.answerOptions}
            value={String(dashboard.practice.availableQuestions)}
          />
          <MiniStat
            label={dictionary.studentExperience.progress}
            value={
              dashboard.practice.averageAccuracy != null
                ? dictionaryFormat(
                    dictionary.studentExperience.score,
                    dashboard.practice.averageAccuracy,
                  )
                : dictionaryFormat(dictionary.studentExperience.score, 0)
            }
          />
        </div>
        {firstCourse ? (
          <Button
            nativeButton={false}
            render={
              <Link
                to="/student/course/$courseId/practice"
                params={{ courseId: firstCourse.course.id }}
              />
            }
            className="mt-5 h-10 w-full rounded-xl"
          >
            {dictionary.studentExperience.startPractice}
          </Button>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">
            {dictionary.studentExperience.noPractice}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function NotesPanel({
  dashboard,
  dictionary,
}: {
  dashboard: StudentDashboardResponse;
  dictionary: Dictionary;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuNotebookPen className="text-primary size-5" />
          {dictionary.studentExperience.recentNotes}
        </h2>
        <div className="mt-4 space-y-3">
          {dashboard.notes.length ? (
            dashboard.notes.map((note) => (
              <Link
                key={note.id}
                to="/student/course/$courseId"
                params={{ courseId: note.courseId }}
                className="hover:border-primary/30 block rounded-xl border bg-white/72 p-3 transition dark:bg-white/8"
              >
                <div className="line-clamp-1 text-sm font-bold">
                  {note.title}
                </div>
                <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                  {note.content}
                </div>
              </Link>
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

function StudyPlanPanel({
  items,
  dictionary,
}: {
  items: StudentStudyPlanItem[];
  dictionary: Dictionary;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuCircleCheck className="text-primary size-5" />
          {dictionary.studentExperience.todayPlan}
        </h2>
        <div className="mt-4 space-y-3">
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border bg-white/72 p-3 dark:bg-white/8"
              >
                <div className="line-clamp-1 text-sm font-bold">
                  {item.title}
                </div>
                {item.plannedForDate && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    {formatDate(item.plannedForDate, dictionary)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              {dictionary.studentExperience.noStudyPlan}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AiTutorPanel({
  dashboard,
  dictionary,
  onOpen,
  isOpening,
}: {
  dashboard: StudentDashboardResponse;
  dictionary: Dictionary;
  onOpen: (initialMessage?: string) => void;
  isOpening: boolean;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <h2 className="flex items-center gap-2 font-extrabold">
          <LuSparkles className="text-primary size-5" />
          {dictionary.studentExperience.menu.aiTutor}
        </h2>
        <div className="mt-4 space-y-2">
          {dictionary.studentExperience.aiPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onOpen(prompt)}
              disabled={isOpening}
              className="hover:border-primary/30 hover:text-primary w-full rounded-xl border bg-white/72 px-3 py-2 text-left text-sm font-semibold transition dark:bg-white/8"
            >
              {prompt}
            </button>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => onOpen()}
          disabled={!dashboard.courses.length || isOpening}
          className="mt-4 h-10 w-full rounded-xl"
        >
          {dictionary.studentExperience.askCourseTutor}
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyCourses({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Card
      data-testid="student-dashboard-empty-courses"
      className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10"
    >
      <CardContent className="flex flex-col items-start gap-4 p-7">
        <div className="bg-primary/10 text-primary grid size-12 place-items-center rounded-xl">
          <LuBookOpen className="size-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">
            {dictionary.studentExperience.noCoursesTitle}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            {dictionary.studentExperience.noCoursesBody}
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link to="/course" />}
          className="h-10 rounded-xl"
        >
          {dictionary.course.list.menu}
        </Button>
      </CardContent>
    </Card>
  );
}

function HomeworkStatusBadge({
  status,
  dictionary,
}: {
  status: StudentHomeworkItem['status'];
  dictionary: Dictionary;
}) {
  return (
    <Badge variant={status === 'overdue' ? 'destructive' : 'secondary'}>
      {dictionary.studentExperience.homeworkStatus[status]}
    </Badge>
  );
}

function nextActionLabel(
  dashboard: StudentDashboardResponse | undefined,
  dictionary: Dictionary,
) {
  if (!dashboard?.nextAction) {
    return dictionary.studentExperience.nextAction.none;
  }

  return dictionaryFormat(
    dictionary.studentExperience.nextAction[dashboard.nextAction.type],
    dashboard.nextAction.title,
  );
}

function nextActionLink(dashboard?: StudentDashboardResponse) {
  if (!dashboard?.nextAction) {
    return { to: '/course' } as const;
  }

  if (dashboard.nextAction.type === 'practice') {
    return {
      to: '/student/course/$courseId/practice',
      params: { courseId: dashboard.nextAction.courseId },
    } as const;
  }

  return {
    to: '/course/$id/learn',
    params: { id: dashboard.nextAction.courseId },
  } as const;
}
