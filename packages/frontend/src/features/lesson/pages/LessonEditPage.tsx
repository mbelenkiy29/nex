import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { LessonForm } from '@/features/lesson/components/LessonForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { toast } from 'sonner';
import { lessonEditRoute } from '@/features/lesson/lessonRouter';

export const lessonEditLazyRoute = createLazyRoute('/lesson/$id/edit')({
  component: LessonEditPage,
});

export function LessonEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = lessonEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['lesson', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/lesson/${id}`, { signal })
        .json<LessonWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/lesson?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/lesson' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const lesson = query.data;
  const lessonListPath = referrer?.startsWith('/lesson?')
    ? referrer
    : '/lesson';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.lesson.list.menu, lessonListPath],
          [
            lessonLabel(lesson, dictionary, locale),
            `/lesson/${lesson?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.lesson.edit.menu],
        ]}
      />
      <div className="my-10">
        <LessonForm
          lesson={lesson}
          onSuccess={(lesson: LessonWithRelationships) =>
            navigate({
              to: `/lesson/${lesson.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/lesson?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/lesson' })
          }
        />
      </div>
    </div>
  );
}
