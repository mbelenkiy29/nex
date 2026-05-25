import { DailyGoalActions } from '@/features/dailyGoal/components/DailyGoalActions';
import { DailyGoalLink } from '@/features/dailyGoal/components/DailyGoalLink';
import { FilesList } from '@/features/file/components/FilesList';
import { ImagesGallery } from '@/features/file/components/ImagesGallery';
import { MemberLink } from '@/features/member/components/MemberLink';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { dailyGoalLabel } from '@project/backend/features/dailyGoal/dailyGoalLabel';
import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { dailyGoalViewRoute } from '@/features/dailyGoal/dailyGoalRouter';

export const dailyGoalViewLazyRoute = createLazyRoute('/dailyGoal/$id')({
  component: DailyGoalViewPage,
});

export function DailyGoalViewPage() {
  const { id } = dailyGoalViewRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['dailyGoal', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/daily-goal/${id}`, { signal })
        .json<DailyGoalWithRelationships>();
    },
    initialData: () =>
      (
        queryClient.getQueryData([
          'dailyGoal',
        ]) as Array<DailyGoalWithRelationships>
      )?.find((d) => d.id === id),
  });

  const dailyGoal = query.data;

  if (query.isSuccess && !dailyGoal) {
    if (referrer?.startsWith('/daily-goal?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/daily-goal' });
    }
    return null;
  }

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/daily-goal?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/daily-goal' });
    }
    return null;
  }

  if (!dailyGoal) {
    return null;
  }

  const dailyGoalListPath = referrer?.startsWith('/daily-goal?')
    ? referrer
    : '/daily-goal';

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            [dictionary.dailyGoal.list.menu, dailyGoalListPath],
            [dailyGoalLabel(dailyGoal, dictionary, locale)],
          ]}
        />
        <div className="flex gap-2">
          <DailyGoalActions
            mode="view"
            dailyGoal={dailyGoal}
            referrer={referrer}
          />
        </div>
      </div>

      <div className="my-6 divide-y border-t">
        {Boolean(dailyGoal.title) && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.title}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{dailyGoal.title}</span>
              <CopyToClipboardButton text={dailyGoal.title} />
            </div>
          </div>
        )}
        {dailyGoal.goalType != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.goalType}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>
                {dictionaryEnumerator(
                  dictionary.dailyGoal.enumerators.goalType,
                  dailyGoal.goalType,
                )}
              </span>
              <CopyToClipboardButton
                text={dictionaryEnumerator(
                  dictionary.dailyGoal.enumerators.goalType,
                  dailyGoal.goalType,
                )}
              />
            </div>
          </div>
        )}
        {dailyGoal.targetValue != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.targetValue}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{dailyGoal.targetValue}</span>
              <CopyToClipboardButton text={dailyGoal.targetValue.toString()} />
            </div>
          </div>
        )}
        {dailyGoal.currentValue != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.currentValue}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{dailyGoal.currentValue}</span>
              <CopyToClipboardButton text={dailyGoal.currentValue.toString()} />
            </div>
          </div>
        )}
        {dailyGoal.xpReward != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.xpReward}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{dailyGoal.xpReward}</span>
              <CopyToClipboardButton text={dailyGoal.xpReward.toString()} />
            </div>
          </div>
        )}
        {dailyGoal.goalDate != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.goalDate}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDate(dailyGoal.goalDate, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDate(dailyGoal.goalDate, dictionary)}
              />
            </div>
          </div>
        )}
        {dailyGoal.completedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.completedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(dailyGoal.completedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(dailyGoal.completedAt, dictionary)}
              />
            </div>
          </div>
        )}
        {dailyGoal.owner != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.owner}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={dailyGoal.owner} />
              <CopyToClipboardButton text={memberLabel(dailyGoal.owner)} />
            </div>
          </div>
        )}

        {dailyGoal.createdByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.createdByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={dailyGoal.createdByMember} />
              <CopyToClipboardButton
                text={memberLabel(dailyGoal.createdByMember)}
              />
            </div>
          </div>
        )}

        {dailyGoal.createdAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.createdAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(dailyGoal.createdAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(dailyGoal.createdAt, dictionary)}
              />
            </div>
          </div>
        )}

        {dailyGoal.updatedByMember != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.updatedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={dailyGoal.updatedByMember} />
              <CopyToClipboardButton
                text={memberLabel(dailyGoal.updatedByMember)}
              />
            </div>
          </div>
        )}

        {dailyGoal.updatedAt != null && (
          <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.updatedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(dailyGoal.updatedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(dailyGoal.updatedAt, dictionary)}
              />
            </div>
          </div>
        )}

        {dailyGoal.archivedByMember != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.archivedByMember}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <MemberLink member={dailyGoal.archivedByMember} />
              <CopyToClipboardButton
                text={memberLabel(dailyGoal.archivedByMember)}
              />
            </div>
          </div>
        )}

        {dailyGoal.archivedAt != null && (
          <div className="group grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
            <div className="font-semibold">
              {dictionary.dailyGoal.fields.archivedAt}
            </div>
            <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
              <span>{formatDateTime(dailyGoal.archivedAt, dictionary)}</span>
              <CopyToClipboardButton
                text={formatDateTime(dailyGoal.archivedAt, dictionary)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
