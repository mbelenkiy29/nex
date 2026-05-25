import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { useState } from 'react';
import { LuPencil, LuPlus } from 'react-icons/lu';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { PracticeQuestionFormSheet } from '@/features/practiceQuestion/components/PracticeQuestionFormSheet';
import { useAuthStore } from '@/features/auth/authStore';
import { AutocompleteInput } from '@/shared/components/form/AutocompleteInput';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function PracticeQuestionAutocompleteInput({
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  isClearable,
  mode,
  disabled,
  hideFormButton,
}: {
  onChange: (
    value: Partial<PracticeQuestionWithRelationships> | undefined | null,
  ) => void;
  value?: Partial<PracticeQuestionWithRelationships> | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  isClearable?: boolean;
  mode: 'memory' | 'async';
  disabled?: boolean;
  hideFormButton?: boolean;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToCreate = hasPermission({
    practiceQuestion: ['create'],
  });

  const hasPermissionToEdit = hasPermission({
    practiceQuestion: ['update'],
  });

  const queryFn = async (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .get(
        `api/practice-question/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<PracticeQuestionWithRelationships[]>();
  };

  return (
    <div className="flex w-full min-w-0 gap-1">
      <div className="min-w-0 flex-1">
        <AutocompleteInput
          queryFn={queryFn}
          queryId={['practiceQuestion', 'autocomplete']}
          isClearable={isClearable}
          labelFn={practiceQuestionLabel}
          notFoundPlaceholder={notFoundPlaceholder}
          onChange={onChange}
          searchPlaceholder={searchPlaceholder}
          selectPlaceholder={selectPlaceholder}
          value={value}
          mode={mode}
          disabled={disabled}
        />
      </div>

      {hasPermissionToCreate && !value && !hideFormButton && (
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

      {hasPermissionToEdit && Boolean(value) && !hideFormButton && (
        <Button
          type="button"
          variant="secondary"
          size={'icon'}
          onClick={() => setIsFormOpen(true)}
          title={dictionary.shared.edit}
          disabled={disabled}
        >
          <LuPencil className="h-4 w-4" />
        </Button>
      )}

      {isFormOpen && (
        <PracticeQuestionFormSheet
          onCancel={() => setIsFormOpen(false)}
          onSuccess={(practiceQuestion) => {
            setIsFormOpen(false);
            onChange(practiceQuestion);
          }}
          practiceQuestion={value ? value : undefined}
        />
      )}
    </div>
  );
}
