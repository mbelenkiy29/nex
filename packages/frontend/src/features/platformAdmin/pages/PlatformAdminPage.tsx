import { createLazyRoute, Link } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LuBadgeDollarSign,
  LuBell,
  LuBookOpenCheck,
  LuCalendarDays,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuClock3,
  LuDownload,
  LuEye,
  LuFileText,
  LuFilter,
  LuFlame,
  LuLoader,
  LuMail,
  LuMailPlus,
  LuMegaphone,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSettings,
  LuShield,
  LuShieldCheck,
  LuSlidersHorizontal,
  LuSparkles,
  LuStar,
  LuUserRoundCheck,
  LuUsers,
  LuWallet,
  LuX,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { useAuthStore } from '@/features/auth/authStore';
import { CategoryAdminCard } from '@/features/courseCategory/CategoryAdminCard';
import { CoursePurchasesCard } from '@/features/course/CoursePurchasesCard';
import type {
  PlatformMetrics,
  PlatformMetricsRange,
} from '@/features/platformAdmin/platformMetricsTypes';
import {
  CreatorPayoutCreateInput,
  PlatformPromotionCreateInput,
} from '@project/backend/features/platformAdmin/platformAdminSchemas';

export const platformAdminLazyRoute = createLazyRoute('/admin')({
  component: PlatformAdminPage,
});

type OrganizationOption = {
  id: string;
  name: string;
  slug: string;
};

type TrendPoint = {
  date: string;
  value: number;
};

type Overview = {
  users: number;
  organizations: number;
  students: number;
  activeCreators: number;
  activeSubscriptions: number;
  pendingInvitations: number;
  activePromotions: number;
  pendingPayouts: number;
  unreadNotifications: number;
  totalPayoutAmount: number;
  payoutSummary: Record<string, { count: number; amount: number }>;
  payoutTrend: Array<TrendPoint>;
  roleCounts: Array<{ role: string; count: number }>;
  risk: {
    disabledMembers: number;
    pendingPayouts: number;
    cancelledPayouts: number;
    cancelledPayoutAmount: number;
  };
  recentAuditLogs: Array<{
    id: string;
    timestamp: string;
    entityName: string;
    operation: string;
    authorName: string | null;
    authorEmail: string | null;
  }>;
};

type StudentUser = {
  id: string;
  email: string;
  name: string;
  creatorEarnings: number;
  accessStatus: 'active' | 'disabled';
  primaryRole: 'admin' | 'member';
  members: Array<{
    id: string;
    role: 'admin' | 'member';
    disabled: boolean;
    organization?: OrganizationOption;
  }>;
};

type PlatformPromotion = {
  id: string;
  kind: 'toast' | 'banner' | 'discount';
  title: string;
  message: string;
  ctaLabel?: string | null;
  audience: 'students' | 'admins' | 'all';
  isActive: boolean;
  organization?: OrganizationOption | null;
};

type CreatorPayout = {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  description?: string | null;
  createdAt: string;
  creatorUser?: {
    email: string;
    name: string;
    payoutMethodNote?: string | null;
  } | null;
  creatorMember?: { fullName?: string | null } | null;
  organization?: OrganizationOption | null;
};

const pageSize = 8;

export function PlatformAdminPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const invitationEmailRef = useRef<HTMLInputElement>(null);
  const promotionTitleRef = useRef<HTMLInputElement>(null);
  const payoutCreatorRef = useRef<HTMLInputElement>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [studentPage, setStudentPage] = useState(1);
  const [metricsRange, setMetricsRange] =
    useState<PlatformMetricsRange>('30d');
  const [promotionForm, setPromotionForm] =
    useState<PlatformPromotionCreateInput>({
      kind: 'toast',
      title: '',
      message: '',
      ctaLabel: '',
      ctaHref: '',
      audience: 'students',
      organizationId: null,
      startsAt: null,
      endsAt: null,
      isActive: true,
    });
  const [invitationForm, setInvitationForm] = useState({
    organizationId: '',
    email: '',
    role: 'member',
  });
  const [payoutForm, setPayoutForm] = useState<CreatorPayoutCreateInput>({
    organizationId: null,
    creatorUserId: null,
    creatorMemberId: null,
    amount: 0,
    currency: 'USD',
    description: '',
  });

  const overviewQuery = useQuery({
    queryKey: ['platformAdmin', 'overview'],
    queryFn: async ({ signal }) =>
      apiClient.get('api/platform-admin/overview', { signal }).json<Overview>(),
  });

  const metricsQuery = useQuery({
    queryKey: ['platformAdmin', 'metrics', metricsRange],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/platform-admin/metrics?${objectToQuery({
            range: metricsRange,
          })}`,
          { signal },
        )
        .json<PlatformMetrics>(),
  });

  const organizationsQuery = useQuery({
    queryKey: ['platformAdmin', 'organizations'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/platform-admin/organizations', { signal })
        .json<{ organizations: OrganizationOption[] }>(),
  });

  const studentsQuery = useQuery({
    queryKey: [
      'platformAdmin',
      'students',
      studentSearch,
      roleFilter,
      statusFilter,
      studentPage,
    ],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/platform-admin/students?${objectToQuery({
            filter: {
              search: studentSearch || undefined,
              role: roleFilter === 'all' ? undefined : roleFilter,
              status: statusFilter === 'all' ? undefined : statusFilter,
            },
            skip: (studentPage - 1) * pageSize,
            take: pageSize,
          })}`,
          { signal },
        )
        .json<{ count: number; users: Array<StudentUser> }>(),
  });

  const promotionsQuery = useQuery({
    queryKey: ['platformAdmin', 'promotions'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/platform-admin/promotions', { signal })
        .json<{ count: number; promotions: Array<PlatformPromotion> }>(),
  });

  const payoutsQuery = useQuery({
    queryKey: ['platformAdmin', 'payouts'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/platform-admin/payouts', { signal })
        .json<{ count: number; payouts: Array<CreatorPayout> }>(),
  });

  const invalidateAdminQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
    queryClient.invalidateQueries({ queryKey: ['platformPromotion'] });
  };

  const invitationMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post('api/platform-admin/invitations', { json: invitationForm })
        .json(),
    onSuccess: () => {
      invalidateAdminQueries();
      setInvitationForm({ organizationId: '', email: '', role: 'member' });
      toast.success(dictionary.platformAdmin.success.invitationSent);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const promotionMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post('api/platform-admin/promotions', { json: promotionForm })
        .json(),
    onSuccess: () => {
      invalidateAdminQueries();
      setPromotionForm({
        kind: 'toast',
        title: '',
        message: '',
        ctaLabel: '',
        ctaHref: '',
        audience: 'students',
        organizationId: null,
        startsAt: null,
        endsAt: null,
        isActive: true,
      });
      toast.success(dictionary.platformAdmin.success.promotionCreated);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const promotionStatusMutation = useMutation({
    mutationFn: (promotion: PlatformPromotion) =>
      apiClient
        .put(`api/platform-admin/promotions/${promotion.id}`, {
          json: { isActive: !promotion.isActive },
        })
        .json(),
    onSuccess: invalidateAdminQueries,
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const payoutMutation = useMutation({
    mutationFn: () =>
      apiClient.post('api/platform-admin/payouts', { json: payoutForm }).json(),
    onSuccess: () => {
      invalidateAdminQueries();
      setPayoutForm({
        organizationId: null,
        creatorUserId: null,
        creatorMemberId: null,
        amount: 0,
        currency: 'USD',
        description: '',
      });
      toast.success(dictionary.platformAdmin.success.payoutCreated);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const payoutStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient
        .patch(`api/platform-admin/payouts/${id}/status`, {
          json: { status },
        })
        .json(),
    onSuccess: invalidateAdminQueries,
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const memberStatusMutation = useMutation({
    mutationFn: ({ id, disabled }: { id: string; disabled: boolean }) =>
      apiClient
        .patch(
          `api/platform-admin/members/${id}/${disabled ? 'disable' : 'restore'}`,
        )
        .json(),
    onSuccess: invalidateAdminQueries,
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const overview = overviewQuery.data;
  const organizations = organizationsQuery.data?.organizations || [];
  const students = studentsQuery.data?.users || [];
  const totalStudents = studentsQuery.data?.count || 0;
  const totalStudentPages = Math.max(1, Math.ceil(totalStudents / pageSize));
  const studentRangeStart = totalStudents
    ? (studentPage - 1) * pageSize + 1
    : 0;
  const studentRangeEnd = Math.min(
    (studentPage - 1) * pageSize + students.length,
    totalStudents,
  );
  const promotions = promotionsQuery.data?.promotions || [];
  const payouts = payoutsQuery.data?.payouts || [];
  const firstStudent = students[0];
  const paidPayouts = overview?.payoutSummary.paid || { count: 0, amount: 0 };
  const pendingPayouts = overview?.payoutSummary.pending || {
    count: 0,
    amount: 0,
  };
  const cancelledPayouts = overview?.payoutSummary.cancelled || {
    count: 0,
    amount: 0,
  };

  const dateRange = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    return `${formatDate(start, 'MMM D')} - ${formatDate(today, 'MMM D, YYYY')}`;
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    [locale],
  );
  const studentPageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    const start = Math.max(
      1,
      Math.min(
        studentPage - Math.floor(maxVisiblePages / 2),
        totalStudentPages - maxVisiblePages + 1,
      ),
    );
    const end = Math.min(totalStudentPages, start + maxVisiblePages - 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [studentPage, totalStudentPages]);

  useEffect(() => {
    if (studentPage > totalStudentPages) {
      setStudentPage(totalStudentPages);
    }
  }, [studentPage, totalStudentPages]);

  const updateStudentSearch = (value: string) => {
    setStudentPage(1);
    setStudentSearch(value);
  };

  const updateRoleFilter = (value: string) => {
    setStudentPage(1);
    setRoleFilter(value);
  };

  const updateStatusFilter = (value: string) => {
    setStudentPage(1);
    setStatusFilter(value);
  };

  return (
    <div className="text-nexexam-ink min-h-screen flex-1 bg-transparent p-4 md:p-6">
      <PageHeader items={[[dictionary.platformAdmin.title]]} />

      <div className="mx-auto flex max-w-[1800px] flex-col gap-5">
        <section className="border-nexexam-line rounded-lg border bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="bg-nexexam-soft text-nexexam-muted flex h-12 max-w-2xl flex-1 items-center gap-3 rounded-lg px-4">
              <LuSearch className="h-5 w-5 shrink-0" />
              <Input
                value={studentSearch}
                onChange={(event) => updateStudentSearch(event.target.value)}
                placeholder={dictionary.platformAdmin.placeholders.globalSearch}
                className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <kbd className="text-nexexam-muted hidden rounded-md bg-white px-2 py-1 text-xs font-semibold shadow-sm md:block">
                {dictionary.platformAdmin.dashboard.shortcut}
              </kbd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <IconButton
                label={dictionary.platformAdmin.actions.add}
                onClick={() => invitationEmailRef.current?.focus()}
              >
                <LuPlus />
              </IconButton>
              <IconButton
                label={dictionary.platformAdmin.actions.export}
                onClick={() => exportAdminCsv(students, payouts)}
              >
                <LuDownload />
              </IconButton>
              <IconButton
                label={dictionary.platformAdmin.actions.alerts}
                onClick={() => promotionTitleRef.current?.focus()}
              >
                <LuBell />
              </IconButton>
              <div className="bg-nexexam-soft flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="bg-nexexam-accent text-nexexam-primary grid h-9 w-9 place-items-center rounded-full">
                  <LuShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {dictionary.platformAdmin.dashboard.adminName}
                  </div>
                  <div className="text-nexexam-muted text-xs">
                    {dictionary.platformAdmin.dashboard.adminRole}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-normal md:text-3xl">
              {dictionary.platformAdmin.hero.title}
            </h1>
            <p className="text-nexexam-muted mt-2 text-sm">
              {dictionary.platformAdmin.hero.description}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-nexexam-line h-10 justify-start gap-2 rounded-lg bg-white"
          >
            <LuCalendarDays className="h-4 w-4" />
            {dateRange}
          </Button>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <Button
            nativeButton={false}
            variant="outline"
            className="border-nexexam-soft-blue h-auto justify-between rounded-xl bg-white/90 p-4 text-left"
            render={<Link to="/admin/courses" />}
          >
            <span className="flex items-center gap-3">
              <span className="bg-nexexam-primary/10 text-nexexam-primary grid h-10 w-10 place-items-center rounded-lg">
                <LuBookOpenCheck className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold">
                  {dictionary.course.admin.title}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {dictionary.course.admin.description}
                </span>
              </span>
            </span>
            <LuChevronRight className="h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="border-nexexam-accent h-auto justify-between rounded-xl bg-white/90 p-4 text-left"
            render={<Link to="/admin/creator-applications" />}
          >
            <span className="flex items-center gap-3">
              <span className="bg-nexexam-accent/60 text-nexexam-primary-light grid h-10 w-10 place-items-center rounded-lg">
                <LuUserRoundCheck className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold">
                  {dictionary.creatorApplication.adminTitle}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {dictionary.creatorApplication.adminDescription}
                </span>
              </span>
            </span>
            <LuChevronRight className="h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            className="border-nexexam-soft-blue h-auto justify-between rounded-xl bg-white/90 p-4 text-left"
            render={<Link to="/admin/trust-safety" />}
          >
            <span className="flex items-center gap-3">
              <span className="bg-nexexam-primary/10 text-nexexam-primary grid h-10 w-10 place-items-center rounded-lg">
                <LuShield className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold">
                  {dictionary.trustSafety.admin.title}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {dictionary.trustSafety.admin.description}
                </span>
              </span>
            </span>
            <LuChevronRight className="h-4 w-4" />
          </Button>
        </section>

        <MetricsOverview
          metrics={metricsQuery.data}
          range={metricsRange}
          onRangeChange={setMetricsRange}
          isLoading={metricsQuery.isLoading}
          locale={locale}
          currencyFormatter={currencyFormatter}
          dictionary={dictionary}
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            icon={<LuUsers />}
            label={dictionary.platformAdmin.stats.users}
            value={formatNumber(overview?.users, locale)}
            tone="blue"
            trend={overview?.payoutTrend}
          />
          <MetricCard
            icon={<LuStar />}
            label={dictionary.platformAdmin.stats.activeCreators}
            value={formatNumber(overview?.activeCreators, locale)}
            tone="sky"
            trend={overview?.payoutTrend}
          />
          <MetricCard
            icon={<LuWallet />}
            label={dictionary.platformAdmin.stats.totalPayouts}
            value={currencyFormatter.format(overview?.totalPayoutAmount || 0)}
            tone="pink"
            trend={overview?.payoutTrend}
          />
          <MetricCard
            icon={<LuBadgeDollarSign />}
            label={dictionary.platformAdmin.stats.pendingPayouts}
            value={currencyFormatter.format(pendingPayouts.amount)}
            tone="orange"
            trend={overview?.payoutTrend}
          />
          <MetricCard
            icon={<LuBell />}
            label={dictionary.platformAdmin.stats.unreadNotifications}
            value={formatNumber(overview?.unreadNotifications, locale)}
            tone="purple"
            trend={overview?.payoutTrend}
          />
          <MetricCard
            icon={<LuMailPlus />}
            label={dictionary.platformAdmin.stats.pendingInvitations}
            value={formatNumber(overview?.pendingInvitations, locale)}
            tone="blue"
            trend={overview?.payoutTrend}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
          <Card className="nex-glass-card border-nexexam-line overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="border-nexexam-line flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeading
                title={dictionary.platformAdmin.students.title}
                description={dictionary.platformAdmin.students.description}
              />
              <Button
                className="bg-nexexam-primary hover:bg-nexexam-primary/90 h-9 gap-2 rounded-lg text-white"
                onClick={() => invitationEmailRef.current?.focus()}
              >
                <LuPlus className="h-4 w-4" />
                {dictionary.platformAdmin.actions.addUser}
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-3 grid gap-2 md:grid-cols-[1fr_140px_140px_110px]">
                <div className="relative">
                  <LuSearch className="text-nexexam-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={studentSearch}
                    onChange={(event) =>
                      updateStudentSearch(event.target.value)
                    }
                    placeholder={
                      dictionary.platformAdmin.placeholders.searchStudents
                    }
                    className="border-nexexam-line h-10 rounded-lg pl-9"
                  />
                </div>
                <LabeledSelect
                  label={dictionary.platformAdmin.fields.role}
                  value={roleFilter}
                  onChange={updateRoleFilter}
                  options={[
                    ['all', dictionary.platformAdmin.filters.allRoles],
                    [
                      'member',
                      dictionary.platformAdmin.enumerators.role.member,
                    ],
                    ['admin', dictionary.platformAdmin.enumerators.role.admin],
                  ]}
                  compact
                />
                <LabeledSelect
                  label={dictionary.platformAdmin.fields.accessStatus}
                  value={statusFilter}
                  onChange={updateStatusFilter}
                  options={[
                    ['all', dictionary.platformAdmin.filters.allStatus],
                    [
                      'active',
                      dictionary.platformAdmin.enumerators.accessStatus.active,
                    ],
                    [
                      'disabled',
                      dictionary.platformAdmin.enumerators.accessStatus
                        .disabled,
                    ],
                  ]}
                  compact
                />
                <Button
                  variant="outline"
                  className="border-nexexam-line h-10 gap-2 rounded-lg"
                >
                  <LuSlidersHorizontal className="h-4 w-4" />
                  {dictionary.platformAdmin.actions.filters}
                </Button>
              </div>

              <div className="border-nexexam-line overflow-hidden rounded-lg border">
                <div className="bg-nexexam-soft text-nexexam-muted grid min-w-[760px] grid-cols-[1.55fr_0.75fr_0.8fr_0.85fr_1fr_0.75fr] px-4 py-3 text-xs font-semibold">
                  <div>{dictionary.platformAdmin.table.user}</div>
                  <div>{dictionary.platformAdmin.table.role}</div>
                  <div>{dictionary.platformAdmin.table.access}</div>
                  <div>{dictionary.platformAdmin.table.plan}</div>
                  <div>{dictionary.platformAdmin.table.creatorEarnings}</div>
                  <div>{dictionary.platformAdmin.table.actions}</div>
                </div>
                <div className="overflow-x-auto">
                  <div className="divide-nexexam-line min-w-[760px] divide-y">
                    {studentsQuery.isLoading && (
                      <LoadingRow
                        label={dictionary.platformAdmin.dashboard.loading}
                      />
                    )}
                    {!studentsQuery.isLoading &&
                      students.map((user) => {
                        const primaryMember = user.members[0];

                        return (
                          <div
                            key={user.id}
                            className="grid grid-cols-[1.55fr_0.75fr_0.8fr_0.85fr_1fr_0.75fr] items-center px-4 py-3 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar name={user.name || user.email} />
                              <div className="min-w-0">
                                <div className="truncate font-semibold">
                                  {user.name || user.email}
                                </div>
                                <div className="text-nexexam-muted truncate text-xs">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Badge className="bg-nexexam-primary/10 text-nexexam-primary hover:bg-nexexam-primary/10 rounded-md">
                                {dictionary.platformAdmin.enumerators.role[
                                  user.primaryRole
                                ] || user.primaryRole}
                              </Badge>
                            </div>
                            <div>
                              <StatusBadge status={user.accessStatus} />
                            </div>
                            <div className="text-nexexam-muted">
                              {primaryMember?.organization?.name ||
                                dictionary.platformAdmin.dashboard.manualPlan}
                            </div>
                            <div className="font-semibold">
                              {currencyFormatter.format(user.creatorEarnings)}
                            </div>
                            <div className="flex items-center gap-1">
                              <TableIconButton
                                label={dictionary.platformAdmin.actions.view}
                              >
                                <LuEye />
                              </TableIconButton>
                              {primaryMember && (
                                <TableIconButton
                                  label={
                                    primaryMember.disabled
                                      ? dictionary.platformAdmin.actions.restore
                                      : dictionary.platformAdmin.actions.disable
                                  }
                                  onClick={() =>
                                    memberStatusMutation.mutate({
                                      id: primaryMember.id,
                                      disabled: !primaryMember.disabled,
                                    })
                                  }
                                >
                                  {primaryMember.disabled ? (
                                    <LuCheck />
                                  ) : (
                                    <LuX />
                                  )}
                                </TableIconButton>
                              )}
                              <TableIconButton
                                label={dictionary.platformAdmin.actions.edit}
                              >
                                <LuPencil />
                              </TableIconButton>
                            </div>
                          </div>
                        );
                      })}
                    {!studentsQuery.isLoading && !students.length && (
                      <EmptyRow
                        label={dictionary.platformAdmin.dashboard.emptyUsers}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-nexexam-muted mt-3 flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
                <span>
                  {dictionary.shared.dataTable.paginationRange
                    .replace('{0}', String(studentRangeStart))
                    .replace('{1}', String(studentRangeEnd))
                    .replace('{2}', String(totalStudents))}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-lg p-0"
                    disabled={studentPage <= 1 || studentsQuery.isLoading}
                    aria-label={dictionary.shared.dataTable.goToPreviousPage}
                    onClick={() =>
                      setStudentPage((page) => Math.max(1, page - 1))
                    }
                  >
                    <LuChevronLeft className="h-4 w-4" />
                  </Button>
                  {studentPageNumbers.map((page) => (
                    <Button
                      key={page}
                      variant={page === studentPage ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 w-8 rounded-lg p-0"
                      disabled={studentsQuery.isLoading}
                      onClick={() => setStudentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-lg p-0"
                    disabled={
                      studentPage >= totalStudentPages ||
                      studentsQuery.isLoading
                    }
                    aria-label={dictionary.shared.dataTable.goToNextPage}
                    onClick={() =>
                      setStudentPage((page) =>
                        Math.min(totalStudentPages, page + 1),
                      )
                    }
                  >
                    <LuChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="border-nexexam-line flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
              <SectionHeading
                title={dictionary.platformAdmin.payouts.title}
                description={dictionary.platformAdmin.payouts.description}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-nexexam-line h-9 gap-2 rounded-lg"
                  onClick={() => exportAdminCsv(students, payouts)}
                >
                  <LuDownload className="h-4 w-4" />
                  {dictionary.platformAdmin.actions.export}
                </Button>
                <Button
                  className="bg-nexexam-primary hover:bg-nexexam-primary/90 h-9 gap-2 rounded-lg text-white"
                  onClick={() => payoutCreatorRef.current?.focus()}
                >
                  <LuPlus className="h-4 w-4" />
                  {dictionary.platformAdmin.actions.viewPayouts}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 xl:grid-cols-[0.75fr_1.25fr_0.8fr]">
              <div className="space-y-4">
                <MiniMetric
                  label={dictionary.platformAdmin.payouts.totalMtd}
                  value={currencyFormatter.format(
                    overview?.totalPayoutAmount || 0,
                  )}
                  positive
                />
                <MiniMetric
                  label={dictionary.platformAdmin.payouts.pendingAmount}
                  value={currencyFormatter.format(pendingPayouts.amount)}
                />
                <MiniMetric
                  label={dictionary.platformAdmin.payouts.successfulPayouts}
                  value={formatNumber(paidPayouts.count, locale)}
                  positive
                />
                <MiniMetric
                  label={dictionary.platformAdmin.payouts.cancelledPayouts}
                  value={formatNumber(cancelledPayouts.count, locale)}
                  negative
                />
              </div>
              <div className="border-nexexam-line rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {dictionary.platformAdmin.payouts.trend}
                  </div>
                  <Badge variant="secondary">
                    {dictionary.platformAdmin.dashboard.daily}
                  </Badge>
                </div>
                <LargeSparkline
                  data={overview?.payoutTrend || []}
                  dictionary={dictionary}
                  currencyFormatter={currencyFormatter}
                />
              </div>
              <div className="space-y-4">
                <DistributionBar
                  icon={<LuBadgeDollarSign />}
                  label={dictionary.platformAdmin.enumerators.status.paid}
                  value={paidPayouts.count}
                  total={payoutsQuery.data?.count || 1}
                />
                <DistributionBar
                  icon={<LuClock3 />}
                  label={dictionary.platformAdmin.enumerators.status.pending}
                  value={pendingPayouts.count}
                  total={payoutsQuery.data?.count || 1}
                />
                <DistributionBar
                  icon={<LuCircleAlert />}
                  label={dictionary.platformAdmin.enumerators.status.cancelled}
                  value={cancelledPayouts.count}
                  total={payoutsQuery.data?.count || 1}
                />
              </div>

              <div className="xl:col-span-3">
                <div className="mb-2 text-sm font-semibold">
                  {dictionary.platformAdmin.payouts.pendingQueue}
                </div>
                <div className="grid gap-2">
                  {payouts.slice(0, 3).map((payout) => (
                    <div
                      key={payout.id}
                      className="bg-nexexam-soft grid gap-2 rounded-lg px-3 py-2 text-sm md:grid-cols-[1fr_0.8fr_0.7fr_auto]"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold">
                          {payout.creatorUser?.name ||
                            payout.creatorMember?.fullName ||
                            payout.creatorUser?.email ||
                            dictionary.platformAdmin.payouts.unassigned}
                        </div>
                        <div className="text-nexexam-muted truncate text-xs">
                          {payout.organization?.name ||
                            dictionary.platformAdmin.dashboard.platformWide}
                        </div>
                        {payout.creatorUser?.payoutMethodNote ? (
                          <div className="text-nexexam-muted mt-0.5 truncate text-xs">
                            ↳ {payout.creatorUser.payoutMethodNote}
                          </div>
                        ) : null}
                      </div>
                      <div>{currencyFormatter.format(payout.amount)}</div>
                      <StatusBadge status={payout.status} />
                      {payout.status === 'pending' && (
                        <div className="flex gap-1">
                          <TableIconButton
                            label={dictionary.platformAdmin.actions.markPaid}
                            onClick={() =>
                              payoutStatusMutation.mutate({
                                id: payout.id,
                                status: 'paid',
                              })
                            }
                          >
                            <LuCheck />
                          </TableIconButton>
                          <TableIconButton
                            label={dictionary.platformAdmin.actions.cancel}
                            onClick={() =>
                              payoutStatusMutation.mutate({
                                id: payout.id,
                                status: 'cancelled',
                              })
                            }
                          >
                            <LuX />
                          </TableIconButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_0.6fr_0.9fr_0.9fr]">
          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="flex-row items-center justify-between p-4">
              <SectionHeading
                title={dictionary.platformAdmin.promotions.title}
                description={dictionary.platformAdmin.promotions.description}
              />
              <LuSettings className="text-nexexam-muted h-5 w-5" />
            </CardHeader>
            <CardContent className="grid gap-4 p-4 pt-0 lg:grid-cols-[1fr_0.9fr]">
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  promotionMutation.mutate();
                }}
              >
                <div className="grid gap-2 md:grid-cols-2">
                  <LabeledSelect
                    label={dictionary.platformAdmin.fields.kind}
                    value={promotionForm.kind}
                    onChange={(value) =>
                      setPromotionForm((current) => ({
                        ...current,
                        kind: value as PlatformPromotionCreateInput['kind'],
                      }))
                    }
                    options={[
                      [
                        'toast',
                        dictionary.platformAdmin.enumerators.kind.toast,
                      ],
                      [
                        'banner',
                        dictionary.platformAdmin.enumerators.kind.banner,
                      ],
                      [
                        'discount',
                        dictionary.platformAdmin.enumerators.kind.discount,
                      ],
                    ]}
                  />
                  <LabeledSelect
                    label={dictionary.platformAdmin.fields.audience}
                    value={promotionForm.audience}
                    onChange={(value) =>
                      setPromotionForm((current) => ({
                        ...current,
                        audience:
                          value as PlatformPromotionCreateInput['audience'],
                      }))
                    }
                    options={[
                      [
                        'students',
                        dictionary.platformAdmin.enumerators.audience.students,
                      ],
                      [
                        'admins',
                        dictionary.platformAdmin.enumerators.audience.admins,
                      ],
                      [
                        'all',
                        dictionary.platformAdmin.enumerators.audience.all,
                      ],
                    ]}
                  />
                </div>
                <Input
                  ref={promotionTitleRef}
                  value={promotionForm.title}
                  onChange={(event) =>
                    setPromotionForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder={dictionary.platformAdmin.placeholders.title}
                  required
                />
                <Textarea
                  value={promotionForm.message}
                  onChange={(event) =>
                    setPromotionForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  placeholder={dictionary.platformAdmin.placeholders.message}
                  required
                />
                <Button
                  className="bg-nexexam-primary hover:bg-nexexam-primary/90 h-10 rounded-lg text-white"
                  disabled={promotionMutation.isPending}
                >
                  {promotionMutation.isPending && (
                    <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {dictionary.platformAdmin.actions.createPromotion}
                </Button>
              </form>

              <div className="space-y-2">
                {promotions.slice(0, 4).map((promotion) => (
                  <div
                    key={promotion.id}
                    className="border-nexexam-line bg-nexexam-soft rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {promotion.title}
                        </div>
                        <div className="text-nexexam-muted line-clamp-2 text-xs">
                          {promotion.message}
                        </div>
                      </div>
                      <Switch
                        checked={promotion.isActive}
                        onCheckedChange={() =>
                          promotionStatusMutation.mutate(promotion)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="p-4">
              <SectionHeading
                title={dictionary.platformAdmin.roles.title}
                description={dictionary.platformAdmin.roles.description}
              />
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              {(overview?.roleCounts || []).map((roleCount) => (
                <RoleRow
                  key={roleCount.role}
                  icon={
                    roleCount.role === 'admin' ? (
                      <LuShield />
                    ) : (
                      <LuUserRoundCheck />
                    )
                  }
                  label={
                    dictionary.platformAdmin.enumerators.role[
                      roleCount.role as 'admin' | 'member'
                    ] || roleCount.role
                  }
                  description={
                    roleCount.role === 'admin'
                      ? dictionary.platformAdmin.roles.adminDescription
                      : dictionary.platformAdmin.roles.memberDescription
                  }
                  count={roleCount.count}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="flex-row items-center justify-between p-4">
              <SectionHeading
                title={dictionary.platformAdmin.activity.title}
                description={dictionary.platformAdmin.activity.description}
              />
              <Button
                variant="link"
                className="text-nexexam-primary h-auto p-0"
              >
                {dictionary.platformAdmin.actions.viewAll}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              {(overview?.recentAuditLogs || []).map((auditLog) => (
                <div
                  key={auditLog.id}
                  className="grid grid-cols-[36px_1fr_auto] items-start gap-3"
                >
                  <div className="bg-nexexam-primary/10 text-nexexam-primary grid h-9 w-9 place-items-center rounded-lg">
                    <LuClock3 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {auditLog.authorName ||
                        dictionary.platformAdmin.activity.system}
                    </div>
                    <div className="text-nexexam-muted truncate text-xs">
                      {dictionary.platformAdmin.activity.auditLine
                        .replace('{0}', auditLog.operation)
                        .replace('{1}', auditLog.entityName)}
                    </div>
                  </div>
                  <div className="text-nexexam-muted text-right text-xs">
                    {formatDateTime(auditLog.timestamp, dictionary)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="p-4">
              <SectionHeading
                title={dictionary.platformAdmin.risk.title}
                description={dictionary.platformAdmin.risk.description}
              />
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
              <RiskMetric
                label={dictionary.platformAdmin.risk.disabledMembers}
                value={formatNumber(overview?.risk.disabledMembers, locale)}
                negative
              />
              <RiskMetric
                label={dictionary.platformAdmin.risk.pendingPayouts}
                value={formatNumber(overview?.risk.pendingPayouts, locale)}
                negative
              />
              <RiskMetric
                label={dictionary.platformAdmin.risk.cancelledAmount}
                value={currencyFormatter.format(
                  overview?.risk.cancelledPayoutAmount || 0,
                )}
                negative
              />
              <DistributionBar
                label={dictionary.platformAdmin.risk.pendingPayouts}
                value={overview?.risk.pendingPayouts || 0}
                total={(payoutsQuery.data?.count || 0) + 1}
              />
              <DistributionBar
                label={dictionary.platformAdmin.risk.disabledMembers}
                value={overview?.risk.disabledMembers || 0}
                total={(overview?.users || 0) + 1}
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="p-4">
              <SectionHeading
                title={dictionary.platformAdmin.invitation.title}
                description={dictionary.platformAdmin.invitation.description}
              />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form
                className="grid gap-3 md:grid-cols-[1fr_1fr_130px_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  invitationMutation.mutate();
                }}
              >
                <label className="text-nexexam-ink grid gap-1 text-sm font-medium">
                  {dictionary.platformAdmin.fields.organization}
                  <select
                    className="border-nexexam-line h-10 rounded-lg border bg-white px-3 text-sm"
                    value={invitationForm.organizationId}
                    onChange={(event) =>
                      setInvitationForm((current) => ({
                        ...current,
                        organizationId: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">
                      {dictionary.platformAdmin.placeholders.organization}
                    </option>
                    {organizations.map((organization) => (
                      <option key={organization.id} value={organization.id}>
                        {organization.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-nexexam-ink grid gap-1 text-sm font-medium">
                  {dictionary.platformAdmin.fields.email}
                  <Input
                    name="platform-admin-invite-email"
                    ref={invitationEmailRef}
                    type="email"
                    value={invitationForm.email}
                    onChange={(event) =>
                      setInvitationForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder={dictionary.platformAdmin.placeholders.email}
                    required
                    className="border-nexexam-line h-10 rounded-lg"
                  />
                </label>
                <LabeledSelect
                  label={dictionary.platformAdmin.fields.role}
                  value={invitationForm.role}
                  onChange={(value) =>
                    setInvitationForm((current) => ({
                      ...current,
                      role: value,
                    }))
                  }
                  options={[
                    [
                      'member',
                      dictionary.platformAdmin.enumerators.role.member,
                    ],
                    ['admin', dictionary.platformAdmin.enumerators.role.admin],
                  ]}
                />
                <Button
                  disabled={invitationMutation.isPending}
                  className="bg-nexexam-primary hover:bg-nexexam-primary/90 mt-6 h-10 rounded-lg text-white"
                >
                  {invitationMutation.isPending && (
                    <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {dictionary.platformAdmin.actions.sendInvitation}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <CardHeader className="p-4">
              <SectionHeading
                title={dictionary.platformAdmin.payouts.createTitle}
                description={dictionary.platformAdmin.payouts.createDescription}
              />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form
                className="grid gap-3 md:grid-cols-[1fr_150px_1.2fr_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  payoutMutation.mutate();
                }}
              >
                <label className="text-nexexam-ink grid gap-1 text-sm font-medium">
                  {dictionary.platformAdmin.fields.creatorUserId}
                  <Input
                    data-testid="admin-payout-creator-input"
                    ref={payoutCreatorRef}
                    value={payoutForm.creatorUserId || ''}
                    onChange={(event) =>
                      setPayoutForm((current) => ({
                        ...current,
                        creatorUserId: event.target.value || null,
                      }))
                    }
                    placeholder={
                      firstStudent?.id ||
                      dictionary.platformAdmin.placeholders.creatorUserId
                    }
                    className="border-nexexam-line h-10 rounded-lg"
                  />
                </label>
                <label className="text-nexexam-ink grid gap-1 text-sm font-medium">
                  {dictionary.platformAdmin.fields.amount}
                  <Input
                    data-testid="admin-payout-amount-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      typeof payoutForm.amount === 'number'
                        ? payoutForm.amount
                        : ''
                    }
                    onChange={(event) =>
                      setPayoutForm((current) => ({
                        ...current,
                        amount: Number(event.target.value),
                      }))
                    }
                    required
                    className="border-nexexam-line h-10 rounded-lg"
                  />
                </label>
                <label className="text-nexexam-ink grid gap-1 text-sm font-medium">
                  {dictionary.platformAdmin.fields.description}
                  <Input
                    data-testid="admin-payout-description-input"
                    value={payoutForm.description || ''}
                    onChange={(event) =>
                      setPayoutForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder={
                      dictionary.platformAdmin.placeholders.description
                    }
                    className="border-nexexam-line h-10 rounded-lg"
                  />
                </label>
                <Button
                  data-testid="admin-payout-create-button"
                  disabled={payoutMutation.isPending}
                  className="bg-nexexam-primary hover:bg-nexexam-primary/90 mt-6 h-10 rounded-lg text-white"
                >
                  {payoutMutation.isPending && (
                    <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {dictionary.platformAdmin.actions.createPayout}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Course categories — curated marketplace taxonomy. Lives below
            the payouts section because category curation is a low-frequency
            housekeeping task, not a daily moderation surface. */}
        <section>
          <CategoryAdminCard />
        </section>

        {/* Course one-time purchases + admin "Mark refunded" workflow. */}
        <section>
          <CoursePurchasesCard />
        </section>
      </div>
    </div>
  );
}

function MetricsOverview({
  metrics,
  range,
  onRangeChange,
  isLoading,
  locale,
  currencyFormatter,
  dictionary,
}: {
  metrics?: PlatformMetrics;
  range: PlatformMetricsRange;
  onRangeChange: (range: PlatformMetricsRange) => void;
  isLoading: boolean;
  locale: string | undefined;
  currencyFormatter: Intl.NumberFormat;
  dictionary: any;
}) {
  const summary = metrics?.summary;
  const revenueTrend =
    metrics?.trends.revenueCents.map((point) => ({
      ...point,
      value: point.value / 100,
    })) || [];

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <CardHeader className="border-nexexam-line flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            title={dictionary.platformAdmin.metrics.title}
            description={dictionary.platformAdmin.metrics.description}
          />
          <div className="w-full md:w-44">
            <LabeledSelect
              label={dictionary.platformAdmin.metrics.range}
              value={range}
              onChange={(value) =>
                onRangeChange(value as PlatformMetricsRange)
              }
              options={[
                ['7d', dictionary.platformAdmin.metrics.ranges['7d']],
                ['30d', dictionary.platformAdmin.metrics.ranges['30d']],
                ['90d', dictionary.platformAdmin.metrics.ranges['90d']],
                ['12m', dictionary.platformAdmin.metrics.ranges['12m']],
              ]}
              compact
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {isLoading && (
            <div className="text-nexexam-muted rounded-lg border border-dashed p-6 text-center text-sm">
              {dictionary.platformAdmin.metrics.loading}
            </div>
          )}
          {!isLoading && (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                icon={<LuUsers />}
                label={dictionary.platformAdmin.metrics.signups}
                value={formatNumber(summary?.signups, locale)}
                tone="blue"
                trend={metrics?.trends.signups}
              />
              <MetricCard
                icon={<LuBookOpenCheck />}
                label={dictionary.platformAdmin.metrics.courseEnrollments}
                value={formatNumber(summary?.courseEnrollments, locale)}
                tone="sky"
                trend={metrics?.trends.enrollments}
              />
              <MetricCard
                icon={<LuCheck />}
                label={dictionary.platformAdmin.metrics.lessonCompletion}
                value={formatPercent(summary?.lessonCompletionRate)}
                tone="purple"
                trend={metrics?.trends.lessonCompletions}
              />
              <MetricCard
                icon={<LuFileText />}
                label={dictionary.platformAdmin.metrics.homeworkCompletion}
                value={formatPercent(summary?.homeworkCompletionRate)}
                tone="orange"
                trend={metrics?.trends.homeworkCompletions}
              />
              <MetricCard
                icon={<LuSparkles />}
                label={dictionary.platformAdmin.metrics.aiUsage}
                value={formatCompactNumber(summary?.aiTokens || 0, locale)}
                tone="purple"
                trend={metrics?.trends.aiTokens}
              />
              <MetricCard
                icon={<LuWallet />}
                label={dictionary.platformAdmin.metrics.monthlyRevenue}
                value={currencyFormatter.format(
                  (summary?.monthlyRevenueCents || 0) / 100,
                )}
                tone="pink"
                trend={revenueTrend}
              />
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-3">
            <MiniMetric
              label={dictionary.platformAdmin.metrics.quizScores}
              value={formatPercent(summary?.averageQuizScore)}
              positive
            />
            <MiniMetric
              label={dictionary.platformAdmin.metrics.refundRate}
              value={formatPercent(summary?.refundRate)}
              negative={(summary?.refundRate || 0) > 0}
            />
            <MiniMetric
              label={dictionary.platformAdmin.metrics.studentRetention}
              value={formatPercent(summary?.studentRetentionRate)}
              positive
            />
          </div>
        </CardContent>
      </Card>

      <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <CardHeader className="border-nexexam-line border-b p-4">
          <SectionHeading
            title={dictionary.platformAdmin.metrics.topCourses}
            description={dictionary.platformAdmin.metrics.topCoursesBody}
          />
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <MiniMetric
              label={dictionary.platformAdmin.metrics.creatorEarnings}
              value={currencyFormatter.format(summary?.creatorEarnings || 0)}
              positive
            />
            <MiniMetric
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
          </div>
          <div className="border-nexexam-line overflow-hidden rounded-lg border">
            <div className="bg-nexexam-soft text-nexexam-muted grid min-w-[680px] grid-cols-[1.35fr_0.55fr_0.6fr_0.65fr_0.55fr_0.7fr] px-3 py-2 text-xs font-semibold">
              <div>{dictionary.platformAdmin.metrics.course}</div>
              <div>{dictionary.platformAdmin.metrics.enrollments}</div>
              <div>{dictionary.platformAdmin.metrics.homework}</div>
              <div>{dictionary.platformAdmin.metrics.quiz}</div>
              <div>{dictionary.platformAdmin.metrics.rating}</div>
              <div>{dictionary.platformAdmin.metrics.revenue}</div>
            </div>
            <div className="overflow-x-auto">
              <div className="divide-nexexam-line min-w-[680px] divide-y">
                {(metrics?.topCourses || []).map((course) => (
                  <div
                    key={course.courseId}
                    className="grid grid-cols-[1.35fr_0.55fr_0.6fr_0.65fr_0.55fr_0.7fr] items-center px-3 py-2 text-sm"
                  >
                    <div className="truncate font-semibold">
                      {course.title}
                    </div>
                    <div>{formatNumber(course.enrollments, locale)}</div>
                    <div>{formatPercent(course.homeworkCompletionRate)}</div>
                    <div>{formatPercent(course.averageQuizScore)}</div>
                    <div>{formatRating(course.averageRating, locale)}</div>
                    <div>
                      {currencyFormatter.format(course.revenueCents / 100)}
                    </div>
                  </div>
                ))}
                {!metrics?.topCourses.length && (
                  <EmptyRow label={dictionary.platformAdmin.metrics.empty} />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'blue' | 'sky' | 'pink' | 'orange' | 'purple';
  trend?: Array<TrendPoint>;
}) {
  const toneClass = {
    blue: 'bg-nexexam-primary/10 text-nexexam-primary',
    sky: 'bg-nexexam-soft-blue text-nexexam-secondary',
    pink: 'bg-nexexam-accent/60 text-nexexam-primary-light',
    orange: 'bg-nexexam-warning/10 text-nexexam-warning',
    purple: 'bg-nexexam-accent/60 text-nexexam-primary-light',
  }[tone];

  return (
    <Card className="nex-glass-card border-nexexam-line rounded-2xl shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`grid h-11 w-11 place-items-center rounded-lg ${toneClass} [&_svg]:h-5 [&_svg]:w-5`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-nexexam-muted truncate text-xs font-semibold">
              {label}
            </div>
            <div className="text-2xl font-bold tracking-normal">{value}</div>
          </div>
        </div>
        <Sparkline data={trend || []} />
      </CardContent>
    </Card>
  );
}

function Sparkline({ data }: { data: Array<TrendPoint> }) {
  const values = data.map((point) => point.value);
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 28 - (value / max) * 22;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 32" className="h-9 w-full overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-nexexam-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,32 ${points} 100,32`}
        fill="currentColor"
        className="text-nexexam-primary/10"
      />
    </svg>
  );
}

function LargeSparkline({
  data,
  dictionary,
  currencyFormatter,
}: {
  data: Array<TrendPoint>;
  dictionary: any;
  currencyFormatter: Intl.NumberFormat;
}) {
  const values = data.map((point) => point.value);
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 70 - (value / max) * 58;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div>
      <svg viewBox="0 0 100 78" className="h-40 w-full">
        <defs>
          <linearGradient id="adminPayoutTrend" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--nexexam-primary)"
              stopOpacity="0.28"
            />
            <stop
              offset="100%"
              stopColor="var(--nexexam-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <polyline
          points={`0,78 ${points} 100,78`}
          fill="url(#adminPayoutTrend)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="var(--nexexam-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-nexexam-muted grid grid-cols-7 gap-1 text-center text-[10px]">
        {data.map((point) => (
          <div key={point.date}>
            <div>{formatDate(point.date, 'MMM D')}</div>
            <div className="text-nexexam-ink font-semibold">
              {point.value
                ? currencyFormatter.format(point.value)
                : dictionary.platformAdmin.dashboard.noValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-nexexam-ink text-base font-bold tracking-normal">
        {title}
      </h2>
      <p className="text-nexexam-muted mt-1 text-xs">{description}</p>
    </div>
  );
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
  compact,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  compact?: boolean;
}) {
  return (
    <label className="text-nexexam-ink grid gap-1 text-sm font-medium">
      {!compact && label}
      <select
        aria-label={label}
        className="border-nexexam-line h-10 rounded-lg border bg-white px-3 text-sm"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="border-nexexam-line text-nexexam-primary h-10 w-10 rounded-lg bg-white"
    >
      {children}
    </Button>
  );
}

function TableIconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="border-nexexam-line text-nexexam-muted h-8 w-8 rounded-md bg-white [&_svg]:h-3.5 [&_svg]:w-3.5"
    >
      {children}
    </Button>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="text-nexexam-primary grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--nexexam-accent),var(--nexexam-soft-blue))] text-xs font-bold">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const dictionary = useAuthStore.getState().dictionary;
  const label =
    dictionary.platformAdmin.enumerators.accessStatus?.[
      status as 'active' | 'disabled'
    ] ||
    dictionary.platformAdmin.enumerators.status?.[
      status as 'pending' | 'paid' | 'cancelled'
    ] ||
    status;
  const active = status === 'active' || status === 'paid';
  const warning = status === 'pending';

  return (
    <Badge
      className={
        active
          ? 'bg-nexexam-success/10 text-nexexam-success hover:bg-nexexam-success/10 rounded-md'
          : warning
            ? 'bg-nexexam-warning/10 text-nexexam-warning hover:bg-nexexam-warning/10 rounded-md'
            : 'bg-nexexam-danger/10 text-nexexam-danger hover:bg-nexexam-danger/10 rounded-md'
      }
    >
      {label}
    </Badge>
  );
}

function MiniMetric({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div>
      <div className="text-nexexam-muted text-xs font-semibold">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-xl font-bold">
        {value}
        {positive && <LuCheck className="text-nexexam-success h-4 w-4" />}
        {negative && <LuCircleAlert className="text-nexexam-danger h-4 w-4" />}
      </div>
    </div>
  );
}

function DistributionBar({
  icon,
  label,
  value,
  total,
}: {
  icon?: ReactNode;
  label: string;
  value: number;
  total: number;
}) {
  const percent = Math.min(100, Math.round((value / Math.max(total, 1)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="text-nexexam-ink flex items-center gap-2 font-semibold">
          {icon && <span className="text-nexexam-primary">{icon}</span>}
          {label}
        </div>
        <span className="text-nexexam-muted">{percent}%</span>
      </div>
      <Progress value={percent} className="bg-nexexam-line h-2" />
    </div>
  );
}

function RoleRow({
  icon,
  label,
  description,
  count,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  count: number;
}) {
  return (
    <div className="bg-nexexam-soft grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-lg p-3">
      <div className="bg-nexexam-primary/10 text-nexexam-primary grid h-10 w-10 place-items-center rounded-lg">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-nexexam-muted truncate text-xs">
          {description}
        </div>
      </div>
      <div className="font-bold">{count}</div>
    </div>
  );
}

function RiskMetric({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-nexexam-muted text-xs font-semibold">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
      {negative && <LuFlame className="text-nexexam-danger h-5 w-5" />}
    </div>
  );
}

function LoadingRow({ label }: { label: string }) {
  return (
    <div className="text-nexexam-muted px-4 py-8 text-center text-sm">
      {label}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="text-nexexam-muted px-4 py-8 text-center text-sm">
      {label}
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

function exportAdminCsv(
  students: Array<StudentUser>,
  payouts: Array<CreatorPayout>,
) {
  const escape = (value: unknown) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['type', 'name', 'email', 'status', 'amount', 'currency'].map(escape),
    ...students.map((student) =>
      [
        'user',
        student.name || student.email,
        student.email,
        student.accessStatus,
        student.creatorEarnings,
        'USD',
      ].map(escape),
    ),
    ...payouts.map((payout) =>
      [
        'payout',
        payout.creatorUser?.name || payout.creatorUser?.email || '',
        payout.creatorUser?.email || '',
        payout.status,
        payout.amount,
        payout.currency,
      ].map(escape),
    ),
  ];
  const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nexexam-platform-admin.csv';
  link.click();
  URL.revokeObjectURL(url);
}
