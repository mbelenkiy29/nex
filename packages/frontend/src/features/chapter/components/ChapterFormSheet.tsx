import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { ChapterForm } from '@/features/chapter/components/ChapterForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function ChapterFormSheet({
  chapter,
  onCancel,
  onSuccess,
}: {
  chapter?: Partial<ChapterWithRelationships>;
  onCancel: () => void;
  onSuccess: (chapter: ChapterWithRelationships) => void;
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
            {chapter?.id
              ? dictionary.chapter.edit.title
              : dictionary.chapter.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <ChapterForm
            chapter={chapter}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
