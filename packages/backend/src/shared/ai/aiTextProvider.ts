import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../env';

export type AiTextProviderName = 'anthropic' | 'openai';

export type AiTokenUsage = {
  inputTokens: number;
  outputTokens: number;
};

export type AiTextGenerationResult = {
  text: string;
  usage: AiTokenUsage;
  model: string;
  provider: AiTextProviderName;
};

export type AiTextStreamChunk =
  | { type: 'text'; content: string }
  | { type: 'usage'; usage: AiTokenUsage };

export class AiTextProviderError extends Error {
  provider: AiTextProviderName;
  status?: number;

  constructor(provider: AiTextProviderName, status?: number) {
    super(`${provider}TextGenerationFailed`);
    this.provider = provider;
    this.status = status;
  }
}

export const ANTHROPIC_TEXT_MODEL = 'claude-haiku-4-5-20251001';
export const OPENAI_TEXT_MODEL = 'gpt-4.1-mini';

const anthropic = env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  : null;

export function aiTextProviderConfigured() {
  return Boolean(activeProvider());
}

export function aiTextProviderModel() {
  const provider = activeProvider();
  return provider === 'openai' ? OPENAI_TEXT_MODEL : ANTHROPIC_TEXT_MODEL;
}

export async function generateAiText(input: {
  system: string;
  prompt: string;
  maxTokens: number;
  json?: boolean;
}): Promise<AiTextGenerationResult> {
  const provider = activeProvider();
  if (provider === 'anthropic') {
    return generateAnthropicText(input);
  }
  if (provider === 'openai') {
    return generateOpenAiText(input);
  }
  throw new Error('aiTextProviderNotConfigured');
}

export async function* streamAiText(input: {
  system: string;
  prompt: string;
  maxTokens: number;
}): AsyncGenerator<AiTextStreamChunk> {
  const provider = activeProvider();
  if (provider === 'anthropic') {
    yield* streamAnthropicText(input);
    return;
  }
  if (provider === 'openai') {
    yield* streamOpenAiText(input);
    return;
  }
  throw new Error('aiTextProviderNotConfigured');
}

function activeProvider(): AiTextProviderName | null {
  if (anthropic) {
    return 'anthropic';
  }
  if (env.OPENAI_API_KEY) {
    return 'openai';
  }
  return null;
}

async function generateAnthropicText(input: {
  system: string;
  prompt: string;
  maxTokens: number;
}): Promise<AiTextGenerationResult> {
  if (!anthropic) {
    throw new Error('anthropicNotConfigured');
  }

  let response: Anthropic.Message;
  try {
    response = await anthropic.messages.create({
      model: ANTHROPIC_TEXT_MODEL,
      max_tokens: input.maxTokens,
      system: input.system,
      messages: [{ role: 'user', content: input.prompt }],
    });
  } catch {
    throw new AiTextProviderError('anthropic');
  }

  return {
    text: response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join(''),
    usage: {
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
    },
    model: ANTHROPIC_TEXT_MODEL,
    provider: 'anthropic',
  };
}

async function* streamAnthropicText(input: {
  system: string;
  prompt: string;
  maxTokens: number;
}): AsyncGenerator<AiTextStreamChunk> {
  if (!anthropic) {
    throw new Error('anthropicNotConfigured');
  }

  let inputTokens = 0;
  let outputTokens = 0;
  let stream: AsyncIterable<Anthropic.MessageStreamEvent>;
  try {
    stream = await anthropic.messages.create({
      model: ANTHROPIC_TEXT_MODEL,
      max_tokens: input.maxTokens,
      system: input.system,
      messages: [{ role: 'user', content: input.prompt }],
      stream: true,
    });
  } catch {
    throw new AiTextProviderError('anthropic');
  }

  for await (const event of stream) {
    if (event.type === 'message_start') {
      inputTokens += event.message.usage?.input_tokens || 0;
    } else if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield { type: 'text', content: event.delta.text };
    } else if (event.type === 'message_delta') {
      outputTokens += event.usage?.output_tokens || 0;
    }
  }

  yield { type: 'usage', usage: { inputTokens, outputTokens } };
}

async function generateOpenAiText(input: {
  system: string;
  prompt: string;
  maxTokens: number;
  json?: boolean;
}): Promise<AiTextGenerationResult> {
  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: openAiHeaders(),
      body: JSON.stringify({
        model: OPENAI_TEXT_MODEL,
        max_tokens: input.maxTokens,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.prompt },
        ],
        ...(input.json ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
  } catch {
    throw new AiTextProviderError('openai');
  }

  if (!response.ok) {
    throw new AiTextProviderError('openai', response.status);
  }

  let data: {
    choices?: Array<{ message?: { content?: string | null } }>;
    usage?: Record<string, unknown>;
  };
  try {
    data = (await response.json()) as typeof data;
  } catch {
    throw new AiTextProviderError('openai', response.status);
  }
  const text = data.choices?.[0]?.message?.content || '';
  if (!text.trim()) {
    throw new AiTextProviderError('openai');
  }

  return {
    text,
    usage: normalizeOpenAiUsage(data.usage),
    model: OPENAI_TEXT_MODEL,
    provider: 'openai',
  };
}

async function* streamOpenAiText(input: {
  system: string;
  prompt: string;
  maxTokens: number;
}): AsyncGenerator<AiTextStreamChunk> {
  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: openAiHeaders(),
      body: JSON.stringify({
        model: OPENAI_TEXT_MODEL,
        max_tokens: input.maxTokens,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.prompt },
        ],
        stream: true,
        stream_options: { include_usage: true },
      }),
    });
  } catch {
    throw new AiTextProviderError('openai');
  }

  if (!response.ok || !response.body) {
    throw new AiTextProviderError('openai', response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let usage: AiTokenUsage = { inputTokens: 0, outputTokens: 0 };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) {
        continue;
      }
      const data = line.slice('data:'.length).trim();
      if (!data || data === '[DONE]') {
        continue;
      }

      let chunk: {
        choices?: Array<{ delta?: { content?: string | null } }>;
        usage?: Record<string, unknown> | null;
      };
      try {
        chunk = JSON.parse(data);
      } catch {
        continue;
      }
      const content = chunk.choices?.[0]?.delta?.content || '';
      if (content) {
        yield { type: 'text', content };
      }
      if (chunk.usage) {
        usage = normalizeOpenAiUsage(chunk.usage);
      }
    }
  }

  yield { type: 'usage', usage };
}

function openAiHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
  };
}

function normalizeOpenAiUsage(
  usage: Record<string, unknown> | null | undefined,
) {
  return {
    inputTokens: numberValue(usage?.prompt_tokens ?? usage?.input_tokens),
    outputTokens: numberValue(usage?.completion_tokens ?? usage?.output_tokens),
  };
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}
