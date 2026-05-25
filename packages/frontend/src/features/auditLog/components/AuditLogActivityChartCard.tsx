import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { times } from 'lodash-es';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart';
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

const chartConfig = {
  count: {
    label: 'Activity',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function AuditLogActivityChartCard() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const _hasPermission = hasPermission({
    member: ['read'],
  });

  const query = useQuery({
    queryKey: ['auditLog', 'activityChart'],
    queryFn: async ({ signal }) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const activities = await apiClient
        .get(`api/audit-log/activity-chart?${objectToQuery({ timezone })}`, {
          signal,
        })
        .json<Array<{ timestamp: string; count: number }>>();

      return times(7)
        .map((index) => {
          const activity = activities.find((activity) =>
            dayjs(activity.timestamp).isSame(
              dayjs().subtract(index, 'day'),
              'day',
            ),
          );

          if (activity) {
            return {
              timestamp: dayjs(activity.timestamp, 'YYYY-MM-DD').format(
                dictionary.shared.dateFormat,
              ),
              count: activity.count,
            };
          }

          return {
            timestamp: dayjs()
              .subtract(index, 'day')
              .format(dictionary.shared.dateFormat),
            count: 0,
          };
        })
        .reverse();
    },
    enabled: _hasPermission,
  });

  if (!_hasPermission) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.auditLog.dashboardCard.activityChart}</CardTitle>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={query.data}>
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
