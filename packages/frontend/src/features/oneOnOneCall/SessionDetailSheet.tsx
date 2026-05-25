import { useState } from 'react';
import { LuExternalLink } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Spinner } from '@/shared/components/ui/spinner';
import { useSession } from './hooks/useOneOnOneCall';
import { SessionNotesPanel } from './SessionNotesPanel';
import { CancelSessionDialog } from './CancelSessionDialog';
import { OpenDisputeDialog } from './OpenDisputeDialog';

// Join link reveals 10 minutes before scheduled start.
const JOIN_WINDOW_MS = 10 * 60 * 1000;

interface Props {
  sessionId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailSheet({ sessionId, onOpenChange }: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall);
  const tSession = t.session;
  const tDispute = t.dispute;
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
  const detail = useSession(sessionId);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  const session = detail.data?.session;
  const notes = detail.data?.notes ?? [];

  const now = Date.now();
  const startMs = session ? new Date(session.scheduledStartAt).getTime() : 0;
  const joinUnlocked =
    session?.status === 'confirmed' && now >= startMs - JOIN_WINDOW_MS;
  const canCancel = session?.status === 'confirmed' || session?.status === 'pendingPayment';

  // Dispute affordance: student, paid + ended (completed / noShow), no existing dispute.
  const canDispute = Boolean(
    session &&
      currentUserId &&
      session.studentUser.id === currentUserId &&
      session.paidAt &&
      (session.priceCents ?? 0) > 0 &&
      (session.status === 'completed' || session.status === 'noShow') &&
      !session.dispute,
  );

  return (
    <Sheet open={sessionId !== null} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        {detail.isLoading || !session ? (
          <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Spinner className="size-4" />
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>{session.sessionType.title}</SheetTitle>
              <SheetDescription>
                {new Date(session.scheduledStartAt).toLocaleString()} ·{' '}
                {session.course.title}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{tSession.statusLabel}:</span>
                <Badge variant="secondary">
                  {tSession.statuses[session.status]}
                </Badge>
              </div>

              {session.status === 'confirmed' ? (
                joinUnlocked && session.jitsiUrl ? (
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        session.jitsiUrl ?? '',
                        '_blank',
                        'noreferrer',
                      )
                    }
                  >
                    {tSession.join} <LuExternalLink className="ml-2 size-4" />
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    {tSession.joinHint}
                  </p>
                )
              ) : null}

              {canCancel ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setCancelOpen(true)}
                >
                  {tSession.cancel}
                </Button>
              ) : null}

              {canDispute ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDisputeOpen(true)}
                >
                  {tDispute.open}
                </Button>
              ) : null}

              {session.dispute ? (
                <div className="rounded-xl border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{tDispute.admin.detail}</span>
                    <Badge variant="secondary">{session.dispute.status}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-xs">
                    {session.dispute.reason}
                  </p>
                </div>
              ) : null}

              <SessionNotesPanel sessionId={session.id} notes={notes} />
            </div>

            <CancelSessionDialog
              open={cancelOpen}
              onOpenChange={setCancelOpen}
              sessionId={session.id}
              scheduledStartAt={session.scheduledStartAt}
            />
            <OpenDisputeDialog
              open={disputeOpen}
              onOpenChange={setDisputeOpen}
              sessionId={session.id}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
