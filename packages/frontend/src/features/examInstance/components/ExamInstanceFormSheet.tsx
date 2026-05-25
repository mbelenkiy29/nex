import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';
import { ExamInstanceForm } from '@/features/examInstance/components/ExamInstanceForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function ExamInstanceFormSheet({
  examInstance,
  onCancel,
  onSuccess,
}: {
  examInstance?: Partial<ExamInstanceWithRelationships>;
  onCancel: () => void;
  onSuccess: (examInstance: ExamInstanceWithRelationships) => void;
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
            {examInstance?.id
              ? dictionary.examInstance.edit.title
              : dictionary.examInstance.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <ExamInstanceForm
            examInstance={examInstance}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
