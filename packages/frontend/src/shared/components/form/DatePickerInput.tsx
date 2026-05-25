import { useEffect, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useAuthStore } from '@/features/auth/authStore';

export function DatePickerInput({
  value,
  onChange,
  isClearable,
  placeholder,
  disabled,
  min,
  max,
}: {
  placeholder?: string;
  value?: string | null | undefined;
  onChange: (date: string | null | undefined) => void;
  isClearable?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const [type, setType] = useState<'date' | 'text'>(value ? 'date' : 'text');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value || '';
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
        defaultValue={value || ''}
        onFocus={() => setType('date')}
        onBlur={(e) => {
          onChange(e.target.value);
          if (!e.target.value) {
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
