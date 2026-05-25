import { useAuthStore } from '@/features/auth/authStore';
import { EmailChangeForm } from '@/features/auth/components/EmailChangeForm';
import { PageHeader } from '@/shared/components/PageHeader';

export function EmailChangePage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.auth.emailChange.menu]]} />
      <div className="mt-10">
        <EmailChangeForm />
      </div>
    </div>
  );
}
