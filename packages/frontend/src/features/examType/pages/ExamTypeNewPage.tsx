import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { ExamTypeForm } from '@/features/examType/components/ExamTypeForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';

export const examTypeNewLazyRoute = createLazyRoute('/exam-type/new')({
  component: ExamTypeNewPage,
});

export function ExamTypeNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const examTypeListPath = referrer?.startsWith('/exam-type?')
    ? referrer
    : '/exam-type';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.examType.list.menu, examTypeListPath],
          [dictionary.examType.new.menu],
        ]}
      />
      <div className="my-10">
        <ExamTypeForm
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
