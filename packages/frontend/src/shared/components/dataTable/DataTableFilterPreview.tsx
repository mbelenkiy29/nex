import { LuChevronDown, LuChevronRight, LuX } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';

export function FilterPreview({
  values,
  renders,
  onClick,
  onRemove,
  expanded,
}: {
  values: { [key: string]: any };
  renders: {
    [key: string]: {
      label: string;
      render?: (val: any) => string | number | boolean | undefined | null;
    };
  };
  onClick: any;
  onRemove: (key: string) => any;
  expanded: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const itemsNotEmpty = Object.keys(values || {})
    .map((key) => {
      if (!renders[key]) {
        return {
          value: null,
        };
      }

      return {
        key: key,
        label: renders[key].label,
        value: renders[key]?.render
          ? renders[key].render!(values[key])
          : values[key],
      };
    })
    .filter((item) => item.value || item.value === 0 || item.value === false);

  return (
    <div
      onClick={onClick}
      className={`${
        expanded ? 'rounded-t-md border-b' : 'rounded-md'
      } bg-sidebar flex cursor-pointer items-center justify-between p-2 px-4`}
    >
      {!itemsNotEmpty.length || expanded ? (
        <div className="flex items-center text-sm font-medium">
          {dictionary.shared.dataTable.filters}
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {dictionary.shared.dataTable.filters}
          </span>
          :
          <span className="ml-2 flex flex-wrap justify-start gap-1">
            {itemsNotEmpty.map((item) => (
              <span
                key={item.label}
                className="bg-background ring-foreground/20 text-foreground inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                style={{ cursor: 'default' }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                {`${item.label}: ${item.value}`}{' '}
                {onRemove && (
                  <button onClick={() => onRemove(item.key!)} className="ml-1">
                    <LuX className="h-4 w-4" style={{ padding: 2 }} />
                  </button>
                )}
              </span>
            ))}
          </span>
        </div>
      )}

      <div className="text-muted-foreground text-sm">
        {expanded ? <LuChevronRight /> : <LuChevronDown />}
      </div>
    </div>
  );
}
