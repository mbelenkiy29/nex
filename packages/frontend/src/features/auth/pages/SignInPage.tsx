import { SignInFormWithRecaptcha } from '@/features/auth/components/SignInForm';
import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { useAuthStore } from '@/features/auth/authStore';
import { Link, useSearch } from '@tanstack/react-router';

export function SignInPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const search = useSearch({ strict: false }) as { redirect?: string };

  if (!dictionary) {
    return null;
  }

  const linkSearch = search.redirect
    ? { redirect: search.redirect }
    : undefined;

  return (
    <AuthPageShell
      activeTab="signin"
      cardTitle={dictionary.auth.signIn.cardTitle}
      cardSubtitle={dictionary.auth.signIn.cardSubtitle}
      linkSearch={linkSearch}
    >
      <SignInFormWithRecaptcha locale={locale} />
      <div className="mt-6 grid gap-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
        <Link
          to="/auth/student-sign-up"
          search={linkSearch}
          preload="intent"
          className="hover:text-nexexam-primary transition-colors"
        >
          {dictionary.auth.signIn.studentSignUpLink}
        </Link>
        <Link
          to="/auth/creator-sign-up"
          search={linkSearch}
          preload="intent"
          className="hover:text-nexexam-primary transition-colors"
        >
          {dictionary.auth.signIn.creatorSignUpLink}
        </Link>
      </div>
    </AuthPageShell>
  );
}
