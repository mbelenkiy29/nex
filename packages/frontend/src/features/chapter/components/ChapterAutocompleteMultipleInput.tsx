import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { ChapterFormSheet } from '@/features/chapter/components/ChapterFormSheet';
import { useAuthStore } from '@/features/auth/authStore';
import { AutocompleteMultipleInput } from '@/shared/components/form/AutocompleteMultipleInput';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function ChapterAutocompleteMultipleInput({
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  mode,
  disabled,
  hideFormButton,
}: {
  onChange: (
    value: Array<Partial<ChapterWithRelationships>> | undefined | null | [],
  ) => void;
  value?: Array<Partial<ChapterWithRelationships>> | null | [];
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  mode: 'memory' | 'async';
  disabled?: boolean;
  hideFormButton?: boolean;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToCreate = hasPermission({
    chapter: ['create'],
  });

  const queryFn = async (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .get(
        `api/chapter/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<ChapterWithRelationships[]>();
  };

  return (
    <div className="flex w-full min-w-0 gap-1">
      <div className="min-w-0 flex-1">
        <AutocompleteMultipleInput
          queryFn={queryFn}
          queryId={['chapter', 'autocomplete']}
          labelFn={chapterLabel}
          notFoundPlaceholder={notFoundPlaceholder}
          onChange={onChange}
          searchPlaceholder={searchPlaceholder}
          selectPlaceholder={selectPlaceholder}
          value={value}
          mode={mode}
          disabled={disabled}
        />
      </div>

      {hasPermissionToCreate && !hideFormButton && (
        <Button
          type="button"
          variant="secondary"
          size={'icon'}
          onClick={() => setIsFormOpen(true)}
          title={dictionary.shared.new}
          disabled={disabled}
        >
          <LuPlus className="h-4 w-4" />
        </Button>
      )}

      {isFormOpen && (
        <ChapterFormSheet
          onCancel={() => setIsFormOpen(false)}
          onSuccess={(chapter) => {
            setIsFormOpen(false);
            onChange([...(value || []), chapter]);
          }}
        />
      )}
    </div>
  );
}
