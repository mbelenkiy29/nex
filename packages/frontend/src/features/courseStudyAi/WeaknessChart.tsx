import { useAuthStore } from '@/features/auth/authStore';
import { Spinner } from '@/shared/components/ui/spinner';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { useWeaknesses } from './hooks/useCourseStudyAi';

function barColor(percent: number) {
  if (percent >= 75) {
    return 'bg-emerald-400/80';
  }
  if (percent >= 50) {
    return 'bg-amber-400/85';
  }
  return 'bg-red-400/80';
}

/**
 * Per-topic strengths/gaps as horizontal bars, weakest first. Deterministic —
 * the data comes straight from graded practice-exam + AI-quiz attempts.
 */
export function WeaknessChart({ courseId }: { courseId: string }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi.weakness;
  const query = useWeaknesses(courseId);

  if (query.isPending) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
        <Spinner />
        {dictionary.shared.loading}
      </div>
    );
  }

  if (query.isError || !query.data?.hasData) {
    return <p className="text-muted-foreground py-3 text-sm">{t.empty}</p>;
  }

  const domains = query.data.domains;
  const weakest = domains[0];

  return (
    <div className="space-y-3">
      {weakest && (
        <p className="text-muted-foreground text-xs">
          {t.weakest}:{' '}
          <span className="text-foreground font-semibold">
            {weakest.domain}
          </span>
        </p>
      )}
      <div className="space-y-2.5">
        {domains.map((domain) => (
          <div key={domain.domain}>
            <div className="flex justify-between gap-2 text-xs">
              <span className="font-medium">{domain.domain}</span>
              <span className="text-muted-foreground">
                {dictionaryFormat(
                  t.scoreLabel,
                  domain.percent,
                  domain.correct,
                  domain.total,
                )}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
              <div
                className={`h-full rounded-full ${barColor(domain.percent)}`}
                style={{ width: `${Math.max(domain.percent, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
