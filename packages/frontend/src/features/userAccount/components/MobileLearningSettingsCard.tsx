import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LuBell, LuRefreshCw, LuSmartphone } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import type { StudentReminderPreference } from '@/features/studentExperience/studentExperienceTypes';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { apiClient } from '@/shared/lib/apiClient';
import {
  getNativePlatform,
  handlePushTokenAfterAuth,
  isNativeApp,
  nativeBridgeGetContext,
} from '@/shared/lib/nativeApp';
import { offlineSyncPendingMutations } from '@/shared/lib/offlineLearning';

type PreferenceResponse = {
  preferences: StudentReminderPreference[];
};

export function MobileLearningSettingsCard() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const [nativeContext, setNativeContext] = useState<{
    platform?: string | null;
    appVersion?: string | null;
  } | null>(null);
  const preferencesQuery = useQuery({
    queryKey: ['studentExperience', 'reminderPreferences'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/student/reminder-preferences', { signal })
        .json<PreferenceResponse>(),
  });
  const preference = preferencesQuery.data?.preferences.find(
    (item) => !item.courseId,
  );
  const [enabled, setEnabled] = useState(true);
  const [smartEnabled, setSmartEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('');
  const [quietHoursEnd, setQuietHoursEnd] = useState('');

  useEffect(() => {
    nativeBridgeGetContext().then((context) => {
      setNativeContext(
        context || {
          platform: getNativePlatform(),
          appVersion: null,
        },
      );
    });
  }, []);

  useEffect(() => {
    if (!preference) {
      return;
    }

    setEnabled(preference.enabled);
    setSmartEnabled(preference.smartRemindersEnabled);
    setQuietHoursStart(preference.quietHoursStart || '');
    setQuietHoursEnd(preference.quietHoursEnd || '');
  }, [preference]);

  const saveMutation = useMutation({
    mutationFn: () =>
      apiClient
        .put('api/student/reminder-preferences', {
          json: {
            enabled,
            smartRemindersEnabled: smartEnabled,
            quietHoursStart: quietHoursStart || null,
            quietHoursEnd: quietHoursEnd || null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            channels: ['mobilePush'],
          },
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['studentExperience', 'reminderPreferences'],
      });
      toast.success(dictionary.account.mobile.saved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const requestPushMutation = useMutation({
    mutationFn: handlePushTokenAfterAuth,
    onSuccess: () => toast.success(dictionary.account.mobile.pushRequested),
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <LuSmartphone className="text-primary size-5" />
              {dictionary.account.mobile.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {isNativeApp()
                ? dictionary.account.mobile.nativeReady
                : dictionary.account.mobile.webReady}
            </p>
          </div>
          <div className="text-muted-foreground rounded-xl border bg-white/72 px-3 py-2 text-xs font-bold dark:bg-white/8">
            {nativeContext?.platform || dictionary.account.mobile.browser}
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border bg-white/72 p-4 dark:bg-white/8">
            <div>
              <div className="font-bold">
                {dictionary.account.mobile.smartReminders}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {dictionary.account.mobile.smartRemindersDescription}
              </div>
            </div>
            <Switch checked={smartEnabled} onCheckedChange={setSmartEnabled} />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border bg-white/72 p-4 dark:bg-white/8">
            <div>
              <div className="font-bold">
                {dictionary.account.mobile.pushReminders}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {dictionary.account.mobile.pushRemindersDescription}
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>{dictionary.account.mobile.quietHoursStart}</Label>
              <Input
                type="time"
                value={quietHoursStart}
                onChange={(event) => setQuietHoursStart(event.target.value)}
                className="rounded-xl bg-white/80 dark:bg-white/8"
              />
            </div>
            <div className="grid gap-2">
              <Label>{dictionary.account.mobile.quietHoursEnd}</Label>
              <Input
                type="time"
                value={quietHoursEnd}
                onChange={(event) => setQuietHoursEnd(event.target.value)}
                className="rounded-xl bg-white/80 dark:bg-white/8"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="h-10 rounded-xl"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              <LuBell className="size-4" />
              {dictionary.account.mobile.save}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl bg-white/70"
              disabled={requestPushMutation.isPending}
              onClick={() => requestPushMutation.mutate()}
            >
              {dictionary.account.mobile.requestPush}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl bg-white/70"
              onClick={() => offlineSyncPendingMutations()}
            >
              <LuRefreshCw className="size-4" />
              {dictionary.account.mobile.syncNow}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
