import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useAuthStore } from '@/features/auth/authStore';

export function DateTimePickerInput({
  value,
  onChange,
  isClearable,
  placeholder,
  disabled,
  min,
  max,
}: {
  placeholder?: string;
  value?: dayjs.ConfigType;
  onChange: (date: Date | string) => void;
  isClearable?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [type, setType] = useState<'datetime-local' | 'text'>(
    value ? 'datetime-local' : 'text',
  );
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : '';
      if (!ref.current.value) {
        setType('text');
      }
    }
  }, [value]);

  return (
    <div className="flex w-full items-center gap-1">
      <Input
        ref={ref}
        type={type}
        placeholder={placeholder}
        defaultValue={value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : ''}
        onFocus={() => setType('datetime-local')}
        onBlur={(e) => {
          const value = e.target.value?.trim()
            ? dayjs(e.target.value?.trim())
            : null;

          if (value && value.isValid()) {
            onChange(value.toDate());
          } else {
            onChange('');
            setType('text');
          }
        }}
        disabled={disabled}
        min={min}
        max={max}
      />
      {isClearable && value && (
        <Button
          type="button"
          variant="secondary"
          size={'icon'}
          onClick={() => onChange('')}
          title={dictionary.shared.clear}
        >
          <LuX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
