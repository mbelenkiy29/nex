import { useState } from 'react';
import { LuVideo } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { useCourseSessionTypes } from './hooks/useOneOnOneCall';
import { BookSessionDialog } from './BookSessionDialog';

interface Props {
  courseId: string;
}

/**
 * Compact entry point shown in the course player's right aside. Surfaces a
 * "Book a 1:1" button whenever the course's instructor has at least one
 * active bookable session type; otherwise shows a quiet empty state.
 */
export function OneOnOneEntryCard({ courseId }: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.entryCard);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useCourseSessionTypes(courseId);
  const sessionTypes = data?.sessionTypes ?? [];
  const hasTypes = sessionTypes.length > 0;

  return (
    <>
      <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
        <CardContent className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-extrabold">
            <LuVideo className="text-primary size-5" />
            {t.title}
          </h2>
          <p className="text-muted-foreground text-sm">{t.description}</p>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
            </div>
          ) : hasTypes ? (
            <Button className="w-full" onClick={() => setOpen(true)}>
              {t.actionOpen}
            </Button>
          ) : (
            <p className="text-muted-foreground text-xs">{t.noAvailability}</p>
          )}
        </CardContent>
      </Card>
      {hasTypes ? (
        <BookSessionDialog
          open={open}
          onOpenChange={setOpen}
          courseId={courseId}
          sessionTypes={sessionTypes}
        />
      ) : null}
    </>
  );
}
