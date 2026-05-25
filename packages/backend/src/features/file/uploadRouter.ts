import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Router } from '@better-upload/server';
import { handleRequest, route, RejectUpload } from '@better-upload/server';
import { aws, custom } from '@better-upload/server/clients';
import { randomUUID } from 'node:crypto';
import { env } from '../../env';
import { storage, hasStoragePermission, StorageConfig } from '../permissions';
import { enqueueFileVerification } from './fileVerification';
import { hashForLogging, logger } from '../../shared/lib/logger';

// Supports AWS S3 and S3-compatible services (Minio, Cloudflare R2, Backblaze B2, etc.)
function createS3Client(): S3Client {
  return new S3Client({
    region: env.S3_REGION || 'us-east-1',
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
    },
    // Required for Minio and some S3-compatible services
    forcePathStyle: env.S3_ENDPOINT ? true : false,
  });
}

function createUploadClient() {
  if (!env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    return null;
  }

  if (env.S3_ENDPOINT) {
    const url = new URL(env.S3_ENDPOINT);
    return custom({
      host: url.host,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      region: env.S3_REGION || 'us-east-1',
      secure: url.protocol === 'https:',
      forcePathStyle: true,
    });
  }
  return aws({
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    region: env.S3_REGION || 'us-east-1',
  });
}

function constructPublicUrl(key: string): string {
  if (env.S3_ENDPOINT) {
    return `${env.S3_ENDPOINT}/${env.S3_BUCKET_PUBLIC}/${key}`;
  } else {
    return `https://${env.S3_BUCKET_PUBLIC}.s3.${env.S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }
}

// Signed-URL TTL for private file downloads. 15 minutes balances leak-radius
// vs. UX — the UI re-mints on each download click, so a user retry costs one
// extra round-trip rather than a leaked URL costing a full hour. Matches the
// data-export TTL (DATA_EXPORT_SIGNED_URL_TTL_SECONDS). Closes finding #12.
const PRIVATE_SIGNED_URL_TTL_SECONDS = 900;

async function generateSignedUrl(key: string, bucket: string): Promise<string> {
  const s3Client = createS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: PRIVATE_SIGNED_URL_TTL_SECONDS,
  });
}

// Dynamically generate upload routes from storage config
function generateUploadRoutes() {
  const routes: Record<string, any> = {};

  for (const [key, storageConfig] of Object.entries(storage) as [
    keyof typeof storage,
    StorageConfig,
  ][]) {
    // Enable multipart for files > 50MB to improve upload reliability
    const isLargeFile = storageConfig.maxSizeInBytes > 50_000_000;

    routes[key] = route({
      ...(storageConfig.fileTypes && { fileTypes: storageConfig.fileTypes }),
      maxFileSize: storageConfig.maxSizeInBytes,
      multipleFiles: true,
      ...(isLargeFile && { multipart: true }),

      onBeforeUpload: async ({ req }: any) => {
        const context = (req as any).context;

        if (
          !context?.currentUser ||
          !context?.currentMember ||
          !context?.currentOrganization
        ) {
          throw new RejectUpload('Authentication required');
        }

        if (!hasStoragePermission(storageConfig, context)) {
          throw new RejectUpload('Insufficient permissions');
        }

        const bucketName = storageConfig.publicRead
          ? env.S3_BUCKET_PUBLIC
          : env.S3_BUCKET_PRIVATE;

        return {
          bucketName,
          generateObjectInfo: ({ file }) => {
            const folderPath = storageConfig.folder.replace(
              ':organizationId',
              context.currentOrganization.id,
            );

            const fileName = file.name;
            const lastDotIndex = fileName.lastIndexOf('.');
            const extension =
              lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
            const nameWithoutExt =
              lastDotIndex !== -1
                ? fileName.substring(0, lastDotIndex)
                : fileName;

            // Key format: folder/randomId/originalFileName.ext
            // RandomId prevents overwrites and adds security through obscurity
            const randomId = randomUUID();
            const key = `${folderPath}/${randomId}/${nameWithoutExt}${extension}`;

            return {
              key,
              ...(storageConfig.publicRead && { acl: 'public-read' }),
            };
          },
        };
      },

      onAfterSignedUrl: async (data) => {
        const bucket = storageConfig.publicRead
          ? env.S3_BUCKET_PUBLIC
          : env.S3_BUCKET_PRIVATE;

        // Enqueue a magic-bytes verification job per file. Async + delayed,
        // so the upload response returns immediately and the user sees their
        // file in the UI before any rejection can take effect. Closes audit
        // finding #10. The catch swallows enqueue errors — a transient
        // pg-boss outage shouldn't fail an otherwise-successful upload; the
        // declared-MIME allowlist remains the first line of defence.
        const ctx = (data as any).req?.context;
        const uploaderUserId = ctx?.currentUser?.id;
        const uploaderOrganizationId = ctx?.currentOrganization?.id;
        for (const file of data.files) {
          enqueueFileVerification({
            kind: 'magicBytes',
            bucket: bucket || '',
            key: file.objectInfo.key,
            declaredMimeType: file.type,
            fileName: file.name,
            uploaderUserId,
            uploaderOrganizationId,
            storageId: storageConfig.id,
          }).catch((err) => {
            logger.error('file_verification.enqueue_failed', {
              storageId: storageConfig.id,
              bucket,
              keyHash: hashForLogging(file.objectInfo.key),
              declaredMimeType: file.type,
              uploaderUserId,
              uploaderOrganizationId,
              error: err,
            });
          });
        }

        const fileMetadata = await Promise.all(
          data.files.map(async (file) => {
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              key: file.objectInfo.key,
              ...(storageConfig.publicRead && {
                publicUrl: constructPublicUrl(file.objectInfo.key),
              }),
              ...(!storageConfig.publicRead && {
                signedUrl: await generateSignedUrl(
                  file.objectInfo.key,
                  bucket!,
                ),
              }),
            };
          }),
        );

        return {
          metadata: {
            ...data.metadata,
            files: fileMetadata,
          },
        };
      },
    });
  }

  return routes;
}

let cachedUploadRouter: Router | null = null;

function getUploadRouter(): Router {
  if (cachedUploadRouter) {
    return cachedUploadRouter;
  }

  const client = createUploadClient();
  if (!client) {
    throw new Error(
      'File uploads are not configured (missing S3 credentials).',
    );
  }

  cachedUploadRouter = {
    client,
    bucketName: env.S3_BUCKET_PRIVATE || '',
    routes: generateUploadRoutes(),
  };
  return cachedUploadRouter;
}

export const handleUpload = (req: Request) =>
  handleRequest(req, getUploadRouter());
