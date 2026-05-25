import { useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useSetExamDate, type ExamDate } from './hooks/useCourseStudyAi';

interface ExamDateDialogProps {
  courseId: string;
  current: ExamDate | undefined;
}

/**
 * A trigger button + dialog for setting the student's target exam date and
 * exam name (stored per course on the enrollment).
 */
export function ExamDateDialog({ courseId, current }: ExamDateDialogProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi.examDate;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const mutation = useSetExamDate(courseId);

  const openDialog = () => {
    setDate(current?.targetExamDate ?? '');
    setName(current?.examName ?? '');
    setOpen(true);
  };

  const save = () => {
    mutation.mutate(
      { targetExamDate: date || null, examName: name || null },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-8 shrink-0 rounded-lg bg-white/70 text-xs dark:bg-white/8"
        onClick={openDialog}
      >
        {current?.targetExamDate ? t.edit : t.set}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold">{t.dateLabel}</label>
              <Input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">{t.nameLabel}</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.namePlaceholder}
                className="mt-1 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="h-10 rounded-xl"
              disabled={mutation.isPending || !date}
              onClick={save}
            >
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
