import { type ReactNode, useEffect, useState } from 'react';
import {
  type UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Check,
  Clock3,
  GraduationCap,
  LineChart,
  Loader2,
  Lock,
  Pencil,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type StudentOnboardingGeneratedPlan,
  type StudentOnboardingProfileInput,
  type StudentOnboardingProfileOutput,
  studentOnboardingCurrentLevelValues,
  studentOnboardingProfileInputSchema,
  studentOnboardingTimelineValues,
} from '@project/backend/features/member/memberSchemas';
import { ContextualPaywall } from '@/features/pricing/ContextualPaywall';
import { Course } from '@/features/course/courseTypes';
import { useAuthStore } from '@/features/auth/authStore';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Spinner } from '@/shared/components/ui/spinner';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { apiClient } from '@/shared/lib/apiClient';
import {
  productAnalyticsTrack,
  productAnalyticsTrackOnce,
} from '@/shared/lib/productAnalytics';
import { cn } from '@/shared/lib/utils';

type PersonalizedOnboardingResponse = {
  profile: StudentOnboardingProfileOutput | null;
  recommendedCourses: Course[];
};

const personalizedOnboardingQueryKey = ['member', 'personalized-onboarding'];
const studyTimeOptions = [120, 240, 420, 600, 900] as const;

export function WelcomeCoursesPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const t = dictionary.studentOnboarding;
  const [isEditing, setIsEditing] = useState(false);

  const onboardingQuery = useQuery({
    queryKey: personalizedOnboardingQueryKey,
    queryFn: () =>
      apiClient
        .get('api/member/me/personalized-onboarding')
        .json<PersonalizedOnboardingResponse>(),
  });

  const form = useForm({
    resolver: zodResolver(studentOnboardingProfileInputSchema),
    defaultValues: studentOnboardingDefaultValues(
      onboardingQuery.data?.profile,
    ),
  });

  useEffect(() => {
    if (onboardingQuery.isLoading) {
      return;
    }

    productAnalyticsTrackOnce('personalized_onboarding_started', {
      eventName: 'personalized_onboarding_started',
      ctaLocation: 'welcome_courses',
      funnelId: 'personalized_onboarding',
      metadata: { hasProfile: Boolean(onboardingQuery.data?.profile) },
    });
  }, [onboardingQuery.data?.profile, onboardingQuery.isLoading]);

  useEffect(() => {
    if (onboardingQuery.data?.profile) {
      form.reset(studentOnboardingDefaultValues(onboardingQuery.data.profile));
    }
  }, [form, onboardingQuery.data?.profile]);

  const generateMutation = useMutation({
    mutationFn: (input: StudentOnboardingProfileInput) =>
      apiClient
        .post('api/member/me/personalized-onboarding/generate-plan', {
          json: input,
        })
        .json<PersonalizedOnboardingResponse>(),
    onSuccess: (response, input) => {
      setIsEditing(false);
      queryClient.setQueryData(personalizedOnboardingQueryKey, response);
      productAnalyticsTrack({
        eventName: 'personalized_onboarding_answered',
        ctaLocation: 'welcome_courses_form',
        funnelId: 'personalized_onboarding',
        metadata: studentOnboardingAnalyticsMetadata(input, response),
      });
      productAnalyticsTrack({
        eventName: 'personalized_plan_generated',
        ctaLocation: 'welcome_courses_plan',
        funnelId: 'personalized_onboarding',
        metadata: studentOnboardingAnalyticsMetadata(input, response),
      });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) =>
      apiClient.post(`api/course/${courseId}/enroll`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: personalizedOnboardingQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['course', 'onboarding-suggestions'],
      });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      apiClient.post('api/member/me/complete-onboarding').json(),
    onSuccess: async () => {
      productAnalyticsTrack({
        eventName: 'personalized_onboarding_completed',
        ctaLocation: 'welcome_courses',
        funnelId: 'personalized_onboarding',
        metadata: {
          hasGeneratedPlan: Boolean(
            onboardingQuery.data?.profile?.generatedPlan,
          ),
        },
      });
      await fetchCurrentUser();
      navigate({ to: '/' });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const profile = onboardingQuery.data?.profile ?? null;
  const plan = profile?.generatedPlan ?? null;
  const courses = onboardingQuery.data?.recommendedCourses ?? [];
  const paidCourse =
    courses.find((course) => course.accessType !== 'free') ?? null;
  const isFormVisible = !plan || isEditing;

  useEffect(() => {
    if (!plan) {
      return;
    }

    productAnalyticsTrackOnce('personalized_plan_unlock_seen', {
      eventName: 'personalized_plan_unlock_seen',
      courseId: paidCourse?.id ?? null,
      ctaLocation: 'welcome_courses_plan',
      funnelId: 'personalized_onboarding',
      metadata: {
        recommendedCourseIds: courses.map((course) => course.id),
        hasPaidRecommendation: Boolean(paidCourse),
      },
    });
  }, [courses, paidCourse, plan]);

  const onSubmit = async (input: StudentOnboardingProfileInput) => {
    generateMutation.mutate(input);
  };

  return (
    <div className="bg-muted relative min-h-screen overflow-hidden px-4 py-6 lg:px-7">
      <div className="absolute top-4 right-4 z-10 flex gap-3 md:top-6 md:right-6">
        <LanguageSwitcher />
        <ThemeModeToggle />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="nex-glass-card relative overflow-hidden rounded-3xl border-white/70 p-6 dark:border-white/10">
          <div className="flex max-w-3xl flex-col items-start">
            <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
              <Sparkles className="size-3.5" />
              {t.badge}
            </Badge>
            <h1 className="text-nexexam-ink mt-3 text-3xl font-extrabold md:text-4xl dark:text-white">
              {isFormVisible ? t.title : t.plan.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              {isFormVisible ? t.body : t.plan.body}
            </p>
          </div>
        </header>

        {onboardingQuery.isLoading ? (
          <div className="flex justify-center p-12">
            <Spinner className="size-6" />
          </div>
        ) : isFormVisible ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="nex-glass-card rounded-3xl border-white/70 p-5 dark:border-white/10">
              <PersonalizedOnboardingForm
                form={form}
                t={t}
                isPending={generateMutation.isPending}
                onSubmit={onSubmit}
              />
            </section>

            <section className="nex-glass-card rounded-3xl border-white/70 p-5 dark:border-white/10">
              <OnboardingUnlockPreview t={t} />
              <div className="mt-5">
                <CourseRecommendationGrid
                  courses={courses.slice(0, 2)}
                  locale={locale ?? 'en'}
                  dictionary={dictionary}
                  enrollMutation={enrollMutation}
                  compact
                />
              </div>
            </section>
          </div>
        ) : (
          <PersonalizedPlanResult
            profile={profile}
            plan={plan!}
            courses={courses}
            paidCourse={paidCourse}
            locale={locale ?? 'en'}
            dictionary={dictionary}
            completePending={completeMutation.isPending}
            enrollMutation={enrollMutation}
            onEdit={() => {
              form.reset(studentOnboardingDefaultValues(profile));
              setIsEditing(true);
            }}
            onFinish={() => completeMutation.mutate()}
          />
        )}

        <footer className="flex flex-col items-center justify-between gap-3 pb-2 sm:flex-row">
          <SignOutButton
            className="text-muted-foreground text-sm hover:underline"
            text={dictionary.auth.signOut.button}
          />
          <Button
            variant="ghost"
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {t.skip}
          </Button>
        </footer>
      </div>
    </div>
  );
}

function PersonalizedOnboardingForm({
  form,
  t,
  isPending,
  onSubmit,
}: {
  form: ReturnType<typeof useForm>;
  t: any;
  isPending: boolean;
  onSubmit: (input: StudentOnboardingProfileInput) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.stopPropagation();
        form.handleSubmit((values) =>
          onSubmit(values as StudentOnboardingProfileInput),
        )(event);
      }}
    >
      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel htmlFor="examGoal" className="required">
            {t.fields.examGoal}
          </FieldLabel>
          <Controller
            control={form.control}
            name="examGoal"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="examGoal"
                  {...field}
                  value={field.value ?? ''}
                  placeholder={t.placeholders.examGoal}
                  className="h-12 rounded-xl bg-white/70 dark:bg-white/8"
                  disabled={isPending}
                  autoFocus
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />
        </Field>

        <Controller
          control={form.control}
          name="timeline"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="required">{t.fields.timeline}</FieldLabel>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-2 sm:grid-cols-2"
              >
                {studentOnboardingTimelineValues.map((value) => (
                  <ChoiceCard
                    key={value}
                    value={value}
                    title={t.timeline[value]}
                    body={t.timelineBody[value]}
                    disabled={isPending}
                  />
                ))}
              </RadioGroup>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="currentLevel"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="required">
                {t.fields.currentLevel}
              </FieldLabel>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-2 sm:grid-cols-2"
              >
                {studentOnboardingCurrentLevelValues.map((value) => (
                  <ChoiceCard
                    key={value}
                    value={value}
                    title={t.currentLevel[value]}
                    body={t.currentLevelBody[value]}
                    disabled={isPending}
                  />
                ))}
              </RadioGroup>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="studyMinutesPerWeek"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="required">{t.fields.studyTime}</FieldLabel>
              <RadioGroup
                value={String(field.value)}
                onValueChange={field.onChange}
                className="grid gap-2 sm:grid-cols-5"
              >
                {studyTimeOptions.map((value) => (
                  <ChoiceCard
                    key={value}
                    value={String(value)}
                    title={t.studyTime[String(value)]}
                    body={formatStudyMinutes(value, t)}
                    disabled={isPending}
                    compact
                  />
                ))}
              </RadioGroup>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="targetScore" className="required">
            {t.fields.targetScore}
          </FieldLabel>
          <Controller
            control={form.control}
            name="targetScore"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="targetScore"
                  {...field}
                  value={field.value ?? ''}
                  placeholder={t.placeholders.targetScore}
                  className="h-12 rounded-xl bg-white/70 dark:bg-white/8"
                  disabled={isPending}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-xl"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Target />}
          {t.generatePlan}
        </Button>
      </FieldGroup>
    </form>
  );
}

function ChoiceCard({
  value,
  title,
  body,
  disabled,
  compact,
}: {
  value: string;
  title: string;
  body: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <label
      className={cn(
        'border-input has-data-checked:border-primary has-data-checked:bg-primary/10 flex cursor-pointer items-start gap-3 rounded-xl border bg-white/70 p-3 transition dark:bg-white/8',
        compact && 'min-h-24 flex-col gap-2',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <RadioGroupItem value={value} disabled={disabled} className="mt-1" />
      <span className="min-w-0">
        <span className="block text-sm font-extrabold">{title}</span>
        <span className="text-muted-foreground mt-1 block text-xs">{body}</span>
      </span>
    </label>
  );
}

function OnboardingUnlockPreview({ t }: { t: any }) {
  return (
    <div>
      <Badge className="text-primary rounded-xl bg-white/80 hover:bg-white/80 dark:bg-white/10">
        <Lock className="size-3.5" />
        {t.unlockPreview.badge}
      </Badge>
      <h2 className="mt-3 text-xl font-extrabold">{t.unlockPreview.title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        {t.unlockPreview.body}
      </p>
      <div className="mt-5 grid gap-3">
        {t.unlockPreview.items.map((item: string) => (
          <div key={item} className="flex items-start gap-2 text-sm">
            <Check className="text-nexexam-success mt-0.5 size-4 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalizedPlanResult({
  profile,
  plan,
  courses,
  paidCourse,
  locale,
  dictionary,
  completePending,
  enrollMutation,
  onEdit,
  onFinish,
}: {
  profile: StudentOnboardingProfileOutput | null;
  plan: StudentOnboardingGeneratedPlan;
  courses: Course[];
  paidCourse: Course | null;
  locale: string;
  dictionary: any;
  completePending: boolean;
  enrollMutation: UseMutationResult<unknown, Error, string, unknown>;
  onEdit: () => void;
  onFinish: () => void;
}) {
  const t = dictionary.studentOnboarding;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <section className="nex-glass-card rounded-3xl border-white/70 p-5 dark:border-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                <Sparkles className="size-3.5" />
                {t.plan.readyBadge}
              </Badge>
              <h2 className="mt-3 text-2xl font-extrabold">
                {dictionaryFormat(t.plan.personalTitle, profile?.examGoal)}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
                {dictionaryFormat(
                  t.plan.summary,
                  t.timeline[plan.timeline],
                  profile?.targetScore,
                )}
              </p>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={onEdit}>
              <Pencil className="size-4" />
              {t.editAnswers}
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <PlanMetric
              icon={<CalendarClock className="size-4" />}
              label={t.plan.metrics.timeline}
              value={t.timeline[plan.timeline]}
            />
            <PlanMetric
              icon={<Clock3 className="size-4" />}
              label={t.plan.metrics.weeklyTime}
              value={formatStudyMinutes(plan.weeklyStudyMinutes, t)}
            />
            <PlanMetric
              icon={<LineChart className="size-4" />}
              label={t.plan.metrics.rhythm}
              value={dictionaryFormat(
                t.plan.sessionRhythm,
                plan.weeklySessions,
                formatStudyMinutes(plan.sessionMinutes, t),
              )}
            />
            <PlanMetric
              icon={<Target className="size-4" />}
              label={t.plan.metrics.targetScore}
              value={profile?.targetScore || ''}
            />
          </div>
        </section>

        <section className="nex-glass-card rounded-3xl border-white/70 p-5 dark:border-white/10">
          <h2 className="text-xl font-extrabold">{t.plan.milestonesTitle}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {plan.milestones.map((milestone) => (
              <div
                key={milestone.key}
                className="rounded-2xl border bg-white/70 p-3 dark:bg-white/8"
              >
                <div className="text-primary text-xs font-bold">
                  {milestone.dueInDays === 0
                    ? t.plan.today
                    : dictionaryFormat(t.plan.days, milestone.dueInDays)}
                </div>
                <div className="mt-2 text-sm font-extrabold">
                  {t.plan.milestones[milestone.key].title}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t.plan.milestones[milestone.key].body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="nex-glass-card rounded-3xl border-white/70 p-5 dark:border-white/10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold">{t.courses.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {t.courses.body}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link to="/course" />}
              className="rounded-xl"
            >
              {t.courses.browseAll}
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <CourseRecommendationGrid
            courses={courses}
            locale={locale}
            dictionary={dictionary}
            enrollMutation={enrollMutation}
          />
        </section>
      </div>

      <aside className="space-y-5">
        <section className="nex-glass-card rounded-3xl border-white/70 p-5 dark:border-white/10">
          <h2 className="text-xl font-extrabold">{t.unlocks.title}</h2>
          <div className="mt-4 space-y-4">
            <UnlockList
              title={t.unlocks.includedTitle}
              items={t.unlocks.includedItems}
              iconClassName="text-nexexam-success"
            />
            <UnlockList
              title={t.unlocks.paidTitle}
              items={plan.unlocks.map((unlock) => t.unlocks.items[unlock])}
              iconClassName="text-primary"
            />
          </div>
          <Button
            className="mt-5 h-11 w-full rounded-xl"
            onClick={onFinish}
            disabled={completePending}
          >
            {completePending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GraduationCap className="size-4" />
            )}
            {t.continue}
          </Button>
        </section>

        <ContextualPaywall
          source="personalized_onboarding_result"
          courseId={paidCourse?.id ?? null}
          courseSlug={paidCourse?.slug ?? null}
          preferredPackageTypes={
            paidCourse
              ? [
                  'course_purchase',
                  'selected_lifetime_course_access',
                  'annual_subscription',
                  'monthly_subscription',
                ]
              : ['annual_subscription', 'monthly_subscription']
          }
          compact
          metadata={{
            recommendedCourseIds: courses.map((course) => course.id),
            onboardingTimeline: plan.timeline,
            onboardingLevel: plan.currentLevel,
          }}
        />
      </aside>
    </div>
  );
}

function PlanMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white/70 p-3 dark:bg-white/8">
      <div className="text-primary flex items-center gap-2">{icon}</div>
      <div className="text-muted-foreground mt-3 text-xs">{label}</div>
      <div className="mt-1 text-sm font-extrabold">{value}</div>
    </div>
  );
}

function UnlockList({
  title,
  items,
  iconClassName,
}: {
  title: string;
  items: string[];
  iconClassName: string;
}) {
  return (
    <div>
      <div className="text-sm font-extrabold">{title}</div>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-muted-foreground flex gap-2 text-xs">
            <Check className={cn('mt-0.5 size-3.5 shrink-0', iconClassName)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CourseRecommendationGrid({
  courses,
  locale,
  dictionary,
  enrollMutation,
  compact,
}: {
  courses: Course[];
  locale: string;
  dictionary: any;
  enrollMutation: UseMutationResult<unknown, Error, string, unknown>;
  compact?: boolean;
}) {
  const t = dictionary.studentOnboarding;

  if (!courses.length) {
    return (
      <div className="mt-4 rounded-2xl border bg-white/70 p-6 text-center dark:bg-white/8">
        <BookOpenCheck className="text-muted-foreground mx-auto size-10" />
        <p className="text-muted-foreground mt-3 text-sm">{t.emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mt-4 grid gap-4',
        compact ? 'grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3',
      )}
    >
      {courses.map((course) => (
        <WelcomeCourseCard
          key={course.id}
          course={course}
          locale={locale}
          dictionary={dictionary}
          onEnroll={() => enrollMutation.mutate(course.id)}
          enrolling={enrollMutation.isPending}
        />
      ))}
    </div>
  );
}

function WelcomeCourseCard({
  course,
  locale,
  dictionary,
  onEnroll,
  enrolling,
}: {
  course: Course;
  locale: string;
  dictionary: any;
  onEnroll: () => void;
  enrolling: boolean;
}) {
  const thumbnail = course.thumbnail?.[0];
  const imageUrl =
    thumbnail?.downloadUrl || thumbnail?.publicUrl || thumbnail?.signedUrl;
  const isFree = course.accessType === 'free';
  const isEnrolled = (course as Course & { isEnrolled?: boolean }).isEnrolled;
  const summary = course.ratingSummary;
  const ratingLabel =
    summary && summary.count > 0
      ? dictionary.course.ratings.summary
          .replace('{0}', summary.average.toFixed(1))
          .replace('{1}', new Intl.NumberFormat(locale).format(summary.count))
      : dictionary.course.ratings.noRatings;
  const priceLabel = isFree
    ? dictionary.course.enumerators.accessType.free
    : course.accessType === 'paid' && course.priceCents != null
      ? new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: course.currency || 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(course.priceCents / 100)
      : dictionary.course.enumerators.accessType[course.accessType];

  return (
    <Card className="nex-glass-card overflow-hidden rounded-2xl border-white/70 p-0 dark:border-white/10">
      <div className="relative h-36 overflow-hidden bg-[linear-gradient(135deg,var(--nexexam-soft-blue),var(--nexexam-accent))]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-nexexam-primary grid h-full place-items-center">
            <BookOpenCheck className="size-12" />
          </div>
        )}
        {course.nexVerified && (
          <Badge className="text-nexexam-primary absolute top-3 left-3 rounded-xl bg-white/90 shadow-sm hover:bg-white">
            <ShieldCheck className="size-3.5" />
            {dictionary.course.fields.nexVerified}
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 rounded-xl bg-white/90 text-black shadow-sm hover:bg-white">
          {priceLabel}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
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
          <Star className="size-3.5" />
          <span>{ratingLabel}</span>
        </div>
        {isFree ? (
          <Button
            size="sm"
            onClick={onEnroll}
            disabled={enrolling || Boolean(isEnrolled)}
            className="mt-auto rounded-xl"
          >
            {isEnrolled
              ? dictionary.studentOnboarding.enrolledLabel
              : dictionary.studentOnboarding.enrollLabel}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="mt-auto rounded-xl"
            nativeButton={false}
            render={<Link to="/course/$slug" params={{ slug: course.slug }} />}
          >
            {dictionary.studentOnboarding.viewLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function studentOnboardingDefaultValues(
  profile?: StudentOnboardingProfileOutput | null,
) {
  return {
    examGoal: profile?.examGoal || '',
    timeline: profile?.timeline || 'one_month',
    currentLevel: profile?.currentLevel || 'some_background',
    studyMinutesPerWeek: profile?.studyMinutesPerWeek || 240,
    targetScore: profile?.targetScore || '',
  };
}

function studentOnboardingAnalyticsMetadata(
  input: StudentOnboardingProfileInput,
  response: PersonalizedOnboardingResponse,
) {
  return {
    timeline: input.timeline,
    currentLevel: input.currentLevel,
    studyMinutesPerWeek: input.studyMinutesPerWeek,
    hasTargetScore: Boolean(input.targetScore),
    hasExamGoal: Boolean(input.examGoal),
    recommendedCourseIds: response.recommendedCourses.map(
      (course) => course.id,
    ),
    paidRecommendations: response.recommendedCourses.filter(
      (course) => course.accessType !== 'free',
    ).length,
  };
}

function formatStudyMinutes(minutes: number, t: any) {
  if (minutes >= 60 && minutes % 60 === 0) {
    return dictionaryFormat(t.duration.hours, minutes / 60);
  }

  if (minutes > 60) {
    return dictionaryFormat(
      t.duration.hoursMinutes,
      Math.floor(minutes / 60),
      minutes % 60,
    );
  }

  return dictionaryFormat(t.duration.minutes, minutes);
}
