import { LuSearch } from 'react-icons/lu';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { ImageDialog } from '@/features/file/components/ImageDialog';
import { useState } from 'react';

export function ImagesGallery({
  value,
}: {
  value: FileUploaded[] | FileUploaded | null | undefined;
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [mouseOver, setMouseOver] = useState<string>('');

  const valueAsArray = value ? (Array.isArray(value) ? value : [value]) : [];

  const slides = valueAsArray
    .map((file) => {
      const url = file.signedUrl || file.publicUrl;
      if (!url) return null;
      return { src: url, alt: file.name };
    })
    .filter((slide): slide is { src: string; alt: string } => slide !== null);

  if (!valueAsArray?.length) {
    return null;
  }

  return (
    <div>
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
              </div>
            </div>
          );
        })}
      </div>

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
