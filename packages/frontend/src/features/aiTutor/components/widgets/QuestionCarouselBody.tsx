import { useMemo, useState } from 'react';
import { LuCheck, LuRotateCcw, LuX } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/shared/lib/utils';
import type { CourseStudyAiQuestion } from '@project/backend/features/courseStudyAi/courseStudyAiSchemas';

type SelectionState = Record<number, number>;

interface QuestionCarouselBodyProps {
  moduleTitle: string;
  questions: CourseStudyAiQuestion[];
}

export function QuestionCarouselBody({
  moduleTitle,
  questions,
}: QuestionCarouselBodyProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const [selections, setSelections] = useState<SelectionState>({});
  const [submitted, setSubmitted] = useState(false);

  const correctCount = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((acc, q, qi) => {
      const opt = selections[qi];
      if (opt == null) return acc;
      return acc + (q.options[opt]?.isCorrect ? 1 : 0);
    }, 0);
  }, [submitted, selections, questions]);

  const total = questions.length;
  const allAnswered = Object.keys(selections).length === total;
  const reset = () => {
    setSelections({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-foreground">{moduleTitle}</div>

      {submitted ? (
        <div className="inline-flex rounded-2xl border border-border/80 bg-white px-4 py-3 text-sm shadow-sm dark:bg-card">
          <span className="font-semibold">
            {dictionary.aiTutor.widgets.quiz.scorePrefix}:
          </span>{' '}
          {correctCount} / {total}
        </div>
      ) : null}

      <div className="flex snap-x gap-3 overflow-x-auto pb-3">
        {questions.map((q, qi) => {
          const selected = selections[qi];
          return (
            <div
              key={qi}
              className="min-w-[280px] max-w-[340px] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_16px_40px_rgb(15_23_42/0.08)] dark:bg-card"
            >
              <div className="space-y-3 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {qi + 1} / {total}
                </div>
                <div className="text-sm font-medium leading-snug text-foreground">
                  {q.questionText}
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isPicked = selected === oi;
                    const reveal = submitted;
                    const isCorrect = opt.isCorrect;
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setSelections((prev) => ({ ...prev, [qi]: oi }))
                        }
                        className={cn(
                          'flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                          reveal && isCorrect
                            ? 'border-green-300 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/60 dark:text-green-100'
                            : reveal && isPicked && !isCorrect
                            ? 'border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/60 dark:text-red-100'
                            : isPicked
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background/80 text-foreground hover:bg-muted/60',
                        )}
                      >
                        <span className="flex size-5 flex-shrink-0 items-center justify-center rounded-full border border-current">
                          {reveal && isCorrect ? (
                            <LuCheck className="size-3" />
                          ) : reveal && isPicked && !isCorrect ? (
                            <LuX className="size-3" />
                          ) : (
                            <span className="text-[10px] font-medium">
                              {String.fromCharCode(65 + oi)}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation ? (
                  <details className="rounded-xl bg-muted/60 p-2.5 text-xs text-muted-foreground">
                    <summary className="cursor-pointer font-medium text-foreground">
                      {dictionary.aiTutor.widgets.quiz.reviewExplanation}
                    </summary>
                    <p className="mt-1 leading-relaxed">{q.explanation}</p>
                  </details>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setSubmitted(true)}
          className={cn(
            'rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
            allAnswered
              ? 'bg-primary text-primary-foreground shadow-[0_12px_28px_rgb(91_92_246/0.22)]'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {dictionary.aiTutor.widgets.submitAnswers}
        </button>
      ) : (
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl bg-nexexam-soft px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-nexexam-line/70 dark:bg-white/10 dark:hover:bg-white/15"
        >
          <LuRotateCcw className="size-4" />
          {dictionary.aiTutor.widgets.quiz.tryAgain}
        </button>
      )}
    </div>
  );
}
