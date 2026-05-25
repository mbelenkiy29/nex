import { LuCloudDownload, LuDownload } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  useDataExportDownloadMutation,
  useDataExportListQuery,
  useDataExportRequestMutation,
} from '../hooks/useUserAccount';
import type { DataExportRow } from '../userAccountTypes';

const COOLDOWN_HOURS = 24;

export function DataExportCard() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const t = dictionary.account.dataExport;
  const listQuery = useDataExportListQuery();
  const request = useDataExportRequestMutation();
  const download = useDataExportDownloadMutation();

  const items = listQuery.data?.items ?? [];
  const mostRecent = items[0];
  const withinCooldown =
    mostRecent &&
    Date.now() - new Date(mostRecent.createdAt).getTime() <
      COOLDOWN_HOURS * 60 * 60 * 1000;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuCloudDownload className="size-5" />
          {t.cardTitle}
        </CardTitle>
        <CardDescription>{t.cardBody}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Button
            disabled={request.isPending || Boolean(withinCooldown)}
            onClick={() =>
              request.mutate(undefined, {
                onSuccess: () => toast.success(t.requestedToast),
                onError: (e: any) =>
                  toast.error(
                    e?.message ||
                      dictionary.shared.errors?.unknown ||
                      'Error',
                  ),
              })
            }
          >
            {t.cardAction}
          </Button>
          {withinCooldown && (
            <p className="text-muted-foreground mt-2 text-xs">
              {dictionaryFormat(t.cooldownBody, COOLDOWN_HOURS)}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-muted/40 rounded-xl px-4 py-6 text-center">
            <p className="text-foreground text-sm font-semibold">
              {t.emptyTitle}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{t.emptyBody}</p>
          </div>
        ) : (
          <ul className="divide-border divide-y rounded-xl border">
            {items.map((row) => (
              <DataExportRowItem
                key={row.id}
                row={row}
                onDownload={async () => {
                  try {
                    const { downloadUrl } = await download.mutateAsync(row.id);
                    window.location.href = downloadUrl;
                  } catch (e: any) {
                    toast.error(e?.message || 'Download failed');
                  }
                }}
              />
            ))}
          </ul>
        )}
        <p className="text-muted-foreground text-xs">{t.downloadHint}</p>
      </CardContent>
    </Card>
  );
}

function DataExportRowItem({
  row,
  onDownload,
}: {
  row: DataExportRow;
  onDownload: () => void;
}) {
  const dictionary = useAuthStore((s) => s.dictionary);
  const t = dictionary.account.dataExport;
  const statusLabel =
    row.status === 'completed'
      ? t.statusCompleted
      : row.status === 'failed'
        ? t.statusFailed
        : t.statusQueued;
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <div>
        <div className="text-foreground font-medium">
          {new Date(row.createdAt).toLocaleString()}
        </div>
        <div className="text-muted-foreground text-xs">{statusLabel}</div>
      </div>
      {row.status === 'completed' && (
        <Button size="sm" variant="outline" onClick={onDownload}>
          <LuDownload className="size-4" />
          {t.downloadAction}
        </Button>
      )}
    </li>
  );
}
