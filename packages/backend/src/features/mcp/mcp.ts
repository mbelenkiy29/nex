import { Hono } from 'hono';
import { appContextForMcp } from '../../shared/controller/appContext';
import { Error400 } from '../../shared/errors/Error400';
import { Error401 } from '../../shared/errors/Error401';
import { Error403 } from '../../shared/errors/Error403';
import { Error404 } from '../../shared/errors/Error404';
import { getAuditLogMcpTools } from '../auditLog/auditLogMcp';
import { authBackend } from '../auth/authBackend';
import { authGuardBackend } from '../auth/authGuardBackend';
import { getMemberMcpTools } from '../member/memberMcp';
import { getSubscriptionMcpTools } from '../subscription/subscriptionMcp';
import { getUserMcpTools } from '../user/userMcp';
import { getExamMcpTools } from '../exam/examMcp';
import { getChapterMcpTools } from '../chapter/chapterMcp';
import { getLessonMcpTools } from '../lesson/lessonMcp';
import { getPracticeQuestionMcpTools } from '../practiceQuestion/practiceQuestionMcp';
import { getConceptMcpTools } from '../concept/conceptMcp';
import { getExamTypeMcpTools } from '../examType/examTypeMcp';
import { getExamInstanceMcpTools } from '../examInstance/examInstanceMcp';
import { getDailyGoalMcpTools } from '../dailyGoal/dailyGoalMcp';
import { getStudyNoteMcpTools } from '../studyNote/studyNoteMcp';
import { getDocumentUploadMcpTools } from '../documentUpload/documentUploadMcp';
import { McpTool } from './mcpTypes';
import { Dictionary } from '../../translation/locales';
import { env } from '../../env';

const app = new Hono();

// Centralized function to ensure consistency across MCP server and chatbot
export function getAllMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    ...getExamMcpTools(dictionary),
    ...getChapterMcpTools(dictionary),
    ...getLessonMcpTools(dictionary),
    ...getPracticeQuestionMcpTools(dictionary),
    ...getConceptMcpTools(dictionary),
    ...getExamTypeMcpTools(dictionary),
    ...getExamInstanceMcpTools(dictionary),
    ...getDailyGoalMcpTools(dictionary),
    ...getStudyNoteMcpTools(dictionary),
    ...getDocumentUploadMcpTools(dictionary),
    ...getMemberMcpTools(dictionary),
    ...getAuditLogMcpTools(dictionary),
    ...getSubscriptionMcpTools(dictionary),
    ...getUserMcpTools(dictionary),
  ];
}

// Maps HTTP error codes to JSON-RPC spec error codes
// Standard codes: -32700 to -32603, custom codes: -32001 to -32003
function formatMcpError(error: any, toolName?: string) {
  let code = -32603;
  const message = error.message || 'Internal error';

  if (error instanceof Error400) {
    code = -32602;
  } else if (error instanceof Error401) {
    code = -32001;
  } else if (error instanceof Error403) {
    code = -32002;
  } else if (error instanceof Error404) {
    code = -32003;
  }

  const errorDetails: any = {
    code,
    message: toolName ? `Tool '${toolName}' failed: ${message}` : message,
  };

  const data: any = {
    errorType: error.constructor?.name || 'Error',
  };

  if (env.NODE_ENV !== 'production' && error.stack) {
    data.stack = error.stack;
  }

  if (error.code) {
    data.httpCode = error.code;
  }

  errorDetails.data = data;

  return errorDetails;
}

app.get('/', async (c) => {
  return c.json({
    name: 'MCP Server',
    version: '1.0.0',
    protocol: '2024-11-05',
    description: 'Model Context Protocol Server with Better Auth OAuth',
    endpoints: {
      jsonRpc: 'POST /api/mcp',
    },
    authentication: {
      type: 'oauth2',
      authorizationServer: '/.well-known/oauth-authorization-server',
      protectedResource: '/.well-known/oauth-protected-resource',
    },
  });
});

// MCP Server Endpoint implementing JSON-RPC protocol with Better Auth OAuth
app.post(`/:language/:organizationId`, async (c) => {
  const mcpSession = await authBackend.api.getMcpSession({
    headers: c.req.raw.headers,
  });

  if (!mcpSession) {
    return c.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32001,
          message: 'Unauthorized: Valid MCP session required',
        },
        id: null,
      },
      401,
    );
  }

  const context = await appContextForMcp(
    mcpSession.userId,
    c.req.param('organizationId'),
    c.req.param('language'),
    c,
  );

  try {
    await authGuardBackend(
      {
        mcp: ['use'],
      },
      context,
    );
  } catch (error: any) {
    return c.json(
      {
        jsonrpc: '2.0',
        error: formatMcpError(error),
        id: null,
      },
      error.code || 403,
    );
  }

  return await handleMcpRequest(c, context, context.dictionary);
});

async function handleMcpRequest(c: any, context: any, dictionary: any) {
  const allTools = getAllMcpTools(dictionary);
  const allowedTools = allTools;
  let request;
  try {
    request = await c.req.json();
  } catch (e) {
    return c.json({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error',
      },
      id: null,
    });
  }

  if (request.method === 'initialize') {
    const serverName =
      env.ORGANIZATION_MODE === 'single'
        ? context.currentOrganization?.name || dictionary.projectName
        : dictionary.projectName;

    return c.json({
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: serverName,
          version: '1.0.0',
        },
      },
      id: request.id,
    });
  }

  if (request.method === 'tools/list') {
    return c.json({
      jsonrpc: '2.0',
      result: {
        tools: allowedTools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.schema,
        })),
      },
      id: request.id,
    });
  }

  if (request.method === 'tools/call') {
    const toolName = request.params?.name;
    const toolParams = request.params?.arguments || {};

    const tool = allowedTools.find((t) => t.name === toolName);

    if (!tool) {
      return c.json({
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: `Tool not found: ${toolName}`,
        },
        id: request.id,
      });
    }

    try {
      const result = await tool.handler(toolParams, context);

      return c.json({
        jsonrpc: '2.0',
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        },
        id: request.id,
      });
    } catch (error: any) {
      console.error(`MCP Tool Error [${toolName}]:`, {
        error: error.message,
        type: error.constructor?.name,
        params: toolParams,
        stack: error.stack,
      });

      return c.json({
        jsonrpc: '2.0',
        error: formatMcpError(error, toolName),
        id: request.id,
      });
    }
  }

  if (request.method === 'notifications/initialized') {
    return c.body(null, 204);
  }

  return c.json({
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: 'Method not found',
    },
    id: request.id,
  });
}

export default app;
