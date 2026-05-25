import { create } from 'zustand';
import type { ChatbotMessage } from '@project/backend/features/chatbot/chatbotSchemas';

interface ChatbotState {
  messages: ChatbotMessage[];
  isOpen: boolean;
  context: {
    courseId?: string;
    lessonId?: string;
    courseTitle?: string;
  } | null;
  setMessages: (messages: ChatbotMessage[]) => void;
  addMessage: (message: ChatbotMessage) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setContext: (context: ChatbotState['context']) => void;
  clearContext: () => void;
}

export const useChatbotStore = create<ChatbotState>()((set) => ({
  messages: [],
  isOpen: false,
  context: null,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateLastMessage: (content) =>
    set((state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        return {
          messages: [
            ...state.messages.slice(0, -1),
            { ...lastMessage, content },
          ],
        };
      } else {
        return {
          messages: [...state.messages, { role: 'assistant', content }],
        };
      }
    }),

  clearMessages: () => set({ messages: [] }),

  setIsOpen: (isOpen) =>
    set((state) => ({
      isOpen,
      context: isOpen ? state.context : null,
    })),

  setContext: (context) => set({ context }),

  clearContext: () => set({ context: null }),
}));
