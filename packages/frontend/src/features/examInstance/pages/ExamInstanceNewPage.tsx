import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { ExamInstanceForm } from '@/features/examInstance/components/ExamInstanceForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';

export const examInstanceNewLazyRoute = createLazyRoute('/exam-instance/new')({
  component: ExamInstanceNewPage,
});

export function ExamInstanceNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const examInstanceListPath = referrer?.startsWith('/exam-instance?')
    ? referrer
    : '/exam-instance';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.examInstance.list.menu, examInstanceListPath],
          [dictionary.examInstance.new.menu],
        ]}
      />
      <div className="my-10">
        <ExamInstanceForm
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
