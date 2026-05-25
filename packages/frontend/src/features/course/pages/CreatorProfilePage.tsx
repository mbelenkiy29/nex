import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, Link, useParams } from '@tanstack/react-router';
import {
  LuBookOpenCheck,
  LuShieldCheck,
  LuStar,
  LuUsers,
} from 'react-icons/lu';
import {
  Course,
  CourseBundle,
  CourseRatingSummary,
} from '@/features/course/courseTypes';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { apiClient } from '@/shared/lib/apiClient';

export const creatorProfileLazyRoute = createLazyRoute('/creator/$creatorId')({
  component: CreatorProfilePage,
});

type CreatorProfile = {
  id: string;
  name: string;
  image?: string | null;
  verified: boolean;
  totalCourses: number;
  totalEnrollments: number;
  ratingSummary: CourseRatingSummary;
};

export function CreatorProfilePage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const { creatorId } = useParams({ from: '/creator/$creatorId' });
  const profileQuery = useQuery({
    queryKey: ['course', 'creator', creatorId],
    queryFn: async ({ signal }) =>
      apiClient.get(`api/course/creator/${creatorId}`, { signal }).json<{
        creator: CreatorProfile;
        courses: Course[];
        bundles: CourseBundle[];
      }>(),
  });
  const creator = profileQuery.data?.creator;
  const courses = profileQuery.data?.courses || [];
  const bundles = profileQuery.data?.bundles || [];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.course.list.title, '/course'],
          [creator?.name || dictionary.course.marketplace.creatorProfile],
        ]}
      />

      {creator && (
        <>
          <section className="nex-glass-card rounded-3xl border-white/70 p-6 dark:border-white/10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {creator.image ? (
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="size-20 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="bg-primary/10 text-primary grid size-20 place-items-center rounded-2xl">
                    <LuUsers className="size-9" />
                  </span>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-extrabold tracking-normal">
                      {creator.name || dictionary.course.marketplace.creator}
                    </h1>
                    {creator.verified && (
                      <Badge className="rounded-xl">
                        <LuShieldCheck className="size-3.5" />
                        {dictionary.course.fields.nexVerified}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {dictionary.course.marketplace.creatorStats
                      .replace(
                        '{0}',
                        new Intl.NumberFormat(locale).format(
                          creator.totalCourses,
                        ),
                      )
                      .replace(
                        '{1}',
                        new Intl.NumberFormat(locale).format(
                          creator.totalEnrollments,
                        ),
                      )}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border bg-white/70 p-4 text-sm dark:bg-white/8">
                <div className="text-muted-foreground font-semibold">
                  {dictionary.course.ratings.title}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xl font-extrabold">
                  <LuStar className="text-primary size-5" />
                  {creator.ratingSummary.count
                    ? dictionary.course.ratings.summary
                        .replace(
                          '{0}',
                          new Intl.NumberFormat(locale, {
                            maximumFractionDigits: 1,
                          }).format(creator.ratingSummary.average),
                        )
                        .replace(
                          '{1}',
                          new Intl.NumberFormat(locale).format(
                            creator.ratingSummary.count,
                          ),
                        )
                    : dictionary.course.ratings.noRatings}
                </div>
              </div>
            </div>
          </section>

          {bundles.length > 0 && (
            <section className="grid gap-4">
              <h2 className="text-xl font-extrabold">
                {dictionary.course.marketplace.bundles}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {bundles.map((bundle) => (
                  <Card
                    key={bundle.id}
                    className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10"
                  >
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="rounded-lg">
                        {dictionary.course.marketplace.bundle}
                      </Badge>
                      <h3 className="mt-3 font-extrabold">{bundle.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {bundle.counts?.courses || bundle.courses?.length || 0}{' '}
                        {dictionary.course.marketplace.coursesIncluded}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="grid gap-4">
            <h2 className="text-xl font-extrabold">
              {dictionary.course.marketplace.creatorCourses}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10"
                >
                  <CardContent className="p-5">
                    <LuBookOpenCheck className="text-primary size-8" />
                    <h3 className="mt-3 line-clamp-2 font-extrabold">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                      {course.subtitle || course.description}
                    </p>
                    <Button
                      nativeButton={false}
                      className="mt-4 h-10 w-full rounded-xl"
                      render={
                        <Link
                          to="/course/$slug"
                          params={{ slug: course.slug }}
                        />
                      }
                    >
                      {dictionary.course.actions.viewCourse}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
