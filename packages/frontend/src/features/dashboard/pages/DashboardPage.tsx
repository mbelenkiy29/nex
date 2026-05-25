import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, Link } from '@tanstack/react-router';
import {
  LuArrowRight,
  LuBookOpen,
  LuBrain,
  LuCircleCheck,
  LuCode,
  LuDatabase,
  LuFileText,
  LuPlay,
  LuSparkles,
  LuStar,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import {
  CourseMyLearningItem,
  CourseMyLearningResponse,
  CourseRecommendation,
} from '@/features/course/courseTypes';
import { NexExamVisual } from '@/shared/components/NexExamVisual';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import { Dictionary } from '@/features/auth/authStore';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';

export const dashboardLazyRoute = createLazyRoute('/student')({
  component: DashboardPage,
});

export function DashboardPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const currentMember = useAuthStore((state) => state.currentMember);
  const learningQuery = useQuery({
    queryKey: ['course', 'my-learning'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/course/my-learning', { signal })
        .json<CourseMyLearningResponse>(),
  });
  const firstName =
    currentMember?.firstName ||
    currentMember?.fullName?.split(' ')[0] ||
    dictionary.dashboard.fallbackName;
  const learning = learningQuery.data;
  const firstCourse = learning?.enrolledCourses[0];
  const continueLearningLink = firstCourse
    ? ({
        to: '/course/$id/learn',
        params: { id: firstCourse.course.id },
      } as const)
    : ({ to: '/course' } as const);

  return (
    <div className="nex-dashboard-shell flex flex-1 flex-col gap-6 px-4 py-6 lg:px-7">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="nex-glass-card nex-gradient-hero relative min-h-[360px] overflow-hidden rounded-3xl p-7 lg:p-9">
          <div className="relative z-10 flex min-h-[300px] items-center">
            <div className="max-w-[680px]">
              <p className="text-muted-foreground text-base">
                {dictionary.dashboard.welcome.replace('{0}', firstName)}
              </p>
              <h1 className="text-nexexam-ink mt-5 text-4xl leading-tight font-extrabold tracking-normal md:text-[44px] 2xl:text-5xl dark:text-white">
                {dictionary.dashboard.heroTitle}
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-lg">
                {dictionary.dashboard.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  nativeButton={false}
                  render={<Link {...continueLearningLink} />}
                  size="lg"
                  className="h-12 rounded-xl px-6 shadow-[0_16px_32px_rgb(91_92_246/0.28)]"
                >
                  <LuPlay className="size-4" />
                  {dictionary.dashboard.continueLearning}
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link {...continueLearningLink} />}
                  size="lg"
                  variant="outline"
                  className="border-primary/25 text-primary hover:bg-primary/5 h-12 rounded-xl bg-white/70 px-6 dark:bg-white/8"
                >
                  <LuSparkles className="size-4" />
                  {dictionary.dashboard.askTutor}
                </Button>
              </div>
            </div>
          </div>
          <NexExamVisual
            compact
            className="pointer-events-none absolute right-6 bottom-7 hidden min-h-[250px] w-[40%] max-w-[390px] lg:block 2xl:w-[36%]"
          />
        </div>

        <AiTutorPanel dictionary={dictionary} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <SectionHeader
            title={dictionary.dashboard.continueLearning}
            action={dictionary.dashboard.viewAllCourses}
            to="/course"
          />
          {learningQuery.isLoading ? (
            <LoadingCard dictionary={dictionary} />
          ) : learning?.enrolledCourses.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {learning.enrolledCourses.map((course, index) => (
                <LearningCard
                  key={course.course.id}
                  course={course}
                  index={index}
                  dictionary={dictionary}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={dictionary.dashboard.noEnrolledCoursesTitle}
              description={dictionary.dashboard.noEnrolledCoursesDescription}
              action={dictionary.dashboard.viewAllCourses}
              to="/course"
              testId="student-dashboard-empty-courses"
            />
          )}

          <SectionHeader
            title={dictionary.dashboard.recommendedForYou}
            action={dictionary.dashboard.viewAll}
            to="/course"
          />
          {learningQuery.isLoading ? (
            <LoadingCard dictionary={dictionary} />
          ) : learning?.recommendedCourses.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {learning.recommendedCourses.map((item, index) => (
                <RecommendationCard
                  key={item.id}
                  item={item}
                  index={index}
                  dictionary={dictionary}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={dictionary.dashboard.noRecommendationsTitle}
              description={dictionary.dashboard.noRecommendationsDescription}
              action={dictionary.dashboard.viewAllCourses}
              to="/course"
            />
          )}
        </div>

        <ProgressPanel dictionary={dictionary} learning={learning} />
      </section>
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

function AiTutorPanel({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
              <LuSparkles className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">
                {dictionary.dashboard.aiTutorTitle}
              </h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-500">
            <span className="size-2 rounded-full bg-emerald-500" />
            {dictionary.dashboard.online}
          </span>
        </div>
        <div className="bg-primary/10 mx-auto mt-8 grid size-32 place-items-center rounded-full shadow-[inset_0_0_0_18px_rgb(91_92_246/0.07)]">
          <div className="grid size-20 place-items-center rounded-full bg-[radial-gradient(circle,white,var(--nexexam-soft-blue)_45%,var(--nexexam-primary-light))] text-white shadow-[0_18px_40px_rgb(91_92_246/0.24)]">
            <LuSparkles className="size-8" />
          </div>
        </div>
        <div className="mt-7 text-center">
          <h3 className="font-extrabold">
            {dictionary.dashboard.aiTutorGreeting}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {dictionary.dashboard.aiTutorPrompt}
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {dictionary.dashboard.tutorActions.map((action) => (
            <button
              key={action}
              className="border-border/70 hover:border-primary/30 hover:text-primary flex h-11 w-full items-center justify-center gap-2 rounded-xl border bg-white/76 text-sm font-semibold transition hover:shadow-md dark:bg-white/8"
              type="button"
            >
              <LuBookOpen className="size-4" />
              {action}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingCard({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="flex items-center justify-center gap-3 p-8 text-sm font-semibold">
        <Spinner className="size-4" />
        {dictionary.shared.loading}
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  action,
  to,
  testId,
}: {
  title: string;
  description: string;
  action: string;
  to: string;
  testId?: string;
}) {
  return (
    <Card
      data-testid={testId}
      className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10"
    >
      <CardContent className="flex flex-col items-start gap-4 p-6">
        <div className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
          <LuBookOpen className="size-5" />
        </div>
        <div>
          <h3 className="font-extrabold">{title}</h3>
          <p className="text-muted-foreground mt-1 max-w-xl text-sm">
            {description}
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link to={to} />}
          variant="outline"
          className="h-10 rounded-xl bg-white/70"
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}

function LearningCard({
  course,
  index,
  dictionary,
}: {
  course: CourseMyLearningItem;
  index: number;
  dictionary: Dictionary;
}) {
  const gradients = [
    'from-nexexam-accent via-nexexam-primary-light to-nexexam-primary',
    'from-nexexam-soft-blue via-nexexam-secondary/50 to-nexexam-secondary',
    'from-nexexam-accent via-nexexam-primary-light/60 to-nexexam-primary-light',
  ];
  const progressLabel = dictionaryFormat(
    dictionary.dashboard.progressComplete,
    course.progress.percent,
  );
  const lessonProgress = dictionaryFormat(
    dictionary.dashboard.lessonProgress,
    course.progress.completedLessons,
    course.progress.totalLessons,
  );
  const assignmentProgress = dictionaryFormat(
    dictionary.dashboard.assignmentProgress,
    course.progress.submittedAssignments,
    course.progress.totalAssignments,
  );

  return (
    <Card
      data-testid="student-dashboard-course-card"
      className="nex-glass-card overflow-hidden rounded-2xl border-white/70 p-0 shadow-[0_18px_42px_rgb(15_23_42/0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgb(91_92_246/0.14)] dark:border-white/10"
    >
      <div
        className={`h-32 bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}
      >
        <div className="absolute -right-7 -bottom-9 size-36 rounded-full bg-white/24" />
        <div className="text-primary absolute top-5 right-8 grid size-12 place-items-center rounded-full border-4 border-white/80 bg-white/72 text-xs font-extrabold">
          {course.progress.percent}%
        </div>
      </div>
      <CardContent className="p-5">
        <Link
          to="/course/$id/learn"
          params={{ id: course.course.id }}
          className="hover:text-nexexam-primary line-clamp-2 min-h-12 text-lg leading-snug font-extrabold"
        >
          {course.course.title}
        </Link>
        <p className="text-muted-foreground mt-2 text-sm">{lessonProgress}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {assignmentProgress}
        </p>
        <p className="text-muted-foreground mt-3 line-clamp-1 text-xs font-semibold">
          {course.nextLesson
            ? `${dictionary.dashboard.nextLesson} ${course.nextLesson.title}`
            : dictionary.dashboard.noLessons}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${course.progress.percent}%` }}
            />
          </div>
          <span className="text-muted-foreground text-sm font-semibold">
            {progressLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({
  item,
  index,
  dictionary,
}: {
  item: CourseRecommendation;
  index: number;
  dictionary: Dictionary;
}) {
  const icons = [LuBrain, LuDatabase, LuCode];
  const Icon = icons[index % icons.length];
  const meta = dictionaryFormat(
    dictionary.dashboard.recommendationMeta,
    item.counts.lessons,
    item.counts.assignments,
  );

  return (
    <Card
      data-testid="student-dashboard-recommendation-card"
      className="nex-glass-card rounded-2xl border-white/70 p-0 transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgb(91_92_246/0.12)] dark:border-white/10"
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div className="bg-primary/10 text-primary grid size-16 shrink-0 place-items-center rounded-xl">
          <Icon className="size-8" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            to="/course/$slug"
            params={{ slug: item.slug }}
            className="hover:text-nexexam-primary line-clamp-2 font-extrabold"
          >
            {item.title}
          </Link>
          <p className="text-muted-foreground mt-1 text-sm">
            {item.category || meta}
          </p>
          <p className="text-nexexam-warning mt-3 flex items-center gap-1 text-sm font-semibold">
            <LuStar className="size-4 fill-current" />
            {meta}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressPanel({
  dictionary,
  learning,
}: {
  dictionary: Dictionary;
  learning?: CourseMyLearningResponse;
}) {
  const stats = learning?.stats || {
    enrolledCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    submittedAssignments: 0,
    totalAssignments: 0,
    averageProgress: 0,
  };
  const statCards = [
    {
      testId: 'student-dashboard-stat-enrolled',
      icon: LuBookOpen,
      label: dictionary.dashboard.enrolledCoursesStat,
      value: String(stats.enrolledCourses),
    },
    {
      testId: 'student-dashboard-stat-lessons',
      icon: LuCircleCheck,
      label: dictionary.dashboard.completedLessonsStat,
      value: dictionaryFormat(
        dictionary.dashboard.lessonProgress,
        stats.completedLessons,
        stats.totalLessons,
      ),
    },
    {
      testId: 'student-dashboard-stat-assignments',
      icon: LuFileText,
      label: dictionary.dashboard.submittedAssignmentsStat,
      value: dictionaryFormat(
        dictionary.dashboard.assignmentProgress,
        stats.submittedAssignments,
        stats.totalAssignments,
      ),
    },
    {
      testId: 'student-dashboard-stat-progress',
      icon: LuSparkles,
      label: dictionary.dashboard.averageProgressStat,
      value: dictionaryFormat(
        dictionary.dashboard.progressComplete,
        stats.averageProgress,
      ),
    },
  ];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold">
            {dictionary.dashboard.learningProgress}
          </h2>
          <span className="text-muted-foreground text-sm">
            {dictionary.dashboard.averageProgressStat}
          </span>
        </div>
        <div className="mt-6 grid gap-3">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.testId}
                data-testid={item.testId}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-white/72 p-4 dark:bg-white/8"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-muted-foreground text-sm font-semibold">
                    {item.label}
                  </span>
                </div>
                <span className="text-right text-lg font-extrabold">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          {(learning?.enrolledCourses || []).slice(0, 4).map((item) => (
            <div key={item.course.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="line-clamp-1 font-semibold">
                  {item.course.title}
                </span>
                <span className="text-muted-foreground font-semibold">
                  {item.progress.percent}%
                </span>
              </div>
              <Progress value={item.progress.percent} className="h-2" />
            </div>
          ))}
          {!learning?.enrolledCourses.length && (
            <div
              data-testid="student-dashboard-empty-progress"
              className="text-muted-foreground rounded-2xl border bg-white/72 p-4 text-sm dark:bg-white/8"
            >
              {dictionary.dashboard.noEnrolledCoursesDescription}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
