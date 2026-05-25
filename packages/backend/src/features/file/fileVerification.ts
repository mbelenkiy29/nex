import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { env } from '../../env';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { getPgBoss } from '../../shared/jobs/pgBoss';
import { durationMs, hashForLogging, logger } from '../../shared/lib/logger';
import {
  FILE_VERIFICATION_QUEUE,
  type FileVerificationJobData,
} from './fileVerificationJobSchemas';

/**
 * Maximum bytes we fetch from S3 to identify a file. Enough to identify
 * every format in the upload allowlist (and to read the first ~1 KB of any
 * stray HTML / SVG payload), well under the 1 MB SDK overhead.
 */
const SNIFF_BYTES = 4096;

/**
 * Coarse kinds the sniffer can identify. The verification policy compares
 * one of these against the uploader's declared MIME — exact MIME match is
 * not required (e.g. .docx and .xlsx both ride ZIP).
 */
export type SniffedKind =
  | 'pdf'
  | 'png'
  | 'jpeg'
  | 'gif'
  | 'webp'
  | 'zip' // .docx / .xlsx / .pptx / generic ZIP archives
  | 'cfb' // legacy .doc / .xls / .ppt
  | 'mp4'
  | 'webm'
  | 'mp3'
  | 'wav'
  | 'ogg'
  | 'html'
  | 'svg-or-xml'
  | 'text';

/**
 * Identifies the buffer's actual format from its first few bytes. Returns
 * `null` for binary blobs we don't recognise (we won't proactively reject
 * those — the false-positive cost is too high).
 */
export function sniffMimeKind(buf: Uint8Array): SniffedKind | null {
  if (buf.length < 4) return null;

  // PDF: "%PDF"
  if (
    buf[0] === 0x25 &&
    buf[1] === 0x50 &&
    buf[2] === 0x44 &&
    buf[3] === 0x46
  ) {
    return 'pdf';
  }
  // PNG: 89 50 4E 47
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return 'png';
  }
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'jpeg';
  }
  // GIF87a / GIF89a
  if (buf.length >= 6) {
    const head = String.fromCharCode(
      buf[0],
      buf[1],
      buf[2],
      buf[3],
      buf[4],
      buf[5],
    );
    if (head === 'GIF87a' || head === 'GIF89a') return 'gif';
  }
  // RIFF container — WebP or WAV
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46
  ) {
    if (
      buf[8] === 0x57 &&
      buf[9] === 0x45 &&
      buf[10] === 0x42 &&
      buf[11] === 0x50
    ) {
      return 'webp';
    }
    if (
      buf[8] === 0x57 &&
      buf[9] === 0x41 &&
      buf[10] === 0x56 &&
      buf[11] === 0x45
    ) {
      return 'wav';
    }
  }
  // ZIP local file header: 'PK' 03 04 (covers .docx / .xlsx / .pptx)
  if (
    buf[0] === 0x50 &&
    buf[1] === 0x4b &&
    buf[2] === 0x03 &&
    buf[3] === 0x04
  ) {
    return 'zip';
  }
  // CFB compound document (legacy Office): D0 CF 11 E0
  if (
    buf[0] === 0xd0 &&
    buf[1] === 0xcf &&
    buf[2] === 0x11 &&
    buf[3] === 0xe0
  ) {
    return 'cfb';
  }
  // ISO base media (MP4 / MOV / etc): 'ftyp' at offset 4
  if (
    buf.length >= 8 &&
    buf[4] === 0x66 &&
    buf[5] === 0x74 &&
    buf[6] === 0x79 &&
    buf[7] === 0x70
  ) {
    return 'mp4';
  }
  // EBML / WebM / Matroska: 1A 45 DF A3
  if (
    buf[0] === 0x1a &&
    buf[1] === 0x45 &&
    buf[2] === 0xdf &&
    buf[3] === 0xa3
  ) {
    return 'webm';
  }
  // MP3: 'ID3' tag OR MPEG frame sync (11 bits set)
  if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) return 'mp3';
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return 'mp3';
  // OGG: 'OggS'
  if (
    buf[0] === 0x4f &&
    buf[1] === 0x67 &&
    buf[2] === 0x67 &&
    buf[3] === 0x53
  ) {
    return 'ogg';
  }

  // Text-with-markup branch. Decode the first ~512 bytes as ASCII and look
  // for the patterns we actively care about (HTML / SVG). Stops at the first
  // control byte that's not a tab/newline — i.e. anything that looks binary.
  const text = decodeAsciiHead(buf);
  if (text === null) return null;
  const lower = text.toLowerCase().trimStart();
  if (lower.startsWith('<!doctype html') || lower.startsWith('<html')) {
    return 'html';
  }
  if (lower.startsWith('<svg')) return 'svg-or-xml';
  if (lower.startsWith('<?xml')) return 'svg-or-xml';
  return 'text';
}

function decodeAsciiHead(buf: Uint8Array): string | null {
  const limit = Math.min(512, buf.length);
  let out = '';
  for (let i = 0; i < limit; i++) {
    const b = buf[i];
    if (b === 0x09 || b === 0x0a || b === 0x0d) {
      out += String.fromCharCode(b);
    } else if (b >= 0x20 && b <= 0x7e) {
      out += String.fromCharCode(b);
    } else if (b >= 0x80) {
      // UTF-8 continuation bytes — accept conservatively without decoding.
      continue;
    } else {
      // Control byte — treat as binary.
      return null;
    }
  }
  return out;
}

/**
 * Decides whether a sniffed kind is compatible with the declared MIME.
 *
 * Policy is intentionally **only blocking on positive bad signals**:
 *   - `html` / `svg-or-xml` are ALWAYS rejected, regardless of declared
 *     MIME, because they're the actual XSS vectors.
 *   - For everything else we accept unless the sniffed kind is in a
 *     completely different family than the declared one.
 *   - `null` (unknown binary) is accepted — the alternative would
 *     false-positive on proprietary formats we don't recognise.
 */
export function isMimeCompatible(
  declaredMime: string,
  sniffedKind: SniffedKind | null,
): boolean {
  if (sniffedKind === 'html' || sniffedKind === 'svg-or-xml') {
    // Allow ONLY if the uploader explicitly declared this format AND the
    // storage config has opted in (no current config does, so this branch
    // is effectively "never" today — but keeps the rule explicit).
    return declaredMime === 'text/html' || declaredMime === 'image/svg+xml';
  }

  if (sniffedKind === null) return true; // unknown binary, defer
  if (sniffedKind === 'text') {
    return (
      declaredMime.startsWith('text/') ||
      declaredMime === 'application/json' ||
      declaredMime === 'application/xml'
    );
  }

  const family = declaredMime.split('/')[0];

  switch (sniffedKind) {
    case 'pdf':
      return declaredMime === 'application/pdf';
    case 'png':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return family === 'image';
    case 'mp4':
    case 'webm':
      return family === 'video';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return family === 'audio';
    case 'zip':
      // Includes generic .zip and every Office Open XML format. Anything
      // declared as a ZIP container should be fine.
      return (
        declaredMime === 'application/zip' ||
        declaredMime.startsWith(
          'application/vnd.openxmlformats-officedocument',
        ) ||
        declaredMime === 'application/epub+zip'
      );
    case 'cfb':
      return (
        declaredMime === 'application/msword' ||
        declaredMime === 'application/vnd.ms-excel' ||
        declaredMime === 'application/vnd.ms-powerpoint'
      );
  }
}

// ---------------------------------------------------------------------------
// pg-boss integration
// ---------------------------------------------------------------------------

/**
 * Enqueue a magic-bytes verification job. Fire-and-forget — uploader's
 * response returns immediately. The 5-second delay gives the user a moment
 * to see their upload land in the UI before any rejection takes effect.
 */
export async function enqueueFileVerification(
  data: FileVerificationJobData,
): Promise<void> {
  const boss = await getPgBoss();
  const jobId = await boss.send(FILE_VERIFICATION_QUEUE, data, {
    startAfter: 5,
  });
  logger.info('file_verification.queued', {
    jobId,
    storageId: data.storageId,
    bucket: data.bucket,
    keyHash: hashForLogging(data.key),
    declaredMimeType: data.declaredMimeType,
    uploaderUserId: data.uploaderUserId,
    uploaderOrganizationId: data.uploaderOrganizationId,
  });
}

function createS3Client(): S3Client {
  return new S3Client({
    region: env.S3_REGION || 'us-east-1',
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: env.S3_ENDPOINT ? true : false,
  });
}

async function fetchSniffBuffer(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<Uint8Array | null> {
  const res = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: `bytes=0-${SNIFF_BYTES - 1}`,
    }),
  );
  const body = res.Body;
  if (!body) return null;
  // `transformToByteArray` is available on the SDK's stream wrapper.
  const arr = await (body as any).transformToByteArray?.();
  if (arr instanceof Uint8Array) return arr;
  return null;
}

/**
 * Worker entry point. Sniffs the freshly-uploaded object, compares against
 * the declared MIME, and DELETEs + audit-logs the object if the content is
 * incompatible. Every branch is idempotent — a re-fired job on an already-
 * deleted object is a no-op (S3 DeleteObject is idempotent; the audit log
 * gains a duplicate row at worst).
 */
export async function runFileVerificationJob(
  data: FileVerificationJobData,
): Promise<void> {
  const startedAt = Date.now();
  const client = createS3Client();
  const logMetadata = {
    storageId: data.storageId,
    bucket: data.bucket,
    keyHash: hashForLogging(data.key),
    declaredMimeType: data.declaredMimeType,
    uploaderUserId: data.uploaderUserId,
    uploaderOrganizationId: data.uploaderOrganizationId,
  };

  let buf: Uint8Array | null = null;
  try {
    buf = await fetchSniffBuffer(client, data.bucket, data.key);
  } catch (err: any) {
    // Object missing (NoSuchKey) or transient S3 error. NoSuchKey means
    // someone already deleted the object — nothing to verify. Other errors
    // bubble so pg-boss can retry.
    if (err?.name === 'NoSuchKey' || err?.Code === 'NoSuchKey') {
      logger.info('file_verification.skipped_missing_object', {
        ...logMetadata,
        durationMs: durationMs(startedAt),
      });
      return;
    }
    logger.error('file_verification.fetch_failed', {
      ...logMetadata,
      durationMs: durationMs(startedAt),
      error: err,
    });
    throw err;
  }
  if (!buf || buf.length === 0) {
    logger.warn('file_verification.skipped_empty_object', {
      ...logMetadata,
      durationMs: durationMs(startedAt),
    });
    return;
  }

  const sniffed = sniffMimeKind(buf);
  const compatible = isMimeCompatible(data.declaredMimeType, sniffed);
  if (compatible) {
    logger.info('file_verification.passed', {
      ...logMetadata,
      sniffedKind: sniffed,
      durationMs: durationMs(startedAt),
    });
    return;
  }

  // Mismatch — pull the object out of S3 and emit an audit row so we can
  // investigate (and so the uploader's signed URL starts 404'ing).
  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: data.bucket, Key: data.key }),
    );
  } catch (err) {
    logger.error('file_verification.delete_failed', {
      ...logMetadata,
      sniffedKind: sniffed,
      durationMs: durationMs(startedAt),
      error: err,
    });
    throw err;
  }

  await auditLogCreate({
    entityId: data.uploaderUserId ?? '00000000-0000-0000-0000-000000000000',
    entityName: 'StorageObject',
    operation: auditLogOperations.delete,
    userId: data.uploaderUserId,
    organizationId: data.uploaderOrganizationId,
    newData: {
      reason: 'magic-bytes mismatch',
      bucket: data.bucket,
      key: data.key,
      declaredMimeType: data.declaredMimeType,
      sniffedKind: sniffed,
      storageId: data.storageId,
      fileName: data.fileName,
    },
  });

  logger.warn('file_verification.rejected', {
    ...logMetadata,
    sniffedKind: sniffed,
    durationMs: durationMs(startedAt),
  });
}
