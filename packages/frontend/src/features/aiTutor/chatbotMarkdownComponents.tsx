import type { Components } from 'react-markdown';

// Shared markdown component overrides used by the new AI Tutor full-page
// thread AND (eventually) the legacy ChatbotSheet modal. Mirrors what
// `features/chatbot/components/ChatbotMessage.tsx` shipped today —
// extracting it here lets both surfaces use one renderer.
export const chatbotMarkdownComponents: Components = {
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
    <tbody className="divide-border bg-background divide-y">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm whitespace-nowrap">{children}</td>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-primary underline-offset-2 hover:underline"
    >
      {children}
    </a>
  ),
};
