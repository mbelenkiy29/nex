import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import { useAuthStore } from '@/features/auth/authStore';
import { cn } from '@/shared/lib/utils';
import { Link } from '@tanstack/react-router';
import { BarChart2, BookOpen, Sparkles, type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

type AuthTab = 'signin' | 'student' | 'creator';

const authTabs = [
  {
    id: 'signin',
    to: '/auth/sign-in',
  },
  {
    id: 'student',
    to: '/auth/student-sign-up',
  },
  {
    id: 'creator',
    to: '/auth/creator-sign-up',
  },
] as const;

export function AuthPageShell({
  activeTab,
  cardTitle,
  cardSubtitle,
  children,
  footer,
  linkSearch,
}: {
  activeTab: AuthTab;
  cardTitle: string;
  cardSubtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  linkSearch?: { redirect: string };
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  const tabLabels: Record<AuthTab, string> = {
    signin: dictionary.auth.signIn.menu,
    student: dictionary.auth.signUp.studentTab,
    creator: dictionary.auth.signUp.creatorTab,
  };

  const features = [
    {
      icon: Sparkles,
      title: dictionary.auth.layout.aiTutorTitle,
      description: dictionary.auth.layout.aiTutorDescription,
    },
    {
      icon: BookOpen,
      title: dictionary.auth.layout.flowStateTitle,
      description: dictionary.auth.layout.flowStateDescription,
    },
    {
      icon: BarChart2,
      title: dictionary.auth.layout.insightsTitle,
      description: dictionary.auth.layout.insightsDescription,
    },
  ];

  return (
    <main className="selection:bg-nexexam-primary/20 relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f1f5f9] p-4 text-[#0f172a] sm:p-6 md:p-8 lg:p-12 dark:bg-[#0f172a] dark:text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[100px] dark:bg-[#0f172a]/35" />
        <div className="nexexam-auth-blob nexexam-auth-blob-one" />
        <div className="nexexam-auth-blob nexexam-auth-blob-two" />
        <div className="nexexam-auth-blob nexexam-auth-blob-three" />
      </div>

      <div className="absolute top-4 right-4 z-30 flex gap-2 md:top-8 md:right-8">
        <LanguageSwitcher />
        <ThemeModeToggle />
      </div>

      <div className="relative z-20 flex w-full max-w-[1320px] flex-col items-center justify-center gap-8 lg:flex-row lg:gap-20 xl:gap-28">
        <section className="mt-8 flex w-full max-w-2xl flex-col justify-center text-center lg:mt-0 lg:flex-1 lg:text-left">
          <NexExamAuthMark label={dictionary.auth.layout.brandName} />

          <h1 className="mb-4 text-4xl leading-[1.1] font-bold tracking-normal text-[#0f172a] drop-shadow-sm sm:mb-6 sm:text-5xl lg:text-[56px] dark:text-white">
            {dictionary.auth.layout.heroTitle}
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed font-medium text-slate-600 sm:text-xl lg:mx-0 lg:mb-12 dark:text-slate-300">
            {dictionary.auth.layout.heroSubtitle}
          </p>

          <div className="hidden grid-cols-3 gap-5 lg:grid">
            {features.map((feature) => (
              <AuthFeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        <section className="w-full max-w-[440px] shrink-0">
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/40 p-6 shadow-[0_24px_60px_-12px_rgba(91,92,246,0.15)] backdrop-blur-[40px] sm:rounded-[40px] sm:p-10 dark:border-white/10 dark:bg-white/10 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <nav
              className="mb-8 flex items-center rounded-[20px] border border-black/[0.03] bg-black/5 p-1.5 shadow-inner backdrop-blur-md dark:border-white/10 dark:bg-white/10"
              aria-label={dictionary.auth.layout.authTabsLabel}
            >
              {authTabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <Link
                    key={tab.id}
                    to={tab.to}
                    search={linkSearch}
                    preload="intent"
                    className={cn(
                      'focus-visible:ring-nexexam-primary/30 relative z-10 flex-1 rounded-[16px] px-2 py-3 text-center text-[13px] font-semibold transition-colors outline-none focus-visible:ring-3 sm:text-sm',
                      isActive
                        ? 'text-nexexam-primary dark:text-nexexam-primary bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] ring-1 ring-white/80 dark:bg-white'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tabLabels[tab.id]}
                  </Link>
                );
              })}
            </nav>

            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold tracking-normal text-[#0f172a] sm:text-3xl dark:text-white">
                {cardTitle}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                {cardSubtitle}
              </p>
            </div>

            {children}
          </div>

          <div className="mt-8 text-center">
            {footer || (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                {dictionary.auth.layout.secureFooter}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function NexExamAuthMark({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-3 lg:mb-12 lg:justify-start">
      <div className="flex scale-110 items-end gap-[3px]" aria-hidden="true">
        <div className="h-5 w-3 translate-x-1.5 -rotate-[15deg] rounded-full bg-gradient-to-t from-[#8b5cf6] to-[#a78bfa] shadow-sm" />
        <div className="z-10 h-7 w-3.5 rounded-full bg-gradient-to-t from-[#5b5cf6] to-[#8b5cf6] shadow-md" />
        <div className="h-5 w-3 -translate-x-1.5 rotate-[15deg] rounded-full bg-gradient-to-t from-[#3b82f6] to-[#60a5fa] shadow-sm" />
      </div>
      <span className="text-3xl font-extrabold tracking-normal text-[#0f172a] drop-shadow-sm dark:text-white">
        {label}
      </span>
    </div>
  );
}

function AuthFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/40 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-colors hover:bg-white/50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
      <div className="text-nexexam-primary mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/80 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/10">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1 text-base font-bold text-[#0f172a] dark:text-white">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
