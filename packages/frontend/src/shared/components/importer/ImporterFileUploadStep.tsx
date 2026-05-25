import { useEffect, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { downloadAndUploadFiles } from '@/shared/lib/importerFileUpload';
import type {
  FileFieldConfig,
  FileUploadProgress,
} from '@/shared/components/importer/importerTypes';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { LuCircleCheck, LuX, LuLoader } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';

interface ImporterFileUploadStepProps {
  rows: any[];
  fileFields: FileFieldConfig[];
  onComplete: (updatedRows: any[]) => void;
}

export function ImporterFileUploadStep({
  rows,
  fileFields,
  onComplete,
}: ImporterFileUploadStepProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, FileUploadProgress>
  >(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    uploadFiles();
  }, []);

  async function uploadFiles() {
    setIsUploading(true);

    const updatedRows = [...rows];
    const uploadCache = new Map<string, FileUploaded>();

    // Initialize all progress entries upfront
    const initialProgress = new Map<string, FileUploadProgress>();
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      if (row._status === 'error') {
        continue;
      }

      for (const fileField of fileFields) {
        const fieldValue = row[fileField.field];

        if (
          !fieldValue ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        ) {
          if (fileField.required) {
            updatedRows[rowIndex] = {
              ...row,
              _status: 'error',
              _errorMessages: [
                ...(row._errorMessages || []),
                `${fileField.field}: ${dictionary.shared.importer.errors.fileRequired}`,
              ],
            };
          }
          continue;
        }

        const progressKey = `${rowIndex}-${fileField.field}`;
        const urls = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

        initialProgress.set(progressKey, {
          rowIndex,
          field: fileField.field,
          current: 0,
          total: urls.length,
          status: 'pending',
        });
      }
    }

    setUploadProgress(initialProgress);

    // Now process uploads
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      if (row._status === 'error') {
        continue;
      }

      for (const fileField of fileFields) {
        const fieldValue = row[fileField.field];

        if (
          !fieldValue ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        ) {
          continue;
        }

        const progressKey = `${rowIndex}-${fileField.field}`;
        const urls = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

        setUploadProgress((prev) =>
          new Map(prev).set(progressKey, {
            rowIndex,
            field: fileField.field,
            current: 0,
            total: urls.length,
            status: 'uploading',
          }),
        );

        try {
          const uploadedFiles = await downloadAndUploadFiles(
            urls,
            fileField.storage.id,
            {
              uploadCache,
              onProgress: (current, total) => {
                setUploadProgress((prev) =>
                  new Map(prev).set(progressKey, {
                    rowIndex,
                    field: fileField.field,
                    current,
                    total,
                    status: 'uploading',
                  }),
                );
              },
            },
          );

          if (uploadedFiles.length === 0) {
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              _status: 'error',
              _errorMessages: [
                ...(updatedRows[rowIndex]._errorMessages || []),
                `${fileField.field}: ${dictionary.shared.importer.errors.uploadFailed}`,
              ],
            };

            setUploadProgress((prev) =>
              new Map(prev).set(progressKey, {
                rowIndex,
                field: fileField.field,
                current: 0,
                total: urls.length,
                status: 'error',
                errorMessage: dictionary.shared.importer.errors.uploadFailed,
              }),
            );
          } else if (uploadedFiles.length < urls.length) {
            const partialUploadMsg = dictionaryFormat(
              dictionary.shared.importer.errors.partialUpload,
              uploadedFiles.length,
              urls.length,
            );
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              [fileField.field]: uploadedFiles,
              _status: 'error',
              _errorMessages: [
                ...(updatedRows[rowIndex]._errorMessages || []),
                `${fileField.field}: ${partialUploadMsg}`,
              ],
            };

            setUploadProgress((prev) =>
              new Map(prev).set(progressKey, {
                rowIndex,
                field: fileField.field,
                current: uploadedFiles.length,
                total: urls.length,
                status: 'error',
                errorMessage: partialUploadMsg,
              }),
            );
          } else {
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              [fileField.field]: uploadedFiles,
            };

            setUploadProgress((prev) =>
              new Map(prev).set(progressKey, {
                rowIndex,
                field: fileField.field,
                current: urls.length,
                total: urls.length,
                status: 'completed',
              }),
            );
          }
        } catch (error) {
          console.error(
            `Failed to upload files for row ${rowIndex}, field ${fileField.field}:`,
            error,
          );

          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            _status: 'error',
            _errorMessages: [
              ...(updatedRows[rowIndex]._errorMessages || []),
              `${fileField.field}: ${error instanceof Error ? error.message : 'Upload failed'}`,
            ],
          };

          setUploadProgress((prev) =>
            new Map(prev).set(progressKey, {
              rowIndex,
              field: fileField.field,
              current: 0,
              total: urls.length,
              status: 'error',
              errorMessage:
                error instanceof Error ? error.message : 'Unknown error',
            }),
          );
        }
      }
    }

    setIsUploading(false);
    setIsComplete(true);
    onComplete(updatedRows);
  }

  const totalProgress = Array.from(uploadProgress.values());
  const completedCount = totalProgress.filter(
    (p) => p.status === 'completed',
  ).length;
  const errorCount = totalProgress.filter((p) => p.status === 'error').length;
  const uploadingCount = totalProgress.filter(
    (p) => p.status === 'uploading',
  ).length;
  const totalCount = totalProgress.length;
  const overallProgress =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle className="flex items-center gap-2">
          {isUploading && <Spinner className="h-4 w-4" />}
          {isComplete && <LuCircleCheck className="h-4 w-4 text-green-600" />}
          {dictionary.shared.importer.fileUpload.title}
        </AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="mr-2">
                {dictionaryFormat(
                  dictionary.shared.importer.fileUpload.progress,
                  completedCount,
                  totalCount,
                )}
              </span>
              <div className="flex gap-2">
                {uploadingCount > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <LuLoader className="h-3 w-3 animate-spin" />
                    {dictionaryFormat(
                      dictionary.shared.importer.fileUpload.uploading,
                      uploadingCount,
                    )}
                  </Badge>
                )}
                {completedCount > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <LuCircleCheck className="h-3 w-3 text-green-600" />
                    {dictionaryFormat(
                      dictionary.shared.importer.fileUpload.completed,
                      completedCount,
                    )}
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <LuX className="h-3 w-3 text-red-600" />
                    {dictionaryFormat(
                      dictionary.shared.importer.fileUpload.failed,
                      errorCount,
                    )}
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </AlertDescription>
      </Alert>

      <div className="max-h-96 space-y-2 overflow-y-auto rounded-md border p-4">
        {Array.from(uploadProgress.entries()).map(([key, progress]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 rounded-md border p-2 text-sm"
          >
            <div className="flex flex-1 items-center gap-2">
              {progress.status === 'uploading' && (
                <LuLoader className="h-4 w-4 animate-spin text-blue-600" />
              )}
              {progress.status === 'completed' && (
                <LuCircleCheck className="h-4 w-4 text-green-600" />
              )}
              {progress.status === 'error' && (
                <LuX className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">
                {dictionaryFormat(
                  dictionary.shared.importer.fileUpload.rowLabel,
                  progress.rowIndex + 1,
                  progress.field,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {progress.current} / {progress.total}
              </span>
              {progress.status === 'error' && progress.errorMessage && (
                <span className="text-xs text-red-600">
                  {progress.errorMessage}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
