import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LuRotateCw, LuSparkles } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { resolveStudyAiError, useGenerateNext } from './hooks/useCourseStudyAi';

/**
 * "What should I study next?" — an on-demand AI recommendation grounded in the
 * student's progress and weak topics. Triggered by a button (no auto-fetch, so
 * no surprise token cost).
 */
export function WhatNextCard({ courseId }: { courseId: string }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi;
  const mutation = useGenerateNext(courseId);

  const errorCode = mutation.isError
    ? resolveStudyAiError(mutation.error)
    : null;
  const errorMessage =
    errorCode === 'limit'
      ? t.errors.limitReached
      : errorCode === 'busy'
        ? t.errors.busy
        : t.errors.generic;

  return (
    <div className="space-y-3">
      {mutation.isIdle && (
        <p className="text-muted-foreground text-sm">{t.whatNext.empty}</p>
      )}

      {mutation.isPending && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner />
          {t.whatNext.generating}
        </div>
      )}

      {mutation.isError && (
        <p className="text-muted-foreground text-sm">{errorMessage}</p>
      )}

      {mutation.data && (
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {mutation.data.recommendation}
          </ReactMarkdown>
        </div>
      )}

      <Button
        variant="outline"
        className="h-10 w-full rounded-xl bg-white/70 dark:bg-white/8"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.data ? (
          <LuRotateCw className="size-4" />
        ) : (
          <LuSparkles className="size-4" />
        )}
        {mutation.data ? t.whatNext.regenerate : t.whatNext.generate}
      </Button>
    </div>
  );
}
