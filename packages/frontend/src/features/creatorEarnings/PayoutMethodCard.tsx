import { useState } from 'react';
import { LuLandmark } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { useMyPayoutMethod } from './hooks/useCreatorEarnings';
import { PayoutMethodDialog } from './PayoutMethodDialog';

export function PayoutMethodCard() {
  const t = useAuthStore((s) => s.dictionary.creatorEarnings.payoutMethod);
  const query = useMyPayoutMethod();
  const [open, setOpen] = useState(false);
  const note = query.data?.payoutMethodNote ?? null;

  return (
    <>
      <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
        <CardContent className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-extrabold">
            <LuLandmark className="text-primary size-5" />
            {t.title}
          </h2>
          <p className="text-muted-foreground text-sm">{t.description}</p>

          {query.isLoading ? (
            <Spinner className="size-4" />
          ) : note ? (
            <p className="bg-muted/50 whitespace-pre-wrap rounded-xl border p-3 text-sm">
              {note}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">{t.empty}</p>
          )}

          <Button variant="outline" onClick={() => setOpen(true)}>
            {t.edit}
          </Button>
        </CardContent>
      </Card>

      <PayoutMethodDialog
        open={open}
        onOpenChange={setOpen}
        initialNote={note}
      />
    </>
  );
}
