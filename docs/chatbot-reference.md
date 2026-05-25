# Chatbot Feature Reference

AI-powered chatbot using Claude API with streaming responses, MCP tool integration, and multi-tier rate limiting.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ ChatbotSheet│──│ useChatbot() │──│ chatbotStore (Zustand)│  │
│  │ (UI)        │  │ (SSE client) │  │ (state management)    │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ SSE Stream
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ chatbotController│──│ chatbotService │──│ Anthropic API    │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
│           │                   │                                  │
│  ┌────────┴──────┐   ┌───────┴────────┐                        │
│  │ lockService   │   │ usageService   │                        │
│  │ (Redis/memory)│   │ (token limits) │                        │
│  └───────────────┘   └────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Components

### Controller (`chatbotController.ts`)

Entry point handling:

1. Auth guard (`chatbot:use` permission)
2. Concurrent request lock (prevents response mixing)
3. Rate limit check (user/org/global)
4. SSE streaming response
5. Token usage tracking

### Service (`chatbotService.ts`)

Core AI logic:

- Uses `claude-haiku-4-5-20251001` model
- Converts MCP tools to Anthropic format
- Filters tools by user permissions via `hasToolPermission()`
- Agentic loop (max 10 iterations) for tool calls
- Streams chunks: `text`, `tool_use`, `tool_result`, `usage`, `done`, `error`

### Lock Service (`chatbotLockService.ts`)

Prevents concurrent requests per user:

- Redis-based locks (production)
- In-memory fallback (development)
- 5-minute TTL prevents permanent locks from crashes

### Usage Service (`chatbotUsageService.ts`)

Three-tier daily token limits:

- **User**: 50k tokens (configurable via `CHATBOT_DAILY_TOKEN_LIMIT_USER`)
- **Organization**: 1M tokens (`CHATBOT_DAILY_TOKEN_LIMIT_ORGANIZATION`)
- **Global**: 1M tokens (`CHATBOT_DAILY_TOKEN_LIMIT_GLOBAL`)

Tracks via `ChatbotUsage` table with daily upserts.

### Schemas (`chatbotSchemas.ts`)

```typescript
// Input
{
  message: string;           // 1-10000 chars
  conversationHistory?: ChatbotMessage[];
}

// ChatbotMessage
{
  role: 'user' | 'assistant';
  content: string;
}
```

## Frontend Components

### Store (`chatbotStore.ts`)

Zustand store managing:

- `messages`: Conversation history
- `isOpen`: Sheet visibility
- `addMessage()`, `updateLastMessage()`: Real-time streaming updates

### Hook (`useChatbot.ts`)

Main hook providing:

- `sendMessage(text)`: Send and stream response
- `cancelRequest()`: Abort ongoing request
- `clearConversation()`: Reset chat
- `isLoading`, `error`, `currentToolUse`: UI state

Handles SSE parsing, error types (429 limit, 409 concurrent).

### UI Components

| Component         | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `ChatbotSheet`    | Slide-out panel with header, messages, input |
| `ChatbotMessages` | Scrollable message list with auto-scroll     |
| `ChatbotMessage`  | Individual message with markdown rendering   |
| `ChatbotToolCall` | Tool execution indicator with spinner        |
| `ChatbotInput`    | Text input with send/cancel buttons          |
| `ChatbotButton`   | Floating action button to open chat          |

### Message Rendering

- User messages: plain text, right-aligned
- Assistant messages: Markdown via `react-markdown` + `remark-gfm`
- Special prefixes for errors: `__LIMIT_EXCEEDED__:`, `__CONCURRENT_REQUEST__:`

## SSE Event Types

```typescript
type: 'text'; // Streaming text chunk
type: 'tool_use'; // Tool invocation started
type: 'tool_result'; // Tool execution result
type: 'usage'; // Token counts (input/output)
type: 'done'; // Stream complete
type: 'error'; // Error message
```

## MCP Tool Integration

Tools are:

1. Loaded via `getAllMcpTools(dictionary)`
2. Filtered by member permissions using Better Auth roles
3. Executed in agentic loop until Claude provides final answer

## Environment Variables

```bash
ANTHROPIC_API_KEY           # Required for chatbot
CHATBOT_DAILY_TOKEN_LIMIT_USER=50000
CHATBOT_DAILY_TOKEN_LIMIT_ORGANIZATION=1000000
CHATBOT_DAILY_TOKEN_LIMIT_GLOBAL=1000000
```

## Error Handling

| HTTP | Error                | Meaning                 |
| ---- | -------------------- | ----------------------- |
| 409  | `concurrent_request` | User has active request |
| 429  | `limit_exceeded`     | Token quota exceeded    |

## Key Files

**Backend:**

- `chatbotApiRoutes.ts` - POST `/api/chatbot/message`
- `chatbotController.ts` - Request orchestration
- `chatbotService.ts` - AI streaming + tool execution
- `chatbotLockService.ts` - Concurrency control
- `chatbotUsageService.ts` - Rate limiting

**Frontend:**

- `chatbotStore.ts` - Zustand state
- `useChatbot.ts` - SSE client hook
- `ChatbotSheet.tsx` - Main UI container
