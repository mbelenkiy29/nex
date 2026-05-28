import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { env } from '../../env';
import { AppContext } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { errorToLogMetadata, logger } from '../../shared/lib/logger';
import type {
  ChatbotAttachment,
  ChatbotAttachmentInput,
} from './chatbotSchemas';

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 10_000_000;
const MAX_ATTACHMENT_TEXT_CHARS = 12_000;
const MAX_TOTAL_ATTACHMENT_TEXT_CHARS = 20_000;

const SUPPORTED_MIME_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function createS3Client() {
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

export function chatbotAttachmentPromptText(
  attachments: ChatbotAttachment[] | null | undefined,
) {
  if (!attachments?.length) {
    return '';
  }

  const parts = attachments
    .filter((attachment) => attachment.extractionStatus === 'ready')
    .map((attachment) => {
      const text = (attachment.extractedText || '').trim();
      if (!text) return null;
      return `Attachment: ${attachment.name}\n${text}`;
    })
    .filter(Boolean);

  return parts.join('\n\n');
}

export function chatbotMessageContentForModel(
  message: string,
  attachments: ChatbotAttachment[] | null | undefined,
) {
  const attachmentText = chatbotAttachmentPromptText(attachments);
  if (!attachmentText) {
    return message;
  }

  return `${message}\n\nAttached file context:\n${attachmentText}`;
}

export async function chatbotProcessAttachments(
  attachments: ChatbotAttachmentInput[] | undefined,
  context: AppContext,
): Promise<ChatbotAttachment[]> {
  if (!attachments?.length) {
    return [];
  }
  if (attachments.length > MAX_ATTACHMENTS) {
    throw new Error400(context.dictionary.aiTutor.attachments.tooMany);
  }

  let remainingChars = MAX_TOTAL_ATTACHMENT_TEXT_CHARS;
  const processed: ChatbotAttachment[] = [];
  for (const attachment of attachments) {
    assertAttachmentAllowed(attachment, context);
    try {
      const body = await downloadAttachment(attachment.key);
      if (body.byteLength > MAX_ATTACHMENT_BYTES) {
        throw new Error400(context.dictionary.aiTutor.attachments.tooLarge);
      }

      const extracted = await extractAttachmentText(attachment, body);
      const text = normalizeExtractedText(extracted).slice(
        0,
        Math.min(MAX_ATTACHMENT_TEXT_CHARS, remainingChars),
      );
      remainingChars = Math.max(0, remainingChars - text.length);
      processed.push({
        ...attachment,
        extractionStatus: 'ready',
        extractedText: text,
      });
    } catch (error: any) {
      if (error instanceof Error400) {
        throw error;
      }
      logger.warn('ai.chatbot.attachment_extract_failed', {
        key: attachment.key,
        type: attachment.type,
        error: errorToLogMetadata(error),
      });
      processed.push({
        ...attachment,
        extractionStatus: 'failed',
        extractionError: 'extractFailed',
      });
    }
  }

  return processed;
}

function assertAttachmentAllowed(
  attachment: ChatbotAttachmentInput,
  context: AppContext,
) {
  const organizationId = context.currentOrganization?.id;
  if (
    !organizationId ||
    !attachment.key.startsWith(
      `organization/${organizationId}/ai-tutor/attachments/`,
    )
  ) {
    throw new Error400(context.dictionary.aiTutor.attachments.invalid);
  }

  if (attachment.size != null && attachment.size > MAX_ATTACHMENT_BYTES) {
    throw new Error400(context.dictionary.aiTutor.attachments.tooLarge);
  }

  if (!attachment.type || !SUPPORTED_MIME_TYPES.has(attachment.type)) {
    throw new Error400(context.dictionary.aiTutor.attachments.unsupported);
  }
}

async function downloadAttachment(key: string) {
  if (!env.S3_BUCKET_PRIVATE) {
    throw new Error('S3 private bucket is not configured.');
  }
  const response = await createS3Client().send(
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_PRIVATE,
      Key: key,
    }),
  );

  return await bodyToBuffer(response.Body);
}

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (!body) {
    return Buffer.alloc(0);
  }
  if (body instanceof Uint8Array) {
    return Buffer.from(body);
  }
  if (
    typeof body === 'object' &&
    'transformToByteArray' in body &&
    typeof (body as any).transformToByteArray === 'function'
  ) {
    return Buffer.from(await (body as any).transformToByteArray());
  }
  if (body instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
  throw new Error('Unsupported S3 body type.');
}

async function extractAttachmentText(
  attachment: ChatbotAttachmentInput,
  body: Buffer,
) {
  switch (attachment.type) {
    case 'application/pdf': {
      const parser = new PDFParse({ data: new Uint8Array(body) });
      try {
        const result = await parser.getText();
        return result.text || '';
      } finally {
        await parser.destroy();
      }
    }
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const result = await mammoth.extractRawText({ buffer: body });
      return result.value || '';
    }
    default:
      return body.toString('utf8');
  }
}

function normalizeExtractedText(value: string) {
  return value
    .split('\u0000')
    .join('')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}
