import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAuthStore } from '@/features/auth/authStore';
import { IoSend, IoStopCircle } from 'react-icons/io5';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
  onCancel?: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatbotInput({
  onSendMessage,
  onCancel,
  isLoading,
  disabled = false,
}: ChatbotInputProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCancel = () => {
    if (onCancel && isLoading) {
      onCancel();
    }
  };

  return (
    <div className="bg-background border-t p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={dictionary.chatbot.placeholder}
          disabled={isLoading || disabled}
          className="max-h-[200px] min-h-[60px] resize-none"
          rows={2}
          autoFocus
        />
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            className="shrink-0"
          >
            <IoStopCircle className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="shrink-0"
          >
            <IoSend className="h-5 w-5" />
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        {dictionary.chatbot.inputHint}
      </p>
    </div>
  );
}
