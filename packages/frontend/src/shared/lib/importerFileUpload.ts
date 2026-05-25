import { uploadFile } from '@better-upload/client';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface UploadOptions {
  onProgress?: (uploaded: number, total: number) => void;
  uploadCache?: Map<string, FileUploaded>;
}

/**
 * Downloads files from URLs and uploads them to the backend storage.
 * Reuses already-uploaded files from cache to avoid duplicate uploads.
 *
 * @param urls - Array of URLs to download and upload (space-separated string or array)
 * @param storageId - Storage configuration ID (e.g., 'examAttachments')
 * @param options - Optional progress callback and upload cache
 * @returns Array of uploaded file metadata
 */
export async function downloadAndUploadFiles(
  urls: string | string[],
  storageId: string,
  options?: UploadOptions,
): Promise<FileUploaded[]> {
  const urlArray = Array.isArray(urls)
    ? urls
    : urls
        .split(' ')
        .map((u) => u.trim())
        .filter(Boolean);

  if (urlArray.length === 0) {
    return [];
  }

  const uploadedFiles: FileUploaded[] = [];
  const cache = options?.uploadCache || new Map<string, FileUploaded>();
  let completed = 0;

  for (const url of urlArray) {
    try {
      const cacheKey = `${storageId}:${url}`;

      if (cache.has(cacheKey)) {
        const cachedFile = cache.get(cacheKey)!;
        uploadedFiles.push(cachedFile);
        completed++;
        options?.onProgress?.(completed, urlArray.length);
        continue;
      }

      const file = await downloadFileFromUrl(url);
      const result = await uploadFileToBackend(file, storageId);

      if (result) {
        uploadedFiles.push(result);
        cache.set(cacheKey, result);
      }

      completed++;
      options?.onProgress?.(completed, urlArray.length);
    } catch (error) {
      console.error(`Failed to download/upload file from ${url}:`, error);
      completed++;
      options?.onProgress?.(completed, urlArray.length);
    }
  }

  return uploadedFiles;
}

/**
 * Downloads a file from a URL and converts it to a File object.
 */
async function downloadFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const blob = await response.blob();
  const filename = extractFilenameFromUrl(url, response);
  const contentType =
    response.headers.get('content-type') || 'application/octet-stream';

  return new File([blob], filename, { type: contentType });
}

/**
 * Extracts filename from URL or response headers.
 */
function extractFilenameFromUrl(url: string, response: Response): string {
  const contentDisposition = response.headers.get('content-disposition');
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=(['"]?)([^'"\n]*)\1/,
    );
    if (filenameMatch && filenameMatch[2]) {
      return filenameMatch[2];
    }
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    if (filename && filename.includes('.')) {
      return decodeURIComponent(filename);
    }
  } catch (error) {
    console.error('Failed to parse URL:', error);
  }

  return `file-${Date.now()}`;
}

/**
 * Uploads a file to the backend using better-upload client.
 */
async function uploadFileToBackend(
  file: File,
  storageId: string,
): Promise<FileUploaded | null> {
  try {
    const result: any = await uploadFile({
      file,
      route: storageId,
      api: `${VITE_BACKEND_URL}/api/file/upload`,
      credentials: 'include',
    });

    if (
      result.metadata?.files &&
      Array.isArray(result.metadata.files) &&
      result.metadata.files.length > 0
    ) {
      const uploadedFile = result.metadata.files[0];
      return {
        key: uploadedFile.key,
        name: uploadedFile.name,
        publicUrl: uploadedFile.publicUrl,
        signedUrl: uploadedFile.signedUrl,
        size: uploadedFile.size,
        type: uploadedFile.type,
      } as FileUploaded;
    }

    return null;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
