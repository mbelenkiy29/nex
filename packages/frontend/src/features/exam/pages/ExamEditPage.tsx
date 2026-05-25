import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { ExamForm } from '@/features/exam/components/ExamForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { toast } from 'sonner';
import { examEditRoute } from '@/features/exam/examRouter';

export const examEditLazyRoute = createLazyRoute('/exam/$id/edit')({
  component: ExamEditPage,
});

export function ExamEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = examEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['exam', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/exam/${id}`, { signal })
        .json<ExamWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/exam?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const exam = query.data;
  const examListPath = referrer?.startsWith('/exam?') ? referrer : '/exam';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.exam.list.menu, examListPath],
          [
            examLabel(exam, dictionary, locale),
            `/exam/${exam?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.exam.edit.menu],
        ]}
      />
      <div className="my-10">
        <ExamForm
          exam={exam}
          onSuccess={(exam: ExamWithRelationships) =>
            navigate({
              to: `/exam/${exam.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/exam?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/exam' })
          }
        />
      </div>
    </div>
  );
}
