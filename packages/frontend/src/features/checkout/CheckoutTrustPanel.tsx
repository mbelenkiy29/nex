import type { ReactNode } from 'react';
import {
  LuBadgeCheck,
  LuCreditCard,
  LuGlobe,
  LuReceiptText,
  LuRefreshCw,
  LuShieldCheck,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { cn } from '@/shared/lib/utils';

type CheckoutTrustVariant =
  | 'subscription'
  | 'course'
  | 'courseBundle'
  | 'aiCreditPack'
  | 'oneOnOneSession';

export function CheckoutTrustPanel({
  variant,
  priceLabel,
  intervalLabel,
  couponApplied,
  compact = false,
  className,
}: {
  variant: CheckoutTrustVariant;
  priceLabel?: string | null;
  intervalLabel?: string | null;
  couponApplied?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const t = useAuthStore((state) => state.dictionary.checkoutTrust);
  const rows = checkoutTrustRows({
    t,
    variant,
    priceLabel,
    intervalLabel,
    couponApplied,
  });

  return (
    <div
      className={cn(
        'border-primary/15 bg-primary/5 rounded-2xl border',
        compact ? 'p-3' : 'p-4',
        className,
      )}
    >
      <Badge className="text-primary rounded-xl bg-white/80 hover:bg-white/80 dark:bg-white/10">
        <LuShieldCheck className="size-3.5" />
        {t.badge}
      </Badge>
      <div className={cn('grid', compact ? 'mt-3 gap-2' : 'mt-4 gap-3')}>
        {rows.map((row) => (
          <CheckoutTrustRow key={row.text} icon={row.icon} text={row.text} />
        ))}
      </div>
    </div>
  );
}

function checkoutTrustRows({
  t,
  variant,
  priceLabel,
  intervalLabel,
  couponApplied,
}: {
  t: any;
  variant: CheckoutTrustVariant;
  priceLabel?: string | null;
  intervalLabel?: string | null;
  couponApplied?: boolean;
}) {
  const rows: Array<{ icon: ReactNode; text: string }> = [];

  if (priceLabel) {
    rows.push({
      icon: <LuReceiptText className="size-4" />,
      text: dictionaryFormat(t.finalTotal, priceLabel),
    });
  }

  if (variant === 'subscription') {
    rows.push({
      icon: <LuRefreshCw className="size-4" />,
      text: dictionaryFormat(t.subscriptionRenewal, intervalLabel || ''),
    });
  }

  if (variant === 'course') {
    rows.push({
      icon: <LuBadgeCheck className="size-4" />,
      text: t.courseOneTime,
    });
    rows.push({
      icon: <LuShieldCheck className="size-4" />,
      text: t.courseRefund,
    });
  }

  if (variant === 'courseBundle') {
    rows.push({
      icon: <LuBadgeCheck className="size-4" />,
      text: t.courseBundleOneTime,
    });
    rows.push({
      icon: <LuShieldCheck className="size-4" />,
      text: t.courseRefund,
    });
  }

  if (variant === 'aiCreditPack') {
    rows.push({
      icon: <LuBadgeCheck className="size-4" />,
      text: t.aiCreditOneTime,
    });
  }

  if (variant === 'oneOnOneSession') {
    rows.push({
      icon: <LuBadgeCheck className="size-4" />,
      text: t.oneOnOneOneTime,
    });
    rows.push({
      icon: <LuRefreshCw className="size-4" />,
      text: t.oneOnOneHold,
    });
  }

  if (couponApplied) {
    rows.push({
      icon: <LuReceiptText className="size-4" />,
      text: t.couponReview,
    });
  }

  rows.push({
    icon: <LuCreditCard className="size-4" />,
    text: t.paymentMethods,
  });
  rows.push({
    icon: <LuGlobe className="size-4" />,
    text: t.noSurpriseFees,
  });

  return rows;
}

function CheckoutTrustRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="text-primary mt-0.5 shrink-0">{icon}</span>
      <span className="text-muted-foreground leading-5">{text}</span>
    </div>
  );
}
