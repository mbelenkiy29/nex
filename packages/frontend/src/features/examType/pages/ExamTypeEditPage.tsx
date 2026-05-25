import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { ExamTypeForm } from '@/features/examType/components/ExamTypeForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { toast } from 'sonner';
import { examTypeEditRoute } from '@/features/examType/examTypeRouter';

export const examTypeEditLazyRoute = createLazyRoute('/exam-type/$id/edit')({
  component: ExamTypeEditPage,
});

export function ExamTypeEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = examTypeEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['exam-type', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/exam-type/${id}`, { signal })
        .json<ExamTypeWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/exam-type?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam-type' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const examType = query.data;
  const examTypeListPath = referrer?.startsWith('/exam-type?')
    ? referrer
    : '/exam-type';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.examType.list.menu, examTypeListPath],
          [
            examTypeLabel(examType, dictionary, locale),
            `/exam-type/${examType?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.examType.edit.menu],
        ]}
      />
      <div className="my-10">
        <ExamTypeForm
          examType={examType}
          onSuccess={(examType: ExamTypeWithRelationships) =>
            navigate({
              to: `/exam-type/${examType.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/exam-type?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/exam-type' })
          }
        />
      </div>
    </div>
  );
}
