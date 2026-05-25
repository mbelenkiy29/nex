import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { useState } from 'react';
import { LuPencil, LuPlus } from 'react-icons/lu';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { LessonFormSheet } from '@/features/lesson/components/LessonFormSheet';
import { useAuthStore } from '@/features/auth/authStore';
import { AutocompleteInput } from '@/shared/components/form/AutocompleteInput';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function LessonAutocompleteInput({
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
    value: Partial<LessonWithRelationships> | undefined | null,
  ) => void;
  value?: Partial<LessonWithRelationships> | null;
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
    lesson: ['create'],
  });

  const hasPermissionToEdit = hasPermission({
    lesson: ['update'],
  });

  const queryFn = async (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .get(
        `api/lesson/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<LessonWithRelationships[]>();
  };

  return (
    <div className="flex w-full min-w-0 gap-1">
      <div className="min-w-0 flex-1">
        <AutocompleteInput
          queryFn={queryFn}
          queryId={['lesson', 'autocomplete']}
          isClearable={isClearable}
          labelFn={lessonLabel}
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
        <LessonFormSheet
          onCancel={() => setIsFormOpen(false)}
          onSuccess={(lesson) => {
            setIsFormOpen(false);
            onChange(lesson);
          }}
          lesson={value ? value : undefined}
        />
      )}
    </div>
  );
}
