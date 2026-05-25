import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  LuBookOpenCheck,
  LuShieldCheck,
  LuSparkles,
  LuStar,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { Course } from '@/features/course/courseTypes';
import { useAuthStore } from '@/features/auth/authStore';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import { SignOutButton } from '@/features/auth/components/SignOutButton';

/**
 * Post-signup "pick your first courses" page. Skippable per design — the
 * Skip and Continue buttons both POST `/api/member/me/complete-onboarding`,
 * which clears the auth guard's redirect for this user permanently. Free
 * courses are enrollable inline; paid courses link to the detail page so
 * the buyer reads the full pitch before hitting Stripe Checkout.
 */
export function WelcomeCoursesPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const t = dictionary.studentOnboarding;

  const suggestionsQuery = useQuery({
    queryKey: ['course', 'onboarding-suggestions'],
    queryFn: () =>
      apiClient
        .get('api/course/onboarding-suggestions')
        .json<{ courses: Course[] }>(),
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) =>
      apiClient.post(`api/course/${courseId}/enroll`).json(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['course', 'onboarding-suggestions'] });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      apiClient.post('api/member/me/complete-onboarding').json(),
    onSuccess: async () => {
      // Refetch the cached member so the auth guard sees
      // `onboardingCompletedAt` set on the next navigation.
      await fetchCurrentUser();
      navigate({ to: '/' });
    },
  });

  const finish = () => completeMutation.mutate();
  const courses = suggestionsQuery.data?.courses ?? [];

  return (
    <div className="bg-muted relative min-h-screen px-4 py-6 lg:px-7">
      <div className="absolute top-4 right-4 z-10 flex gap-3 md:top-6 md:right-6">
        <LanguageSwitcher />
        <ThemeModeToggle />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="nex-glass-card relative overflow-hidden rounded-3xl border-white/70 p-6 dark:border-white/10">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                <LuSparkles className="size-3.5" />
                {dictionary.course.list.menu}
              </Badge>
              <h1 className="text-nexexam-ink mt-3 text-3xl font-extrabold md:text-4xl dark:text-white">
                {t.title}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
                {t.body}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={finish}
              disabled={completeMutation.isPending}
            >
              {t.skip}
            </Button>
          </div>
        </header>

        {suggestionsQuery.isLoading ? (
          <div className="flex justify-center p-12">
            <Spinner className="size-6" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <LuBookOpenCheck className="text-muted-foreground size-12" />
              <p className="text-muted-foreground max-w-md text-sm">
                {t.emptyMessage}
              </p>
              <Button onClick={finish} disabled={completeMutation.isPending}>
                {t.continue}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <WelcomeCourseCard
                  key={course.id}
                  course={course}
                  locale={locale ?? 'en'}
                  enrollLabel={t.enrollLabel}
                  enrolledLabel={t.enrolledLabel}
                  viewLabel={t.viewLabel}
                  verifiedLabel={dictionary.course.fields.nexVerified}
                  noRatingsLabel={dictionary.course.ratings.noRatings}
                  ratingSummaryFormat={dictionary.course.ratings.summary}
                  freeLabel={dictionary.course.enumerators.accessType.free}
                  onEnroll={() => enrollMutation.mutate(course.id)}
                  enrolling={enrollMutation.isPending}
                />
              ))}
            </section>

            <footer className="sticky bottom-4 z-10 flex justify-end">
              <Button
                size="lg"
                onClick={finish}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  t.continue
                )}
              </Button>
            </footer>
          </>
        )}

        <div className="flex justify-center pt-2">
          <SignOutButton
            className="text-muted-foreground text-sm hover:underline"
            text={dictionary.auth.signOut.button}
          />
        </div>
      </div>
    </div>
  );
}

interface WelcomeCourseCardProps {
  course: Course;
  locale: string;
  enrollLabel: string;
  enrolledLabel: string;
  viewLabel: string;
  verifiedLabel: string;
  noRatingsLabel: string;
  ratingSummaryFormat: string;
  freeLabel: string;
  onEnroll: () => void;
  enrolling: boolean;
}

function WelcomeCourseCard({
  course,
  locale,
  enrollLabel,
  enrolledLabel,
  viewLabel,
  verifiedLabel,
  noRatingsLabel,
  ratingSummaryFormat,
  freeLabel,
  onEnroll,
  enrolling,
}: WelcomeCourseCardProps) {
  const thumbnail = course.thumbnail?.[0];
  const imageUrl =
    thumbnail?.downloadUrl || thumbnail?.publicUrl || thumbnail?.signedUrl;
  const isFree = course.accessType === 'free';
  const isEnrolled = (course as Course & { isEnrolled?: boolean }).isEnrolled;
  const summary = course.ratingSummary;
  const ratingLabel =
    summary && summary.count > 0
      ? ratingSummaryFormat
          .replace('{0}', summary.average.toFixed(1))
          .replace('{1}', new Intl.NumberFormat(locale).format(summary.count))
      : noRatingsLabel;
  const priceLabel = isFree
    ? freeLabel
    : course.accessType === 'paid' && course.priceCents != null
      ? new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: course.currency || 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(course.priceCents / 100)
      : null;

  return (
    <Card className="nex-glass-card overflow-hidden rounded-2xl border-white/70 p-0 dark:border-white/10">
      <div className="relative h-40 overflow-hidden bg-[linear-gradient(135deg,var(--nexexam-soft-blue),var(--nexexam-accent))]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-nexexam-primary grid h-full place-items-center">
            <LuBookOpenCheck className="size-12" />
          </div>
        )}
        {course.nexVerified && (
          <Badge className="text-nexexam-primary absolute top-3 left-3 rounded-xl bg-white/90 shadow-sm hover:bg-white">
            <LuShieldCheck className="size-3.5" />
            {verifiedLabel}
          </Badge>
        )}
        {priceLabel && (
          <Badge className="absolute top-3 right-3 rounded-xl bg-white/90 text-black shadow-sm hover:bg-white">
            {priceLabel}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-2 text-base font-extrabold">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {course.subtitle}
            </p>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <LuStar className="size-3.5" />
          <span>{ratingLabel}</span>
        </div>
        {isFree ? (
          <Button
            size="sm"
            onClick={onEnroll}
            disabled={enrolling || Boolean(isEnrolled)}
            className="mt-2"
          >
            {isEnrolled ? enrolledLabel : enrollLabel}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            nativeButton={false}
            render={<Link to="/course/$slug" params={{ slug: course.slug }} />}
          >
            {viewLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
