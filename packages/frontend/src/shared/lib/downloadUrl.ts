import { FileUploaded } from '@project/backend/features/file/fileSchemas';

/**
 * Get download URL for a file or file array
 * Returns signedUrl for private files or publicUrl for public files
 *
 * @param files - Single file, array of files, or any value (for compatibility with Prisma JsonValue)
 * @param index - Index of file in array (default: 0)
 * @returns Download URL (signedUrl or publicUrl)
 */
export function downloadUrl(files: any, index = 0): string | undefined {
  if (!files) {
    return undefined;
  }

  if (Array.isArray(files)) {
    const file = files[index] as FileUploaded | undefined;
    return file?.signedUrl || file?.publicUrl;
  }

  if (!index && typeof files === 'object') {
    const file = files as FileUploaded;
    return file.signedUrl || file.publicUrl;
  }

  return undefined;
}
