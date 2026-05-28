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
import { AiPrivacyControlsSheet } from '@/features/aiTrust/AiPrivacyControlsSheet';

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

  const initials = (currentUser?.name || currentUser?.email || 'U')
    .slice(0, 1)
    .toUpperCase();

  return (
    <>
      <header
        className={cn(
          'border-border/80 dark:bg-background/72 sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/84 px-4 py-3 shadow-[0_10px_30px_rgb(15_23_42/0.04)] backdrop-blur-xl',
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {onOpenHistory ? (
            <button
              type="button"
              onClick={onOpenHistory}
              aria-label={dictionary.aiTutor.header.openHistory}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-1.5 transition-colors md:hidden"
            >
              <LuMenu className="size-5" />
            </button>
          ) : null}
          <span className="text-foreground font-semibold tracking-normal">
            {dictionary.aiTutor.title}
          </span>
          <span className="text-muted-foreground hidden text-sm font-normal sm:inline">
            {dictionary.aiTutor.header.studyMode}
          </span>
          {title ? (
            <>
              <span className="text-muted-foreground/50 hidden sm:inline">
                ·
              </span>
              <span className="text-muted-foreground hidden max-w-[34vw] min-w-0 truncate text-sm lg:inline">
                {title}
              </span>
            </>
          ) : null}
          {courseTitle ? (
            <span
              className="bg-muted text-muted-foreground ml-2 hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs sm:inline-flex"
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
          <AiPrivacyControlsSheet />
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
          <Avatar className="bg-primary text-primary-foreground size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
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
    <div className="border-border dark:bg-background absolute top-16 right-4 z-30 w-52 rounded-2xl border bg-white p-3 shadow-[0_20px_44px_rgb(15_23_42/0.16)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <LuTimer className="size-3.5" />
          {dictionary.aiTutor.timer.label}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={dictionary.aiTutor.timer.close}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-0.5 transition-colors"
        >
          <LuX className="size-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-foreground font-mono text-3xl font-light tracking-normal">
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
      <div className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
