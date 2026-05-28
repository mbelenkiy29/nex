import { LuFile } from 'react-icons/lu';
import type { AiTutorAttachment } from '@/features/aiTutor/aiTutorTypes';

export function AiTutorUserBubble({
  content,
  attachments,
}: {
  content: string;
  attachments?: AiTutorAttachment[] | null;
}) {
  return (
    <div className="flex w-full justify-end">
      <div className="bg-nexexam-soft text-nexexam-ink max-w-[85%] rounded-3xl px-5 py-3 text-base leading-relaxed shadow-sm dark:bg-white/10 dark:text-white">
        <div className="whitespace-pre-wrap">{content}</div>
        {attachments?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <a
                key={attachment.key}
                href={attachment.signedUrl || attachment.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 rounded-xl border border-white/80 bg-white/70 px-2.5 py-1 text-xs font-semibold hover:underline dark:border-white/10 dark:bg-white/10"
              >
                <LuFile className="size-3.5 shrink-0" />
                <span className="max-w-48 truncate">{attachment.name}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
