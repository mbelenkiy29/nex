import { LuDownload } from 'react-icons/lu';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';

/**
 * Read-only file list component with download links
 * Displays files as a vertical list with download icons
 */
export function FilesList({
  files,
}: {
  files?: FileUploaded[] | FileUploaded | null;
}) {
  const filesArray = files ? (Array.isArray(files) ? files : [files]) : [];

  if (!filesArray?.length) {
    return null;
  }

  return (
    <div>
      {filesArray.map((file: FileUploaded) => {
        return (
          <div className="flex items-center" key={file.key}>
            <div className="flex items-center text-blue-500 hover:text-blue-400 hover:underline focus:text-blue-400 dark:text-blue-400">
              <a
                href={file.signedUrl || file.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-center gap-1"
              >
                <LuDownload className="h-4 w-4" />
                {file.name}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
