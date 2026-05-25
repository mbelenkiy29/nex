import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { LuMegaphone, LuX } from 'react-icons/lu';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/authStore';

const storageKey = 'nexexam-seen-platform-promotions';

export function PlatformPromotionDisplay() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const dictionary = useAuthStore((state) => state.dictionary);
  const [dismissedBannerIds, setDismissedBannerIds] = useState<string[]>([]);

  const query = useQuery({
    queryKey: ['platformPromotion', 'active'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/platform-promotion/active', { signal })
        .json<{ promotions: Array<any> }>(),
    enabled: Boolean(currentUser),
    refetchInterval: 60000,
  });

  const seenIds = useMemo(() => {
    try {
      const parsed = JSON.parse(
        window.localStorage.getItem(storageKey) || '[]',
      );
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  }, [query.data?.promotions]);

  useEffect(() => {
    const promotions = query.data?.promotions || [];
    const toastPromotions = promotions.filter(
      (promotion) =>
        ['toast', 'discount'].includes(promotion.kind) &&
        !seenIds.includes(promotion.id),
    );

    if (!toastPromotions.length) {
      return;
    }

    const nextSeenIds = [...seenIds];
    toastPromotions.forEach((promotion) => {
      toast(promotion.title, {
        description: promotion.message,
        action: promotion.ctaHref
          ? {
              label:
                promotion.ctaLabel ||
                dictionary.platformAdmin.activePromotion.open,
              onClick: () => {
                window.location.href = promotion.ctaHref;
              },
            }
          : undefined,
      });
      nextSeenIds.push(promotion.id);
    });

    window.localStorage.setItem(storageKey, JSON.stringify(nextSeenIds));
  }, [dictionary, query.data?.promotions, seenIds]);

  const banner = (query.data?.promotions || []).find(
    (promotion) =>
      promotion.kind === 'banner' && !dismissedBannerIds.includes(promotion.id),
  );

  if (!banner) {
    return null;
  }

  return (
    <div className="border-nexexam-soft-blue bg-nexexam-soft-blue border-b px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="text-nexexam-primary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
            <LuMegaphone className="h-4 w-4" />
          </div>
          <div>
            <div className="text-nexexam-ink text-sm font-semibold">
              {banner.title}
            </div>
            <div className="text-nexexam-muted text-sm">{banner.message}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {banner.ctaHref && (
            <Button
              size="sm"
              variant="outline"
              render={<a href={banner.ctaHref} />}
            >
              {banner.ctaLabel || dictionary.platformAdmin.activePromotion.open}
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            aria-label={dictionary.platformAdmin.activePromotion.dismiss}
            onClick={() =>
              setDismissedBannerIds((current) => [...current, banner.id])
            }
          >
            <LuX className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
