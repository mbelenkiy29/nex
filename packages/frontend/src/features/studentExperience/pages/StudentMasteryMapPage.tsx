import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, Link } from '@tanstack/react-router';
import {
  LuArrowRight,
  LuAward,
  LuBadgeCheck,
  LuBookOpenCheck,
  LuCalendarCheck,
  LuCircleCheck,
  LuCircleDot,
  LuFlame,
  LuLock,
  LuMap,
  LuMinus,
  LuRoute,
  LuShieldCheck,
  LuSparkles,
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
} from 'react-icons/lu';
import type { ReactNode } from 'react';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { ContextualPaywall } from '@/features/pricing/ContextualPaywall';
import { apiClient } from '@/shared/lib/apiClient';
import { cn } from '@/shared/lib/utils';
import type { Dictionary } from '@/features/auth/authStore';
import type { StudentMasteryMapResponse } from '../studentExperienceTypes';

export const studentMasteryMapLazyRoute = createLazyRoute(
  '/student/mastery-map',
)({
  component: StudentMasteryMapPage,
});

export function StudentMasteryMapPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const config = useAuthStore((state) => state.config);
  const masteryMapQuery = useQuery({
    queryKey: ['studentExperience', 'masteryMap'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/student/mastery-map', { signal })
        .json<StudentMasteryMapResponse>(),
  });
  const masteryMap = masteryMapQuery.data;

  if (masteryMapQuery.isLoading || !masteryMap) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const t = dictionary.studentExperience.masteryMap;
  const canSubscribe = config?.subscriptionMode !== 'disabled';

  if (!masteryMap.summary.enrolledCourses) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
        <section className="nex-glass-card nex-gradient-hero rounded-3xl p-7 lg:p-9">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
            <LuMap className="size-3.5" />
            {t.badge}
          </Badge>
          <h1 className="text-nexexam-ink mt-4 text-4xl font-extrabold tracking-normal dark:text-white">
            {t.title}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
            {t.emptyBody}
          </p>
          <Button
            nativeButton={false}
            render={<Link to="/course" />}
            className="mt-6 h-11 rounded-xl"
          >
            <LuBookOpenCheck className="size-4" />
            {t.browseCourses}
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="nex-glass-card nex-gradient-hero overflow-hidden rounded-3xl p-7 lg:p-9">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
                <LuMap className="size-3.5" />
                {t.badge}
              </Badge>
              <h1 className="text-nexexam-ink mt-4 text-4xl font-extrabold tracking-normal dark:text-white">
                {t.title}
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
                {t.body}
              </p>
            </div>
            <div className="min-w-48 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10">
              <div className="text-muted-foreground text-xs font-semibold tracking-normal">
                {t.readinessScore}
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-nexexam-ink text-5xl font-extrabold dark:text-white">
                  {masteryMap.summary.readinessScore}
                </span>
                <span className="text-muted-foreground pb-2 text-sm">
                  {t.points}
                </span>
              </div>
              <TrendBadge
                direction={masteryMap.summary.readinessDirection}
                delta={masteryMap.summary.readinessDelta}
                dictionary={dictionary}
              />
            </div>
          </div>
        </div>

        <NextMilestoneCard masteryMap={masteryMap} dictionary={dictionary} />
      </section>

      {masteryMap.access.premiumLocked && canSubscribe && (
        <PremiumProgressBanner dictionary={dictionary} />
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MasteryMetric
          icon={<LuTarget className="size-5" />}
          label={t.metrics.weakSkills}
          value={String(masteryMap.summary.weakSkills)}
          helper={t.metrics.weakSkillsHelper}
        />
        <MasteryMetric
          icon={<LuRoute className="size-5" />}
          label={t.metrics.unlockedModules}
          value={dictionaryFormat(
            t.unlockedModulesValue,
            masteryMap.summary.unlockedModules,
            masteryMap.summary.totalModules,
          )}
          helper={t.metrics.unlockedModulesHelper}
        />
        <MasteryMetric
          icon={<LuAward className="size-5" />}
          label={t.metrics.certificates}
          value={dictionaryFormat(
            t.certificatesValue,
            masteryMap.summary.certificatesEarned,
            masteryMap.summary.certificatesAvailable,
          )}
          helper={t.metrics.certificatesHelper}
        />
        <MasteryMetric
          icon={<LuFlame className="size-5" />}
          label={t.metrics.streak}
          value={dictionaryFormat(
            t.streakValue,
            masteryMap.summary.currentStreak,
          )}
          helper={dictionaryFormat(
            t.metrics.streakHelper,
            masteryMap.summary.longestStreak,
          )}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <ReadinessTrendPanel
            masteryMap={masteryMap}
            dictionary={dictionary}
          />
          <WeakSkillsPanel masteryMap={masteryMap} dictionary={dictionary} />
          <UnlockedModulesPanel
            masteryMap={masteryMap}
            dictionary={dictionary}
          />
        </div>
        <div className="space-y-5">
          <MilestonesPanel masteryMap={masteryMap} dictionary={dictionary} />
          <StreakPanel masteryMap={masteryMap} dictionary={dictionary} />
          <CertificatesPanel
            masteryMap={masteryMap}
            dictionary={dictionary}
            showPremiumCta={masteryMap.access.premiumLocked && canSubscribe}
          />
        </div>
      </section>
    </div>
  );
}

function TrendBadge({
  direction,
  delta,
  dictionary,
}: {
  direction: string;
  delta: number;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap.trend;
  const labels = t.direction as Record<string, string>;
  const Icon =
    direction === 'up'
      ? LuTrendingUp
      : direction === 'down'
        ? LuTrendingDown
        : LuMinus;

  return (
    <div className="bg-primary/10 text-primary mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold">
      <Icon className="size-3.5" />
      {labels[direction] || labels.none}
      {direction !== 'none' && (
        <span>{dictionaryFormat(t.delta, Math.abs(delta))}</span>
      )}
    </div>
  );
}

function NextMilestoneCard({
  masteryMap,
  dictionary,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap;
  const milestone = masteryMap.summary.nextMilestone;
  const labels = t.milestoneLabels as Record<string, string>;
  const progress = Math.min(
    100,
    milestone.threshold
      ? Math.round(
          (masteryMap.summary.readinessScore / milestone.threshold) * 100,
        )
      : 100,
  );

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-xl">
              <LuCalendarCheck className="size-3.5" />
              {t.nextMilestone}
            </Badge>
            <h2 className="mt-3 text-xl font-extrabold">
              {labels[milestone.key] || labels.mastered}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {dictionaryFormat(t.milestoneTarget, milestone.threshold)}
            </p>
          </div>
          <div className="bg-primary/10 text-primary grid size-12 shrink-0 place-items-center rounded-2xl">
            <LuShieldCheck className="size-5" />
          </div>
        </div>
        <Progress value={progress} className="mt-5 h-2" />
        <p className="text-muted-foreground mt-3 text-sm">
          {dictionaryFormat(t.milestoneProgress, progress)}
        </p>
      </CardContent>
    </Card>
  );
}

function PremiumProgressBanner({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.studentExperience.masteryMap.premium;

  return (
    <section className="border-primary/20 bg-primary/8 dark:bg-primary/15 rounded-2xl border p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
            <LuLock className="size-5" />
          </div>
          <div>
            <h2 className="font-extrabold">{t.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{t.body}</p>
          </div>
        </div>
        <Button
          nativeButton={false}
          render={<Link to="/subscription" />}
          className="h-10 rounded-xl"
        >
          <LuSparkles className="size-4" />
          {t.cta}
        </Button>
      </div>
    </section>
  );
}

function MasteryMetric({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <div className="text-primary bg-primary/10 grid size-11 place-items-center rounded-xl">
          {icon}
        </div>
        <div className="mt-4 text-2xl font-extrabold">{value}</div>
        <div className="mt-1 font-bold">{label}</div>
        <p className="text-muted-foreground mt-1 text-sm">{helper}</p>
      </CardContent>
    </Card>
  );
}

function ReadinessTrendPanel({
  masteryMap,
  dictionary,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap.trend;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <PanelHeader
          icon={<LuTrendingUp className="size-4" />}
          title={t.title}
          body={t.body}
        />
        <div className="mt-5 h-52 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
          <Sparkline
            points={masteryMap.readinessTrend.points}
            label={t.chartLabel}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Sparkline({
  points,
  label,
}: {
  points: StudentMasteryMapResponse['readinessTrend']['points'];
  label: string;
}) {
  if (!points.length) {
    return (
      <div className="text-muted-foreground grid h-full place-items-center text-sm">
        {label}
      </div>
    );
  }

  const width = 640;
  const height = 180;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coordinates = points.map((point, index) => {
    const x = points.length > 1 ? index * step : width / 2;
    const y = height - (Math.max(0, Math.min(100, point.score)) / 100) * height;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="h-full w-full overflow-visible"
    >
      <polyline
        points={coordinates.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      {points.map((point, index) => {
        const [x, y] = coordinates[index].split(',').map(Number);
        return (
          <circle
            key={`${point.date}-${point.score}`}
            cx={x}
            cy={y}
            r="7"
            className="stroke-primary fill-white"
            strokeWidth="5"
          />
        );
      })}
    </svg>
  );
}

function WeakSkillsPanel({
  masteryMap,
  dictionary,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap.weakSkills;
  const actionLabels = dictionary.studentExperience.learningOutcomes.mastery
    .actions as Record<string, string>;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <PanelHeader
          icon={<LuTarget className="size-4" />}
          title={t.title}
          body={t.body}
        />
        <div className="mt-4 grid gap-3">
          {masteryMap.weakSkills.length ? (
            masteryMap.weakSkills.map((skill) => (
              <div
                key={`${skill.courseId}-${skill.domain}`}
                className="rounded-xl border bg-white/70 p-3 dark:bg-white/8"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{skill.domain}</div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {skill.courseTitle}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-xl bg-white/70">
                    {dictionaryFormat(
                      dictionary.studentExperience.score,
                      skill.scorePercent,
                    )}
                  </Badge>
                </div>
                <Progress value={skill.scorePercent} className="mt-3 h-2" />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-muted-foreground text-xs">
                    {actionLabels[skill.recommendedAction] ||
                      actionLabels.practice}
                  </p>
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/student/course/$courseId/practice"
                        params={{ courseId: skill.courseId }}
                      />
                    }
                    variant="outline"
                    className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
                  >
                    {t.practiceCta}
                    <LuArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">{t.empty}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UnlockedModulesPanel({
  masteryMap,
  dictionary,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap.modules;
  const statusLabels = t.status as Record<string, string>;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <PanelHeader
          icon={<LuRoute className="size-4" />}
          title={t.title}
          body={t.body}
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {masteryMap.modules.items.length ? (
            masteryMap.modules.items.map((module) => (
              <div
                key={module.id}
                className={cn(
                  'rounded-xl border bg-white/70 p-3 dark:bg-white/8',
                  module.status === 'locked' && 'opacity-70',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{module.title}</div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {module.courseTitle}
                    </div>
                  </div>
                  {module.status === 'locked' ? (
                    <LuLock className="text-muted-foreground size-4" />
                  ) : module.status === 'complete' ? (
                    <LuCircleCheck className="size-4 text-green-600" />
                  ) : (
                    <LuCircleDot className="text-primary size-4" />
                  )}
                </div>
                <Progress value={module.percent} className="mt-3 h-2" />
                <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">
                    {dictionaryFormat(
                      t.lessons,
                      module.completedLessons,
                      module.totalLessons,
                    )}
                  </span>
                  <Badge variant="secondary" className="rounded-xl">
                    {statusLabels[module.status] || statusLabels.unlocked}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">{t.empty}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MilestonesPanel({
  masteryMap,
  dictionary,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap;
  const labels = t.milestoneLabels as Record<string, string>;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <PanelHeader
          icon={<LuShieldCheck className="size-4" />}
          title={t.milestonesTitle}
          body={t.milestonesBody}
        />
        <div className="mt-4 grid gap-3">
          {masteryMap.milestones.map((milestone) => (
            <div
              key={milestone.key}
              className="flex items-center gap-3 rounded-xl border bg-white/70 p-3 dark:bg-white/8"
            >
              <div
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-xl',
                  milestone.achieved
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {milestone.achieved ? (
                  <LuCircleCheck className="size-4" />
                ) : (
                  <LuLock className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold">
                  {labels[milestone.key] || labels.mastered}
                </div>
                <div className="text-muted-foreground text-xs">
                  {dictionaryFormat(t.milestoneTarget, milestone.threshold)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StreakPanel({
  masteryMap,
  dictionary,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
}) {
  const t = dictionary.studentExperience.masteryMap.streaks;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <PanelHeader
          icon={<LuFlame className="size-4" />}
          title={t.title}
          body={t.body}
        />
        <div className="mt-4 grid gap-3">
          {masteryMap.streaks.courses.slice(0, 5).map((course) => (
            <div
              key={course.courseId}
              className="rounded-xl border bg-white/70 p-3 dark:bg-white/8"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold">{course.courseTitle}</div>
                <Badge variant="secondary" className="rounded-xl">
                  {dictionaryFormat(t.dayCount, course.currentStreak)}
                </Badge>
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                {course.lastActivityDate
                  ? dictionaryFormat(
                      t.lastActivity,
                      formatDate(course.lastActivityDate, dictionary),
                    )
                  : t.noActivity}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CertificatesPanel({
  masteryMap,
  dictionary,
  showPremiumCta,
}: {
  masteryMap: StudentMasteryMapResponse;
  dictionary: Dictionary;
  showPremiumCta: boolean;
}) {
  const t = dictionary.studentExperience.masteryMap.certificates;
  const statusLabels = t.status as Record<string, string>;

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="p-5">
        <PanelHeader
          icon={<LuAward className="size-4" />}
          title={t.title}
          body={t.body}
        />
        <div className="mt-4 grid gap-3">
          {masteryMap.certificates.items.map((certificate) => (
            <div
              key={certificate.courseId}
              className="rounded-xl border bg-white/70 p-3 dark:bg-white/8"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold">{certificate.courseTitle}</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {statusLabels[certificate.status] || statusLabels.locked}
                  </div>
                </div>
                {certificate.status === 'earned' ? (
                  <LuBadgeCheck className="text-primary size-5" />
                ) : (
                  <LuAward className="text-muted-foreground size-5" />
                )}
              </div>
              <Progress value={certificate.percent} className="mt-3 h-2" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">
                  {dictionaryFormat(
                    t.lessons,
                    certificate.completedLessons,
                    certificate.totalLessons,
                  )}
                </span>
                {certificate.status === 'earned' && (
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/course/$id/certificate"
                        params={{ id: certificate.courseId }}
                      />
                    }
                    variant="outline"
                    className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
                  >
                    {t.view}
                  </Button>
                )}
              </div>
              {showPremiumCta &&
                certificate.enabled &&
                (certificate.status === 'locked' ||
                  certificate.status === 'inProgress') && (
                  <ContextualPaywall
                    source="locked_certificate"
                    courseId={certificate.courseId}
                    lockedFeature="certificate"
                    preferredPackageTypes={[
                      'annual_subscription',
                      'monthly_subscription',
                    ]}
                    compact
                    className="mt-3"
                    metadata={{
                      certificateStatus: certificate.status,
                      completedLessons: certificate.completedLessons,
                      totalLessons: certificate.totalLessons,
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PanelHeader({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary bg-primary/10 grid size-10 shrink-0 place-items-center rounded-xl">
        {icon}
      </div>
      <div>
        <h2 className="font-extrabold">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{body}</p>
      </div>
    </div>
  );
}
