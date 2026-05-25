import { LuMail } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  useEmailPreferencesMutation,
  useUserAccountMeQuery,
} from '../hooks/useUserAccount';
import type { EmailChannel } from '../userAccountTypes';

const TOGGLABLE_CHANNELS = ['marketing', 'digest', 'productUpdates'] as const;
type TogglableChannel = (typeof TOGGLABLE_CHANNELS)[number];

export function EmailPreferencesCard() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const t = dictionary.account.emailPreferences;
  const meQuery = useUserAccountMeQuery();
  const mutate = useEmailPreferencesMutation();
  const unsubscribed = meQuery.data?.emailUnsubscribedChannels ?? [];

  function isSubscribed(channel: EmailChannel): boolean {
    return !unsubscribed.includes(channel);
  }

  function handleToggle(channel: TogglableChannel, next: boolean) {
    mutate.mutate(
      { [channel]: next },
      {
        onSuccess: () => toast.success(t.savedToast),
        onError: (e: any) =>
          toast.error(
            e?.message || dictionary.shared.errors?.unknown || 'Error',
          ),
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuMail className="size-5" />
          {t.cardTitle}
        </CardTitle>
        <CardDescription>{t.cardBody}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {TOGGLABLE_CHANNELS.map((channel) => {
          const labelKey =
            channel === 'marketing'
              ? t.marketingLabel
              : channel === 'digest'
                ? t.digestLabel
                : t.productUpdatesLabel;
          return (
            <div
              key={channel}
              className="flex items-center justify-between gap-3"
            >
              <Label htmlFor={`email-pref-${channel}`} className="text-sm">
                {labelKey}
              </Label>
              <Switch
                id={`email-pref-${channel}`}
                checked={isSubscribed(channel)}
                disabled={mutate.isPending || meQuery.isLoading}
                onCheckedChange={(v) => handleToggle(channel, v)}
              />
            </div>
          );
        })}
        <div className="border-border bg-muted/30 mt-2 flex items-start justify-between gap-3 rounded-xl border px-3 py-3">
          <div>
            <div className="text-foreground text-sm font-medium">
              {t.alwaysOnLabel}
            </div>
            <div className="text-muted-foreground mt-0.5 text-xs">
              {t.alwaysOnHint}
            </div>
          </div>
          <Switch checked disabled aria-disabled />
        </div>
      </CardContent>
    </Card>
  );
}
