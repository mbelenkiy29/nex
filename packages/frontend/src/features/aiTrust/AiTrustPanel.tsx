import { LuDatabase, LuShieldCheck, LuTriangleAlert } from 'react-icons/lu';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import type {
  AiTrustDataSource,
  AiTrustSignal,
} from '@project/backend/features/aiTrust/aiTrustSchemas';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';

function statusClassName(status: AiTrustDataSource['status']) {
  if (status === 'used') {
    return 'border-nexexam-success/30 bg-nexexam-success/10 text-nexexam-success';
  }
  if (status === 'omitted') {
    return 'border-primary/20 bg-primary/10 text-primary';
  }
  return 'border-muted bg-muted/70 text-muted-foreground';
}

export function AiTrustPanel({
  trust,
  className,
  defaultOpen = false,
}: {
  trust?: AiTrustSignal | null;
  className?: string;
  defaultOpen?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.aiTrust;

  if (!trust) {
    return null;
  }

  const statusLabel = {
    used: t.panel.used,
    omitted: t.panel.omitted,
    unavailable: t.panel.unavailable,
  };

  return (
    <details
      open={defaultOpen}
      className={cn(
        'group border-primary/15 rounded-2xl border bg-white/75 p-3 shadow-sm dark:bg-white/8',
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold marker:hidden">
        <LuShieldCheck className="text-primary size-4" />
        <span>{t.panel.trigger}</span>
        <Badge variant="secondary" className="ml-auto rounded-md">
          {t.confidence[trust.confidenceLevel]}
        </Badge>
      </summary>

      <div className="mt-3 space-y-3 text-sm">
        <section className="space-y-1">
          <h3 className="text-muted-foreground text-xs font-bold uppercase">
            {t.panel.why}
          </h3>
          <p className="text-foreground">{trust.whyGenerated}</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold uppercase">
            <LuDatabase className="size-3.5" />
            {t.panel.influencedBy}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {trust.influencingData.map((source, index) => (
              <div
                key={`${source.key}-${index}`}
                className="rounded-xl border bg-white/70 p-2 dark:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-bold">
                    {t.sources[source.key]}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-md text-[10px]',
                      statusClassName(source.status),
                    )}
                  >
                    {statusLabel[source.status]}
                  </Badge>
                </div>
                {source.count !== undefined || source.details?.length ? (
                  <div className="text-muted-foreground mt-1 text-xs">
                    {source.count !== undefined ? (
                      <span>{source.count}</span>
                    ) : null}
                    {source.details?.length ? (
                      <span className="block truncate">
                        {source.details.join(', ')}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {trust.limitations.length ? (
          <section className="space-y-2">
            <h3 className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold uppercase">
              <LuTriangleAlert className="size-3.5" />
              {t.panel.limitations}
            </h3>
            <ul className="text-muted-foreground space-y-1 text-xs">
              {trust.limitations.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="text-muted-foreground flex flex-wrap gap-2 border-t pt-2 text-xs">
          <span>
            {t.panel.generated}: {formatDateTime(trust.generatedAt, dictionary)}
          </span>
          {trust.model ? (
            <span>
              {t.panel.model}: {trust.model}
            </span>
          ) : null}
          <span>{t.panel.privacyNote}</span>
        </section>
      </div>
    </details>
  );
}
