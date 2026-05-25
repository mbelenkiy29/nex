import { createLazyRoute } from '@tanstack/react-router';
import {
  memberImportFileSchema,
  memberImportInputSchema,
} from '@project/backend/features/member/memberSchemas';
import { Importer } from '@/shared/components/importer/Importer';
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { importerOutputSchema } from '@project/backend/shared/schemas/importerSchemas';
import { z } from 'zod';

export const memberImporterLazyRoute = createLazyRoute('/member/importer')({
  component: MemberImporterPage,
});

export function MemberImporterPage() {
  const dictionary = useAuthStore((state) => state.dictionary);

  const memberImportApiCall = async (
    data: z.input<typeof memberImportInputSchema>[],
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .post('api/member/importer', {
        json: data,
        signal,
      })
      .json<z.output<typeof importerOutputSchema>>();
  };

  return (
    <Importer
      keys={['email', 'role']}
      labels={dictionary.member.fields}
      validationSchema={memberImportInputSchema}
      fileSchema={memberImportFileSchema}
      importerFn={memberImportApiCall}
      breadcrumbRoot={[dictionary.member.list.menu, '/member']}
      breadcrumbImporterMenu={dictionary.member.importer.menu}
      importerTitle={dictionary.member.importer.title}
      queryKeyToInvalidate={['member', 'invitation']}
    />
  );
}
