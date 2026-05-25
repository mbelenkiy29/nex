import { Course } from '@/features/course/courseTypes';
import { courseLabel } from '@project/backend/features/course/courseLabel';
import { AutocompleteInput } from '@/shared/components/form/AutocompleteInput';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function CourseAutocompleteInput({
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  isClearable,
  mode,
  disabled,
}: {
  onChange: (value: Partial<Course> | undefined | null) => void;
  value?: Partial<Course> | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  isClearable?: boolean;
  mode: 'memory' | 'async';
  disabled?: boolean;
}) {
  const queryFn = async (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .get(
        `api/course/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<Course[]>();
  };

  return (
    <AutocompleteInput
      queryFn={queryFn}
      queryId={['course', 'autocomplete']}
      isClearable={isClearable}
      labelFn={courseLabel}
      notFoundPlaceholder={notFoundPlaceholder}
      onChange={onChange}
      searchPlaceholder={searchPlaceholder}
      selectPlaceholder={selectPlaceholder}
      value={value}
      mode={mode}
      disabled={disabled}
    />
  );
}
