# MCP (Model Context Protocol) Reference

Server implementing MCP specification for AI assistant integration (Claude Code, Claude Desktop, etc.) with OAuth2 authentication via Better Auth.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Client (Claude Code/Desktop)              │
│                              │                                   │
│                    OAuth2 + JSON-RPC                            │
│                              ▼                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        Backend                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    mcp.ts (Router)                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │ │
│  │  │ initialize   │  │ tools/list   │  │ tools/call     │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              getAllMcpTools(dictionary)                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │ member   │ │ auditLog │ │ category │ │ user     │ ...  │ │
│  │  │ Mcp.ts   │ │ Mcp.ts   │ │ Mcp.ts   │ │ Mcp.ts   │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Components

### Main Router (`mcp.ts`)

JSON-RPC endpoint implementing MCP protocol:

**Endpoint**: `POST /api/mcp/:language/:organizationId`

**Methods**:
| Method | Description |
|--------|-------------|
| `initialize` | Returns server info and capabilities |
| `tools/list` | Lists available tools with schemas |
| `tools/call` | Executes a tool by name with arguments |
| `notifications/initialized` | Acknowledgment (returns 204) |

**Authentication**: Better Auth MCP plugin with OAuth2/OIDC flow.

### Types (`mcpTypes.ts`)

```typescript
interface McpTool {
  name: string; // Tool identifier (e.g., "member_list")
  description: string; // i18n description from dictionary
  requiredPermissions: PartialPermissions; // Permission check
  schema: object; // JSON Schema for input validation
  handler: (params, context) => Promise<any>;
}
```

### Schema Converter (`mcpSchemaConverter.ts`)

Converts Zod schemas to JSON Schema for MCP:

```typescript
toMcpJsonSchema(zodSchema);
// Uses io:"input" for wire format, unrepresentable:"any" for unsupported types
```

### Error Mapping

HTTP errors map to JSON-RPC codes:

| HTTP  | JSON-RPC | Meaning        |
| ----- | -------- | -------------- |
| 400   | -32602   | Invalid params |
| 401   | -32001   | Unauthorized   |
| 403   | -32002   | Forbidden      |
| 404   | -32003   | Not found      |
| Other | -32603   | Internal error |

## Tool Definition Pattern

Each feature defines tools in `[feature]Mcp.ts`:

```typescript
// memberMcp.ts - Aggregator
export function getMemberMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    memberFindManyMcpTool(dictionary),
    memberFindMcpTool(dictionary),
    memberUpdateMcpTool(dictionary),
    // ...
  ];
}
```

Tools are exported from controllers alongside API docs:

```typescript
// memberFindManyController.ts
export const memberFindManyMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'member_list',
  description: dictionary.member.mcpDescription.list,
  requiredPermissions: { member: ['read'] },
  schema: toMcpJsonSchema(memberFindManyInputSchema),
  handler: async (params, context) => {
    return await memberFindManyController(params, context);
  },
});
```

## Tool Registration

All tools aggregated in `mcp.ts`:

```typescript
export function getAllMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    ...getCategoryMcpTools(dictionary),
    ...getProjectSpecificationMcpTools(dictionary),
    ...getMemberMcpTools(dictionary),
    ...getAuditLogMcpTools(dictionary),
    ...getSubscriptionMcpTools(dictionary),
    ...getUserMcpTools(dictionary),
  ];
}
```

## Authentication Setup

Better Auth MCP plugin configured in `authBackend.ts`:

```typescript
mcp({
  loginPage: `${getFrontendUrl()}/auth/sign-in`,
  oidcConfig: {
    loginPage: `${getFrontendUrl()}/auth/sign-in`,
    allowDynamicClientRegistration: true,
    useJWTPlugin: true,
  },
}),
```

**OAuth Endpoints** (auto-registered by Better Auth):

- `/.well-known/oauth-authorization-server`
- `/.well-known/oauth-protected-resource`

## Frontend Components

### Docs Page (`McpDocsPage.tsx`)

Shows users how to connect AI clients:

- Displays endpoint URL with org/language params
- Copy-to-clipboard functionality
- Step-by-step connection instructions

### Route (`mcpRouter.ts`)

Protected by `mcp:use` permission:

```typescript
beforeLoad: async ({ location }) => {
  authGuardFrontend(
    { currentUser, currentMember },
    { mcp: ['use'] },
    location.pathname,
  );
};
```

## Adding New MCP Tools

1. **Create tool in controller**:

```typescript
export const entityFindMcpTool = (dictionary: Dictionary): McpTool => ({
  name: 'entity_find',
  description: dictionary.entity.mcpDescription.find,
  requiredPermissions: { entity: ['read'] },
  schema: toMcpJsonSchema(entityFindInputSchema),
  handler: async (params, context) => {
    return await entityFindController(params, context);
  },
});
```

2. **Aggregate in `[feature]Mcp.ts`**:

```typescript
export function getEntityMcpTools(dictionary: Dictionary): McpTool[] {
  return [entityFindMcpTool(dictionary), ...];
}
```

3. **Register in `mcp.ts`**:

```typescript
export function getAllMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    ...getEntityMcpTools(dictionary),
    // ...existing tools
  ];
}
```

## Chatbot Integration

The chatbot uses the same tools via `getAllMcpTools()`:

- Tools filtered by user permissions using `hasToolPermission()`
- Converted to Anthropic format for Claude API
- See [chatbot-reference.md](./chatbot-reference.md) for details

## Key Files

**Backend:**

- `features/mcp/mcp.ts` - Main router + tool aggregator
- `features/mcp/mcpTypes.ts` - McpTool interface
- `features/mcp/mcpSchemaConverter.ts` - Zod to JSON Schema
- `features/[entity]/[entity]Mcp.ts` - Per-feature tool aggregation
- `features/[entity]/controllers/*Controller.ts` - Tool definitions

**Frontend:**

- `features/mcp/pages/McpDocsPage.tsx` - Connection docs
- `features/mcp/mcpRouter.ts` - Route config

## Protocol Reference

MCP spec version: `2024-11-05`

For full protocol details: https://modelcontextprotocol.io
