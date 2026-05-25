import { LuX } from 'react-icons/lu';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useAuthStore } from '@/features/auth/authStore';

export function RangeInput({
  type,
  disabled,
  value,
  onChange,
  isClearable,
}: {
  type: 'text' | 'number';
  value?: (number | string | undefined)[];
  onChange: (range: (number | string | undefined)[]) => void;
  isClearable?: boolean;
  disabled?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const handleStartChanged = (value?: string) => {
    onChange([value || '', endValue()]);
  };

  const handleEndChanged = (value?: string) => {
    onChange([startValue(), value || '']);
  };

  const startValue = () => {
    if (!value) {
      return '';
    }

    if (Array.isArray(!value)) {
      return '';
    }

    if (!value.length) {
      return '';
    }

    return value[0] || '';
  };

  const endValue = () => {
    if (!value) {
      return '';
    }

    if (Array.isArray(!value)) {
      return '';
    }

    if (value.length < 2) {
      return '';
    }

    return value[1] || '';
  };

  return (
    <div className="flex flex-nowrap items-center gap-1">
      <div className="w-full">
        <Input
          type={type}
          value={startValue()}
          onChange={(event) => handleStartChanged(event.target.value)}
          disabled={disabled}
          placeholder={dictionary.shared.min}
        />
      </div>

      <div className="text-muted-foreground shrink-0">~</div>

      <div className="w-full">
        <Input
          type={type}
          value={endValue()}
          onChange={(event) => handleEndChanged(event.target.value)}
          disabled={disabled}
          placeholder={dictionary.shared.max}
        />
      </div>

      {isClearable && Boolean(value?.length) && (
        <div className="flex shrink-0 items-center justify-center">
          <Button
            type="button"
            variant="secondary"
            size={'icon'}
            onClick={() => onChange([])}
            title={dictionary.shared.clear}
          >
            <LuX className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
