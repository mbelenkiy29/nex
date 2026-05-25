import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, Link, useSearch } from '@tanstack/react-router';
import {
  LuBookOpenCheck,
  LuClock,
  LuShieldCheck,
  LuStar,
} from 'react-icons/lu';
import type { ReactNode } from 'react';
import { Course } from '@/features/course/courseTypes';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { apiClient } from '@/shared/lib/apiClient';

export const courseCompareLazyRoute = createLazyRoute('/course/compare')({
  component: CourseComparePage,
});

export function CourseComparePage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const search = useSearch({ strict: false }) as { ids?: string };
  const ids = search.ids || '';
  const compareQuery = useQuery({
    queryKey: ['course', 'compare', ids],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/course/compare?ids=${encodeURIComponent(ids)}`, { signal })
        .json<{ courses: Course[] }>(),
  });
  const courses = compareQuery.data?.courses || [];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.course.list.title, '/course'],
          [dictionary.course.marketplace.compare],
        ]}
      />

      {courses.length === 0 ? (
        <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="grid place-items-center gap-3 p-10 text-center">
            <LuBookOpenCheck className="text-muted-foreground size-10" />
            <h1 className="text-xl font-extrabold">
              {dictionary.course.marketplace.noCompareCourses}
            </h1>
            <Button nativeButton={false} render={<Link to="/course" />}>
              {dictionary.course.list.title}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="overflow-x-auto rounded-3xl border bg-white/75 shadow-[0_18px_48px_rgb(91_92_246/0.12)] dark:bg-white/8">
          <div
            className="grid min-w-[760px]"
            style={{
              gridTemplateColumns: `180px repeat(${courses.length}, 1fr)`,
            }}
          >
            <CompareLabel label={dictionary.course.fields.title} />
            {courses.map((course) => (
              <div key={course.id} className="border-b p-4">
                <Link
                  to="/course/$slug"
                  params={{ slug: course.slug }}
                  className="hover:text-primary line-clamp-2 font-extrabold"
                >
                  {course.title}
                </Link>
                <div className="mt-2 flex flex-wrap gap-1">
                  {course.nexVerified && (
                    <Badge className="rounded-lg">
                      <LuShieldCheck className="size-3.5" />
                      {dictionary.course.fields.nexVerified}
                    </Badge>
                  )}
                  <Badge variant="outline" className="rounded-lg">
                    {coursePriceLabel(course, dictionary, locale)}
                  </Badge>
                </div>
              </div>
            ))}

            <CompareRow
              label={dictionary.course.ratings.title}
              courses={courses}
              render={(course) => (
                <span className="inline-flex items-center gap-1">
                  <LuStar className="text-primary size-4" />
                  {courseRatingLabel(course, dictionary, locale)}
                </span>
              )}
            />
            <CompareRow
              label={dictionary.course.marketplace.duration}
              courses={courses}
              render={(course) => (
                <span className="inline-flex items-center gap-1">
                  <LuClock className="text-primary size-4" />
                  {courseDurationLabel(course.durationSeconds, dictionary) ||
                    dictionary.course.marketplace.noDuration}
                </span>
              )}
            />
            <CompareRow
              label={dictionary.course.fields.lessons}
              courses={courses}
              render={(course) => String(course.counts?.lessons || 0)}
            />
            <CompareRow
              label={dictionary.course.fields.assignments}
              courses={courses}
              render={(course) => String(course.counts?.assignments || 0)}
            />
            <CompareRow
              label={dictionary.course.fields.examType}
              courses={courses}
              render={(course) => course.examType || dictionary.shared.all}
            />
            <CompareRow
              label={dictionary.course.fields.difficulty}
              courses={courses}
              render={(course) => course.difficulty || dictionary.shared.all}
            />
            <CompareRow
              label={dictionary.course.fields.language}
              courses={courses}
              render={(course) => course.language || dictionary.shared.all}
            />
            <CompareRow
              label={dictionary.course.certificate.title}
              courses={courses}
              render={(course) =>
                course.certificateEnabled
                  ? dictionary.shared.yes
                  : dictionary.shared.no
              }
            />
          </div>
        </section>
      )}
    </div>
  );
}

function CompareLabel({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground border-r border-b p-4 text-xs font-extrabold uppercase">
      {label}
    </div>
  );
}

function CompareRow({
  label,
  courses,
  render,
}: {
  label: string;
  courses: Course[];
  render: (course: Course) => ReactNode;
}) {
  return (
    <>
      <CompareLabel label={label} />
      {courses.map((course) => (
        <div key={`${label}-${course.id}`} className="border-b p-4 text-sm">
          {render(course)}
        </div>
      ))}
    </>
  );
}

function courseRatingLabel(course: Course, dictionary: any, locale: string) {
  const summary = course.ratingSummary;

  if (!summary?.count) {
    return dictionary.course.ratings.noRatings;
  }

  return dictionary.course.ratings.summary
    .replace(
      '{0}',
      new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
        summary.average,
      ),
    )
    .replace('{1}', new Intl.NumberFormat(locale).format(summary.count));
}

function courseDurationLabel(
  durationSeconds: number | null | undefined,
  dictionary: any,
) {
  if (!durationSeconds) {
    return null;
  }

  const minutes = Math.max(1, Math.round(durationSeconds / 60));
  if (minutes < 60) {
    return dictionary.course.learn.durationMinutes.replace(
      '{0}',
      String(minutes),
    );
  }

  return dictionary.course.marketplace.durationHours.replace(
    '{0}',
    String(Math.round((minutes / 60) * 10) / 10),
  );
}

function coursePriceLabel(course: Course, dictionary: any, locale: string) {
  if (course.accessType === 'free') {
    return dictionary.course.enumerators.accessType.free;
  }

  if (course.accessType === 'paid' && course.priceCents != null) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: course.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(course.priceCents / 100);
  }

  return dictionary.course.enumerators.accessType[course.accessType];
}
