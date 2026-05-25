import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
import { ConceptForm } from '@/features/concept/components/ConceptForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function ConceptFormSheet({
  concept,
  onCancel,
  onSuccess,
}: {
  concept?: Partial<ConceptWithRelationships>;
  onCancel: () => void;
  onSuccess: (concept: ConceptWithRelationships) => void;
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
            {concept?.id
              ? dictionary.concept.edit.title
              : dictionary.concept.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <ConceptForm
            concept={concept}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
