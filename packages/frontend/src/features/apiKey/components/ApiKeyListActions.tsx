import { DataTableViewOptions } from '@/shared/components/dataTable/DataTableViewButton';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Table } from '@tanstack/react-table';
import { LuLoader, LuPlus, LuRefreshCw } from 'react-icons/lu';

type ApiKey = {
  id: string;
  name: string | null;
  prefix: string | null;
  start: string | null;
  enabled: boolean;
  expiresAt: Date | null;
  remaining: number | null;
  lastRequest: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function ApiKeyListActions({ table }: { table: Table<ApiKey> }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ['apiKey'] });

  const hasPermissionToCreate = hasPermission({
    apiKey: ['create'],
  });

  return (
    <>
      <DataTableViewOptions table={table} />

      <Button
        variant="outline"
        size="sm"
        className="ml-auto flex h-8"
        onClick={() => queryClient.invalidateQueries({ queryKey: ['apiKey'] })}
        disabled={!!isFetching}
      >
        {isFetching ? (
          <LuLoader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LuRefreshCw className="mr-2 h-4 w-4" />
        )}
        <span>{dictionary.shared.refresh}</span>
      </Button>

      {hasPermissionToCreate && (
        <Button
          nativeButton={false}
          size="sm"
          className="ml-auto flex h-8 whitespace-nowrap"
          render={<Link to={`/api-key/new`} />}
        >
          <LuPlus className="mr-2 h-4 w-4" />
          <span>{dictionary.shared.new}</span>
        </Button>
      )}
    </>
  );
}
