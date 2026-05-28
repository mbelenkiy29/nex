import { useState } from 'react';
import type { ComponentProps } from 'react';
import { LuShieldCheck } from 'react-icons/lu';
import { toast } from 'sonner';
import type {
  AiTrustPreferences,
  AiTrustPreferencesInput,
} from '@project/backend/features/aiTrust/aiTrustSchemas';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import {
  useAiTrustPreferences,
  useUpdateAiTrustPreferences,
} from './useAiTrustPreferences';

const preferenceRows: Array<{
  key: keyof AiTrustPreferences;
  textKey:
    | 'lessonContent'
    | 'lessonProgress'
    | 'practiceResults'
    | 'chatHistory'
    | 'attachments';
}> = [
  { key: 'useLessonContent', textKey: 'lessonContent' },
  { key: 'useLessonProgress', textKey: 'lessonProgress' },
  { key: 'usePracticeResults', textKey: 'practiceResults' },
  { key: 'useChatHistory', textKey: 'chatHistory' },
  { key: 'useAttachments', textKey: 'attachments' },
];

const defaultPreferences: AiTrustPreferences = {
  useLessonContent: true,
  useLessonProgress: true,
  usePracticeResults: true,
  useChatHistory: true,
  useAttachments: true,
};

export function AiPrivacyControlsSheet({
  className,
  size = 'icon-sm',
}: {
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
}) {
  const [open, setOpen] = useState(false);
  const dictionary = useAuthStore((state) => state.dictionary);
  const query = useAiTrustPreferences();
  const mutation = useUpdateAiTrustPreferences();
  const preferences = query.data?.preferences ?? defaultPreferences;
  const t = dictionary.aiTrust;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={size}
        className={cn('shrink-0', className)}
        aria-label={t.openControls}
        title={t.openControls}
        onClick={() => setOpen(true)}
      >
        <LuShieldCheck className="size-4" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md">
          <SheetHeader>
            <SheetTitle>{t.settingsTitle}</SheetTitle>
            <SheetDescription>{t.settingsDescription}</SheetDescription>
          </SheetHeader>

          <div className="space-y-3 px-4">
            {preferenceRows.map((row) => {
              const text = t.controls[row.textKey];
              return (
                <div
                  key={row.key}
                  className="rounded-2xl border bg-white/70 p-3 dark:bg-white/8"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold">{text.label}</div>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {text.description}
                      </p>
                    </div>
                    <Switch
                      checked={preferences[row.key]}
                      disabled={query.isLoading || mutation.isPending}
                      onCheckedChange={(checked) =>
                        mutation.mutate(
                          {
                            [row.key]: Boolean(checked),
                          } as AiTrustPreferencesInput,
                          {
                            onSuccess: () => toast.success(t.saved),
                          },
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
