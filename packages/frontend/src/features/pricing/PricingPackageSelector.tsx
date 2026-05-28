import { LuCheck, LuSparkles, LuZap } from 'react-icons/lu';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/authStore';
import { PricingPackage } from './pricingTypes';

export function PricingPackageSelector({
  packages,
  selectedPackageId,
  onSelect,
  onCheckout,
  checkoutLabel,
  pending,
}: {
  packages: PricingPackage[];
  selectedPackageId?: string | null;
  onSelect?: (pkg: PricingPackage) => void;
  onCheckout?: (pkg: PricingPackage) => void;
  checkoutLabel?: string;
  pending?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);

  if (!packages.length) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {packages.map((pkg) => {
        const selected = selectedPackageId === pkg.id;
        return (
          <Card
            key={pkg.id}
            className={`rounded-2xl border bg-white/75 p-0 dark:bg-white/8 ${
              selected ? 'border-primary/70 shadow-[var(--nexexam-glow)]' : ''
            }`}
          >
            <CardContent className="p-4">
              <button
                type="button"
                className="grid w-full gap-3 text-left"
                onClick={() => onSelect?.(pkg)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold">{pkg.name}</h3>
                      {pkg.recommended && (
                        <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                          <LuSparkles className="size-3.5" />
                          {dictionary.pricing.recommended}
                        </Badge>
                      )}
                      {pkg.savingsPercent ? (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-xl">
                          {dictionary.pricing.savingsBadge.replace(
                            '{0}',
                            String(pkg.savingsPercent),
                          )}
                        </Badge>
                      ) : null}
                    </div>
                    {pkg.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold">
                      {formatPackagePrice(pkg, locale)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {packageIntervalLabel(pkg, dictionary)}
                    </div>
                  </div>
                </div>
                {pkg.tokenAmount ? (
                  <div className="text-primary flex items-center gap-2 text-xs font-semibold">
                    <LuZap className="size-3.5" />
                    {dictionary.pricing.aiTokensIncluded.replace(
                      '{0}',
                      new Intl.NumberFormat(locale).format(pkg.tokenAmount),
                    )}
                  </div>
                ) : null}
                {pkg.benefits.length > 0 && (
                  <ul className="grid gap-2">
                    {pkg.benefits.slice(0, 4).map((benefit) => (
                      <li
                        key={benefit}
                        className="text-muted-foreground flex items-start gap-2 text-xs"
                      >
                        <LuCheck className="text-primary mt-0.5 size-3.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
              {onCheckout && (
                <Button
                  type="button"
                  className="mt-4 h-10 w-full rounded-xl"
                  disabled={pending}
                  onClick={() => onCheckout(pkg)}
                >
                  {checkoutLabel || dictionary.pricing.choosePackage}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function formatPackagePrice(pkg: PricingPackage, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: pkg.currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(pkg.priceCents / 100);
}

function packageIntervalLabel(pkg: PricingPackage, dictionary: any) {
  if (pkg.billingInterval === 'month') {
    return dictionary.pricing.perMonth;
  }
  if (pkg.billingInterval === 'year') {
    return dictionary.pricing.perYear;
  }

  return dictionary.pricing.oneTime;
}
