import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import {
  LuAward,
  LuBookOpen,
  LuCheck,
  LuClock,
  LuFlag,
  LuFileText,
  LuHeart,
  LuLayers3,
  LuShieldCheck,
  LuStar,
  LuTags,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Course, CourseCertificate } from '@/features/course/courseTypes';
import {
  missingTrustSafetyPolicies,
  PolicyAcceptanceDialog,
  useTrustSafetyPolicies,
} from '@/features/trustSafety/PolicyAcceptanceDialog';
import { ReportDialog } from '@/features/trustSafety/ReportDialog';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/shared/lib/apiClient';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export const courseDetailLazyRoute = createLazyRoute('/course/$slug')({
  component: CourseDetailPage,
});

export function CourseDetailPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const { slug } = useParams({ from: '/course/$slug' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const courseQuery = useQuery({
    queryKey: ['course', 'detail', slug],
    queryFn: async ({ signal }) =>
      apiClient.get(`api/course/${slug}`, { signal }).json<{
        course: Course;
        isEnrolled: boolean;
        certificate: CourseCertificate | null;
      }>(),
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) =>
      apiClient.post(`api/course/${courseId}/enroll`).json(),
    onSuccess: async (_data, courseId) => {
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.success.enrolled);
      navigate({ to: '/course/$id/learn', params: { id: courseId } });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  // Paid courses route through Stripe Checkout. The webhook writes the
  // enrollment; the user is redirected back with ?purchase=success which we
  // consume in the useEffect below to fire the toast + cache invalidation.
  const checkoutMutation = useMutation({
    mutationFn: ({
      courseId,
      couponCode,
    }: {
      courseId: string;
      couponCode: string;
    }) =>
      apiClient
        .post(`api/course/${courseId}/checkout`, {
          json: { couponCode: couponCode || null },
        })
        .json<{ url: string }>(),
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const saveMutation = useMutation({
    mutationFn: ({ courseId, saved }: { courseId: string; saved: boolean }) =>
      saved
        ? apiClient.delete(`api/course/${courseId}/save`).json()
        : apiClient.post(`api/course/${courseId}/save`).json(),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(
        variables.saved
          ? dictionary.course.success.courseUnsaved
          : dictionary.course.success.courseSaved,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  // Pick up the post-Stripe redirect (`?purchase=success`). The catalog
  // cache is invalidated so the "Continue learning" button replaces "Buy".
  // The query param is stripped after the side effect to avoid double-firing
  // on tab refocus.
  const search = useSearch({ strict: false }) as {
    purchase?: 'success' | 'cancelled';
  };
  useEffect(() => {
    if (search.purchase === 'success') {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.success.purchased);
      navigate({
        to: '/course/$slug',
        params: { slug },
        search: {},
        replace: true,
      });
    } else if (search.purchase === 'cancelled') {
      navigate({
        to: '/course/$slug',
        params: { slug },
        search: {},
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.purchase, slug]);

  const course = courseQuery.data?.course;
  const certificate = courseQuery.data?.certificate;
  const policiesQuery = useTrustSafetyPolicies(
    Boolean(course && !courseQuery.data?.isEnrolled),
  );
  const missingStudentPolicies = missingTrustSafetyPolicies(
    policiesQuery.data?.policies,
    ['studentTerms'],
  );
  const thumbnail = course?.thumbnail?.[0];
  const imageUrl =
    thumbnail?.downloadUrl || thumbnail?.publicUrl || thumbnail?.signedUrl;
  const introVideo = course?.introVideoFiles?.[0];
  const introVideoUrl =
    introVideo?.downloadUrl || introVideo?.publicUrl || introVideo?.signedUrl;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.course.list.title, '/course'],
          [course?.title || dictionary.course.detail.title],
        ]}
      />

      {course && (
        <>
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="nex-glass-card overflow-hidden rounded-3xl border-white/70 dark:border-white/10">
              <div className="relative h-72 bg-[linear-gradient(135deg,var(--nexexam-soft-blue),var(--nexexam-accent))]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-nexexam-primary grid h-full place-items-center">
                    <LuBookOpen className="size-20" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {course.category && (
                    <Badge className="bg-nexexam-soft-blue text-nexexam-secondary hover:bg-nexexam-soft-blue rounded-xl">
                      {course.category}
                    </Badge>
                  )}
                  {course.examType && (
                    <Badge className="bg-nexexam-soft-blue text-nexexam-secondary hover:bg-nexexam-soft-blue rounded-xl">
                      {course.examType}
                    </Badge>
                  )}
                  {course.nexVerified && (
                    <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                      <LuShieldCheck className="size-3.5" />
                      {dictionary.course.fields.nexVerified}
                    </Badge>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-normal md:text-4xl">
                  {course.title}
                </h1>
                {course.subtitle && (
                  <p className="text-muted-foreground mt-3 text-lg">
                    {course.subtitle}
                  </p>
                )}
                {course.description && (
                  <p className="text-muted-foreground mt-5 whitespace-pre-wrap">
                    {course.description}
                  </p>
                )}
                {introVideoUrl && (
                  <video
                    className="mt-6 aspect-video w-full rounded-2xl border bg-black"
                    src={introVideoUrl}
                    controls
                  />
                )}
              </div>
            </div>

            <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
              <CardContent className="p-6">
                <div className="grid gap-3">
                  <Stat
                    icon={<LuLayers3 className="size-5" />}
                    label={dictionary.course.fields.modules}
                    value={String(course.modules.length)}
                  />
                  <Stat
                    icon={<LuBookOpen className="size-5" />}
                    label={dictionary.course.fields.lessons}
                    value={String(course.lessons.length)}
                  />
                  <Stat
                    icon={<LuFileText className="size-5" />}
                    label={dictionary.course.fields.assignments}
                    value={String(course.assignments.length)}
                  />
                  <Stat
                    icon={<LuStar className="size-5" />}
                    label={dictionary.course.ratings.title}
                    value={courseRatingLabel(course, dictionary, locale)}
                  />
                  <Stat
                    icon={<LuClock className="size-5" />}
                    label={dictionary.course.marketplace.duration}
                    value={
                      courseDurationLabel(course.durationSeconds, dictionary) ||
                      dictionary.course.marketplace.noDuration
                    }
                  />
                </div>
                <div className="mt-6 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                  <div className="text-muted-foreground text-xs font-semibold">
                    {dictionary.course.fields.accessType}
                  </div>
                  <div className="mt-1 font-bold">
                    {dictionaryEnumerator(
                      dictionary.course.enumerators.accessType,
                      course.accessType,
                    )}
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                  <div className="text-muted-foreground text-xs font-semibold">
                    {dictionary.course.fields.price}
                  </div>
                  <div className="mt-1 font-bold">
                    {coursePriceLabel(course, dictionary, locale)}
                  </div>
                </div>
                {course.creatorRevenueShareBps != null && (
                  <div className="mt-3 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                    <div className="text-muted-foreground text-xs font-semibold">
                      {dictionary.course.fields.creatorRevenueShareBps}
                    </div>
                    <div className="mt-1 font-bold">
                      {course.creatorRevenueShareBps / 100}%
                    </div>
                  </div>
                )}
                {course.creatorUser && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    render={
                      <Link
                        to="/creator/$creatorId"
                        params={{ creatorId: course.creatorUser.id }}
                      />
                    }
                  >
                    {dictionary.course.marketplace.viewCreator}
                  </Button>
                )}
                {course.accessType === 'paid' &&
                  !courseQuery.data?.isEnrolled && (
                    <label className="mt-3 grid gap-2">
                      <span className="text-muted-foreground text-xs font-semibold">
                        {dictionary.course.marketplace.couponCode}
                      </span>
                      <div className="relative">
                        <LuTags className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          value={couponCode}
                          onChange={(event) =>
                            setCouponCode(event.target.value)
                          }
                          placeholder={
                            dictionary.course.marketplace.couponPlaceholder
                          }
                          className="h-10 rounded-xl bg-white/80 pl-10 dark:bg-white/8"
                        />
                      </div>
                    </label>
                  )}
                {certificate && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    render={
                      <Link
                        to="/course/$id/certificate"
                        params={{ id: course.id }}
                      />
                    }
                  >
                    <LuAward className="size-4" />
                    {dictionary.course.certificate.view}
                  </Button>
                )}
                <div className="mt-6">
                  {courseQuery.data?.isEnrolled ? (
                    <Button
                      nativeButton={false}
                      data-testid="course-detail-continue-button"
                      className="h-11 w-full rounded-xl"
                      render={
                        <Link
                          to="/course/$id/learn"
                          params={{ id: course.id }}
                        />
                      }
                    >
                      {dictionary.course.actions.continue}
                    </Button>
                  ) : course.accessType === 'paid' ? (
                    /* Paid course → Stripe Checkout. Policy dialog still
                       gates the buy click so the buyer accepts terms
                       before money moves. */
                    <Button
                      data-testid="course-detail-buy-button"
                      className="h-11 w-full rounded-xl"
                      disabled={
                        checkoutMutation.isPending ||
                        !course.priceCents ||
                        course.priceCents <= 0
                      }
                      onClick={() => {
                        if (
                          policiesQuery.isLoading ||
                          missingStudentPolicies.length
                        ) {
                          setPolicyDialogOpen(true);
                          return;
                        }
                        checkoutMutation.mutate({
                          courseId: course.id,
                          couponCode,
                        });
                      }}
                    >
                      {dictionary.course.actions.buyCourseWithPrice.replace(
                        '{0}',
                        coursePriceLabel(course, dictionary, locale),
                      )}
                    </Button>
                  ) : (
                    <Button
                      data-testid="course-detail-enroll-button"
                      className="h-11 w-full rounded-xl"
                      disabled={
                        enrollMutation.isPending || course.accessType !== 'free'
                      }
                      onClick={() => {
                        if (
                          policiesQuery.isLoading ||
                          missingStudentPolicies.length
                        ) {
                          setPolicyDialogOpen(true);
                          return;
                        }
                        enrollMutation.mutate(course.id);
                      }}
                    >
                      {dictionary.course.actions.enroll}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    onClick={() =>
                      saveMutation.mutate({
                        courseId: course.id,
                        saved: Boolean(course.isSaved),
                      })
                    }
                    disabled={saveMutation.isPending}
                  >
                    <LuHeart
                      className={
                        course.isSaved ? 'text-primary fill-current' : undefined
                      }
                    />
                    {course.isSaved
                      ? dictionary.course.marketplace.unsave
                      : dictionary.course.actions.saveCourse}
                  </Button>
                  {course.accessType === 'paid' && (
                    <p className="text-muted-foreground mt-3 text-xs">
                      {
                        dictionary.trustSafety.policies.refundPolicy
                          .checkoutSummary
                      }
                    </p>
                  )}
                  <Button
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    onClick={() => setReportDialogOpen(true)}
                  >
                    <LuFlag className="size-4" />
                    {dictionary.trustSafety.report.reportCourse}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <PolicyAcceptanceDialog
            open={policyDialogOpen}
            onOpenChange={setPolicyDialogOpen}
            requiredTypes={['studentTerms']}
            onAccepted={() => {
              if (course.accessType === 'paid') {
                checkoutMutation.mutate({ courseId: course.id, couponCode });
              } else {
                enrollMutation.mutate(course.id);
              }
            }}
          />

          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            target={{
              targetType: 'course',
              courseId: course.id,
              teacherUserId: course.creatorUserId,
            }}
          />

          <section className="grid gap-4">
            <h2 className="text-xl font-extrabold">
              {dictionary.course.learn.modules}
            </h2>
            {course.modules.map((module) => (
              <Card
                key={module.id}
                className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="bg-primary/10 text-primary mt-0.5 grid size-10 place-items-center rounded-xl">
                      <LuLayers3 className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold">{module.title}</h3>
                      {module.description && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          {module.description}
                        </p>
                      )}
                      <div className="mt-4 grid gap-2">
                        {(module.lessons || []).map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-2 text-sm dark:bg-white/8"
                          >
                            <LuCheck className="text-muted-foreground size-4" />
                            <span className="font-semibold">
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </>
      )}
    </div>
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

  if (course.accessType === 'subscription') {
    return (
      course.subscriptionPlanKey ||
      dictionary.course.enumerators.accessType.subscription
    );
  }

  return dictionary.course.enumerators.accessType.manual;
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
      <div className="flex items-center gap-3">
        <span className="text-primary bg-nexexam-primary/10 grid size-10 place-items-center rounded-xl">
          {icon}
        </span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className="text-lg font-extrabold">{value}</span>
    </div>
  );
}
