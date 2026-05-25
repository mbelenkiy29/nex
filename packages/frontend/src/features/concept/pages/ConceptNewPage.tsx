import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { ConceptForm } from '@/features/concept/components/ConceptForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';

export const conceptNewLazyRoute = createLazyRoute('/concept/new')({
  component: ConceptNewPage,
});

export function ConceptNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const conceptListPath = referrer?.startsWith('/concept?')
    ? referrer
    : '/concept';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.concept.list.menu, conceptListPath],
          [dictionary.concept.new.menu],
        ]}
      />
      <div className="my-10">
        <ConceptForm
          onSuccess={(concept: ConceptWithRelationships) =>
            navigate({
              to: `/concept/${concept.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/concept?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/concept' })
          }
        />
      </div>
    </div>
  );
}
