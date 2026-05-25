import { ReactNode, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { AiTutorHistoryRail } from './AiTutorHistoryRail';

interface AiTutorShellProps {
  activeConversationId: string | null;
  children: ReactNode;
  renderMain: (openHistory: () => void) => ReactNode;
}

export function AiTutorShell({
  activeConversationId,
  children,
  renderMain,
}: AiTutorShellProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="grid h-[calc(100svh-73px)] min-h-0 grid-cols-1 overflow-hidden bg-white/72 text-foreground backdrop-blur-xl md:grid-cols-[280px_minmax(0,1fr)] dark:bg-nexexam-surface/70">
      <div className="hidden min-h-0 md:block">
        <AiTutorHistoryRail activeConversationId={activeConversationId} />
      </div>
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white/82 dark:bg-background/35">
        {renderMain(() => setMobileOpen(true))}
        {children}
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-80 border-r border-border bg-background/95 p-0 backdrop-blur-xl"
        >
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle>{dictionary.aiTutor.title}</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100dvh-64px)]">
            <AiTutorHistoryRail activeConversationId={activeConversationId} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
