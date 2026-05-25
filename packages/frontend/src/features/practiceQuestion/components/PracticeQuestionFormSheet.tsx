import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { PracticeQuestionForm } from '@/features/practiceQuestion/components/PracticeQuestionForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function PracticeQuestionFormSheet({
  practiceQuestion,
  onCancel,
  onSuccess,
}: {
  practiceQuestion?: Partial<PracticeQuestionWithRelationships>;
  onCancel: () => void;
  onSuccess: (practiceQuestion: PracticeQuestionWithRelationships) => void;
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
            {practiceQuestion?.id
              ? dictionary.practiceQuestion.edit.title
              : dictionary.practiceQuestion.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <PracticeQuestionForm
            practiceQuestion={practiceQuestion}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
