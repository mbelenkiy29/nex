import { SignUpFormWithRecaptcha } from '@/features/auth/components/SignUpForm';
import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { useAuthStore } from '@/features/auth/authStore';
import { Link, useSearch } from '@tanstack/react-router';
import type { DashboardPersona } from '@/features/dashboard/dashboardHome';

export function StudentSignUpPage() {
  return <SignUpPage accountType="student" />;
}

export function CreatorSignUpPage() {
  return <SignUpPage accountType="creator" />;
}

function SignUpPage({ accountType }: { accountType: DashboardPersona }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const search = useSearch({ strict: false }) as { redirect?: string };

  if (!dictionary) {
    return null;
  }

  const isCreatorSignUp = accountType === 'creator';
  const linkSearch = search.redirect
    ? { redirect: search.redirect }
    : undefined;

  return (
    <AuthPageShell
      activeTab={isCreatorSignUp ? 'creator' : 'student'}
      cardTitle={
        isCreatorSignUp
          ? dictionary.auth.signUp.creatorCardTitle
          : dictionary.auth.signUp.studentCardTitle
      }
      cardSubtitle={dictionary.auth.signUp.cardSubtitle}
      linkSearch={linkSearch}
    >
      <SignUpFormWithRecaptcha locale={locale} accountType={accountType} />
      <Link
        className="hover:text-nexexam-primary mt-6 block text-center text-sm font-medium text-slate-600 transition-colors dark:text-slate-300"
        to="/auth/sign-in"
        search={linkSearch}
        preload="intent"
      >
        {dictionary.auth.signUp.signInLink}
      </Link>
    </AuthPageShell>
  );
}
