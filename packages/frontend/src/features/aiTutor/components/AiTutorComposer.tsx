import { useCallback, useRef, useState } from 'react';
import { uploadFile } from '@better-upload/client';
import { formatBytes } from '@better-upload/client/helpers';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { storage } from '@project/backend/features/permissions';
import {
  LuArrowUp,
  LuFile,
  LuLoader,
  LuPaperclip,
  LuSquare,
  LuX,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';

interface AiTutorComposerProps {
  isLoading: boolean;
  onSend: (message: string, attachments?: FileUploaded[]) => void;
  onStop: () => void;
}

const MAX_ATTACHMENTS = 5;
const ACCEPTED_ATTACHMENTS = '.txt,.md,.csv,.json,.pdf,.docx';
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export function AiTutorComposer({
  isLoading,
  onSend,
  onStop,
}: AiTutorComposerProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<FileUploaded[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isLoading) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      onSend(trimmed, attachments);
      setValue('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    [attachments, isLoading, onSend, value],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      const ta = e.target;
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 192)}px`;
    },
    [],
  );

  const handleAttach = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      event.target.value = '';
      if (!files.length || isUploading) return;

      const remaining = MAX_ATTACHMENTS - attachments.length;
      const selected = files.slice(0, remaining);
      if (selected.length < files.length) {
        toast.error(dictionary.aiTutor.attachments.tooMany);
      }
      if (!selected.length) return;

      setIsUploading(true);
      try {
        const uploaded: FileUploaded[] = [];
        for (const file of selected) {
          const result: any = await uploadFile({
            file,
            route: storage.aiTutorAttachments.id,
            api: `${VITE_BACKEND_URL}/api/file/upload`,
            credentials: 'include',
          });
          const metadataFile = result.metadata?.files?.[0];
          if (metadataFile) {
            uploaded.push({
              key: metadataFile.key,
              name: metadataFile.name,
              publicUrl: metadataFile.publicUrl,
              signedUrl: metadataFile.signedUrl,
              size: metadataFile.size,
              type: metadataFile.type,
            });
          }
        }
        if (uploaded.length) {
          setAttachments((current) => [...current, ...uploaded]);
        }
      } catch {
        toast.error(dictionary.aiTutor.attachments.uploadFailed);
      } finally {
        setIsUploading(false);
      }
    },
    [attachments.length, dictionary, isUploading],
  );

  const disabled = !value.trim() || isUploading;

  return (
    <div className="dark:from-background dark:via-background pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-6 pb-6">
      <div className="pointer-events-auto mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className={cn(
            'bg-nexexam-soft flex items-end gap-2 rounded-[26px] p-2 shadow-[0_14px_38px_rgb(15_23_42/0.08)] transition-colors dark:bg-white/10',
            'focus-within:ring-primary/20 focus-within:bg-white focus-within:ring-2 dark:focus-within:bg-white/12',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_ATTACHMENTS}
            className="hidden"
            onChange={handleAttach}
          />
          <button
            type="button"
            disabled={
              isLoading || isUploading || attachments.length >= MAX_ATTACHMENTS
            }
            aria-label={dictionary.aiTutor.attachments.add}
            title={dictionary.aiTutor.attachments.add}
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground/80 hover:text-foreground mb-0.5 flex-shrink-0 rounded-full p-2 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
          >
            {isUploading ? (
              <LuLoader className="size-5 animate-spin" />
            ) : (
              <LuPaperclip className="size-5" />
            )}
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={dictionary.aiTutor.composer.placeholder}
            rows={1}
            disabled={isLoading}
            className={cn(
              'max-h-48 min-h-[44px] w-full resize-none border-none bg-transparent px-2 py-3',
              'placeholder:text-muted-foreground text-[15px] leading-snug outline-none',
              'focus:ring-0',
            )}
            style={{ overflowY: 'auto' }}
          />

          {isLoading ? (
            <button
              type="button"
              aria-label={dictionary.aiTutor.composer.stopAriaLabel}
              onClick={onStop}
              className="bg-primary text-primary-foreground mr-0.5 mb-0.5 flex-shrink-0 rounded-full p-2 transition-colors"
            >
              <LuSquare className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={dictionary.aiTutor.composer.sendAriaLabel}
              disabled={disabled}
              className={cn(
                'mr-0.5 mb-0.5 flex-shrink-0 rounded-full p-2 transition-colors',
                disabled
                  ? 'bg-nexexam-line text-white dark:bg-white/15'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              <LuArrowUp className="size-4" strokeWidth={3} />
            </button>
          )}
        </form>
        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {attachments.map((attachment) => (
              <span
                key={attachment.key}
                className="bg-nexexam-soft text-nexexam-ink inline-flex max-w-full items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold dark:bg-white/10 dark:text-white"
              >
                <LuFile className="size-3.5 shrink-0" />
                <span className="max-w-48 truncate">{attachment.name}</span>
                {attachment.size ? (
                  <span className="text-muted-foreground">
                    {formatBytes(attachment.size)}
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={dictionary.aiTutor.attachments.remove}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.key !== attachment.key),
                    )
                  }
                >
                  <LuX className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="text-muted-foreground mt-2.5 text-center text-xs">
          {dictionary.aiTutor.composer.disclaimer}
        </div>
      </div>
    </div>
  );
}
