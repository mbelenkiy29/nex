import { useState } from 'react';
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
import { useOpenDispute } from './hooks/useOneOnOneCall';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}

/**
 * Single-purpose dispute form: one Textarea, one primary destructive CTA, one
 * ghost cancel. No multi-step, no second tab — matches DESIGN.md's "one job
 * per surface" rule.
 */
export function OpenDisputeDialog({ open, onOpenChange, sessionId }: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.dispute);
  const openDispute = useOpenDispute();
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const close = () => {
    setReason('');
    setErrorMessage(null);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    try {
      await openDispute.mutateAsync({ sessionId, reason: reason.trim() });
      close();
    } catch (error: any) {
      const message =
        error?.response && typeof error.response.json === 'function'
          ? (await error.response.json().catch(() => null))?.errors?.[0]?.message
          : null;
      setErrorMessage(message || t.notEligible);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.open}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="oneOnOneDisputeReason">{t.reasonLabel}</Label>
            <Textarea
              id="oneOnOneDisputeReason"
              rows={5}
              value={reason}
              placeholder={t.reasonPlaceholder}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>

          {errorMessage ? (
            <p className="text-destructive text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={reason.trim().length < 10 || openDispute.isPending}
          >
            {t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
