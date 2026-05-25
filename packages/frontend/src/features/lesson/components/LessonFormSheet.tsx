import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { LessonForm } from '@/features/lesson/components/LessonForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function LessonFormSheet({
  lesson,
  onCancel,
  onSuccess,
}: {
  lesson?: Partial<LessonWithRelationships>;
  onCancel: () => void;
  onSuccess: (lesson: LessonWithRelationships) => void;
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
            {lesson?.id
              ? dictionary.lesson.edit.title
              : dictionary.lesson.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <LessonForm
            lesson={lesson}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
