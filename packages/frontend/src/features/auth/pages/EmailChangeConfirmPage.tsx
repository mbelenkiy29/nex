import { EmailChangeConfirmWithRecaptcha } from '@/features/auth/components/EmailChangeConfirm';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/authStore';

export function EmailChangeConfirmPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!dictionary) {
    return null;
  }

  return (
    <div className="bg-muted relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-4 md:top-8 md:right-8">
        <LanguageSwitcher />
        <ThemeModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {dictionary.auth.emailChangeConfirm.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmailChangeConfirmWithRecaptcha currentUser={currentUser} />
        </CardContent>
      </Card>
    </div>
  );
}
