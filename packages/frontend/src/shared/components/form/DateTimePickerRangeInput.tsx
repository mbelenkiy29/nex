import dayjs from 'dayjs';
import { LuX } from 'react-icons/lu';
import { DateTimePickerInput } from '@/shared/components/form/DateTimePickerInput';
import { Button } from '@/shared/components/ui/button';
import { Locale } from '@project/backend/translation/locales';
import { useAuthStore } from '@/features/auth/authStore';

export function DateTimePickerRangeInput({
  disabled,
  value,
  onChange,
  isClearable,
}: {
  value?: dayjs.ConfigType[];
  onChange: (range: dayjs.ConfigType[]) => void;
  isClearable?: boolean;
  disabled?: boolean;
  locale: Locale;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const handleStartChanged = (value?: dayjs.ConfigType) => {
    onChange([value, endValue()]);
  };

  const handleEndChanged = (value?: dayjs.ConfigType) => {
    onChange([startValue(), value]);
  };

  const startValue = () => {
    if (!value) {
      return null;
    }

    if (Array.isArray(!value)) {
      return null;
    }

    if (!value.length) {
      return null;
    }

    return value[0];
  };

  const endValue = () => {
    if (!value) {
      return null;
    }

    if (Array.isArray(!value)) {
      return null;
    }

    if (value.length < 2) {
      return null;
    }

    return value[1];
  };

  return (
    <div className="flex flex-nowrap items-center gap-1">
      <div className="w-full">
        <DateTimePickerInput
          value={startValue()}
          onChange={(value) => handleStartChanged(value)}
          disabled={disabled}
          placeholder={dictionary.shared.startDate}
        />
      </div>

      <div className="text-muted-foreground shrink-0">~</div>

      <div className="w-full">
        <DateTimePickerInput
          value={endValue()}
          onChange={(value) => handleEndChanged(value)}
          disabled={disabled}
          placeholder={dictionary.shared.endDate}
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
