import { useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { ImporterForm } from '@/shared/components/importer/ImporterForm';
import { ImporterStatus } from '@/shared/components/importer/ImporterStatus';
import { ImporterTable } from '@/shared/components/importer/ImporterTable';
import { ImporterToolbar } from '@/shared/components/importer/ImporterToolbar';
import { ImporterFileUploadStep } from '@/shared/components/importer/ImporterFileUploadStep';
import { useAuthStore } from '@/features/auth/authStore';
import { importerOutputSchema } from '@project/backend/shared/schemas/importerSchemas';
import { z } from 'zod';
import type { FileFieldConfig } from '@/shared/components/importer/importerTypes';

export function Importer({
  keys,
  labels,
  validationSchema,
  fileSchema,
  chunkSize = 50,
  importerFn,
  breadcrumbRoot,
  breadcrumbImporterMenu,
  importerTitle,
  queryKeyToInvalidate,
  fileFields,
}: {
  keys: string[];
  labels: Record<string, string>;
  fileSchema: z.ZodSchema<any>;
  validationSchema: z.ZodSchema<any>;
  importerFn: (chunk: any[]) => Promise<z.output<typeof importerOutputSchema>>;
  chunkSize?: number;
  breadcrumbRoot: [string, string];
  breadcrumbImporterMenu?: string;
  importerTitle?: string;
  queryKeyToInvalidate?: Array<string>;
  fileFields?: FileFieldConfig[];
}) {
  const queryClient = useQueryClient();
  const dictionary = useAuthStore((state) => state.dictionary);
  const [state, setState] = useState<
    'idle' | 'uploading' | 'importing' | 'paused' | 'completed'
  >('idle');
  const [filesUploaded, setFilesUploaded] = useState(false);

  const _rows = useRef<any[]>([]);
  const [rows, setRows] = React.useState<z.output<typeof importerOutputSchema>>(
    [],
  );

  function _setRows(rows: any[]) {
    _rows.current = rows;
    setRows(rows);
  }

  function onFileUploadComplete(updatedRows: any[]) {
    _setRows(updatedRows);
    setFilesUploaded(true);
    setState('idle');
  }

  async function doStart() {
    if (
      fileFields &&
      fileFields.length > 0 &&
      state === 'idle' &&
      !filesUploaded
    ) {
      setState('uploading');
      return;
    }

    setState('importing');

    while (_rows.current.some((row) => row._status === 'pending')) {
      if (state === 'paused') {
        break;
      }

      const chunk = _rows.current
        .filter((row) => row._status === 'pending')
        .slice(0, chunkSize);
      const result = await importerFn(chunk);

      _setRows(
        _rows.current.map((row) => {
          const match = result.find((r) => r._line === row._line);
          if (match) {
            return { ...row, ...match };
          }
          return row;
        }),
      );

      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: queryKeyToInvalidate,
        });
      }
    }

    const isCompleted = !_rows.current.some((row) => row._status === 'pending');
    if (isCompleted) {
      setState('completed');
    }
  }

  function doNew() {
    _setRows([]);
    setFilesUploaded(false);
    setState('idle');
  }

  function doPause() {
    setState('paused');
  }

  return (
    <div className="mb-4 flex w-full flex-col gap-4 overflow-x-hidden p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          items={[
            breadcrumbRoot,
            [breadcrumbImporterMenu || dictionary.shared.importer.menu],
          ]}
        />
        <div className="flex gap-2"></div>
      </div>

      {rows.length ? (
        <div className="mb-4 flex flex-col gap-4">
          {state === 'uploading' && fileFields && fileFields.length > 0 ? (
            <ImporterFileUploadStep
              rows={rows}
              fileFields={fileFields}
              onComplete={onFileUploadComplete}
            />
          ) : (
            <>
              <ImporterToolbar
                state={state}
                doNew={doNew}
                doPause={doPause}
                doStart={doStart}
                rows={rows}
                hasFileFields={
                  fileFields && fileFields.length > 0 && !filesUploaded
                }
              />
              <ImporterStatus state={state} rows={rows} />
              <ImporterTable keys={keys} labels={labels} rows={rows} />
            </>
          )}
        </div>
      ) : (
        <ImporterForm
          validationSchema={validationSchema}
          fileSchema={fileSchema}
          keys={keys}
          labels={labels}
          setRows={_setRows}
          title={importerTitle}
        />
      )}
    </div>
  );
}
