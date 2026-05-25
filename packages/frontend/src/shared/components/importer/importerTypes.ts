import type { StorageConfig } from '@project/backend/features/permissions';

/**
 * Configuration for a file field in the CSV importer.
 */
export interface FileFieldConfig {
  field: string;
  storage: StorageConfig;
  multiple: boolean;
  required?: boolean;
}

/**
 * Progress tracking for file uploads per row.
 */
export interface FileUploadProgress {
  rowIndex: number;
  field: string;
  current: number;
  total: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

/**
 * Overall file upload state.
 */
export interface FileUploadState {
  phase: 'idle' | 'uploading' | 'completed';
  progress: Map<string, FileUploadProgress>;
  totalFiles: number;
  uploadedFiles: number;
  failedFiles: number;
}
