import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { ExamForm } from '@/features/exam/components/ExamForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function ExamFormSheet({
  exam,
  onCancel,
  onSuccess,
}: {
  exam?: Partial<ExamWithRelationships>;
  onCancel: () => void;
  onSuccess: (exam: ExamWithRelationships) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => (!open ? onCancel() : null)}
      modal={true}
    >
      <SheetContent className="w-full overflow-y-scroll sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {exam?.id ? dictionary.exam.edit.title : dictionary.exam.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <ExamForm exam={exam} onCancel={onCancel} onSuccess={onSuccess} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
