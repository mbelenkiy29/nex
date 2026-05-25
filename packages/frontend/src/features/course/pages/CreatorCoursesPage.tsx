import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useQuery } from '@tanstack/react-query';
import { Link, createLazyRoute, useNavigate } from '@tanstack/react-router';
import {
  LuArrowRight,
  LuBookOpen,
  LuClock,
  LuPlus,
  LuShieldCheck,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import type {
  CourseFile,
  CourseStatus,
} from '@/features/course/courseTypes';
import type { CourseBuilderSection } from '@/features/course/courseBuilderUtils';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { apiClient } from '@/shared/lib/apiClient';
import { builderLastSectionRead } from '../builder/builderLocalState';

export const creatorCoursesLazyRoute = createLazyRoute('/creator/courses')({
  component: CreatorCoursesPage,
});

type BuilderCourseSummary = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnail?: CourseFile[] | null;
  status: CourseStatus;
  reviewNotes?: string | null;
  updatedAt: string;
  counts: {
    modules: number;
    lessons: number;
    assignments: number;
    quizzes: number;
    practiceExams: number;
    outcomes: number;
    flashcardSets: number;
    enrollments: number;
  };
};

type SummaryChecklistItem = {
  key: string;
  met: boolean;
  section: CourseBuilderSection;
};

function courseSummaryChecklist(course: BuilderCourseSummary) {
  return [
    {
      key: 'titleItem',
      section: 'goals',
      met: course.title.trim().length > 0,
    },
    {
      key: 'descriptionItem',
      section: 'goals',
      met: Boolean(course.description?.trim()),
    },
    {
      key: 'thumbnailItem',
      section: 'landing-page',
      met: Boolean(course.thumbnail?.length),
    },
    {
      key: 'moduleItem',
      section: 'curriculum',
      met: course.counts.modules >= 1,
    },
    {
      key: 'lessonsItem',
      section: 'curriculum',
      met: course.counts.lessons >= 3,
    },
    {
      key: 'assessmentItem',
      section: 'curriculum',
      met: course.counts.quizzes >= 1 || course.counts.practiceExams >= 1,
    },
    {
      key: 'outcomeItem',
      section: 'goals',
      met: course.counts.outcomes >= 1,
    },
  ] satisfies SummaryChecklistItem[];
}

function courseSummaryProgress(course: BuilderCourseSummary) {
  const items = courseSummaryChecklist(course);
  const met = items.filter((item) => item.met).length;
  return {
    percent: Math.round((met / items.length) * 100),
    nextStep: items.find((item) => !item.met) || null,
  };
}

function navigateToBuilderSection(
  navigate: ReturnType<typeof useNavigate>,
  courseId: string,
  section: CourseBuilderSection,
) {
  if (section === 'goals') {
    navigate({ to: '/creator/courses/$courseId/edit/goals', params: { courseId } });
    return;
  }
  if (section === 'landing-page') {
    navigate({
      to: '/creator/courses/$courseId/edit/landing-page',
      params: { courseId },
    });
    return;
  }
  if (section === 'practice-exams') {
    navigate({
      to: '/creator/courses/$courseId/edit/practice-exams',
      params: { courseId },
    });
    return;
  }
  if (section === 'flashcards') {
    navigate({
      to: '/creator/courses/$courseId/edit/flashcards',
      params: { courseId },
    });
    return;
  }
  if (section === 'ai-assistant') {
    navigate({
      to: '/creator/courses/$courseId/edit/ai-assistant',
      params: { courseId },
    });
    return;
  }
  if (section === 'submit') {
    navigate({ to: '/creator/courses/$courseId/edit/submit', params: { courseId } });
    return;
  }
  navigate({
    to: '/creator/courses/$courseId/edit/curriculum',
    params: { courseId },
  });
}

export function CreatorCoursesPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const isVerifiedCreator = useAuthStore((state) => state.isVerifiedCreator);
  const navigate = useNavigate();
  const builder = dictionary.course.builder;

  const coursesQuery = useQuery({
    queryKey: ['courseBuilder', 'list'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/course-builder', { signal })
        .json<{ courses: BuilderCourseSummary[] }>(),
  });

  const courses = coursesQuery.data?.courses || [];

  return (
    <div className="nex-dashboard-shell flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader items={[[builder.menu]]} />

      <section className="nex-glass-card nex-gradient-hero overflow-hidden rounded-3xl p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
              <LuBookOpen className="size-3.5" />
              {builder.menu}
            </Badge>
            <h1 className="text-nexexam-ink mt-4 text-4xl leading-tight font-extrabold dark:text-white">
              {builder.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
              {builder.description}
            </p>
          </div>
          {isVerifiedCreator && (
            <Button
              data-testid="creator-courses-new-button"
              className="h-11 rounded-xl"
              onClick={() => navigate({ to: '/creator/courses/new' })}
            >
              <LuPlus className="size-4" />
              {builder.newCourse}
            </Button>
          )}
        </div>
      </section>

      {!isVerifiedCreator && (
        <Card className="border-nexexam-warning/30 bg-nexexam-warning/10 rounded-2xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <LuShieldCheck className="size-4" />
              {builder.verifyRequired}
            </p>
            <Button
              nativeButton={false}
              render={<Link to="/creator-application" />}
              variant="outline"
              className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
            >
              {builder.verifyCta}
            </Button>
          </CardContent>
        </Card>
      )}

      {courses.length === 0 ? (
        <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="grid place-items-center gap-3 p-12 text-center">
            <span className="bg-primary/10 text-primary grid size-14 place-items-center rounded-2xl">
              <LuBookOpen className="size-7" />
            </span>
            <p className="text-muted-foreground">{builder.emptyCourses}</p>
            {isVerifiedCreator && (
              <Button
                className="mt-1 h-10 rounded-xl"
                onClick={() => navigate({ to: '/creator/courses/new' })}
              >
                <LuPlus className="size-4" />
                {builder.createFirst}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => {
            const progress = courseSummaryProgress(course);
            const nextLabel = progress.nextStep
              ? (builder.checklist as Record<string, string>)[
                  progress.nextStep.key
                ]
              : builder.nextStep.ready;
            const targetSection =
              builderLastSectionRead(course.id) ||
              progress.nextStep?.section ||
              'curriculum';
            const openCourse = () =>
              navigateToBuilderSection(navigate, course.id, targetSection);

            return (
              <Card
                key={course.id}
                role="button"
                tabIndex={0}
                data-testid="creator-courses-item"
                onClick={openCourse}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCourse();
                  }
                }}
                className="nex-glass-card cursor-pointer rounded-2xl border-white/70 transition hover:border-primary/40 dark:border-white/10"
              >
                <CardContent className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-lg font-extrabold">
                        {course.title}
                      </h2>
                      <Badge variant="outline" className="rounded-xl">
                        {dictionaryEnumerator(
                          dictionary.course.enumerators.status,
                          course.status,
                        )}
                      </Badge>
                    </div>
                    {course.subtitle && (
                      <p className="text-muted-foreground mt-1 truncate text-sm">
                        {course.subtitle}
                      </p>
                    )}
                    <div className="mt-3 grid gap-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          {course.counts.modules}{' '}
                          {dictionary.course.fields.modules}
                        </span>
                        <span>
                          {course.counts.lessons}{' '}
                          {dictionary.course.fields.lessons}
                        </span>
                        <span>
                          {course.counts.quizzes}{' '}
                          {dictionary.course.fields.quizzes}
                        </span>
                        <span>
                          {course.counts.enrollments}{' '}
                          {dictionary.course.admin.enrollments}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <LuClock className="size-3.5" />
                        {dictionaryFormat(
                          builder.updatedAt,
                          formatDateTime(course.updatedAt, dictionary),
                        )}
                      </div>
                    </div>
                    <div className="mt-3 max-w-xl">
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold">
                        <span>
                          {dictionaryFormat(
                            builder.completionLabel,
                            progress.percent,
                          )}
                        </span>
                        <span className="text-muted-foreground">
                          {dictionaryFormat(
                            builder.nextRecommended,
                            nextLabel,
                          )}
                        </span>
                      </div>
                      <Progress value={progress.percent} className="h-2" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {course.status === 'draft' && course.reviewNotes && (
                      <Badge className="bg-nexexam-warning/15 text-nexexam-warning rounded-xl">
                        {builder.reviewNotesTitle}
                      </Badge>
                    )}
                    <Button
                      type="button"
                      className="h-10 rounded-xl"
                      onClick={(event) => {
                        event.stopPropagation();
                        openCourse();
                      }}
                    >
                      <LuArrowRight className="size-4" />
                      {builder.continueBuilding}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
