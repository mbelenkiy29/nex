import { useState } from 'react';
import { LuShieldAlert } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import {
  useUserAccountDeletionRequestMutation,
  useUserAccountMeQuery,
} from '../hooks/useUserAccount';

/**
 * Card 2 of 3 on the Privacy & account page. Opens a confirmation dialog
 * with an explicit acknowledgement checkbox; submit → POST /deletion which
 * stamps the 14-day grace window and emails a confirmation link. The
 * DeletionScheduledBanner shows on the page top while the request is
 * pending so this card stays informational.
 */
export function AccountDeleteCard() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const t = dictionary.account.delete;
  const me = useUserAccountMeQuery().data;
  const request = useUserAccountDeletionRequestMutation();
  const [open, setOpen] = useState(false);
  const [ack, setAck] = useState(false);

  const alreadyRequested = Boolean(me?.deletionRequestedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuShieldAlert className="text-destructive size-5" />
          {t.cardTitle}
        </CardTitle>
        <CardDescription>{t.cardBody}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="text-destructive border-destructive/40 hover:bg-destructive/10"
          disabled={alreadyRequested}
          onClick={() => {
            setAck(false);
            setOpen(true);
          }}
        >
          {t.cardAction}
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dialogTitle}</DialogTitle>
              <DialogDescription>{t.dialogBody}</DialogDescription>
            </DialogHeader>

            <div className="flex items-start gap-2 py-2">
              <Checkbox
                id="account-delete-ack"
                checked={ack}
                onCheckedChange={(c) => setAck(Boolean(c))}
              />
              <Label
                htmlFor="account-delete-ack"
                className="text-sm leading-snug"
              >
                {t.dialogAcknowledge}
              </Label>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={request.isPending}
              >
                {dictionary.shared.cancel}
              </Button>
              <Button
                variant="default"
                disabled={!ack || request.isPending}
                onClick={() =>
                  request.mutate(undefined, {
                    onSuccess: () => {
                      setOpen(false);
                      toast.success(t.requestSentTitle, {
                        description: t.requestSentBody,
                      });
                    },
                    onError: (e: any) =>
                      toast.error(
                        e?.message ||
                          dictionary.shared.errors?.unknown ||
                          'Error',
                      ),
                  })
                }
              >
                {t.dialogSubmit}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
