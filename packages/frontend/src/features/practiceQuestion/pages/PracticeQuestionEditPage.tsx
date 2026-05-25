import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { PracticeQuestionForm } from '@/features/practiceQuestion/components/PracticeQuestionForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { toast } from 'sonner';
import { practiceQuestionEditRoute } from '@/features/practiceQuestion/practiceQuestionRouter';

export const practiceQuestionEditLazyRoute = createLazyRoute(
  '/practice-question/$id/edit',
)({
  component: PracticeQuestionEditPage,
});

export function PracticeQuestionEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = practiceQuestionEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['practice-question', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/practice-question/${id}`, { signal })
        .json<PracticeQuestionWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/practice-question?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/practice-question' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const practiceQuestion = query.data;
  const practiceQuestionListPath = referrer?.startsWith('/practice-question?')
    ? referrer
    : '/practice-question';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.practiceQuestion.list.menu, practiceQuestionListPath],
          [
            practiceQuestionLabel(practiceQuestion, dictionary, locale),
            `/practice-question/${practiceQuestion?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.practiceQuestion.edit.menu],
        ]}
      />
      <div className="my-10">
        <PracticeQuestionForm
          practiceQuestion={practiceQuestion}
          onSuccess={(practiceQuestion: PracticeQuestionWithRelationships) =>
            navigate({
              to: `/practice-question/${practiceQuestion.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/practice-question?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/practice-question' })
          }
        />
      </div>
    </div>
  );
}
