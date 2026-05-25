import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

export interface UnsavedChangesModalProps {
  title: string;
  message: string;
  discardText: string;
  cancelText: string;
  saveChangesText: string;
  onDiscard: () => void;
  onCancel: () => void;
  onSaveChanges: () => void;
  loading?: boolean;
}

export function UnsavedChangesModal({
  title,
  message,
  discardText,
  cancelText,
  saveChangesText,
  onDiscard,
  onCancel,
  onSaveChanges,
  loading,
}: UnsavedChangesModalProps) {
  return (
    <AlertDialog
      open={true}
      onOpenChange={(open) => (!open && !loading ? onCancel() : null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onSaveChanges} disabled={loading}>
            {saveChangesText}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onDiscard} disabled={loading}>
            {discardText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
