import { OrganizationForm } from '@/features/organization/components/OrganizationForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { useAuthStore } from '@/features/auth/authStore';
import type { Organization } from '@project/backend/prisma/prismaTypes';
import { createLazyRoute, useNavigate } from '@tanstack/react-router';

export const organizationNewLazyRoute = createLazyRoute('/organization/new')({
  component: OrganizationNewPage,
});

export function OrganizationNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();

  if (!dictionary) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.organization.form.new.title]]} />

      <div className="my-6">
        <OrganizationForm
          onSuccess={(_organization: Organization) => navigate({ to: '/' })}
          onCancel={() => navigate({ to: '/' })}
        />
      </div>
    </div>
  );
}
