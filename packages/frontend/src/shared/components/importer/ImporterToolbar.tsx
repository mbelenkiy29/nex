import { useState } from 'react';
import {
  LuFile,
  LuInfo,
  LuPause,
  LuPlay,
  LuTrash,
  LuUpload,
} from 'react-icons/lu';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { importerOutputSchema } from '@project/backend/shared/schemas/importerSchemas';
import { z } from 'zod';
import { useAuthStore } from '@/features/auth/authStore';

export function ImporterToolbar({
  state,
  doStart,
  doPause,
  doNew,
  rows,
  hasFileFields,
}: {
  rows: z.output<typeof importerOutputSchema>;
  state: 'idle' | 'uploading' | 'importing' | 'paused' | 'completed';
  doStart: () => void;
  doPause: () => void;
  doNew: () => void;
  hasFileFields?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [newConfirmVisible, setNewConfirmVisible] = useState(false);
  const [discardConfirmVisible, setDiscardConfirmVisible] = useState(false);

  const isOnlyErrorRows =
    rows.every((row) => row._status === 'error') && state === 'idle';
  const showStart =
    !isOnlyErrorRows && (state === 'idle' || state === 'paused');
  const showDiscard = state === 'idle' || state === 'paused';
  const showNew = state === 'completed';
  const showPause = state === 'importing';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {isOnlyErrorRows && (
          <TooltipProvider delay={0}>
            <Tooltip>
              <TooltipTrigger render={<span />}>
                <Button className="cursor-none" disabled>
                  <LuPlay className="mr-2 h-4 w-4" />
                  {dictionary.shared.import}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-destructive">
                  {dictionary.shared.importer.noValidRows}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {showStart && (
          <Button onClick={doStart}>
            {hasFileFields ? (
              <>
                <LuUpload className="mr-2 h-4 w-4" />
                {dictionary.shared.importer.uploadFiles}
              </>
            ) : (
              <>
                <LuPlay className="mr-2 h-4 w-4" />
                {dictionary.shared.import}
              </>
            )}
          </Button>
        )}

        {showPause && (
          <Button variant="secondary" onClick={doPause}>
            <LuPause className="mr-2 h-4 w-4" />
            {dictionary.shared.pause}
          </Button>
        )}

        {showDiscard && (
          <Button
            variant="secondary"
            onClick={() => setDiscardConfirmVisible(true)}
          >
            <LuTrash className="mr-2 h-4 w-4" /> {dictionary.shared.discard}
          </Button>
        )}

        {showNew && (
          <Button
            variant="secondary"
            onClick={() => setNewConfirmVisible(true)}
          >
            <LuFile className="mr-2 h-4 w-4" /> {dictionary.shared.new}
          </Button>
        )}

        {discardConfirmVisible && (
          <ConfirmDialog
            title={dictionary.shared.importer.list.discardConfirm}
            onConfirm={() => {
              setDiscardConfirmVisible(false);
              doNew();
            }}
            onCancel={() => setDiscardConfirmVisible(false)}
            confirmText={dictionary.shared.yes}
            cancelText={dictionary.shared.no}
          />
        )}

        {newConfirmVisible && (
          <ConfirmDialog
            title={dictionary.shared.importer.list.newConfirm}
            onConfirm={() => {
              setNewConfirmVisible(false);
              doNew();
            }}
            onCancel={() => setNewConfirmVisible(false)}
            confirmText={dictionary.shared.yes}
            cancelText={dictionary.shared.no}
          />
        )}
      </div>

      {hasFileFields && (showStart || showPause) && (
        <Alert>
          <LuInfo className="h-4 w-4" />
          <AlertDescription>
            {dictionary.shared.importer.uploadFilesDisclaimer}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
