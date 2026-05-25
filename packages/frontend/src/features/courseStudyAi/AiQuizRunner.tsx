import { useMemo, useState } from 'react';
import { LuBrain, LuCheck, LuListChecks, LuRotateCw, LuX } from 'react-icons/lu';
import type { CourseStudyAiQuestion } from '@project/backend/features/courseStudyAi/courseStudyAiSchemas';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import {
  resolveStudyAiError,
  useGenerateAiPractice,
  useGenerateAiQuiz,
  useSubmitAiQuiz,
} from './hooks/useCourseStudyAi';

export type AiQuizKind = 'quiz' | 'practice';

interface AiQuizRunnerProps {
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  kind: AiQuizKind;
  onClose: () => void;
}

const PASS_THRESHOLD = 70;

/**
 * Side sheet that generates an AI quiz / practice set scoped to one module,
 * lets the student answer it, and grades it in-memory (Phase 1 — attempts are
 * not yet persisted). AI questions are study-only and never affect grades.
 */
export function AiQuizRunner({
  courseId,
  moduleId,
  moduleTitle,
  kind,
  onClose,
}: AiQuizRunnerProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi;

  const quizMutation = useGenerateAiQuiz(courseId);
  const practiceMutation = useGenerateAiPractice(courseId);
  const generation = kind === 'quiz' ? quizMutation : practiceMutation;
  const submitMutation = useSubmitAiQuiz(courseId);

  // answers: question index -> selected option index
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);

  const questions: Array<CourseStudyAiQuestion> =
    generation.data?.questions ?? [];

  const startGeneration = () => {
    setAnswers({});
    setGraded(false);
    if (kind === 'quiz') {
      quizMutation.mutate({ moduleId });
    } else {
      practiceMutation.mutate({ moduleId });
    }
  };

  // Shows in-memory grading instantly and persists the attempt in the
  // background (it feeds weakness detection — a failed persist is non-blocking).
  const handleCheck = () => {
    setGraded(true);
    submitMutation.mutate({
      kind,
      moduleId,
      questions,
      answers: Object.entries(answers).map(([questionIndex, optionIndex]) => ({
        questionIndex: Number(questionIndex),
        selectedOptionIndex: optionIndex,
      })),
    });
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every((_, index) => answers[index] !== undefined);

  const grade = useMemo(() => {
    const correctByQuestion = questions.map(
      (question, index) =>
        answers[index] !== undefined &&
        question.options[answers[index]]?.isCorrect === true,
    );
    const correctCount = correctByQuestion.filter(Boolean).length;
    const scorePercent = questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

    const domainMap = new Map<string, { correct: number; total: number }>();
    questions.forEach((question, index) => {
      const entry = domainMap.get(question.examDomain) ?? {
        correct: 0,
        total: 0,
      };
      entry.total += 1;
      if (correctByQuestion[index]) {
        entry.correct += 1;
      }
      domainMap.set(question.examDomain, entry);
    });
    const domains = [...domainMap.entries()].map(([domain, value]) => ({
      domain,
      correct: value.correct,
      total: value.total,
      percent: Math.round((value.correct / value.total) * 100),
    }));

    return { correctByQuestion, correctCount, scorePercent, domains };
  }, [questions, answers]);

  const title = kind === 'quiz' ? t.quiz.quizTitle : t.quiz.practiceTitle;
  const errorCode = generation.isError
    ? resolveStudyAiError(generation.error)
    : null;
  const errorMessage =
    errorCode === 'limit'
      ? t.errors.limitReached
      : errorCode === 'busy'
        ? t.errors.busy
        : t.errors.generic;

  return (
    <Sheet
      open
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        style={{ width: '100%', maxWidth: 'min(680px, 100vw)' }}
        className="gap-0"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 text-lg font-extrabold">
            {kind === 'quiz' ? (
              <LuListChecks className="text-primary size-5" />
            ) : (
              <LuBrain className="text-primary size-5" />
            )}
            {title}
          </SheetTitle>
          <SheetDescription>{moduleTitle}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <p className="text-muted-foreground text-xs italic">
            {t.quiz.aiDisclaimer}
          </p>

          {/* Phase 0 — intro / start */}
          {generation.isIdle && (
            <div className="space-y-4">
              <p className="text-sm">{t.quiz.intro}</p>
              <Button className="h-10 rounded-xl" onClick={startGeneration}>
                {t.quiz.start}
              </Button>
            </div>
          )}

          {/* Phase 1 — generating */}
          {generation.isPending && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner />
              {t.quiz.generating}
            </div>
          )}

          {/* Phase 2 — generation failed */}
          {generation.isError && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">{errorMessage}</p>
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={startGeneration}
              >
                <LuRotateCw className="size-4" />
                {t.result.retry}
              </Button>
            </div>
          )}

          {/* Phase 3/4 — answer + results */}
          {generation.isSuccess && questions.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {t.quiz.noQuestions}
            </p>
          )}

          {generation.isSuccess && questions.length > 0 && (
            <>
              {graded && (
                <div className="bg-nexexam-primary/10 rounded-2xl p-4">
                  <p className="text-lg font-extrabold">
                    {dictionaryFormat(t.quiz.yourScore, grade.scorePercent)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {dictionaryFormat(
                      t.quiz.correctCount,
                      grade.correctCount,
                      questions.length,
                    )}{' '}
                    —{' '}
                    {grade.scorePercent >= PASS_THRESHOLD
                      ? t.quiz.passed
                      : t.quiz.failed}
                  </p>
                </div>
              )}

              <div className="grid gap-3">
                {questions.map((question, questionIndex) => {
                  const selected = answers[questionIndex];
                  return (
                    <div
                      key={questionIndex}
                      className="rounded-xl border bg-white/80 p-3 dark:bg-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold">
                          {questionIndex + 1}. {question.questionText}
                        </p>
                        <Badge
                          variant="outline"
                          className="shrink-0 rounded-lg text-xs"
                        >
                          {question.examDomain}
                        </Badge>
                      </div>
                      <div className="mt-2 grid gap-1">
                        {question.options.map((option, optionIndex) => {
                          const isSelected = selected === optionIndex;
                          const showCorrect = graded && option.isCorrect;
                          const showWrongPick =
                            graded && isSelected && !option.isCorrect;
                          return (
                            <button
                              key={optionIndex}
                              type="button"
                              disabled={graded}
                              onClick={() =>
                                setAnswers((current) => ({
                                  ...current,
                                  [questionIndex]: optionIndex,
                                }))
                              }
                              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                                showCorrect
                                  ? 'border-nexexam-success bg-nexexam-success/10'
                                  : showWrongPick
                                    ? 'border-nexexam-warning bg-nexexam-warning/10'
                                    : isSelected
                                      ? 'border-nexexam-primary bg-nexexam-primary/10'
                                      : 'bg-white/70 dark:bg-white/8'
                              }`}
                            >
                              <span className="grid size-4 shrink-0 place-items-center rounded-full border">
                                {isSelected && <LuCheck className="size-3" />}
                              </span>
                              <span>{option.text}</span>
                            </button>
                          );
                        })}
                      </div>
                      {graded && (
                        <p
                          className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                            grade.correctByQuestion[questionIndex]
                              ? 'text-nexexam-success'
                              : 'text-nexexam-warning'
                          }`}
                        >
                          {grade.correctByQuestion[questionIndex] ? (
                            <LuCheck className="size-3.5" />
                          ) : (
                            <LuX className="size-3.5" />
                          )}
                          {grade.correctByQuestion[questionIndex]
                            ? t.quiz.correct
                            : t.quiz.incorrect}
                        </p>
                      )}
                      {graded && question.explanation && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {graded && grade.domains.length > 0 && (
                <div className="rounded-xl border p-3 text-sm dark:bg-white/8">
                  <p className="font-bold">{t.quiz.domainBreakdown}</p>
                  <div className="mt-2 grid gap-1">
                    {grade.domains.map((domain) => (
                      <div
                        key={domain.domain}
                        className="flex justify-between gap-3"
                      >
                        <span>{domain.domain}</span>
                        <span className="text-muted-foreground">
                          {domain.correct}/{domain.total} ({domain.percent}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {!graded ? (
                  <Button
                    className="h-10 rounded-xl"
                    disabled={!allAnswered}
                    onClick={handleCheck}
                  >
                    {t.quiz.submit}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl"
                    onClick={startGeneration}
                  >
                    <LuRotateCw className="size-4" />
                    {t.quiz.retake}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
