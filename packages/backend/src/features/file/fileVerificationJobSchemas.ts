/**
 * pg-boss queue used to verify uploaded files asynchronously, away from the
 * upload-completion request path. The worker fetches the first few KB of
 * the freshly-uploaded S3 object, sniffs its magic bytes, and deletes the
 * object (plus emits an audit-log entry) if the actual content disagrees
 * with the declared MIME in a way that could enable stored XSS.
 *
 * Added 2026-05-23 alongside audit finding #10. Job is async so a 100-300 ms
 * S3 round-trip doesn't slow down course-builder batch uploads.
 */
export const FILE_VERIFICATION_QUEUE = 'file-verification';

/** Only one kind today; the discriminant keeps the surface forward-compat. */
export type FileVerificationJobKind = 'magicBytes';

export interface FileVerificationJobData {
  kind: FileVerificationJobKind;
  /** S3 bucket the object lives in (public or private). */
  bucket: string;
  /** S3 key for the freshly-uploaded object. */
  key: string;
  /** Content-Type the uploader declared at presign / PUT time. */
  declaredMimeType: string;
  /** Original filename — used for log breadcrumbs only, never trusted. */
  fileName?: string;
  /** Uploader, for the audit-log entry if we end up rejecting the file. */
  uploaderUserId?: string;
  uploaderOrganizationId?: string;
  /** Storage config key (e.g. 'courseResources') — for log scope. */
  storageId?: string;
}
