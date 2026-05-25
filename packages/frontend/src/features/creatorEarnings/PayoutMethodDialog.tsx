import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { useUpdateMyPayoutMethod } from './hooks/useCreatorEarnings';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialNote: string | null;
}

/**
 * Single Textarea + Save / Cancel. Per DESIGN.md: one job per surface, two
 * primary CTAs max (Save is default; Cancel is ghost), `Label htmlFor=` for
 * accessibility.
 */
export function PayoutMethodDialog({ open, onOpenChange, initialNote }: Props) {
  const t = useAuthStore((s) => s.dictionary.creatorEarnings.payoutMethod);
  const mutate = useUpdateMyPayoutMethod();
  const [draft, setDraft] = useState<string>(initialNote ?? '');

  // Sync the draft when the dialog re-opens with a different stored value.
  useEffect(() => {
    if (open) setDraft(initialNote ?? '');
  }, [open, initialNote]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    await mutate.mutateAsync(trimmed ? trimmed : null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{t.description}</p>
          <div className="space-y-2">
            <Label htmlFor="creatorPayoutMethodNote">{t.title}</Label>
            <Textarea
              id="creatorPayoutMethodNote"
              rows={5}
              value={draft}
              placeholder={t.placeholder}
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={mutate.isPending}>
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
