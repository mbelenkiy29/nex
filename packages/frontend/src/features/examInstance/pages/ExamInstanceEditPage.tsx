import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { ExamInstanceForm } from '@/features/examInstance/components/ExamInstanceForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';
import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
import { toast } from 'sonner';
import { examInstanceEditRoute } from '@/features/examInstance/examInstanceRouter';

export const examInstanceEditLazyRoute = createLazyRoute(
  '/exam-instance/$id/edit',
)({
  component: ExamInstanceEditPage,
});

export function ExamInstanceEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = examInstanceEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['exam-instance', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/exam-instance/${id}`, { signal })
        .json<ExamInstanceWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/exam-instance?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/exam-instance' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const examInstance = query.data;
  const examInstanceListPath = referrer?.startsWith('/exam-instance?')
    ? referrer
    : '/exam-instance';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.examInstance.list.menu, examInstanceListPath],
          [
            examInstanceLabel(examInstance, dictionary, locale),
            `/exam-instance/${examInstance?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.examInstance.edit.menu],
        ]}
      />
      <div className="my-10">
        <ExamInstanceForm
          examInstance={examInstance}
          onSuccess={(examInstance: ExamInstanceWithRelationships) =>
            navigate({
              to: `/exam-instance/${examInstance.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/exam-instance?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/exam-instance' })
          }
        />
      </div>
    </div>
  );
}
