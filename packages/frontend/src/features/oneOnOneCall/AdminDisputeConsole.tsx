import { useEffect, useState } from 'react';
import { LuShield } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useAdminDispute,
  useAdminDisputes,
  useResolveDispute,
  type AdminDisputeRow,
} from './hooks/useAdminDisputes';
import type { OneOnOneDisputeStatus } from './hooks/useOneOnOneCall';

const STATUS_OPTIONS: Array<OneOnOneDisputeStatus | 'all'> = [
  'all',
  'open',
  'underReview',
  'resolvedRefund',
  'resolvedNoRefund',
];

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface DisputeRowProps {
  row: AdminDisputeRow;
  active: boolean;
  onSelect: (id: string) => void;
}

function DisputeRow({ row, active, onSelect }: DisputeRowProps) {
  const studentName = row.session.studentUser.name || row.session.studentUser.email;
  return (
    <button
      type="button"
      onClick={() => onSelect(row.id)}
      aria-pressed={active}
      className={`hover:bg-muted/50 flex w-full flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
        active ? 'border-primary bg-muted/40' : ''
      }`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm font-semibold">
          {row.session.course.title}
        </span>
        <Badge variant="secondary">{row.status}</Badge>
      </div>
      <span className="text-muted-foreground text-xs">
        {studentName} · {formatWhen(row.createdAt)}
      </span>
    </button>
  );
}

interface DisputeDetailProps {
  dispute: AdminDisputeRow;
}

function DisputeDetail({ dispute }: DisputeDetailProps) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.dispute);
  const resolve = useResolveDispute();
  const isResolved =
    dispute.status === 'resolvedRefund' || dispute.status === 'resolvedNoRefund';

  const session = dispute.session;
  const defaultRefund =
    session.priceCents != null ? session.priceCents : undefined;

  const [resolution, setResolution] = useState<'refund' | 'noRefund'>('refund');
  const [refundCents, setRefundCents] = useState<number | ''>(
    defaultRefund ?? '',
  );
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResolve = async () => {
    setErrorMessage(null);
    try {
      await resolve.mutateAsync({
        id: dispute.id,
        resolution,
        refundCents:
          resolution === 'refund' && typeof refundCents === 'number'
            ? refundCents
            : undefined,
        resolutionNotes: notes.trim() || undefined,
      });
    } catch (error: any) {
      const message =
        error?.response && typeof error.response.json === 'function'
          ? (await error.response.json().catch(() => null))?.errors?.[0]
              ?.message
          : null;
      setErrorMessage(message || 'Could not resolve the dispute.');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
        <CardContent className="space-y-3 p-5 text-sm">
          <h3 className="font-extrabold">{t.admin.detail}</h3>
          <dl className="text-muted-foreground grid grid-cols-[140px_1fr] gap-y-1 text-xs">
            <dt>Session</dt>
            <dd>
              {session.sessionType.title} · {session.sessionType.durationMinutes}{' '}
              min
            </dd>
            <dt>Course</dt>
            <dd>{session.course.title}</dd>
            <dt>Student</dt>
            <dd>
              {session.studentUser.name || session.studentUser.email}
            </dd>
            <dt>Instructor</dt>
            <dd>
              {session.instructorUser.name || session.instructorUser.email}
            </dd>
            <dt>Scheduled</dt>
            <dd>{new Date(session.scheduledStartAt).toLocaleString()}</dd>
            <dt>Price</dt>
            <dd>
              {session.priceCents != null
                ? `${session.priceCents / 100} ${session.currency}`
                : '—'}
            </dd>
            <dt>Paid at</dt>
            <dd>
              {session.paidAt ? new Date(session.paidAt).toLocaleString() : '—'}
            </dd>
            <dt>Refunded</dt>
            <dd>
              {session.refundedAt
                ? `${(session.refundCents ?? 0) / 100} ${session.currency} on ${new Date(session.refundedAt).toLocaleDateString()}`
                : '—'}
            </dd>
            <dt>Status</dt>
            <dd>{session.status}</dd>
          </dl>
          <div>
            <p className="text-foreground text-xs font-semibold">Reason</p>
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-xs">
              {dispute.reason}
            </p>
          </div>
          {dispute.resolutionNotes ? (
            <div>
              <p className="text-foreground text-xs font-semibold">
                {t.admin.notes}
              </p>
              <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-xs">
                {dispute.resolutionNotes}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {isResolved ? (
        <p className="text-muted-foreground text-sm">{t.admin.resolved}</p>
      ) : (
        <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
          <CardContent className="space-y-4 p-5">
            <h3 className="font-extrabold">{t.admin.resolve}</h3>
            <div className="space-y-2">
              <Label>{t.admin.resolutionLabel}</Label>
              <RadioGroup
                value={resolution}
                onValueChange={(value) =>
                  setResolution(value as 'refund' | 'noRefund')
                }
                className="flex gap-4"
              >
                <Label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="refund" />
                  {t.admin.refund}
                </Label>
                <Label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="noRefund" />
                  {t.admin.noRefund}
                </Label>
              </RadioGroup>
            </div>

            {resolution === 'refund' ? (
              <div className="space-y-2">
                <Label htmlFor="oneOnOneRefundCents">
                  {t.admin.refundAmount}
                </Label>
                <Input
                  id="oneOnOneRefundCents"
                  type="number"
                  min={50}
                  max={session.priceCents ?? 1_000_000}
                  value={refundCents}
                  onChange={(event) => {
                    const value = event.target.value;
                    setRefundCents(value === '' ? '' : Number(value));
                  }}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="oneOnOneResolutionNotes">{t.admin.notes}</Label>
              <Textarea
                id="oneOnOneResolutionNotes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            {errorMessage ? (
              <p className="text-destructive text-sm" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <Button onClick={handleResolve} disabled={resolve.isPending}>
              {resolve.isPending ? (
                <Spinner className="size-4" />
              ) : (
                t.admin.resolve
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Platform-admin dispute review: filter + master/detail pane. Two cards in the
 * detail panel — one for the read-only session info, one for the resolve form
 * — keeping each card focused on a single job (DESIGN.md).
 */
export function AdminDisputeConsole() {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.dispute);
  const [filter, setFilter] = useState<OneOnOneDisputeStatus | 'all'>('open');
  const list = useAdminDisputes(filter === 'all' ? undefined : filter);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detail = useAdminDispute(selectedId);

  // Auto-select the first row when the list changes (e.g. after filter change).
  useEffect(() => {
    const first = list.data?.disputes[0]?.id ?? null;
    if (!selectedId || !list.data?.disputes.some((d) => d.id === selectedId)) {
      setSelectedId(first);
    }
  }, [list.data, selectedId]);

  const rows = list.data?.disputes ?? [];

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
        <CardContent className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-extrabold">
            <LuShield className="text-primary size-5" />
            {t.admin.title}
          </h2>

          <div className="space-y-2">
            <Label htmlFor="oneOnOneDisputeFilter">{t.admin.statusFilter}</Label>
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter((value ?? 'all') as OneOnOneDisputeStatus | 'all')
              }
            >
              <SelectTrigger id="oneOnOneDisputeFilter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {list.isLoading ? (
            <Spinner className="size-4" />
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.admin.empty}</p>
          ) : (
            <div className="space-y-2">
              {rows.map((row) => (
                <DisputeRow
                  key={row.id}
                  row={row}
                  active={row.id === selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        {detail.isLoading ? (
          <Spinner className="size-4" />
        ) : detail.data ? (
          <DisputeDetail dispute={detail.data.dispute} />
        ) : (
          <p className="text-muted-foreground text-sm">{t.admin.empty}</p>
        )}
      </div>
    </div>
  );
}
