import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, Link } from '@tanstack/react-router';
import {
  LuBadgeCheck,
  LuBookOpenCheck,
  LuCheck,
  LuClock3,
  LuFileText,
  LuIdCard,
  LuLayers,
  LuSend,
  LuShieldCheck,
  LuSparkles,
  LuStar,
  LuWallet,
} from 'react-icons/lu';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore, type Dictionary } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import type { PlatformMetrics } from '@/features/platformAdmin/platformMetricsTypes';

export const creatorDashboardLazyRoute = createLazyRoute('/creator')({
  component: CreatorDashboardPage,
});

type CreatorApplication = {
  id: string;
  legalName?: string | null;
  displayName: string;
  bio: string;
  credentials: string;
  expertise: string;
  links: string[];
  payoutContact?: string | null;
  identityStatus:
    | 'notStarted'
    | 'needsDocuments'
    | 'readyForReview'
    | 'verified'
    | 'rejected';
  identityScanStatus: 'notStarted' | 'passed' | 'needsReview' | 'failed';
  status: 'pending' | 'approved' | 'rejected';
};

type CreatorVerificationEligibility = {
  applicationApproved: boolean;
  identityVerified: boolean;
  payoutComplete: boolean;
  eligible: boolean;
  nexVerified: boolean;
};

const emptyEligibility: CreatorVerificationEligibility = {
  applicationApproved: false,
  identityVerified: false,
  payoutComplete: false,
  eligible: false,
  nexVerified: false,
};

export function CreatorDashboardPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const currentMember = useAuthStore((state) => state.currentMember);
  const firstName =
    currentMember?.firstName ||
    currentMember?.fullName?.split(' ')[0] ||
    dictionary.dashboard.fallbackName;

  const applicationQuery = useQuery({
    queryKey: ['creatorApplication', 'me'],
    queryFn: async ({ signal }) =>
      apiClient.get('api/creator-application/me', { signal }).json<{
        application: CreatorApplication | null;
        eligibility: CreatorVerificationEligibility;
      }>(),
  });

  const metricsQuery = useQuery({
    queryKey: ['courseBuilder', 'metrics'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/course-builder/metrics?range=30d', { signal })
        .json<PlatformMetrics>(),
    enabled: Boolean(applicationQuery.data?.eligibility.nexVerified),
  });

  const application = applicationQuery.data?.application;
  const status = application?.status;
  const eligibility = applicationQuery.data?.eligibility || emptyEligibility;
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  return (
    <div className="nex-dashboard-shell flex flex-1 flex-col gap-6 px-4 py-6 lg:px-7">
      <section className="nex-glass-card nex-gradient-hero overflow-hidden rounded-3xl p-7 lg:p-9">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-3xl">
            <p className="text-muted-foreground text-base">
              {dictionary.dashboard.creator.welcome.replace('{0}', firstName)}
            </p>
            <h1 className="text-nexexam-ink mt-5 text-4xl leading-tight font-extrabold tracking-normal md:text-[44px] 2xl:text-5xl dark:text-white">
              {dictionary.dashboard.creator.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
              {dictionary.dashboard.creator.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={<Link to="/creator-application" />}
                size="lg"
                className="h-12 rounded-xl px-6 shadow-[var(--nexexam-glow)]"
              >
                <LuSend className="size-4" />
                {application
                  ? dictionary.dashboard.creator.editApplication
                  : dictionary.dashboard.creator.startApplication}
              </Button>
              <Button
                nativeButton={false}
                render={<Link to="/creator/courses" />}
                size="lg"
                variant="outline"
                className="border-primary/25 text-primary hover:bg-primary/5 h-12 rounded-xl bg-white/70 px-6 dark:bg-white/8"
              >
                <LuLayers className="size-4" />
                {dictionary.course.builder.menu}
              </Button>
              <Button
                nativeButton={false}
                render={<Link to="/student" />}
                size="lg"
                variant="outline"
                className="border-primary/25 text-primary hover:bg-primary/5 h-12 rounded-xl bg-white/70 px-6 dark:bg-white/8"
              >
                <LuBookOpenCheck className="size-4" />
                {dictionary.dashboard.student.menu}
              </Button>
            </div>
          </div>

          <Card className="nex-glass-card rounded-3xl border-white/70 bg-white/74 p-0 dark:border-white/10 dark:bg-white/8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
                  <LuBadgeCheck className="size-5" />
                </span>
                <div>
                  <h2 className="font-extrabold">
                    {dictionary.dashboard.creator.applicationTitle}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {status && (
                      <Badge variant="outline" className="rounded-xl">
                        {dictionaryEnumerator(
                          dictionary.creatorApplication.enumerators.status,
                          status,
                        )}
                      </Badge>
                    )}
                    {eligibility.nexVerified && (
                      <Badge className="bg-nexexam-success hover:bg-nexexam-success rounded-xl text-white">
                        <LuBadgeCheck className="size-3.5" />
                        {
                          dictionary.creatorApplication.verification
                            .nexVerifiedBadge
                        }
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {applicationQuery.isLoading ? (
                  <div className="text-nexexam-muted flex items-center gap-3 text-sm font-semibold">
                    <Spinner className="size-4" />
                    {dictionary.shared.loading}
                  </div>
                ) : (
                  <ApplicationState
                    status={status}
                    empty={!application}
                    dictionary={dictionary}
                  />
                )}
              </div>
              {application && (
                <div className="mt-5 grid gap-3">
                  <VerificationRow
                    icon={<LuIdCard className="size-4" />}
                    label={dictionary.creatorApplication.fields.identityStatus}
                    value={dictionaryEnumerator(
                      dictionary.creatorApplication.enumerators.identityStatus,
                      application.identityStatus,
                    )}
                  />
                  <VerificationRow
                    icon={<LuShieldCheck className="size-4" />}
                    label={
                      dictionary.creatorApplication.fields.identityScanStatus
                    }
                    value={dictionaryEnumerator(
                      dictionary.creatorApplication.enumerators
                        .identityScanStatus,
                      application.identityScanStatus,
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {eligibility.nexVerified && (
        <CreatorMetricsPanel
          metrics={metricsQuery.data}
          isLoading={metricsQuery.isLoading}
          dictionary={dictionary}
          locale={locale}
          currencyFormatter={currencyFormatter}
        />
      )}

      <section>
        <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="p-6 lg:p-7">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
                <LuShieldCheck className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold tracking-normal">
                  {dictionary.creatorApplication.verification.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm leading-6">
                  {dictionary.creatorApplication.verification.description}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <VerificationCheck
                complete={eligibility.applicationApproved}
                label={
                  dictionary.creatorApplication.verification.checks
                    .applicationApproved
                }
              />
              <VerificationCheck
                complete={eligibility.identityVerified}
                label={
                  dictionary.creatorApplication.verification.checks
                    .identityVerified
                }
              />
              <VerificationCheck
                complete={eligibility.payoutComplete}
                label={
                  dictionary.creatorApplication.verification.checks
                    .payoutComplete
                }
              />
              <VerificationCheck
                complete={eligibility.nexVerified}
                label={
                  dictionary.creatorApplication.verification.checks.nexVerified
                }
              />
            </div>

            <p className="text-muted-foreground mt-5 text-sm leading-6">
              {eligibility.eligible
                ? dictionary.creatorApplication.verification.eligibleNote
                : dictionary.creatorApplication.verification.pendingNote}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CreatorMetricsPanel({
  metrics,
  isLoading,
  dictionary,
  locale,
  currencyFormatter,
}: {
  metrics?: PlatformMetrics;
  isLoading: boolean;
  dictionary: Dictionary;
  locale: string | undefined;
  currencyFormatter: Intl.NumberFormat;
}) {
  const summary = metrics?.summary;

  return (
    <section>
      <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
        <CardContent className="p-6 lg:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-normal">
                {dictionary.dashboard.creator.metricsTitle}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {dictionary.dashboard.creator.metricsBody}
              </p>
            </div>
            <Badge variant="outline" className="w-fit rounded-xl">
              {dictionary.platformAdmin.metrics.ranges['30d']}
            </Badge>
          </div>

          {isLoading ? (
            <div className="text-muted-foreground mt-6 flex items-center gap-3 text-sm font-semibold">
              <Spinner className="size-4" />
              {dictionary.platformAdmin.metrics.loading}
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <CreatorMetric
                icon={<LuBookOpenCheck className="size-5" />}
                label={dictionary.platformAdmin.metrics.courseEnrollments}
                value={formatNumber(summary?.courseEnrollments, locale)}
              />
              <CreatorMetric
                icon={<LuFileText className="size-5" />}
                label={dictionary.platformAdmin.metrics.homeworkCompletion}
                value={formatPercent(summary?.homeworkCompletionRate)}
              />
              <CreatorMetric
                icon={<LuSparkles className="size-5" />}
                label={dictionary.platformAdmin.metrics.aiUsage}
                value={formatCompactNumber(summary?.aiTokens || 0, locale)}
              />
              <CreatorMetric
                icon={<LuWallet className="size-5" />}
                label={dictionary.platformAdmin.metrics.creatorEarnings}
                value={currencyFormatter.format(summary?.creatorEarnings || 0)}
              />
              <CreatorMetric
                icon={<LuCheck className="size-5" />}
                label={dictionary.platformAdmin.metrics.lessonCompletion}
                value={formatPercent(summary?.lessonCompletionRate)}
              />
              <CreatorMetric
                icon={<LuLayers className="size-5" />}
                label={dictionary.platformAdmin.metrics.quizScores}
                value={formatPercent(summary?.averageQuizScore)}
              />
              <CreatorMetric
                icon={<LuStar className="size-5" />}
                label={dictionary.platformAdmin.metrics.courseRatings}
                value={
                  summary?.courseRatingCount
                    ? dictionary.course.ratings.summary
                        .replace(
                          '{0}',
                          formatRating(summary.averageCourseRating, locale),
                        )
                        .replace(
                          '{1}',
                          formatNumber(summary.courseRatingCount, locale),
                        )
                    : dictionary.course.ratings.noRatings
                }
              />
              <CreatorMetric
                icon={<LuShieldCheck className="size-5" />}
                label={dictionary.platformAdmin.metrics.studentRetention}
                value={formatPercent(summary?.studentRetentionRate)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function CreatorMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
      <div className="text-primary bg-primary/10 grid size-10 place-items-center rounded-xl">
        {icon}
      </div>
      <div className="text-muted-foreground mt-4 text-xs font-semibold">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold tracking-normal">
        {value}
      </div>
    </div>
  );
}

function ApplicationState({
  status,
  empty,
  dictionary,
}: {
  status?: CreatorApplication['status'];
  empty: boolean;
  dictionary: Dictionary;
}) {
  if (empty) {
    return (
      <p className="text-muted-foreground text-sm leading-6">
        {dictionary.dashboard.creator.applicationEmpty}
      </p>
    );
  }

  const message =
    status === 'approved'
      ? dictionary.dashboard.creator.applicationApproved
      : status === 'rejected'
        ? dictionary.dashboard.creator.applicationRejected
        : dictionary.dashboard.creator.applicationPending;

  return <p className="text-muted-foreground text-sm leading-6">{message}</p>;
}

function VerificationCheck({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-white/70 px-3 py-2.5 dark:bg-white/8">
      <span
        className={
          complete
            ? 'bg-nexexam-success grid size-6 place-items-center rounded-full text-white'
            : 'bg-nexexam-soft text-nexexam-muted grid size-6 place-items-center rounded-full'
        }
      >
        {complete ? (
          <LuCheck className="size-4" />
        ) : (
          <LuClock3 className="size-3.5" />
        )}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

function VerificationRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-white/70 px-3 py-2 dark:bg-white/8">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold">
        {icon}
        {label}
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function formatNumber(value: number | undefined, locale: string | undefined) {
  return new Intl.NumberFormat(locale || undefined).format(value || 0);
}

function formatPercent(value: number | undefined) {
  return `${Math.round(value || 0)}%`;
}

function formatRating(value: number | undefined, locale: string | undefined) {
  return new Intl.NumberFormat(locale || undefined, {
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatCompactNumber(value: number, locale: string | undefined) {
  return new Intl.NumberFormat(locale || undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value || 0);
}
