import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  missingTrustSafetyPolicies,
  PolicyAcceptanceDialog,
  useTrustSafetyPolicies,
} from '@/features/trustSafety/PolicyAcceptanceDialog';
import { CheckoutTrustPanel } from '@/features/checkout/CheckoutTrustPanel';
import {
  useCourseSlots,
  useCreateBooking,
  type OneOnOneSessionType,
} from './hooks/useOneOnOneCall';
import { formatOneOnOnePrice } from './oneOnOneCallFormat';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  sessionTypes: OneOnOneSessionType[];
}

// Today's date in YYYY-MM-DD in the user's local timezone.
function localTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Local-day [start, end) as UTC ISO strings — picks up all slots that fall on
// the chosen calendar date in the viewer's timezone, regardless of UTC offset.
function localDayRangeUtc(dateStr: string): { from: string; to: string } {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { from: start.toISOString(), to: end.toISOString() };
}

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookSessionDialog({
  open,
  onOpenChange,
  courseId,
  sessionTypes,
}: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.booking);
  const locale = useAuthStore((s) => s.locale);
  const navigate = useNavigate();

  const [sessionTypeId, setSessionTypeId] = useState<string>(
    () => sessionTypes[0]?.id ?? '',
  );
  const [dateStr, setDateStr] = useState<string>(() => localTodayString());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [pendingStartUtc, setPendingStartUtc] = useState<string | null>(null);

  const range = useMemo(() => localDayRangeUtc(dateStr), [dateStr]);
  const slots = useCourseSlots(
    courseId,
    sessionTypeId || null,
    range.from,
    range.to,
  );
  const booking = useCreateBooking(courseId);
  const policiesQuery = useTrustSafetyPolicies(open);
  const selectedSessionType = sessionTypes.find(
    (sessionType) => sessionType.id === sessionTypeId,
  );
  const selectedSessionTypeIsPaid = Boolean(
    selectedSessionType &&
    !selectedSessionType.isFree &&
    (selectedSessionType.priceCents ?? 0) > 0,
  );
  const selectedSessionPriceLabel =
    selectedSessionType && selectedSessionTypeIsPaid
      ? formatOneOnOnePrice(
          selectedSessionType.priceCents,
          selectedSessionType.currency,
          locale,
        )
      : null;
  const missingRefundPolicies = missingTrustSafetyPolicies(
    policiesQuery.data?.policies,
    ['refundPolicy'],
  );

  const handleBook = async (startUtc: string, skipPolicyCheck = false) => {
    if (
      !skipPolicyCheck &&
      selectedSessionType &&
      !selectedSessionType.isFree &&
      (policiesQuery.isLoading || missingRefundPolicies.length)
    ) {
      setPendingStartUtc(startUtc);
      setPolicyDialogOpen(true);
      return;
    }

    setErrorMessage(null);
    try {
      const result = await booking.mutateAsync({ sessionTypeId, startUtc });
      onOpenChange(false);
      // Paid bookings hand back a Stripe Checkout URL — redirect immediately;
      // the webhook will confirm the session once payment succeeds. Free
      // bookings just go straight to "my sessions".
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        navigate({ to: '/sessions' });
      }
    } catch (error: any) {
      const message =
        error?.response && typeof error.response.json === 'function'
          ? (await error.response.json().catch(() => null))?.errors?.[0]
              ?.message
          : null;
      setErrorMessage(message || t.noSlots);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            {sessionTypes.length === 0 ? (
              <DialogDescription>{t.noSessionTypes}</DialogDescription>
            ) : null}
          </DialogHeader>

          {sessionTypes.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.pickSessionType}</Label>
                <Select
                  value={sessionTypeId}
                  onValueChange={(value) => setSessionTypeId(value ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map((st) => (
                      <SelectItem key={st.id} value={st.id}>
                        {dictionaryFormat(
                          t.sessionTypeOptionLabel,
                          st.title,
                          t.durationMinutesShort.replace(
                            '{0}',
                            String(st.durationMinutes),
                          ),
                          st.isFree
                            ? t.freeLabel
                            : formatOneOnOnePrice(
                                st.priceCents,
                                st.currency,
                                locale,
                              ),
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSessionTypeIsPaid ? (
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-xs">
                      {t.paidBookingNotice}
                    </p>
                    <CheckoutTrustPanel
                      variant="oneOnOneSession"
                      priceLabel={selectedSessionPriceLabel}
                      compact
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="oneOnOneDate">{t.pickDate}</Label>
                <Input
                  id="oneOnOneDate"
                  type="date"
                  value={dateStr}
                  min={localTodayString()}
                  onChange={(event) => setDateStr(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.pickTime}</Label>
                {slots.isFetching ? (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Spinner className="size-4" />
                  </div>
                ) : (slots.data?.slots.length ?? 0) === 0 ? (
                  <p className="text-muted-foreground text-sm">{t.noSlots}</p>
                ) : (
                  <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto">
                    {slots.data!.slots.map((slot) => (
                      <Button
                        key={slot.startUtc}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={booking.isPending}
                        onClick={() => handleBook(slot.startUtc)}
                      >
                        {formatSlotTime(slot.startUtc)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {errorMessage ? (
                <p className="text-destructive text-sm" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              {t.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PolicyAcceptanceDialog
        open={policyDialogOpen}
        onOpenChange={setPolicyDialogOpen}
        requiredTypes={['refundPolicy']}
        onAccepted={() => {
          if (pendingStartUtc) {
            const nextStart = pendingStartUtc;
            setPendingStartUtc(null);
            handleBook(nextStart, true);
          }
        }}
      />
    </>
  );
}
