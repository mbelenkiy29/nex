import { useCallback, useRef, useState } from 'react';
import { LuArrowUp, LuPaperclip, LuSquare } from 'react-icons/lu';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';

interface AiTutorComposerProps {
  isLoading: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

export function AiTutorComposer({
  isLoading,
  onSend,
  onStop,
}: AiTutorComposerProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isLoading) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      onSend(trimmed);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    [isLoading, onSend, value],
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

  const disabled = !value.trim();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-6 pb-6 dark:from-background dark:via-background">
      <div className="pointer-events-auto mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className={cn(
            'flex items-end gap-2 rounded-[26px] bg-nexexam-soft p-2 shadow-[0_14px_38px_rgb(15_23_42/0.08)] transition-colors dark:bg-white/10',
            'focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:bg-white/12',
          )}
        >
          <button
            type="button"
            disabled
            aria-label={dictionary.aiTutor.composer.attachComingSoon}
            title={dictionary.aiTutor.composer.attachComingSoon}
            className="mb-0.5 flex-shrink-0 rounded-full p-2 text-muted-foreground/70 transition-colors disabled:cursor-not-allowed"
          >
            <LuPaperclip className="size-5" />
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
              'min-h-[44px] max-h-48 w-full resize-none border-none bg-transparent px-2 py-3',
              'text-[15px] leading-snug outline-none placeholder:text-muted-foreground',
              'focus:ring-0',
            )}
            style={{ overflowY: 'auto' }}
          />

          {isLoading ? (
            <button
              type="button"
              aria-label={dictionary.aiTutor.composer.stopAriaLabel}
              onClick={onStop}
              className="mb-0.5 mr-0.5 flex-shrink-0 rounded-full bg-primary p-2 text-primary-foreground transition-colors"
            >
              <LuSquare className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={dictionary.aiTutor.composer.sendAriaLabel}
              disabled={disabled}
              className={cn(
                'mb-0.5 mr-0.5 flex-shrink-0 rounded-full p-2 transition-colors',
                disabled
                  ? 'bg-nexexam-line text-white dark:bg-white/15'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              <LuArrowUp className="size-4" strokeWidth={3} />
            </button>
          )}
        </form>
        <div className="mt-2.5 text-center text-xs text-muted-foreground">
          {dictionary.aiTutor.composer.disclaimer}
        </div>
      </div>
    </div>
  );
}
