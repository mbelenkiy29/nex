import { DocumentUploadWithRelationships } from '@project/backend/features/documentUpload/documentUploadSchemas';
import { DocumentUploadForm } from '@/features/documentUpload/components/DocumentUploadForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function DocumentUploadFormSheet({
  documentUpload,
  onCancel,
  onSuccess,
}: {
  documentUpload?: Partial<DocumentUploadWithRelationships>;
  onCancel: () => void;
  onSuccess: (documentUpload: DocumentUploadWithRelationships) => void;
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
            {documentUpload?.id
              ? dictionary.documentUpload.edit.title
              : dictionary.documentUpload.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <DocumentUploadForm
            documentUpload={documentUpload}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
