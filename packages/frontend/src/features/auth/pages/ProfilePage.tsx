import { useAuthStore } from '@/features/auth/authStore';
import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { PageHeader } from '@/shared/components/PageHeader';

export function ProfilePage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.auth.profile.menu]]} />
      <div className="mt-10">
        <ProfileForm />
      </div>
    </div>
  );
}
