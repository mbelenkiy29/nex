import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { ExamTypeFormSheet } from '@/features/examType/components/ExamTypeFormSheet';
import { useAuthStore } from '@/features/auth/authStore';
import { AutocompleteMultipleInput } from '@/shared/components/form/AutocompleteMultipleInput';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function ExamTypeAutocompleteMultipleInput({
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
    value: Array<Partial<ExamTypeWithRelationships>> | undefined | null | [],
  ) => void;
  value?: Array<Partial<ExamTypeWithRelationships>> | null | [];
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
    examType: ['create'],
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
        <AutocompleteMultipleInput
          queryFn={queryFn}
          queryId={['examType', 'autocomplete']}
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
        <ExamTypeFormSheet
          onCancel={() => setIsFormOpen(false)}
          onSuccess={(examType) => {
            setIsFormOpen(false);
            onChange([...(value || []), examType]);
          }}
        />
      )}
    </div>
  );
}
