import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from '@tanstack/react-router';
import { LuArrowLeft } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { BrandMark } from '@/shared/components/BrandMark';
import { ThemeModeToggle } from '@/shared/components/ThemeModeToggle';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

type LegalShellProps = {
  title: string;
  lastUpdated: string;
  version: string;
  body: string;
};

/**
 * Shared wrapper for `/terms` and `/privacy`. Public-readable (no auth
 * required) so Stripe checkout and external "see our policies" links work
 * for anonymous visitors. Renders markdown body via the same
 * `react-markdown` + `remark-gfm` stack as lesson content.
 */
export function LegalShell({
  title,
  lastUpdated,
  version,
  body,
}: LegalShellProps) {
  const dictionary = useAuthStore((s) => s.dictionary);
  return (
    <div className="bg-background min-h-[100dvh]">
      <header className="border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Back home"
              className="text-nexexam-muted hover:text-nexexam-primary inline-flex h-8 w-8 items-center justify-center rounded-lg transition"
            >
              <LuArrowLeft className="size-4" />
            </Link>
            <BrandMark label={dictionary.projectName} />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {lastUpdated} · v{version}
          </p>
        </div>
        <article className="prose prose-sm dark:prose-invert sm:prose-base prose-headings:font-extrabold prose-headings:tracking-tight max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
