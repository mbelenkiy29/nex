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
import { useCancelSession } from './hooks/useOneOnOneCall';

const LATE_CANCEL_HOURS = 24;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  scheduledStartAt: string;
}

export function CancelSessionDialog({
  open,
  onOpenChange,
  sessionId,
  scheduledStartAt,
}: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.cancel);
  const [reason, setReason] = useState('');
  const cancel = useCancelSession();

  const hoursUntilStart =
    (new Date(scheduledStartAt).getTime() - Date.now()) / 3_600_000;
  const isLate = hoursUntilStart < LATE_CANCEL_HOURS;

  const handleConfirm = async () => {
    await cancel.mutateAsync({ id: sessionId, reason: reason || undefined });
    onOpenChange(false);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {isLate ? (
            <p className="text-destructive text-sm">{t.lateCancelWarning}</p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="cancelReason">{t.reasonLabel}</Label>
            <Textarea
              id="cancelReason"
              value={reason}
              rows={3}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t.keep}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={cancel.isPending}
          >
            {t.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
