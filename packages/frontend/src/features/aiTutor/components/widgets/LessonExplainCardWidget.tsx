import { Link } from '@tanstack/react-router';
import { LuLightbulb } from 'react-icons/lu';
import { AiTutorWidgetHeader } from './AiTutorWidgetHeader';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import type { LessonExplainCardWidget as Widget } from '@/features/aiTutor/aiTutorTypes';

export function LessonExplainCardWidget({
  payload,
}: {
  payload: Widget['payload'];
}) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );

  return (
    <div className="my-1 w-full max-w-md">
      <AiTutorWidgetHeader
        scope={dictionary.aiTutor.widgets.explain.title}
        icon={LuLightbulb}
      />
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_16px_40px_rgb(15_23_42/0.08)] dark:bg-card">
        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-base font-semibold leading-tight text-foreground">
              {payload.lessonTitle}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {payload.courseTitle}
            </p>
          </div>
          {payload.summary ? (
            <p className="text-sm leading-relaxed text-foreground">
              {payload.summary}
            </p>
          ) : null}
          {payload.keyPoints?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {payload.keyPoints.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="px-4 pb-4">
          <Link
            to="/student/course/$courseId"
            params={{ courseId: payload.lessonId }}
            search={{}}
            className="inline-flex items-center justify-center rounded-xl bg-nexexam-soft px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-nexexam-line/70 dark:bg-white/10 dark:hover:bg-white/15"
          >
            {dictionary.aiTutor.widgets.explain.openFullLesson}
          </Link>
        </div>
      </div>
    </div>
  );
}
