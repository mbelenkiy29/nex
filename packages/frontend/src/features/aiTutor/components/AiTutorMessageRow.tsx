import type { AiTutorMessage } from '@/features/aiTutor/aiTutorTypes';
import { AiTutorUserBubble } from './AiTutorUserBubble';
import { AiTutorAssistantBody } from './AiTutorAssistantBody';

export function AiTutorMessageRow({ message }: { message: AiTutorMessage }) {
  if (message.role === 'user') {
    return <AiTutorUserBubble content={message.content} />;
  }
  return <AiTutorAssistantBody message={message} />;
}
