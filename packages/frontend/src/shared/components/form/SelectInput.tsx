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
import { toLower } from 'lodash-es';
import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { LuChevronsUpDown, LuX } from 'react-icons/lu';

export function SelectInput({
  onChange,
  value,
  selectPlaceholder,
  searchPlaceholder,
  notFoundPlaceholder,
  options,
  isClearable,
  disabled,
}: {
  onChange: (value: string | undefined | null) => void;
  value?: string | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  options: Array<{ value: string; label: string }>;
  isClearable?: boolean;
  disabled?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [open, setOpen] = useState(false);

  function onChangeInternal(value: string | undefined | null) {
    const correctValue =
      options.find((option) => option.value === value || '')?.value ||
      options.find((option) => toLower(option.value) === toLower(value || ''))
        ?.value ||
      value;
    setOpen(false);
    onChange(correctValue);
  }

  const commandFilter = (value: string, search: string) => {
    let option = options.find((option) => option.value === value);

    if (!option) {
      option = options.find(
        (option) => toLower(option.value) === toLower(value),
      );
    }

    if (toLower(option?.label).includes(toLower(search))) {
      return 1;
    }
    return 0;
  };

  return (
    <div className="relative flex min-w-0 items-center gap-1">
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
            {value
              ? options.find((option) => option.value === value)?.label
              : selectPlaceholder || dictionary.shared.selectPlaceholder}
          </span>
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[340px] p-0">
          <Command filter={commandFilter}>
            <CommandInput
              placeholder={
                searchPlaceholder || dictionary.shared.searchPlaceholder
              }
            />
            <CommandEmpty>
              {notFoundPlaceholder || dictionary.shared.searchNotFound}
            </CommandEmpty>
            <CommandGroup className="max-h-[340px] overflow-y-auto">
              {options.map((option) => {
                return (
                  <CommandItem
                    value={option.value}
                    key={option.value}
                    onSelect={onChangeInternal}
                  >
                    <LuCheck
                      className={cn(
                        'mr-2 h-4 w-4',
                        option.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
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
