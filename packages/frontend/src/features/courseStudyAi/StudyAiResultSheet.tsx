import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LuRotateCw } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import {
  useCourseStudyAiStream,
  type StudyAiStreamMode,
} from './hooks/useCourseStudyAiStream';

interface StudyAiResultSheetProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  mode: StudyAiStreamMode;
  onClose: () => void;
}

/**
 * Side sheet that streams an "Explain this lesson" / "Summarize this lesson"
 * response as markdown. Rendered fresh (keyed) each time it is opened, so the
 * stream starts once on mount.
 */
export function StudyAiResultSheet({
  courseId,
  lessonId,
  lessonTitle,
  mode,
  onClose,
}: StudyAiResultSheetProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi;
  const { text, status, error, start } = useCourseStudyAiStream();

  useEffect(() => {
    start({ courseId, lessonId, mode });
  }, [start, courseId, lessonId, mode]);

  const title =
    mode === 'explain' ? t.result.explainTitle : t.result.summarizeTitle;

  const errorMessage =
    error === 'limit'
      ? t.errors.limitReached
      : error === 'busy'
        ? t.errors.busy
        : t.result.streamError;

  return (
    <Sheet
      open
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        style={{ width: '100%', maxWidth: 'min(640px, 100vw)' }}
        className="gap-0"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="text-lg font-extrabold">{title}</SheetTitle>
          <SheetDescription>{lessonTitle}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {status === 'error' ? (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">{errorMessage}</p>
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => start({ courseId, lessonId, mode })}
              >
                <LuRotateCw className="size-4" />
                {t.result.retry}
              </Button>
            </div>
          ) : !text && status === 'streaming' ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner />
              {t.result.generating}
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-7">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
              {status === 'streaming' && (
                <span className="bg-primary ml-0.5 inline-block h-4 w-1.5 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
