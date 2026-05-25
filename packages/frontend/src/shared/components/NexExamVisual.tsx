import { cn } from '@/shared/lib/utils';
import { LuSparkles } from 'react-icons/lu';

export function NexExamVisual({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'nex-gradient-hero relative isolate min-h-64 overflow-hidden rounded-xl',
        compact && 'min-h-52',
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          'nex-auth-orb top-[18%] right-[14%] size-8',
          compact && 'size-5',
        )}
      />
      <span
        className={cn(
          'nex-auth-orb bottom-[32%] left-[14%] size-6',
          compact && 'size-4',
        )}
      />
      <span className="nex-auth-orb top-[46%] right-[7%] size-4" />
      <div
        className={cn(
          'nex-visual-pedestal bottom-[18%] h-28 w-[82%]',
          compact && 'bottom-[19%] h-20 w-[78%]',
        )}
      />
      <div
        className={cn(
          'nex-visual-pedestal bottom-[8%] h-24 w-[92%] opacity-90',
          compact && 'bottom-[9%] h-16 w-[88%]',
        )}
      />
      <div
        className={cn(
          'nex-visual-cube bottom-[43%] size-32 rounded-[2rem]',
          compact && 'bottom-[42%] size-24 rounded-[1.55rem]',
        )}
      >
        <LuSparkles
          className={cn(
            'size-12 drop-shadow-[0_0_18px_rgb(255_255_255/0.82)]',
            compact && 'size-8',
          )}
        />
      </div>
    </div>
  );
}
