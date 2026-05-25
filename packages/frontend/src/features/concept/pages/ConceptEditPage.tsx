import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { ConceptForm } from '@/features/concept/components/ConceptForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { apiClient } from '@/shared/lib/apiClient';
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { toast } from 'sonner';
import { conceptEditRoute } from '@/features/concept/conceptRouter';

export const conceptEditLazyRoute = createLazyRoute('/concept/$id/edit')({
  component: ConceptEditPage,
});

export function ConceptEditPage() {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const navigate = useNavigate();
  const { id } = conceptEditRoute.useParams();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const query = useQuery({
    queryKey: ['concept', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/concept/${id}`, { signal })
        .json<ConceptWithRelationships>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  if (query.isError) {
    toast.error(
      (query.error as any).message || dictionary.shared.errors.unknown,
    );
    if (referrer?.startsWith('/concept?')) {
      navigate({ to: referrer as any });
    } else {
      navigate({ to: '/concept' });
    }
    return null;
  }

  if (!query.data) {
    return null;
  }

  const concept = query.data;
  const conceptListPath = referrer?.startsWith('/concept?')
    ? referrer
    : '/concept';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.concept.list.menu, conceptListPath],
          [
            conceptLabel(concept, dictionary, locale),
            `/concept/${concept?.id}${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
          ],
          [dictionary.concept.edit.menu],
        ]}
      />
      <div className="my-10">
        <ConceptForm
          concept={concept}
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
