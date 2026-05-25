import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, Link } from '@tanstack/react-router';
import {
  LuArrowLeft,
  LuBadgeAlert,
  LuBookOpenCheck,
  LuFlag,
  LuRefreshCw,
  LuSearch,
  LuShieldAlert,
  LuShieldCheck,
  LuUserX,
} from 'react-icons/lu';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import {
  CourseReviewDecision,
  TrustSafetyQueue,
  TrustSafetyReportOutcomeCategory,
  TrustSafetyReportPriority,
  TrustSafetyReport,
  TrustSafetyReportStatus,
  TrustSafetyRiskFlag,
  TrustSafetyRiskFlagSeverity,
  TrustSafetyRiskFlagStatus,
} from '@/features/trustSafety/trustSafetyTypes';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export const platformTrustSafetyLazyRoute = createLazyRoute(
  '/admin/trust-safety',
)({
  component: PlatformTrustSafetyPage,
});

type ManualFlagForm = {
  targetType: TrustSafetyRiskFlag['targetType'];
  targetId: string;
  severity: TrustSafetyRiskFlagSeverity;
  reason: string;
};

const emptyManualFlag: ManualFlagForm = {
  targetType: 'course',
  targetId: '',
  severity: 'medium',
  reason: '',
};

export function PlatformTrustSafetyPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const text = dictionary.trustSafety.admin;
  const currentUser = useAuthStore((state) => state.currentUser);
  const [search, setSearch] = useState('');
  const [reportStatus, setReportStatus] = useState('all');
  const [flagStatus, setFlagStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [targetType, setTargetType] = useState('all');
  const [reportNotes, setReportNotes] = useState<Record<string, string>>({});
  const [reportResolutionSummaries, setReportResolutionSummaries] = useState<
    Record<string, string>
  >({});
  const [reportOutcomes, setReportOutcomes] = useState<
    Record<string, TrustSafetyReportOutcomeCategory>
  >({});
  const [reportPriorities, setReportPriorities] = useState<
    Record<string, TrustSafetyReportPriority>
  >({});
  const [flagNotes, setFlagNotes] = useState<Record<string, string>>({});
  const [manualFlag, setManualFlag] = useState<ManualFlagForm>(emptyManualFlag);

  const queueQuery = useQuery({
    queryKey: [
      'platformAdmin',
      'trustSafety',
      search,
      reportStatus,
      flagStatus,
      priority,
      severity,
      targetType,
    ],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/platform-admin/trust-safety?${objectToQuery({
            filter: {
              search: search || undefined,
              reportStatus,
              flagStatus,
              priority,
              severity,
              targetType,
            },
          })}`,
          { signal },
        )
        .json<TrustSafetyQueue>(),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['platformAdmin', 'trustSafety'],
    });
    await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
    await queryClient.invalidateQueries({ queryKey: ['course'] });
  };

  const reportMutation = useMutation({
    mutationFn: ({
      report,
      status,
      assignedToUserId,
    }: {
      report: TrustSafetyReport;
      status: TrustSafetyReportStatus;
      assignedToUserId?: string | null;
    }) =>
      apiClient
        .patch(`api/platform-admin/trust-safety/reports/${report.id}`, {
          json: {
            status,
            priority: reportPriorities[report.id] || report.priority,
            assignedToUserId:
              assignedToUserId !== undefined
                ? assignedToUserId
                : report.assignedToUserId || null,
            outcomeCategory:
              reportOutcomes[report.id] || report.outcomeCategory || null,
            resolutionSummary:
              reportResolutionSummaries[report.id] ||
              report.resolutionSummary ||
              '',
            adminNotes: reportNotes[report.id] || report.adminNotes || '',
          },
        })
        .json(),
    onSuccess: async () => {
      await invalidate();
      toast.success(dictionary.trustSafety.success.adminActionSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const flagMutation = useMutation({
    mutationFn: ({
      flag,
      status,
    }: {
      flag: TrustSafetyRiskFlag;
      status: TrustSafetyRiskFlagStatus;
    }) =>
      apiClient
        .patch(`api/platform-admin/trust-safety/risk-flags/${flag.id}`, {
          json: {
            status,
            adminNotes: flagNotes[flag.id] || flag.adminNotes || '',
          },
        })
        .json(),
    onSuccess: async () => {
      await invalidate();
      toast.success(dictionary.trustSafety.success.adminActionSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const creatorMutation = useMutation({
    mutationFn: ({
      userId,
      disabled,
      reason,
    }: {
      userId: string;
      disabled: boolean;
      reason?: string | null;
    }) =>
      apiClient
        .patch(`api/platform-admin/trust-safety/creators/${userId}/status`, {
          json: { disabled, reason, holdCourses: true },
        })
        .json(),
    onSuccess: async () => {
      await invalidate();
      toast.success(dictionary.trustSafety.success.adminActionSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const courseHoldMutation = useMutation({
    mutationFn: ({
      courseId,
      held,
      reason,
    }: {
      courseId: string;
      held: boolean;
      reason?: string | null;
    }) =>
      apiClient
        .patch(`api/platform-admin/trust-safety/courses/${courseId}/hold`, {
          json: { held, reason },
        })
        .json(),
    onSuccess: async () => {
      await invalidate();
      toast.success(dictionary.trustSafety.success.adminActionSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const ruleScanMutation = useMutation({
    mutationFn: () =>
      apiClient.post('api/platform-admin/trust-safety/rule-scan').json<{
        createdCount: number;
      }>(),
    onSuccess: async (data) => {
      await invalidate();
      toast.success(
        dictionary.trustSafety.success.ruleScanComplete.replace(
          '{0}',
          String(data.createdCount),
        ),
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const manualFlagMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post('api/platform-admin/trust-safety/risk-flags', {
          json: manualFlagPayload(manualFlag),
        })
        .json(),
    onSuccess: async () => {
      setManualFlag(emptyManualFlag);
      await invalidate();
      toast.success(dictionary.trustSafety.success.adminActionSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const queue = queueQuery.data;
  const counts = queue?.counts;
  const policySummary = useMemo(
    () =>
      (queue?.policyVersions || [])
        .map(
          (policy) =>
            `${dictionary.trustSafety.policies[policy.type].title} ${policy.version}`,
        )
        .join(' / '),
    [dictionary, queue?.policyVersions],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.platformAdmin.title, '/admin'],
          [dictionary.trustSafety.admin.title],
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          nativeButton={false}
          variant="outline"
          className="h-10 rounded-lg"
          render={<Link to="/admin" />}
        >
          <LuArrowLeft className="size-4" />
          {dictionary.platformAdmin.actions.backToDashboard}
        </Button>
        <Button
          className="h-10 rounded-lg"
          disabled={ruleScanMutation.isPending}
          onClick={() => ruleScanMutation.mutate()}
        >
          <LuRefreshCw className="size-4" />
          {text.runRuleScan}
        </Button>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <TrustSafetyStat
          icon={<LuFlag />}
          label={text.openReports}
          value={counts?.openReports || 0}
        />
        <TrustSafetyStat
          icon={<LuShieldAlert />}
          label={text.openRiskFlags}
          value={counts?.openRiskFlags || 0}
        />
        <TrustSafetyStat
          icon={<LuBookOpenCheck />}
          label={text.pendingReviews}
          value={counts?.pendingReviews || 0}
        />
        <TrustSafetyStat
          icon={<LuUserX />}
          label={text.disabledCreators}
          value={counts?.disabledCreators || 0}
        />
      </section>

      <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-extrabold">{text.policyVersions}</h2>
            <p className="text-muted-foreground text-sm">
              {policySummary || text.noPolicyVersions}
            </p>
          </div>
          <div className="grid w-full gap-2 lg:w-[46rem] lg:grid-cols-3">
            <select
              value={reportStatus}
              onChange={(event) => setReportStatus(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="all">{text.reportStatusFilter}</option>
              {Object.entries(text.reportStatuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={flagStatus}
              onChange={(event) => setFlagStatus(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="all">{text.flagStatusFilter}</option>
              {Object.entries(text.flagStatuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="all">{text.priorityFilter}</option>
              {Object.entries(text.priorities).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="all">{text.severityFilter}</option>
              {Object.entries(text.severities).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={targetType}
              onChange={(event) => setTargetType(event.target.value)}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            >
              <option value="all">{text.targetTypeFilter}</option>
              {Object.entries(text.targetTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="relative">
              <LuSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={text.searchPlaceholder}
                className="h-10 rounded-lg pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <QueueCard title={text.riskFlags} icon={<LuShieldAlert />}>
          {queue?.riskFlags.length ? (
            <div className="grid gap-3">
              {queue.riskFlags.map((flag) => (
                <RiskFlagItem
                  key={flag.id}
                  flag={flag}
                  locale={locale}
                  dictionary={dictionary}
                  notes={flagNotes[flag.id] || flag.adminNotes || ''}
                  onNotesChange={(value) =>
                    setFlagNotes((current) => ({
                      ...current,
                      [flag.id]: value,
                    }))
                  }
                  onStatus={(status) => flagMutation.mutate({ flag, status })}
                  onDisableCreator={(userId) =>
                    creatorMutation.mutate({
                      userId,
                      disabled: true,
                      reason: flagNotes[flag.id] || flag.reason,
                    })
                  }
                  onHoldCourse={(courseId) =>
                    courseHoldMutation.mutate({
                      courseId,
                      held: true,
                      reason: flagNotes[flag.id] || flag.reason,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState label={text.emptyRiskFlags} />
          )}
        </QueueCard>

        <QueueCard title={text.reports} icon={<LuFlag />}>
          {queue?.reports.length ? (
            <div className="grid gap-3">
              {queue.reports.map((report) => (
                <ReportItem
                  key={report.id}
                  report={report}
                  locale={locale}
                  dictionary={dictionary}
                  notes={reportNotes[report.id] || report.adminNotes || ''}
                  priority={reportPriorities[report.id] || report.priority}
                  outcome={
                    reportOutcomes[report.id] ||
                    report.outcomeCategory ||
                    'none'
                  }
                  resolutionSummary={
                    reportResolutionSummaries[report.id] ||
                    report.resolutionSummary ||
                    ''
                  }
                  onNotesChange={(value) =>
                    setReportNotes((current) => ({
                      ...current,
                      [report.id]: value,
                    }))
                  }
                  onPriorityChange={(value) =>
                    setReportPriorities((current) => ({
                      ...current,
                      [report.id]: value,
                    }))
                  }
                  onOutcomeChange={(value) =>
                    setReportOutcomes((current) => ({
                      ...current,
                      [report.id]: value,
                    }))
                  }
                  onResolutionSummaryChange={(value) =>
                    setReportResolutionSummaries((current) => ({
                      ...current,
                      [report.id]: value,
                    }))
                  }
                  onStatus={(status) =>
                    reportMutation.mutate({ report, status })
                  }
                  onAssignToMe={() =>
                    reportMutation.mutate({
                      report,
                      status: 'underReview',
                      assignedToUserId: currentUser?.id || null,
                    })
                  }
                  onDisableCreator={(userId) =>
                    creatorMutation.mutate({
                      userId,
                      disabled: true,
                      reason: reportNotes[report.id] || report.reason,
                    })
                  }
                  onHoldCourse={(courseId) =>
                    courseHoldMutation.mutate({
                      courseId,
                      held: true,
                      reason: reportNotes[report.id] || report.reason,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState label={text.emptyReports} />
          )}
        </QueueCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <QueueCard title={text.manualFlag} icon={<LuBadgeAlert />}>
          <div className="grid gap-3">
            <div className="grid gap-2 md:grid-cols-3">
              <select
                value={manualFlag.targetType}
                onChange={(event) =>
                  setManualFlag((current) => ({
                    ...current,
                    targetType: event.target
                      .value as ManualFlagForm['targetType'],
                  }))
                }
                className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
              >
                {Object.entries(text.targetTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={manualFlag.severity}
                onChange={(event) =>
                  setManualFlag((current) => ({
                    ...current,
                    severity: event.target.value as TrustSafetyRiskFlagSeverity,
                  }))
                }
                className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
              >
                {Object.entries(text.severities).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Input
                value={manualFlag.targetId}
                onChange={(event) =>
                  setManualFlag((current) => ({
                    ...current,
                    targetId: event.target.value,
                  }))
                }
                placeholder={text.targetIdPlaceholder}
                className="h-10 rounded-lg"
              />
            </div>
            <Textarea
              value={manualFlag.reason}
              onChange={(event) =>
                setManualFlag((current) => ({
                  ...current,
                  reason: event.target.value,
                }))
              }
              placeholder={text.reasonPlaceholder}
              rows={3}
            />
            <Button
              className="h-10 justify-self-start rounded-lg"
              disabled={
                manualFlagMutation.isPending ||
                !manualFlag.targetId.trim() ||
                !manualFlag.reason.trim()
              }
              onClick={() => manualFlagMutation.mutate()}
            >
              {text.createFlag}
            </Button>
          </div>
        </QueueCard>

        <QueueCard title={text.pendingCourseReviews} icon={<LuBookOpenCheck />}>
          {queue?.coursesInReview.length ? (
            <div className="grid gap-3">
              {queue.coursesInReview.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border bg-white/80 p-4 dark:bg-white/8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold">{course.title}</h3>
                      <p className="text-muted-foreground text-xs">
                        {course.creatorUser?.name ||
                          course.creatorUser?.email ||
                          text.unknownCreator}
                      </p>
                    </div>
                    <Badge
                      variant={course.safetyHold ? 'destructive' : 'outline'}
                    >
                      {course.safetyHold ? text.onHold : text.inReview}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      nativeButton={false}
                      size="sm"
                      variant="outline"
                      render={<Link to="/admin/courses" />}
                    >
                      {text.openCourseReview}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        courseHoldMutation.mutate({
                          courseId: course.id,
                          held: !course.safetyHold,
                          reason: course.safetyHold
                            ? null
                            : text.manualSafetyHoldReason,
                        })
                      }
                    >
                      {course.safetyHold ? text.removeHold : text.placeHold}
                    </Button>
                  </div>
                  <ReviewDecisionTimeline
                    decisions={course.reviewDecisions || []}
                    dictionary={dictionary}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label={text.emptyCourseReviews} />
          )}
        </QueueCard>
      </section>

      <QueueCard title={text.disabledCreatorList} icon={<LuUserX />}>
        {queue?.disabledCreators.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {queue.disabledCreators.map((creator) => (
              <div
                key={creator.id}
                className="rounded-xl border bg-white/80 p-4 dark:bg-white/8"
              >
                <h3 className="font-extrabold">
                  {creator.displayName ||
                    creator.user?.name ||
                    creator.user?.email ||
                    text.unknownCreator}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {creator.safetyDisabledAt
                    ? formatDateTime(creator.safetyDisabledAt, dictionary)
                    : text.disabled}
                </p>
                {creator.safetyDisabledReason && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {creator.safetyDisabledReason}
                  </p>
                )}
                <Button
                  className="mt-3 h-9 rounded-lg"
                  variant="outline"
                  onClick={() =>
                    creatorMutation.mutate({
                      userId: creator.userId,
                      disabled: false,
                    })
                  }
                >
                  <LuShieldCheck className="size-4" />
                  {text.restoreCreator}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState label={text.emptyDisabledCreators} />
        )}
      </QueueCard>
    </div>
  );
}

function manualFlagPayload(form: ManualFlagForm) {
  const targetFieldByType = {
    creator: 'creatorUserId',
    course: 'courseId',
    report: 'reportId',
    payout: 'payoutId',
    oneOnOneSession: 'oneOnOneSessionId',
  } as const;

  return {
    targetType: form.targetType,
    severity: form.severity,
    reason: form.reason,
    [targetFieldByType[form.targetType]]: form.targetId,
  };
}

function TrustSafetyStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="bg-nexexam-primary/10 text-nexexam-primary grid size-11 place-items-center rounded-xl">
          {icon}
        </span>
        <div>
          <div className="text-2xl font-extrabold">{value}</div>
          <div className="text-muted-foreground text-xs font-semibold">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QueueCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardHeader className="border-nexexam-line flex-row items-center gap-3 border-b p-4">
        <span className="bg-nexexam-primary/10 text-nexexam-primary grid size-10 place-items-center rounded-xl">
          {icon}
        </span>
        <h2 className="font-extrabold">{title}</h2>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

function RiskFlagItem({
  flag,
  locale,
  dictionary,
  notes,
  onNotesChange,
  onStatus,
  onDisableCreator,
  onHoldCourse,
}: {
  flag: TrustSafetyRiskFlag;
  locale: string;
  dictionary: any;
  notes: string;
  onNotesChange: (value: string) => void;
  onStatus: (status: TrustSafetyRiskFlagStatus) => void;
  onDisableCreator: (userId: string) => void;
  onHoldCourse: (courseId: string) => void;
}) {
  const text = dictionary.trustSafety.admin;
  const target = flag.course?.title || flag.creatorUser?.email || flag.id;

  return (
    <div className="rounded-xl border bg-white/80 p-4 dark:bg-white/8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold">{target}</h3>
          <p className="text-muted-foreground text-xs">
            {formatDateTime(flag.createdAt, dictionary)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{text.severities[flag.severity]}</Badge>
          <Badge variant="outline">{text.flagStatuses[flag.status]}</Badge>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold">
        {text.riskReasons[flag.reason] || flag.reason}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {text.sources[flag.source]} / {text.targetTypes[flag.targetType]}
      </p>
      {flag.payout && (
        <p className="text-muted-foreground mt-1 text-xs">
          {new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: flag.payout.currency || 'USD',
          }).format(flag.payout.amount)}
        </p>
      )}
      <Textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder={text.adminNotesPlaceholder}
        className="mt-3"
        rows={2}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatus('reviewing')}
        >
          {text.markReviewing}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatus('resolved')}
        >
          {text.resolve}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatus('dismissed')}
        >
          {text.dismiss}
        </Button>
        {flag.creatorUser?.id && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDisableCreator(flag.creatorUser!.id)}
          >
            {text.disableCreator}
          </Button>
        )}
        {flag.course?.id && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onHoldCourse(flag.course!.id)}
          >
            {text.placeHold}
          </Button>
        )}
      </div>
    </div>
  );
}

function ReportItem({
  report,
  locale,
  dictionary,
  notes,
  priority,
  outcome,
  resolutionSummary,
  onNotesChange,
  onPriorityChange,
  onOutcomeChange,
  onResolutionSummaryChange,
  onStatus,
  onAssignToMe,
  onDisableCreator,
  onHoldCourse,
}: {
  report: TrustSafetyReport;
  locale: string;
  dictionary: any;
  notes: string;
  priority: TrustSafetyReportPriority;
  outcome: TrustSafetyReportOutcomeCategory;
  resolutionSummary: string;
  onNotesChange: (value: string) => void;
  onPriorityChange: (value: TrustSafetyReportPriority) => void;
  onOutcomeChange: (value: TrustSafetyReportOutcomeCategory) => void;
  onResolutionSummaryChange: (value: string) => void;
  onStatus: (status: TrustSafetyReportStatus) => void;
  onAssignToMe: () => void;
  onDisableCreator: (userId: string) => void;
  onHoldCourse: (courseId: string) => void;
}) {
  const text = dictionary.trustSafety.admin;
  const target =
    report.course?.title ||
    report.teacherUser?.email ||
    report.rating?.comment ||
    report.id;

  void locale;

  return (
    <div className="rounded-xl border bg-white/80 p-4 dark:bg-white/8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold">{target}</h3>
          <p className="text-muted-foreground text-xs">
            {formatDateTime(report.createdAt, dictionary)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{text.priorities[priority]}</Badge>
          <Badge variant="outline">{text.reportStatuses[report.status]}</Badge>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold">
        {dictionary.trustSafety.report.reasons[report.reason] || report.reason}
      </p>
      {report.details && (
        <p className="text-muted-foreground mt-1 text-sm">{report.details}</p>
      )}
      <p className="text-muted-foreground mt-2 text-xs">
        {text.reportedBy}:{' '}
        {report.reporterUser?.name ||
          report.reporterUser?.email ||
          text.unknown}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {text.assignedTo}:{' '}
        {report.assignedToUser?.name ||
          report.assignedToUser?.email ||
          text.unassigned}
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <select
          value={priority}
          onChange={(event) =>
            onPriorityChange(event.target.value as TrustSafetyReportPriority)
          }
          className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
        >
          {Object.entries(text.priorities).map(([value, label]) => (
            <option key={value} value={value}>
              {String(label)}
            </option>
          ))}
        </select>
        <select
          value={outcome}
          onChange={(event) =>
            onOutcomeChange(
              event.target.value as TrustSafetyReportOutcomeCategory,
            )
          }
          className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
        >
          {Object.entries(text.outcomeCategories).map(([value, label]) => (
            <option key={value} value={value}>
              {String(label)}
            </option>
          ))}
        </select>
      </div>
      <Textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder={text.adminNotesPlaceholder}
        className="mt-3"
        rows={2}
      />
      <Textarea
        value={resolutionSummary}
        onChange={(event) => onResolutionSummaryChange(event.target.value)}
        placeholder={text.resolutionSummaryPlaceholder}
        className="mt-3"
        rows={2}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onAssignToMe}>
          {text.assignToMe}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatus('underReview')}
        >
          {text.markReviewing}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatus('resolvedActionTaken')}
        >
          {text.resolveActionTaken}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatus('resolvedNoAction')}
        >
          {text.resolveNoAction}
        </Button>
        {report.teacherUser?.id && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDisableCreator(report.teacherUser!.id)}
          >
            {text.disableCreator}
          </Button>
        )}
        {report.course?.id && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onHoldCourse(report.course!.id)}
          >
            {text.placeHold}
          </Button>
        )}
      </div>
    </div>
  );
}

function ReviewDecisionTimeline({
  decisions,
  dictionary,
}: {
  decisions: CourseReviewDecision[];
  dictionary: any;
}) {
  const text = dictionary.trustSafety.admin;

  return (
    <div className="border-nexexam-line mt-4 border-t pt-3">
      <div className="text-muted-foreground text-xs font-bold">
        {text.reviewTimeline}
      </div>
      {decisions.length ? (
        <div className="mt-2 grid gap-2">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="rounded-lg bg-white/70 p-3 text-xs dark:bg-white/8"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold">
                  {text.reviewDecisions[decision.decision] || decision.decision}
                </span>
                <span className="text-muted-foreground">
                  {formatDateTime(decision.reviewedAt, dictionary)}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                {decision.previousStatus} -&gt; {decision.nextStatus}
                {decision.reviewedByUser
                  ? ` / ${
                      decision.reviewedByUser.name ||
                      decision.reviewedByUser.email
                    }`
                  : ''}
              </p>
              {decision.reviewNotes && (
                <p className="mt-1">{decision.reviewNotes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">
          {text.noReviewDecisions}
        </p>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground rounded-xl border border-dashed bg-white/50 p-6 text-center text-sm dark:bg-white/5">
      {label}
    </div>
  );
}
