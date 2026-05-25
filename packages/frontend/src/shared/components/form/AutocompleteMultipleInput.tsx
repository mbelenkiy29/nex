import { LuX } from 'react-icons/lu';
import { AutocompleteAsyncInput } from '@/shared/components/form/AutocompleteAsyncInput';
import { AutocompleteMemoryInput } from '@/shared/components/form/AutocompleteMemoryInput';
import { Badge } from '@/shared/components/ui/badge';
import { Dictionary, Locale } from '@project/backend/translation/locales';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';

export function AutocompleteMultipleInput<T extends { id: string }>({
  queryId,
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  queryFn,
  labelFn,
  mode,
  disabled,
}: {
  queryId: string[];
  onChange: (value: Array<Partial<T>> | undefined | null | []) => void;
  value?: Array<Partial<T>> | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  queryFn: (
    query?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => Promise<any>;
  labelFn: (
    value: Partial<T> | null | undefined,
    dictionary: Dictionary,
    locale: Locale,
  ) => string;
  mode: 'async' | 'memory';
  disabled?: boolean;
}) {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  function onSelectChange(itemToAdd: Partial<T> | undefined | null) {
    if (itemToAdd) {
      onChange([...(value || []), itemToAdd]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {mode === 'memory' ? (
        <AutocompleteMemoryInput
          queryId={queryId}
          onChange={onSelectChange}
          value={null}
          selectPlaceholder={selectPlaceholder}
          searchPlaceholder={searchPlaceholder}
          notFoundPlaceholder={notFoundPlaceholder}
          queryFn={queryFn}
          labelFn={labelFn}
          exclude={value}
          disabled={disabled}
        />
      ) : (
        <AutocompleteAsyncInput
          queryId={queryId}
          onChange={onSelectChange}
          value={null}
          selectPlaceholder={selectPlaceholder}
          searchPlaceholder={searchPlaceholder}
          notFoundPlaceholder={notFoundPlaceholder}
          queryFn={queryFn}
          labelFn={labelFn}
          exclude={value}
          disabled={disabled}
        />
      )}

      {Boolean(value?.length) && (
        <div className="flex flex-wrap gap-1">
          {value?.map((item) => {
            return (
              <Badge
                variant={'outline'}
                key={item?.id}
                className="px-3 py-1 text-sm"
              >
                {labelFn(item, dictionary, locale)}
                <button
                  type="button"
                  onClick={() =>
                    onChange(value.filter((v) => v?.id !== item?.id))
                  }
                  className="ml-2"
                  title={dictionary.shared.remove}
                >
                  <LuX className="text-muted-foreground text-xs" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
