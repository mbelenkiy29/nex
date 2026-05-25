import { Spinner } from '@/shared/components/ui/spinner';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { useAuthStore } from '@/features/auth/authStore';
import { IoHammerOutline } from 'react-icons/io5';

interface ChatbotToolCallProps {
  toolName: string;
}

export function ChatbotToolCall({ toolName }: ChatbotToolCallProps) {
  const dictionary = useAuthStore((state) => state.dictionary);

  // Format tool name to be more readable (e.g., "entity_list" -> "entity list")
  const formattedToolName = toolName.replace(/_/g, ' ');

  return (
    <div className="text-muted-foreground mb-4 flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <Spinner className="h-4 w-4" />
        <IoHammerOutline className="h-4 w-4" />
        <span>
          {dictionaryFormat(dictionary.chatbot.usingTool, formattedToolName)}
        </span>
      </div>
    </div>
  );
}
