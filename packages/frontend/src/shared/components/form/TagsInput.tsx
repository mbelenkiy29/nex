import { trim } from 'lodash-es';
import { useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { useAuthStore } from '@/features/auth/authStore';

export function TagsInput({
  onChange,
  value,
  placeholder,
  separator,
  disabled,
}: {
  onChange: (value: Array<string>) => void;
  value?: Array<string>;
  placeholder?: string;
  separator?: string;
  disabled?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={placeholder || dictionary.shared.tagsPlaceholder}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onBlur={(event) => {
          if (event.target.value) {
            onChange([
              ...(value || []),
              ...(separator
                ? event.target.value.split(separator).map(trim)
                : [event.target.value]),
            ]);
            setInputValue('');
          }
        }}
        onKeyDown={(event: any) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (event.target.value) {
              onChange([
                ...(value || []),
                ...(separator
                  ? event.target.value.split(separator).map(trim)
                  : [event.target.value]),
              ]);
              setInputValue('');
            }
          }
        }}
        disabled={disabled}
      />

      {Boolean(value?.length) && (
        <div className="flex flex-wrap gap-1">
          {value?.map((item) => {
            return (
              <Badge
                variant={'outline'}
                key={item}
                className="px-3 py-1 text-sm"
              >
                {item}
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
