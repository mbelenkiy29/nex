import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { ExamTypeForm } from '@/features/examType/components/ExamTypeForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function ExamTypeFormSheet({
  examType,
  onCancel,
  onSuccess,
}: {
  examType?: Partial<ExamTypeWithRelationships>;
  onCancel: () => void;
  onSuccess: (examType: ExamTypeWithRelationships) => void;
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
            {examType?.id
              ? dictionary.examType.edit.title
              : dictionary.examType.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <ExamTypeForm
            examType={examType}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
