import { ProfileOnboardForm } from '@/features/auth/components/ProfileOnboardForm';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';

export function ProfileOnboardPage() {
  const { dictionary, currentMember } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      currentMember: state.currentMember,
    })),
  );

  if (!dictionary) {
    return null;
  }

  const displayName =
    currentMember?.organization?.name || dictionary.projectName;

  return (
    <div className="bg-muted relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-4 md:top-8 md:right-8">
        <LanguageSwitcher />
        <ThemeModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{displayName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileOnboardForm />

          <div className="flex justify-center">
            <SignOutButton
              className="mt-8 block text-center text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
              text={dictionary.auth.signOut.button}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
