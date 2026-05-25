import { LuX } from 'react-icons/lu';
import { SelectInput } from '@/shared/components/form/SelectInput';
import { Badge } from '@/shared/components/ui/badge';
import { useAuthStore } from '@/features/auth/authStore';

export function SelectMultipleInput({
  onChange,
  value,
  placeholder,
  options,
  disabled,
}: {
  onChange: (value: Array<string>) => void;
  value?: Array<string>;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  function onSelectChange(itemToAdd: string | undefined | null) {
    if (itemToAdd) {
      onChange([...(value || []), itemToAdd]);
    }
  }

  const availableOptions = options.filter(
    (option) => !value?.includes(option.value),
  );

  return (
    <div className="flex flex-col gap-2">
      {Boolean(availableOptions.length) && (
        <SelectInput
          onChange={onSelectChange}
          value={''}
          selectPlaceholder={placeholder}
          options={availableOptions}
          disabled={disabled}
        />
      )}

      {Boolean(value?.length) && (
        <div className="flex flex-wrap gap-1">
          {value?.map((item) => {
            return (
              <Badge
                variant={'outline'}
                key={item}
                className="px-3 py-1 text-sm"
              >
                {options.find((option) => option.value === item)?.label}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((v) => v !== item))}
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
