import { Button } from '@/shared/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { csvExporterTemplate } from '@/shared/lib/csvExporter';
import { csvReader } from '@/shared/lib/csvReader';
import { useAuthStore } from '@/features/auth/authStore';
import { IMPORTER_STATUS } from '@project/backend/shared/schemas/importerSchemas';
import md5 from 'md5';
import { useRef, useState } from 'react';
import { LuUpload } from 'react-icons/lu';
import { z } from 'zod';

export function ImporterForm({
  fileSchema,
  validationSchema,
  keys,
  labels,
  setRows,
  title,
}: {
  fileSchema: z.ZodSchema<any>;
  validationSchema: z.ZodSchema<any>;
  keys: string[];
  labels: Record<string, string>;
  setRows: (rows: any[]) => void;
  title?: string;
}) {
  const input = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const dictionary = useAuthStore((state) => state.dictionary);

  function doDownloadTemplate() {
    csvExporterTemplate(keys, labels, 'template');
  }

  async function doReadFile(file: File) {
    setErrorMessage('');
    try {
      const rawData = await csvReader(file, keys);

      if (!rawData?.length) {
        setErrorMessage(dictionary.shared.importer.errors.invalidFileEmpty);
        return;
      }

      let data = z.array(fileSchema).parse(rawData);

      data = data.map((item, index) => {
        return {
          _line: index + 1,
          ...item,
          importHash: md5(JSON.stringify(item)),
        };
      });

      const rows = data.map((row) => {
        let _status: IMPORTER_STATUS = 'pending';

        const validation = validationSchema.safeParse(row);

        if (!validation.success) {
          const _errorMessages = validation.error.issues.map((error) => {
            const pathKey = String(error.path[0]);
            return `${labels[pathKey] || pathKey}: ${error.message}`;
          });

          _status = 'error';

          return {
            ...row,
            _status,
            _errorMessages,
          };
        }

        return { ...row, _status };
      });

      setRows(rows);
    } catch (error) {
      setErrorMessage(dictionary.shared.importer.errors.invalidFileEmpty);
      setRows([]);
    }
  }

  return (
    <div>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <LuUpload className="size-12" />
          </EmptyMedia>
          <EmptyTitle>{title || dictionary.shared.importer.title}</EmptyTitle>
          <EmptyDescription>
            {dictionary.shared.importer.form.description}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              render={<label />}
              variant={'default'}
            >
              {dictionary.file.button}
              <input
                style={{ display: 'none' }}
                accept={'.csv'}
                type="file"
                onChange={async (event) => {
                  const files = event.target.files;

                  if (!files || !files.length) {
                    return;
                  }

                  const file = files[0];

                  if (file) {
                    await doReadFile(file);
                  }

                  event.target.value = '';
                }}
                ref={input}
              />
            </Button>

            <Button variant={'outline'} onClick={doDownloadTemplate}>
              {dictionary.shared.importer.form.downloadTemplate}
            </Button>
          </div>
        </EmptyContent>
      </Empty>

      {errorMessage && (
        <div className="mt-4 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
