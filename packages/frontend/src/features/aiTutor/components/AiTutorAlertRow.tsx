import { LuTriangleAlert, LuX } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/shared/lib/utils';
import type { AiTutorAlertRow as AlertRow } from '@/features/aiTutor/aiTutorTypes';

interface AiTutorAlertRowProps {
  alert: AlertRow;
  onDismiss: () => void;
}

export function AiTutorAlertRow({ alert, onDismiss }: AiTutorAlertRowProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );

  const text =
    alert.message ||
    dictionary.aiTutor.alerts[alert.kind] ||
    dictionary.aiTutor.alerts.networkError;

  const tone =
    alert.kind === 'limitDaily' ||
    alert.kind === 'limitOrg' ||
    alert.kind === 'limitGlobal'
      ? 'info'
      : 'warn';

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm',
        tone === 'info'
          ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-100'
          : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-100',
      )}
      role="status"
    >
      <LuTriangleAlert className="mt-0.5 size-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">{text}</div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dictionary.aiTutor.alerts.dismiss}
        className="rounded-full p-1 text-current opacity-70 transition-opacity hover:opacity-100"
      >
        <LuX className="size-4" />
      </button>
    </div>
  );
}
