import { useState } from 'react';
import { LuCookie } from 'react-icons/lu';
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
import { Switch } from '@/shared/components/ui/switch';
import { useCookieConsentMutation } from '@/features/userAccount/hooks/useUserAccount';
import { useCookieConsentStore } from './cookieConsentStore';

/**
 * Sticky-bottom banner shown until the user records a consent choice.
 * Three quick paths: "Essential only" (deny analytics + marketing),
 * "Accept all", or "Customize" → opens a Dialog with two switches.
 *
 * When a signed-in user makes a choice, we mirror it to the backend so
 * the preference survives device changes. Anonymous visitors keep it in
 * localStorage only.
 */
export function CookieBanner() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const isSignedIn = Boolean(useAuthStore((s) => s.currentUser));
  const t = dictionary.cookies;
  const hasDecided = useCookieConsentStore((s) => s.hasDecided());
  const setConsent = useCookieConsentStore((s) => s.setConsent);
  const remoteMutate = useCookieConsentMutation();
  const [customOpen, setCustomOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  function apply(next: { analytics: boolean; marketing: boolean }) {
    setConsent(next);
    if (isSignedIn) {
      // Fire-and-forget: the user's choice persists locally regardless.
      remoteMutate.mutate(next);
    }
  }

  if (hasDecided) return null;

  return (
    <>
      <div
        role="dialog"
        aria-label={t.bannerTitle}
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6"
      >
        <div className="bg-card ring-foreground/10 mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl p-4 shadow-lg ring-1 sm:flex-row sm:items-center sm:gap-4">
          <LuCookie className="size-5 shrink-0" aria-hidden />
          <div className="flex-1 text-sm">
            <p className="text-foreground font-semibold">{t.bannerTitle}</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
              {t.bannerBody}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomOpen(true)}
            >
              {t.customize}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => apply({ analytics: false, marketing: false })}
            >
              {t.essentialOnly}
            </Button>
            <Button
              size="sm"
              onClick={() => apply({ analytics: true, marketing: true })}
            >
              {t.acceptAll}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.customizeTitle}</DialogTitle>
            <DialogDescription>{t.bannerBody}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <ConsentRow
              title={t.essentialLabel}
              body={t.essentialBody}
              checked
              disabled
            />
            <ConsentRow
              title={t.analyticsLabel}
              body={t.analyticsBody}
              checked={analytics}
              onCheckedChange={setAnalytics}
            />
            <ConsentRow
              title={t.marketingLabel}
              body={t.marketingBody}
              checked={marketing}
              onCheckedChange={setMarketing}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomOpen(false)}
            >
              {dictionary.shared.cancel}
            </Button>
            <Button
              onClick={() => {
                apply({ analytics, marketing });
                setCustomOpen(false);
              }}
            >
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ConsentRow({
  title,
  body,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{body}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => onCheckedChange?.(Boolean(v))}
      />
    </div>
  );
}
