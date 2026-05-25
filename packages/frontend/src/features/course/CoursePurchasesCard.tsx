import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LuReceipt } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';

interface CoursePurchaseRow {
  id: string;
  createdAt: string;
  priceCents: number;
  currency: string;
  paidAt: string;
  refundedAt: string | null;
  refundReason: string | null;
  course: { id: string; title: string; slug: string };
  user: { id: string; name: string | null; email: string };
  organization: { id: string; name: string } | null;
}

type Filter = 'all' | 'active' | 'refunded';

const purchasesKey = (filter: Filter) =>
  ['platformAdmin', 'coursePurchases', filter] as const;

function useCoursePurchases(filter: Filter) {
  return useQuery({
    queryKey: purchasesKey(filter),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filter === 'refunded') params.refunded = 'true';
      if (filter === 'active') params.refunded = 'false';
      return apiClient
        .get('api/platform-admin/course-purchases', { searchParams: params })
        .json<{ count: number; purchases: CoursePurchaseRow[] }>();
    },
  });
}

function useRefundPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      refundReason,
    }: {
      id: string;
      refundReason: string | null;
    }) =>
      apiClient
        .patch(`api/platform-admin/course-purchases/${id}/refund`, {
          json: { refundReason },
        })
        .json<{ purchase: CoursePurchaseRow }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['platformAdmin', 'coursePurchases'] });
    },
  });
}

/**
 * Admin-facing list of every successful course Stripe purchase, with an
 * inline "Mark refunded" workflow. v1 is admin-driven: admin issues the
 * refund in Stripe Dashboard first, then clicks here to revoke access +
 * cancel the linked CreatorPayout. v2 wires the Stripe `charge.refunded`
 * webhook for full automation.
 */
export function CoursePurchasesCard() {
  const t = useAuthStore((s) => s.dictionary.adminCoursePurchases);
  const locale = useAuthStore((s) => s.locale);
  const [filter, setFilter] = useState<Filter>('all');
  const [refundTarget, setRefundTarget] = useState<CoursePurchaseRow | null>(
    null,
  );
  const [reason, setReason] = useState('');

  const query = useCoursePurchases(filter);
  const refundMutation = useRefundPurchase();
  const rows = query.data?.purchases ?? [];

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!refundTarget) return;
    await refundMutation.mutateAsync({
      id: refundTarget.id,
      refundReason: reason.trim() || null,
    });
    setRefundTarget(null);
    setReason('');
  }

  function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 font-extrabold">
              <LuReceipt className="text-primary size-5" />
              {t.title}
            </h2>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'refunded'] as const).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={filter === value ? 'default' : 'outline'}
                onClick={() => setFilter(value)}
              >
                {t.filters[value]}
              </Button>
            ))}
          </div>
        </div>

        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.empty}</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/60 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">{t.columns.buyer}</th>
                  <th className="px-4 py-2 text-left">{t.columns.course}</th>
                  <th className="px-4 py-2 text-right">{t.columns.amount}</th>
                  <th className="px-4 py-2 text-left">{t.columns.paidAt}</th>
                  <th className="px-4 py-2 text-left">
                    {t.columns.refundedAt}
                  </th>
                  <th className="px-4 py-2 text-right">{t.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-white/40 dark:border-white/10"
                  >
                    <td className="px-4 py-2">
                      <div className="font-medium">
                        {row.user.name || row.user.email}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {row.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-2">{row.course.title}</td>
                    <td className="px-4 py-2 text-right">
                      {formatPrice(row.priceCents, row.currency)}
                    </td>
                    <td className="text-muted-foreground px-4 py-2 text-xs">
                      {new Date(row.paidAt).toLocaleString(locale)}
                    </td>
                    <td className="px-4 py-2">
                      {row.refundedAt ? (
                        <Badge variant="outline">{t.badges.refunded}</Badge>
                      ) : (
                        <Badge variant="secondary">{t.badges.paid}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {!row.refundedAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRefundTarget(row);
                            setReason('');
                          }}
                        >
                          {t.actions.markRefunded}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog
        open={refundTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRefundTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.refundDialog.title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-muted-foreground text-sm">
              {t.refundDialog.description}
            </p>
            <div className="space-y-1">
              <Label htmlFor="coursePurchaseRefundReason">
                {t.refundDialog.reasonLabel}
              </Label>
              <Textarea
                id="coursePurchaseRefundReason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.refundDialog.reasonPlaceholder}
                maxLength={2000}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRefundTarget(null)}
              >
                {t.actions.cancel}
              </Button>
              <Button type="submit" disabled={refundMutation.isPending}>
                {refundMutation.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  t.actions.markRefunded
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
