import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { PracticeQuestionForm } from '@/features/practiceQuestion/components/PracticeQuestionForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';

export const practiceQuestionNewLazyRoute = createLazyRoute(
  '/practice-question/new',
)({
  component: PracticeQuestionNewPage,
});

export function PracticeQuestionNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const practiceQuestionListPath = referrer?.startsWith('/practice-question?')
    ? referrer
    : '/practice-question';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.practiceQuestion.list.menu, practiceQuestionListPath],
          [dictionary.practiceQuestion.new.menu],
        ]}
      />
      <div className="my-10">
        <PracticeQuestionForm
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
