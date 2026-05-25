import { Avatar } from '@/shared/components/ui/avatar';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { cn } from '@/shared/lib/utils';
import type { ChatbotMessage as ChatbotMessageType } from '@project/backend/features/chatbot/chatbotSchemas';
import { IoPerson } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';
import { MdInfo } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatbotMessageProps {
  message: ChatbotMessageType;
}

export function ChatbotMessage({ message }: ChatbotMessageProps) {
  const isUser = message.role === 'user';

  if (message.content.startsWith('__LIMIT_EXCEEDED__:')) {
    const parts = message.content.split(':');
    const errorMessage = parts.slice(2).join(':'); // Rejoin in case message contains colons

    return (
      <div className="mb-4">
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <MdInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            {errorMessage}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (message.content.startsWith('__CONCURRENT_REQUEST__:')) {
    const errorMessage = message.content.replace('__CONCURRENT_REQUEST__:', '');

    return (
      <div className="mb-4">
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <MdInfo className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-900 dark:text-orange-100">
            {errorMessage}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mb-4 flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <Avatar
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {isUser ? (
          <IoPerson className="h-5 w-5" />
        ) : (
          <RiRobot2Fill className="h-5 w-5" />
        )}
      </Avatar>

      <div
        className={cn(
          'w-full max-w-[420px] min-w-0 flex-1',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'rounded-lg px-4 py-3 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground',
          )}
        >
          {isUser ? (
            <p className="wrap-break-word whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="-mx-4 my-4 overflow-x-auto px-4">
                      <table className="divide-border border-border w-full divide-y rounded-lg border">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-muted/50">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-border bg-background divide-y">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-muted/30 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
