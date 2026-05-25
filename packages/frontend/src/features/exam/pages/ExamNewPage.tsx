import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { ExamForm } from '@/features/exam/components/ExamForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';

export const examNewLazyRoute = createLazyRoute('/exam/new')({
  component: ExamNewPage,
});

export function ExamNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const examListPath = referrer?.startsWith('/exam?') ? referrer : '/exam';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.exam.list.menu, examListPath],
          [dictionary.exam.new.menu],
        ]}
      />
      <div className="my-10">
        <ExamForm
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
