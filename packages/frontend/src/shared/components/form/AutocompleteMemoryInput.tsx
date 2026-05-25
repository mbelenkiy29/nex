import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { Dictionary, Locale } from '@project/backend/translation/locales';
import { useQuery } from '@tanstack/react-query';
import { toLower } from 'lodash-es';
import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { LuChevronsUpDown, LuLoader, LuX } from 'react-icons/lu';

export function AutocompleteMemoryInput<T extends { id: string }>({
  queryId,
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  isClearable,
  queryFn,
  labelFn,
  exclude,
  disabled,
}: {
  queryId: string[];
  onChange: (value: Partial<T> | undefined | null) => void;
  value?: Partial<T> | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  isClearable?: boolean;
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
  exclude?: Array<Partial<T>> | null;
  disabled?: boolean;
}) {
  const { dictionary, locale } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      locale: state.locale,
    })),
  );
  const [open, setOpen] = useState(false);
  const query = useQuery({
    queryKey: queryId,
    queryFn: ({ signal }) => queryFn(undefined, undefined, signal),
    enabled: open,
  });

  function onSelect(id?: string | null) {
    setOpen(false);

    if (!id) {
      onChange(null);
    }

    const option = query.data?.find((option: T) => option.id === id);
    onChange(option);
  }

  const filteredOptions = query.data
    ?.filter((option: T) => !value || option.id !== value?.id)
    .filter(
      (option: T) => !exclude || !exclude.find((e) => e.id === option.id),
    );

  const commandFilter = (value: string, search: string) => {
    if (
      toLower(
        labelFn(
          filteredOptions?.find((item: T) => item?.id === value),
          dictionary,
          locale,
        ),
      ).includes(toLower(search))
    ) {
      return 1;
    }
    return 0;
  };

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-full min-w-0 shrink justify-between',
                !value && 'text-muted-foreground',
              )}
              disabled={disabled}
            />
          }
        >
          <span className="flex-1 truncate text-left">
            {labelFn(value, dictionary, locale) ||
              selectPlaceholder ||
              dictionary.shared.selectPlaceholder}
          </span>
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0" align="start">
          <Command filter={commandFilter}>
            <CommandInput
              placeholder={
                searchPlaceholder || dictionary.shared.searchPlaceholder
              }
              disabled={disabled}
            />

            {query.isLoading && (
              <div className="flex items-center justify-center py-6 text-sm">
                <LuLoader className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            )}

            {query.isSuccess ? (
              <>
                {filteredOptions?.length ? (
                  <CommandEmpty>
                    {notFoundPlaceholder || dictionary.shared.searchNotFound}
                  </CommandEmpty>
                ) : (
                  <div className="py-6 text-center text-sm">
                    {notFoundPlaceholder || dictionary.shared.searchNotFound}
                  </div>
                )}
              </>
            ) : null}

            {query.isSuccess ? (
              <CommandGroup className="max-h-[340px] overflow-y-auto">
                {filteredOptions?.map((option: T) => (
                  <CommandItem
                    value={option.id}
                    key={option.id}
                    onSelect={onSelect}
                    aria-label={labelFn(option, dictionary, locale)}
                  >
                    <LuCheck
                      className={cn(
                        'mr-2 h-4 w-4',
                        option.id === value?.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {labelFn(option, dictionary, locale)}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      {isClearable && value && (
        <Button
          type="button"
          variant="secondary"
          size={'icon'}
          onClick={() => onChange(null)}
          title={dictionary.shared.clear}
          disabled={disabled}
        >
          <LuX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
