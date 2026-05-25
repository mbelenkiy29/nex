import type { Organization } from '@project/backend/prisma/prismaTypes';
import { createLazyRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { OrganizationForm } from '@/features/organization/components/OrganizationForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { organizationEditRoute } from '@/features/organization/organizationRouter';

export const organizationEditLazyRoute = createLazyRoute(
  '/organization/$id/edit',
)({
  component: OrganizationEditPage,
});

export function OrganizationEditPage() {
  const { id } = organizationEditRoute.useParams();
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization>();

  useEffect(() => {
    async function doFetch() {
      try {
        setOrganization(undefined);

        const organization = await apiClient
          .get(`api/organization/${id}`)
          .json<Organization>();

        if (!organization) {
          navigate({ to: '/' });
          return;
        }

        setOrganization(organization);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || dictionary.shared.errors.unknown);
        navigate({ to: '/' });
      }
    }

    doFetch();
  }, [id, navigate, dictionary.shared.errors.unknown]);

  if (!organization) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.organization.form.edit.title]]} />
      <div className="my-10">
        <OrganizationForm
          organization={organization}
          onSuccess={() => navigate({ to: '/' })}
          onCancel={() => navigate({ to: '/' })}
        />
      </div>
    </div>
  );
}
