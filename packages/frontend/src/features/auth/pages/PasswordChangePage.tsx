import { useAuthStore } from '@/features/auth/authStore';
import { PasswordChangeForm } from '@/features/auth/components/PasswordChangeForm';
import { PageHeader } from '@/shared/components/PageHeader';

export function PasswordChangePage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.auth.passwordChange.menu]]} />
      <div className="mt-10">
        <PasswordChangeForm />
      </div>
    </div>
  );
}
