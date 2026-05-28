import Anthropic from '@anthropic-ai/sdk';
import { AppContext } from '../../shared/controller/appContext';
import { McpTool } from '../mcp/mcpTypes';
import { getAllMcpTools } from '../mcp/mcp';
import { ChatbotAttachment, ChatbotMessage } from './chatbotSchemas';
import { roles, rolesIds } from '../permissions';
import type { Role } from 'better-auth/plugins/access';
import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { promptLanguageName } from '../../shared/lib/promptLanguageName';
import { env } from '../../env';
import { courseBuildAiContext } from '../course/courseControllers';
import {
  getStudyToolDefinitions,
  isStudyToolName,
  runStudyTool,
  StudyToolWidget,
} from './chatbotTools';
import { errorToLogMetadata, logger } from '../../shared/lib/logger';
import { chatbotMessageContentForModel } from './chatbotAttachmentService';
import type { AiTrustPreferences } from '../aiTrust/aiTrustSchemas';

const anthropicApiKey = env.ANTHROPIC_API_KEY;
export const CHATBOT_MODEL = 'claude-haiku-4-5-20251001';

if (!anthropicApiKey) {
  logger.warn('ai.chatbot.not_configured');
}

const anthropic = anthropicApiKey
  ? new Anthropic({ apiKey: anthropicApiKey })
  : null;

function convertMcpToolsToAnthropicFormat(
  mcpTools: McpTool[],
): Anthropic.Tool[] {
  return mcpTools.map((mcpTool) => ({
    name: mcpTool.name,
    description: mcpTool.description,
    input_schema: mcpTool.schema as Anthropic.Tool.InputSchema,
  }));
}

function hasToolPermission(tool: McpTool, context: AppContext): boolean {
  if (!context.currentMember) {
    return false;
  }

  const role: Role = roles[context.currentMember.role as keyof typeof rolesIds];

  if (!role) {
    return false;
  }

  if (
    !tool.requiredPermissions ||
    Object.keys(tool.requiredPermissions).length === 0
  ) {
    return true;
  }

  const result = role.authorize(tool.requiredPermissions as any);

  return result.success;
}

function filterToolsByPermissions(
  mcpTools: McpTool[],
  context: AppContext,
): { allowedTools: McpTool[]; anthropicTools: Anthropic.Tool[] } {
  const allowedTools = mcpTools.filter((tool) =>
    hasToolPermission(tool, context),
  );
  const anthropicTools = convertMcpToolsToAnthropicFormat(allowedTools);

  return { allowedTools, anthropicTools };
}

async function executeMcpTool(
  toolName: string,
  toolInput: any,
  allowedTools: McpTool[],
  context: AppContext,
): Promise<string> {
  const tool = allowedTools.find((t) => t.name === toolName);

  if (!tool) {
    return `Error: Tool "${toolName}" not found or not allowed`;
  }

  try {
    const result = await tool.handler(toolInput, context);
    return JSON.stringify(result, null, 2);
  } catch (error: any) {
    logger.error('ai.chatbot.tool_failed', {
      toolName,
      error: errorToLogMetadata(error),
    });
    return `Error executing ${toolName}: ${error.message}`;
  }
}

function convertHistoryToAnthropicMessages(
  history: ChatbotMessage[],
): Anthropic.MessageParam[] {
  return history.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));
}

function createSystemPrompt(
  context: AppContext,
  courseContext?: string,
): string {
  const orgName = context.currentOrganization?.name || 'your organization';
  // Uses the shared promptLanguageName() whitelist — single source of truth,
  // explicit safe-set, closes the defence-in-depth gap in audit finding #13.
  const languageName = promptLanguageName(context.locale);

  const basePrompt = dictionaryFormat(
    context.dictionary.chatbot.systemPrompt,
    orgName,
    languageName,
  );

  if (!courseContext) {
    return basePrompt;
  }

  return `${basePrompt}\n\n${dictionaryFormat(
    context.dictionary.chatbot.courseScopedSystemPrompt,
    courseContext,
  )}`;
}

export interface ChatbotStreamChunk {
  type: 'text' | 'tool_use' | 'tool_result' | 'error' | 'done' | 'usage';
  content?: string;
  toolName?: string;
  toolInput?: any;
  // When a study tool (e.g. study_quiz_module) emits a tool_result, the payload
  // is also attached here so the frontend can render an inline widget. Regular
  // MCP tools omit this field and only set `content`.
  widget?: StudyToolWidget;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export async function* streamChatbotResponse(
  message: string,
  history: ChatbotMessage[] = [],
  context: AppContext,
  options: {
    courseId?: string;
    lessonId?: string;
    attachments?: ChatbotAttachment[];
    preferences?: AiTrustPreferences;
  } = {},
): AsyncGenerator<ChatbotStreamChunk> {
  const courseContext = options.courseId
    ? await courseBuildAiContext(options.courseId, options.lessonId, context, {
        preferences: options.preferences,
      })
    : undefined;

  if (!anthropic) {
    yield {
      type: 'error',
      content: context.dictionary.chatbot.errorNoApiKey,
    };
    return;
  }

  const allMcpTools = getAllMcpTools(context.dictionary);
  const { allowedTools, anthropicTools } = filterToolsByPermissions(
    allMcpTools,
    context,
  );

  // Study tools are only meaningful inside a course-scoped conversation, but
  // they're advertised either way: when the user is chatting outside a course
  // and the model tries to call one, the tool throws Error400 with a clear
  // "open from a course" message which is surfaced as tool_result text.
  const studyTools = getStudyToolDefinitions();
  const combinedTools: Anthropic.Tool[] = [...anthropicTools, ...studyTools];

  const messages: Anthropic.MessageParam[] = [
    ...convertHistoryToAnthropicMessages(history),
    {
      role: 'user',
      content: chatbotMessageContentForModel(
        message,
        options.preferences?.useAttachments === false
          ? []
          : options.attachments,
      ),
    },
  ];

  try {
    // Agentic loop: continue until Claude provides final answer
    let continueLoop = true;
    const maxIterations = 10;
    let iteration = 0;

    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    while (continueLoop && iteration < maxIterations) {
      iteration++;

      const stream = await anthropic.messages.create({
        model: CHATBOT_MODEL,
        max_tokens: 4096,
        system: createSystemPrompt(context, courseContext),
        messages,
        tools: combinedTools.length > 0 ? combinedTools : undefined,
        stream: true,
      });

      const contentBlocks: Array<
        Anthropic.TextBlockParam | Anthropic.ToolUseBlockParam
      > = [];
      let currentTextBlock = '';
      let currentToolUse: { id: string; name: string; input: string } | null =
        null;
      let stopReason: string | null = null;

      for await (const event of stream) {
        if (event.type === 'message_start') {
          if (event.message.usage) {
            totalInputTokens += event.message.usage.input_tokens || 0;
          }
        } else if (event.type === 'content_block_start') {
          if (event.content_block.type === 'text') {
            currentTextBlock = '';
          } else if (event.content_block.type === 'tool_use') {
            currentToolUse = {
              id: event.content_block.id,
              name: event.content_block.name,
              input: '',
            };
            yield {
              type: 'tool_use',
              toolName: event.content_block.name,
              toolInput: {},
            };
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            currentTextBlock += event.delta.text;
            yield {
              type: 'text',
              content: event.delta.text,
            };
          } else if (event.delta.type === 'input_json_delta') {
            if (currentToolUse) {
              currentToolUse.input += event.delta.partial_json;
            }
          }
        } else if (event.type === 'content_block_stop') {
          if (currentTextBlock) {
            contentBlocks.push({
              type: 'text',
              text: currentTextBlock,
            } as Anthropic.TextBlockParam);
            currentTextBlock = '';
          } else if (currentToolUse) {
            contentBlocks.push({
              type: 'tool_use',
              id: currentToolUse.id,
              name: currentToolUse.name,
              input: currentToolUse.input
                ? JSON.parse(currentToolUse.input)
                : {},
            } as Anthropic.ToolUseBlockParam);
            currentToolUse = null;
          }
        } else if (event.type === 'message_delta') {
          if (event.delta.stop_reason) {
            stopReason = event.delta.stop_reason;
          }
          if (event.usage) {
            totalOutputTokens += event.usage.output_tokens || 0;
          }
        }
      }

      if (stopReason === 'tool_use') {
        messages.push({
          role: 'assistant',
          content: contentBlocks,
        });

        const toolResults: Anthropic.MessageParam = {
          role: 'user',
          content: [],
        };

        for (const block of contentBlocks) {
          if (block.type !== 'tool_use') continue;

          if (isStudyToolName(block.name)) {
            // Study tool — runs the courseStudyAi generator, returns a widget
            // payload + a short textForModel summary the agent sees on the
            // next iteration. Errors are caught and surfaced as plain text
            // so the model can recover (e.g. "open from a course").
            try {
              const result = await runStudyTool(
                block.name,
                (block.input as Record<string, unknown>) || {},
                {
                  context,
                  courseId: options.courseId ?? null,
                  preferences: options.preferences,
                },
              );

              totalInputTokens += result.usage.inputTokens;
              totalOutputTokens += result.usage.outputTokens;

              (toolResults.content as Anthropic.ToolResultBlockParam[]).push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: result.textForModel,
              });

              yield {
                type: 'tool_result',
                toolName: block.name,
                content: result.textForModel,
                widget: result.widget,
              };
            } catch (error: any) {
              const errorMessage =
                error?.message || `Error running ${block.name}`;
              (toolResults.content as Anthropic.ToolResultBlockParam[]).push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: `Error: ${errorMessage}`,
                is_error: true,
              });
              yield {
                type: 'tool_result',
                toolName: block.name,
                content: `Error: ${errorMessage}`,
              };
            }
            continue;
          }

          // Regular MCP tool — preserves the existing JSON-string contract.
          const toolResult = await executeMcpTool(
            block.name,
            block.input,
            allowedTools,
            context,
          );

          (toolResults.content as Anthropic.ToolResultBlockParam[]).push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: toolResult,
          });

          yield {
            type: 'tool_result',
            toolName: block.name,
            content: toolResult,
          };
        }

        messages.push(toolResults);
      } else {
        continueLoop = false;
      }
    }

    yield {
      type: 'usage',
      usage: {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
      },
    };

    yield { type: 'done' };
  } catch (error: any) {
    logger.error('ai.chatbot.stream_failed', {
      courseId: options.courseId,
      lessonId: options.lessonId,
      error: errorToLogMetadata(error),
    });
    yield {
      type: 'error',
      content:
        error.message || 'An error occurred while processing your request',
    };
  }
}
