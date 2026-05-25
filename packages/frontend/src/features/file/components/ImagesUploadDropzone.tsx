import { useUploadFiles } from '@better-upload/client';
import { LuSearch, LuX } from 'react-icons/lu';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { ImageDialog } from '@/features/file/components/ImageDialog';
import { StorageConfig } from '@project/backend/features/permissions';
import { useAuthStore } from '@/features/auth/authStore';
import { toast } from 'sonner';
import { UploadDropzone } from '@/shared/components/upload-dropzone';
import { formatBytes } from '@better-upload/client/helpers';
import { useState } from 'react';

export function ImagesUploadDropzone({
  readonly,
  max,
  formats,
  storage,
  value,
  onChange,
  disabled,
}: {
  value: any;
  onChange?: (value: Array<FileUploaded> | null | undefined) => void;
  storage?: StorageConfig;
  readonly?: boolean;
  max?: number;
  formats?: string[];
  disabled?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [mouseOver, setMouseOver] = useState<string>('');

  const valueAsArray = value ? (Array.isArray(value) ? value : [value]) : [];

  const slides = valueAsArray
    .map((file: FileUploaded) => {
      const url = file.signedUrl || file.publicUrl;
      if (!url) return null;
      return { src: url, alt: file.name };
    })
    .filter((slide): slide is { src: string; alt: string } => slide !== null);

  const { isPending, control } = useUploadFiles({
    route: storage?.id || '',
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

      onChange && onChange([...valueAsArray, ...newFiles]);
      toast.success(dictionary.file.dropzone.uploadSuccessful);
    },
    onUploadFail: (result) => {
      console.error('Upload failed:', result);
      toast.error(dictionary.shared.errors.unknown);
    },
  });

  const handleRemove = (key: string) => {
    onChange &&
      onChange(
        valueAsArray?.filter(
          (fileUploaded: FileUploaded) => fileUploaded.key !== key,
        ),
      );
  };

  const formatsCommaSeparated = formats
    ?.map((format) => `.${format}`)
    .join(',');

  const filesLeft = max ? max - valueAsArray.length : Infinity;

  return (
    <div>
      {!readonly && filesLeft > 0 && storage && (
        <UploadDropzone
          control={control}
          accept={formatsCommaSeparated ? formatsCommaSeparated : 'image/*'}
          description={{
            fileTypes: formats?.join(', ') || 'images',
            maxFileSize: formatBytes(storage.maxSizeInBytes),
            maxFiles: max,
          }}
        />
      )}

      {valueAsArray?.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap">
          {valueAsArray.map((fileUploaded: FileUploaded, index: number) => {
            const imageUrl = fileUploaded.signedUrl || fileUploaded.publicUrl;
            return (
              <div
                className="mr-2 mb-2 rounded-md"
                style={{ height: '104px' }}
                key={fileUploaded.key}
                onMouseEnter={() => setMouseOver(fileUploaded.key)}
                onMouseLeave={() => setMouseOver('')}
              >
                <img
                  alt={fileUploaded.name}
                  src={imageUrl}
                  className="rounded-md"
                  style={{
                    width: '104px',
                    height: '104px',
                    objectFit: 'cover',
                  }}
                />

                <div
                  className="relative items-center justify-center gap-3 rounded-b-md p-2"
                  style={{
                    display: mouseOver === fileUploaded.key ? 'flex' : 'none',
                    bottom: '2.25rem',
                    width: '104px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <button
                    type="button"
                    className="text-white"
                    onClick={() => setPreviewIndex(index)}
                  >
                    <LuSearch className="h-5 w-5" />
                  </button>

                  {!readonly && (
                    <button
                      type="button"
                      className="text-white"
                      onClick={() => handleRemove(fileUploaded.key)}
                      disabled={isPending || disabled}
                    >
                      <LuX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewIndex !== null && (
        <ImageDialog
          slides={slides}
          index={previewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}
