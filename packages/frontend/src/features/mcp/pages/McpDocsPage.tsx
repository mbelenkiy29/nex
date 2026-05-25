import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { FiInfo } from 'react-icons/fi';
import { useShallow } from 'zustand/react/shallow';
import { PageHeader } from '@/shared/components/PageHeader';

export const mcpDocsLazyRoute = createLazyRoute('/mcp-docs')({
  component: McpDocsPage,
});

export function McpDocsPage() {
  const { dictionary, locale, currentMember } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
      currentMember: state.currentMember,
    })),
  );

  const organizationId = currentMember?.organizationId || '';
  const language = locale || 'en';

  // Construct the JSON-RPC endpoint URL
  const mcpEndpoint = `${window.location.origin}/api/mcp/${language}/${organizationId}`;

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6">
        <PageHeader items={[[dictionary.mcp.title]]} />
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Alert>
            <FiInfo className="h-4 w-4" />
            <AlertDescription>{dictionary.mcp.info}</AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{dictionary.mcp.endpoint.title}</CardTitle>
              <CardDescription>
                {dictionary.mcp.endpoint.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {dictionary.mcp.endpoint.endpointLabel}
                </label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted flex-1 rounded px-3 py-2 text-sm break-all">
                    {mcpEndpoint}
                  </code>
                  <CopyToClipboardButton text={mcpEndpoint} />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-muted-foreground text-sm">
                  <strong>{dictionary.mcp.endpoint.organizationLabel}:</strong>{' '}
                  {organizationId}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  <strong>{dictionary.mcp.endpoint.languageLabel}:</strong>{' '}
                  {language}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{dictionary.mcp.usage.title}</CardTitle>
              <CardDescription>
                {dictionary.mcp.usage.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-decimal space-y-2 text-sm">
                <li>{dictionary.mcp.usage.step1}</li>
                <li>{dictionary.mcp.usage.step2}</li>
                <li>{dictionary.mcp.usage.step3}</li>
                <li>{dictionary.mcp.usage.step4}</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
