import { LuCheck, LuLoaderCircle, LuTriangleAlert } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { useBuilder } from './BuilderContext';

// Compact save-state pill shown in the builder top bar. Replaces the old
// manual "Save" button — saving is automatic.
export function AutosaveIndicator() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const text = dictionary.course.builder.autosave;
  const { saveStatus, retrySave, editable } = useBuilder();

  if (!editable || saveStatus === 'idle') {
    return null;
  }

  if (saveStatus === 'saving') {
    return (
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
        <LuLoaderCircle className="size-3.5 animate-spin" />
        {text.saving}
      </span>
    );
  }

  if (saveStatus === 'saved') {
    return (
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
        <LuCheck className="size-3.5 text-emerald-500" />
        {text.saved}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={retrySave}
      className="text-nexexam-warning flex items-center gap-1.5 text-xs font-semibold hover:underline"
    >
      <LuTriangleAlert className="size-3.5" />
      {text.error} · {text.retry}
    </button>
  );
}
