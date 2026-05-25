import { useState } from 'react';
import { LuCalendarDays, LuCheck } from 'react-icons/lu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';
import { AiTutorWidgetHeader } from './AiTutorWidgetHeader';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/shared/lib/utils';
import type { StudyPlanListWidget as Widget } from '@/features/aiTutor/aiTutorTypes';

interface StudyPlanItem {
  title: string;
  description: string;
}

async function saveStudyPlanItem(
  courseId: string,
  item: StudyPlanItem,
): Promise<void> {
  await apiClient
    .post(`api/course-study-ai/${courseId}/study-plan`, {
      json: {
        title: item.title,
        description: item.description || undefined,
      },
    })
    .json();
}

export function StudyPlanListWidget({
  payload,
}: {
  payload: Widget['payload'];
}) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const queryClient = useQueryClient();
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const invalidateStudyPlanQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['studentExperience', 'dashboard'],
    });
    queryClient.invalidateQueries({
      queryKey: ['studentExperience', 'course', payload.courseId],
    });
  };

  const saveSingle = useMutation({
    mutationFn: async ({
      index,
      item,
    }: {
      index: number;
      item: StudyPlanItem;
    }) => {
      await saveStudyPlanItem(payload.courseId, item);
      return index;
    },
    onSuccess: (index) => {
      setSavedIndices((prev) => new Set(prev).add(index));
      invalidateStudyPlanQueries();
    },
  });

  const saveAll = useMutation({
    mutationFn: async () => {
      // Serial so the existing per-item endpoint preserves order.
      for (let i = 0; i < payload.items.length; i++) {
        if (savedIndices.has(i)) continue;
        await saveStudyPlanItem(payload.courseId, payload.items[i]);
      }
    },
    onSuccess: () => {
      setSavedIndices(new Set(payload.items.map((_, i) => i)));
      invalidateStudyPlanQueries();
    },
  });

  const allSaved = savedIndices.size === payload.items.length;

  return (
    <div className="my-1 w-full max-w-md">
      <AiTutorWidgetHeader
        scope={dictionary.aiTutor.widgets.plan.title}
        icon={LuCalendarDays}
      />
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_16px_40px_rgb(15_23_42/0.08)] dark:bg-card">
        <div className="space-y-3 border-b border-border/60 bg-muted/35 p-4">
          <div className="text-sm font-semibold text-foreground">
            {payload.courseTitle}
          </div>
          {payload.daysUntil != null && payload.examName ? (
            <div className="text-xs font-medium text-primary">
              {payload.examName} · {payload.daysUntil}{' '}
              {dictionary.aiTutor.widgets.plan.daysShort}
            </div>
          ) : null}
        </div>
        <div className="p-2">
          <ul className="space-y-2">
            {payload.items.map((item, i) => {
              const saved = savedIndices.has(i);
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {item.title}
                    </div>
                    {item.description ? (
                      <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={saved || saveSingle.isPending}
                    onClick={() => saveSingle.mutate({ index: i, item })}
                    className={cn(
                      'flex-shrink-0 rounded-lg px-2 py-1 text-xs font-semibold transition-colors',
                      saved
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-200'
                        : 'bg-muted text-foreground hover:bg-muted/70',
                    )}
                  >
                    {saved ? (
                      <span className="inline-flex items-center gap-1">
                        <LuCheck className="size-3" />
                        {dictionary.aiTutor.widgets.plan.completed}
                      </span>
                    ) : (
                      dictionary.aiTutor.widgets.plan.saveSingle
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={allSaved || saveAll.isPending}
            onClick={() => saveAll.mutate()}
            className={cn(
              'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
              allSaved
                ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-200'
                : 'bg-primary text-primary-foreground shadow-[0_12px_28px_rgb(91_92_246/0.22)]',
            )}
          >
            {allSaved
              ? dictionary.aiTutor.widgets.plan.completed
              : dictionary.aiTutor.widgets.plan.savePlan}
          </button>
        </div>
      </div>
    </div>
  );
}
