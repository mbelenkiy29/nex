import { useUploadFiles } from '@better-upload/client';
import { LuDownload, LuX } from 'react-icons/lu';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { StorageConfig } from '@project/backend/features/permissions';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { toast } from 'sonner';
import { UploadDropzone } from '@/shared/components/upload-dropzone';
import { formatBytes } from '@better-upload/client/helpers';

export function FilesUploadDropzone({
  readonly,
  max,
  formats,
  storage,
  value,
  onChange,
  disabled,
  testId,
}: {
  readonly?: boolean;
  max?: number;
  formats?: string[];
  storage: StorageConfig;
  value: any;
  onChange: (value: Array<FileUploaded> | null | undefined) => void;
  disabled?: boolean;
  testId?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  const valueAsArray = value ? (Array.isArray(value) ? value : [value]) : [];

  const { isPending, control } = useUploadFiles({
    route: storage.id,
    api: `${import.meta.env.VITE_BACKEND_URL || ''}/api/file/upload`,
    credentials: 'include',
    onUploadComplete: (result) => {
      // Metadata contains the files array with publicUrl or signedUrl
      const metadataFiles = (result.metadata?.files as any[]) || [];
      const newFiles: FileUploaded[] = metadataFiles.map((file: any) => ({
        key: file.key,
        name: file.name,
        publicUrl: file.publicUrl,
        signedUrl: file.signedUrl,
        size: file.size,
        type: file.type,
      }));

      onChange([...valueAsArray, ...newFiles]);
      toast.success(dictionary.file.dropzone.uploadSuccessful);
    },
    onUploadFail: (result) => {
      console.error('Upload failed:', result);
      toast.error(dictionary.shared.errors.unknown);
    },
  });

  const handleRemove = (key: string) => {
    onChange(
      valueAsArray.filter(
        (uploadedFile: FileUploaded) => uploadedFile.key !== key,
      ),
    );
  };

  const formatsCommaSeparated = formats
    ?.map((format) => `.${format}`)
    .join(',');

  const filesLeft = max ? max - valueAsArray.length : Infinity;

  return (
    <div>
      {!readonly && filesLeft > 0 && (
        <UploadDropzone
          testId={testId}
          control={control}
          accept={formatsCommaSeparated}
          description={{
            fileTypes: formats?.join(', '),
            maxFileSize: formatBytes(storage.maxSizeInBytes),
            maxFiles: max,
          }}
        />
      )}

      {valueAsArray?.length > 0 && (
        <div className="mt-2 space-y-2">
          {valueAsArray.map((item: FileUploaded) => {
            return (
              <div className="flex items-center justify-between" key={item.key}>
                <div className="flex items-center text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400">
                  <a
                    href={item.signedUrl || item.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-1"
                  >
                    <LuDownload className="h-4 w-4" />
                    {item.name}
                  </a>
                </div>

                {!readonly && (
                  <Button
                    type="button"
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() => handleRemove(item.key)}
                    title={dictionary.file.delete}
                    className="ml-2"
                    disabled={isPending || disabled}
                  >
                    <LuX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
