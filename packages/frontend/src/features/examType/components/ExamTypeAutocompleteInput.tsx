import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { useState } from 'react';
import { LuPencil, LuPlus } from 'react-icons/lu';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { ExamTypeFormSheet } from '@/features/examType/components/ExamTypeFormSheet';
import { useAuthStore } from '@/features/auth/authStore';
import { AutocompleteInput } from '@/shared/components/form/AutocompleteInput';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function ExamTypeAutocompleteInput({
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
    value: Partial<ExamTypeWithRelationships> | undefined | null,
  ) => void;
  value?: Partial<ExamTypeWithRelationships> | null;
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
    examType: ['create'],
  });

  const hasPermissionToEdit = hasPermission({
    examType: ['update'],
  });

  const queryFn = async (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .get(
        `api/exam-type/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<ExamTypeWithRelationships[]>();
  };

  return (
    <div className="flex w-full min-w-0 gap-1">
      <div className="min-w-0 flex-1">
        <AutocompleteInput
          queryFn={queryFn}
          queryId={['examType', 'autocomplete']}
          isClearable={isClearable}
          labelFn={examTypeLabel}
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
        <ExamTypeFormSheet
          onCancel={() => setIsFormOpen(false)}
          onSuccess={(examType) => {
            setIsFormOpen(false);
            onChange(examType);
          }}
          examType={value ? value : undefined}
        />
      )}
    </div>
  );
}
