import { LuCrown } from 'react-icons/lu';
import { cn } from '@/shared/lib/utils';

export function BrandMark({
  label,
  className,
  iconClassName,
  showLabel = true,
}: {
  label: string;
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
}) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <div
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--nexexam-gradient-primary)] text-white shadow-[0_12px_30px_rgb(91_92_246/0.28)]',
          iconClassName,
        )}
      >
        <LuCrown className="size-5" />
      </div>
      {showLabel ? (
        <span className="text-nexexam-ink truncate text-xl font-extrabold tracking-normal dark:text-white">
          {label}
        </span>
      ) : null}
    </div>
  );
}
