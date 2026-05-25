import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { ChapterForm } from '@/features/chapter/components/ChapterForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { toast } from 'sonner';
import { chapterEditRoute } from '@/features/chapter/chapterRouter';

export const chapterEditLazyRoute = createLazyRoute('/chapter/$id/edit')({
  component: ChapterEditPage,
});

export function ChapterEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = chapterEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['chapter', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/chapter/${id}`, { signal })
        .json<ChapterWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/chapter?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/chapter' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const chapter = query.data;
  const chapterListPath = referrer?.startsWith('/chapter?')
    ? referrer
    : '/chapter';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.chapter.list.menu, chapterListPath],
          [
            chapterLabel(chapter, dictionary, locale),
            `/chapter/${chapter?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.chapter.edit.menu],
        ]}
      />
      <div className="my-10">
        <ChapterForm
          chapter={chapter}
          onSuccess={(chapter: ChapterWithRelationships) =>
            navigate({
              to: `/chapter/${chapter.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/chapter?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/chapter' })
          }
        />
      </div>
    </div>
  );
}
