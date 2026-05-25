import { LuMaximize2 } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';

interface AiTutorWidgetHeaderProps {
  scope: string;
  icon?: React.ComponentType<{ className?: string }>;
  onExpand?: () => void;
}

export function AiTutorWidgetHeader({
  scope,
  icon: Icon,
  onExpand,
}: AiTutorWidgetHeaderProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );

  return (
    <div className="mb-2 flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        {Icon ? (
          <div className="flex size-5 items-center justify-center rounded-md border border-border bg-white shadow-sm dark:bg-card">
            <Icon className="size-3 text-primary" />
          </div>
        ) : null}
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {dictionary.aiTutor.widgets.headerLabel} · {scope}
        </span>
      </div>
      {onExpand ? (
        <button
          type="button"
          onClick={onExpand}
          aria-label={dictionary.aiTutor.widgets.expand}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LuMaximize2 className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
