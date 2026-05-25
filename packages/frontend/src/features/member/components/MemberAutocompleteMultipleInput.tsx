import { AutocompleteMultipleInput } from '@/shared/components/form/AutocompleteMultipleInput';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';

export function MemberAutocompleteMultipleInput({
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  mode,
  disabled,
}: {
  onChange: (
    value: Array<Partial<MemberWithRelationships>> | undefined | null | [],
  ) => void;
  value?: Array<Partial<MemberWithRelationships>> | null | [];
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  mode: 'memory' | 'async';
  disabled?: boolean;
  hideFormButton?: boolean;
}) {
  const queryFn = (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return apiClient
      .get(
        `api/member/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<MemberWithRelationships[]>();
  };

  return (
    <div className="flex w-full min-w-0 gap-1">
      <div className="min-w-0 flex-1">
        <AutocompleteMultipleInput
          queryFn={queryFn}
          queryId={['member', 'autocomplete']}
          labelFn={memberLabel}
          notFoundPlaceholder={notFoundPlaceholder}
          onChange={onChange}
          searchPlaceholder={searchPlaceholder}
          selectPlaceholder={selectPlaceholder}
          value={value}
          mode={mode}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
