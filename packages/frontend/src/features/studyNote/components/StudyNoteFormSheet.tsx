import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';
import { StudyNoteForm } from '@/features/studyNote/components/StudyNoteForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function StudyNoteFormSheet({
  studyNote,
  onCancel,
  onSuccess,
}: {
  studyNote?: Partial<StudyNoteWithRelationships>;
  onCancel: () => void;
  onSuccess: (studyNote: StudyNoteWithRelationships) => void;
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
            {studyNote?.id
              ? dictionary.studyNote.edit.title
              : dictionary.studyNote.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <StudyNoteForm
            studyNote={studyNote}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
