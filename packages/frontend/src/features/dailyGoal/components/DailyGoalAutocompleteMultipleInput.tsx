import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { dailyGoalLabel } from '@project/backend/features/dailyGoal/dailyGoalLabel';
import { DailyGoalFormSheet } from '@/features/dailyGoal/components/DailyGoalFormSheet';
import { useAuthStore } from '@/features/auth/authStore';
import { AutocompleteMultipleInput } from '@/shared/components/form/AutocompleteMultipleInput';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

export function DailyGoalAutocompleteMultipleInput({
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
    value: Array<Partial<DailyGoalWithRelationships>> | undefined | null | [],
  ) => void;
  value?: Array<Partial<DailyGoalWithRelationships>> | null | [];
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
    dailyGoal: ['create'],
  });

  const queryFn = async (
    search?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => {
    return await apiClient
      .get(
        `api/daily-goal/autocomplete?${objectToQuery({
          search,
          exclude,
          take: mode === 'async' ? 10 : undefined,
        })}`,
        { signal },
      )
      .json<DailyGoalWithRelationships[]>();
  };

  return (
    <div className="flex w-full min-w-0 gap-1">
      <div className="min-w-0 flex-1">
        <AutocompleteMultipleInput
          queryFn={queryFn}
          queryId={['dailyGoal', 'autocomplete']}
          labelFn={dailyGoalLabel}
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
        <DailyGoalFormSheet
          onCancel={() => setIsFormOpen(false)}
          onSuccess={(dailyGoal) => {
            setIsFormOpen(false);
            onChange([...(value || []), dailyGoal]);
          }}
        />
      )}
    </div>
  );
}
