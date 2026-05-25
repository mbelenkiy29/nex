import { useEffect, useRef } from 'react';
import { AiTutorMessageRow } from './AiTutorMessageRow';
import { AiTutorToolIndicator } from './AiTutorToolIndicator';
import { AiTutorAlertRow } from './AiTutorAlertRow';
import type {
  AiTutorAlertRow as Alert,
  AiTutorMessage,
} from '@/features/aiTutor/aiTutorTypes';

interface AiTutorThreadProps {
  messages: AiTutorMessage[];
  currentToolUse: string | null;
  alerts: Alert[];
  onDismissAlert: (id: string) => void;
}

export function AiTutorThread({
  messages,
  currentToolUse,
  alerts,
  onDismissAlert,
}: AiTutorThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, currentToolUse, alerts.length]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-7 sm:px-6"
      data-testid="ai-tutor-thread"
    >
      <div className="mx-auto max-w-3xl space-y-8 pb-32">
        {messages.map((m) => (
          <AiTutorMessageRow key={m.id} message={m} />
        ))}
        {currentToolUse ? (
          <AiTutorToolIndicator toolName={currentToolUse} />
        ) : null}
        {alerts.map((a) => (
          <AiTutorAlertRow
            key={a.id}
            alert={a}
            onDismiss={() => onDismissAlert(a.id)}
          />
        ))}
      </div>
    </div>
  );
}
