import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { ChapterForm } from '@/features/chapter/components/ChapterForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';

export const chapterNewLazyRoute = createLazyRoute('/chapter/new')({
  component: ChapterNewPage,
});

export function ChapterNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const chapterListPath = referrer?.startsWith('/chapter?')
    ? referrer
    : '/chapter';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.chapter.list.menu, chapterListPath],
          [dictionary.chapter.new.menu],
        ]}
      />
      <div className="my-10">
        <ChapterForm
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
