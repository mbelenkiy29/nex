import { createLazyRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { PageHeader } from '@/shared/components/PageHeader';

export const apiDocsLazyRoute = createLazyRoute('/api-docs')({
  component: ApiDocsPage,
});

export function ApiDocsPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);

  return (
    <div className="flex flex-1 flex-col">
      <Tabs defaultValue="app" className="flex flex-1 flex-col gap-0">
        <div className="bg-background border-b p-6 pb-4">
          <div className="mb-4">
            <PageHeader items={[[dictionary.apiDocs.title]]} />
          </div>
          <TabsList>
            <TabsTrigger value="app">
              {dictionary.apiDocs.featuresApi}
            </TabsTrigger>
            <TabsTrigger value="auth">{dictionary.apiDocs.authApi}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="app" className="flex-1">
          <div className="h-full">
            <iframe
              src={`${import.meta.env.VITE_BACKEND_URL || ''}/api/api-docs/reference?locale=${locale}`}
              className="h-full w-full border-0"
              title={dictionary.apiDocs.featuresApi}
              style={{ minHeight: 'calc(100vh - 200px)' }}
            />
          </div>
        </TabsContent>

        <TabsContent value="auth" className="flex-1">
          <div className="h-full">
            <iframe
              src={`${import.meta.env.VITE_BACKEND_URL || ''}/api/auth/reference?locale=${locale}`}
              className="h-full w-full border-0"
              title={dictionary.apiDocs.authApi}
              style={{ minHeight: 'calc(100vh - 200px)' }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
