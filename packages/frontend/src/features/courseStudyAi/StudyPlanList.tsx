import { useState } from 'react';
import {
  LuCheck,
  LuPlus,
  LuRotateCw,
  LuSparkles,
  LuTrash2,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Spinner } from '@/shared/components/ui/spinner';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { ExamDateDialog } from './ExamDateDialog';
import {
  resolveStudyAiError,
  useCreateStudyPlanItem,
  useDeleteStudyPlanItem,
  useExamDate,
  useGenerateStudyPlan,
  useStudyPlan,
  useUpdateStudyPlanItem,
} from './hooks/useCourseStudyAi';

// Days-aware countdown text for the exam date.
function examCountdownText(
  isoDate: string,
  t: { daysRemaining: string; examToday: string; examPast: string },
) {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) {
    return '';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const days = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days > 0) {
    return dictionaryFormat(t.daysRemaining, days);
  }
  return days === 0 ? t.examToday : t.examPast;
}

/**
 * The study-plan tab: exam-date countdown, an AI plan generator, and an
 * editable checklist of dated study tasks.
 */
export function StudyPlanList({ courseId }: { courseId: string }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi;
  const planQuery = useStudyPlan(courseId);
  const examQuery = useExamDate(courseId);
  const generate = useGenerateStudyPlan(courseId);
  const createItem = useCreateStudyPlanItem(courseId);
  const updateItem = useUpdateStudyPlanItem(courseId);
  const deleteItem = useDeleteStudyPlanItem(courseId);
  const [newTitle, setNewTitle] = useState('');

  const items = planQuery.data?.items ?? [];
  const doneCount = items.filter((item) => item.status === 'completed').length;
  const hasAiItems = items.some((item) => item.source === 'ai');

  const examDate = examQuery.data?.targetExamDate ?? null;
  const countdown = examDate
    ? examCountdownText(examDate, t.examDate)
    : t.examDate.none;

  const generateErrorCode = generate.isError
    ? resolveStudyAiError(generate.error)
    : null;

  const addItem = () => {
    const title = newTitle.trim();
    if (!title) {
      return;
    }
    createItem.mutate({ title }, { onSuccess: () => setNewTitle('') });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 rounded-xl border bg-white/70 p-2.5 dark:bg-white/8">
        <span className="text-xs font-medium">{countdown}</span>
        <ExamDateDialog courseId={courseId} current={examQuery.data} />
      </div>

      <Button
        variant="outline"
        className="h-10 w-full rounded-xl bg-white/70 dark:bg-white/8"
        disabled={generate.isPending}
        onClick={() => generate.mutate()}
      >
        {generate.isPending ? (
          <Spinner />
        ) : hasAiItems ? (
          <LuRotateCw className="size-4" />
        ) : (
          <LuSparkles className="size-4" />
        )}
        {generate.isPending
          ? t.studyPlan.generating
          : hasAiItems
            ? t.studyPlan.regenerate
            : t.studyPlan.generate}
      </Button>
      {generateErrorCode && (
        <p className="text-muted-foreground text-xs">
          {generateErrorCode === 'limit'
            ? t.errors.limitReached
            : generateErrorCode === 'busy'
              ? t.errors.busy
              : t.errors.generic}
        </p>
      )}

      {items.length > 0 && (
        <p className="text-muted-foreground text-xs">
          {dictionaryFormat(t.studyPlan.remaining, doneCount, items.length)}
        </p>
      )}

      {planQuery.isPending ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner />
          {dictionary.shared.loading}
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t.studyPlan.empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => {
            const done = item.status === 'completed';
            return (
              <li
                key={item.id}
                className="flex items-start gap-2 rounded-xl border bg-white/70 p-2.5 dark:bg-white/8"
              >
                <button
                  type="button"
                  aria-label={done ? t.studyPlan.markTodo : t.studyPlan.markDone}
                  onClick={() =>
                    updateItem.mutate({
                      itemId: item.id,
                      status: done ? 'todo' : 'completed',
                    })
                  }
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${
                    done
                      ? 'border-nexexam-success bg-nexexam-success/15 text-nexexam-success'
                      : 'bg-white dark:bg-white/10'
                  }`}
                >
                  {done && <LuCheck className="size-3.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      done ? 'text-muted-foreground line-through' : ''
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="rounded-md text-[10px]"
                    >
                      {item.plannedForDate || t.studyPlan.noDate}
                    </Badge>
                    {item.source === 'ai' && (
                      <Badge
                        variant="secondary"
                        className="rounded-md text-[10px]"
                      >
                        {t.studyPlan.aiBadge}
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={t.studyPlan.deleteItem}
                  onClick={() => deleteItem.mutate(item.id)}
                  className="text-muted-foreground mt-0.5 transition hover:text-red-500"
                >
                  <LuTrash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addItem();
            }
          }}
          placeholder={t.studyPlan.addPlaceholder}
          className="h-10 rounded-xl"
        />
        <Button
          variant="outline"
          className="h-10 shrink-0 rounded-xl bg-white/70 dark:bg-white/8"
          disabled={createItem.isPending || !newTitle.trim()}
          onClick={addItem}
        >
          <LuPlus className="size-4" />
          {t.studyPlan.addItem}
        </Button>
      </div>
    </div>
  );
}
