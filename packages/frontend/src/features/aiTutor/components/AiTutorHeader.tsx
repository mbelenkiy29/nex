import { useEffect, useState } from 'react';
import {
  LuGraduationCap,
  LuMenu,
  LuPause,
  LuPlay,
  LuTimer,
  LuX,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

interface AiTutorHeaderProps {
  title: string;
  courseTitle?: string | null;
  onOpenHistory?: () => void;
}

const studyTimerSeconds = 25 * 60;

export function AiTutorHeader({
  title,
  courseTitle,
  onOpenHistory,
}: AiTutorHeaderProps) {
  const { dictionary, currentUser } = useAuthStore(
    useShallow((s) => ({
      dictionary: s.dictionary,
      currentUser: s.currentUser,
    })),
  );
  const [showTimer, setShowTimer] = useState(false);

  const initials =
    (currentUser?.name || currentUser?.email || 'U')
      .slice(0, 1)
      .toUpperCase();

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border/80 bg-white/84 px-4 py-3 shadow-[0_10px_30px_rgb(15_23_42/0.04)] backdrop-blur-xl dark:bg-background/72',
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {onOpenHistory ? (
            <button
              type="button"
              onClick={onOpenHistory}
              aria-label={dictionary.aiTutor.header.openHistory}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              <LuMenu className="size-5" />
            </button>
          ) : null}
          <span className="font-semibold tracking-normal text-foreground">
            {dictionary.aiTutor.title}
          </span>
          <span className="hidden text-sm font-normal text-muted-foreground sm:inline">
            {dictionary.aiTutor.header.studyMode}
          </span>
          {title ? (
            <>
              <span className="hidden text-muted-foreground/50 sm:inline">
                ·
              </span>
              <span className="hidden min-w-0 max-w-[34vw] truncate text-sm text-muted-foreground lg:inline">
                {title}
              </span>
            </>
          ) : null}
          {courseTitle ? (
            <span
              className="ml-2 hidden items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline-flex"
              title={courseTitle}
            >
              <LuGraduationCap className="size-3" />
              {dictionaryFormat(
                dictionary.aiTutor.thread.courseChip,
                courseTitle,
              )}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTimer((value) => !value)}
            aria-label={dictionary.aiTutor.timer.toggle}
            title={dictionary.aiTutor.timer.toggle}
            className={cn(
              'grid size-9 place-items-center rounded-full transition-colors',
              showTimer
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <LuTimer className="size-5" />
          </button>
          <Avatar className="size-8 bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      {showTimer ? (
        <AiTutorStudyTimer onClose={() => setShowTimer(false)} />
      ) : null}
    </>
  );
}

function AiTutorStudyTimer({ onClose }: { onClose: () => void }) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const [timeLeft, setTimeLeft] = useState(studyTimerSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const intervalId = window.setInterval(() => {
      setTimeLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) setIsActive(false);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (1 - timeLeft / studyTimerSeconds) * 100;
  const toggleLabel = isActive
    ? dictionary.aiTutor.timer.pause
    : dictionary.aiTutor.timer.resume;

  return (
    <div className="absolute top-16 right-4 z-30 w-52 rounded-2xl border border-border bg-white p-3 shadow-[0_20px_44px_rgb(15_23_42/0.16)] dark:bg-background">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <LuTimer className="size-3.5" />
          {dictionary.aiTutor.timer.label}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={dictionary.aiTutor.timer.close}
          className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LuX className="size-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-3xl font-light tracking-normal text-foreground">
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </div>
        <button
          type="button"
          onClick={() => setIsActive((value) => !value)}
          aria-label={toggleLabel}
          title={toggleLabel}
          className={cn(
            'grid size-10 place-items-center rounded-full transition-colors',
            isActive
              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-200'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        >
          {isActive ? (
            <LuPause className="size-4 fill-current" />
          ) : (
            <LuPlay className="ml-0.5 size-4 fill-current" />
          )}
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
