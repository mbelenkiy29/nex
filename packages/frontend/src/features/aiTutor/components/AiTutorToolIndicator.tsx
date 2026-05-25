import { LuHammer } from 'react-icons/lu';
import { Spinner } from '@/shared/components/ui/spinner';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';

function humanizeToolName(name: string) {
  return name
    .replace(/^study_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function AiTutorToolIndicator({ toolName }: { toolName: string }) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Spinner className="size-4" />
      <LuHammer className="size-4" />
      <span>
        {dictionaryFormat(
          dictionary.aiTutor.thread.usingTool,
          humanizeToolName(toolName),
        )}
      </span>
    </div>
  );
}
