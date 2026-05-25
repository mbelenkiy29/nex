import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAuthStore } from '@/features/auth/authStore';
import { cn } from '@/shared/lib/utils';

const sidebarItems = Array.from({ length: 7 }, (_, index) => index);
const metricCards = Array.from({ length: 4 }, (_, index) => index);
const tableRows = Array.from({ length: 6 }, (_, index) => index);
const tableColumns = Array.from({ length: 4 }, (_, index) => index);

export function AppSkeletonLoader({ className }: { className?: string }) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        'bg-background min-h-screen w-full overflow-hidden font-sans antialiased',
        className,
      )}
    >
      <span className="sr-only">{dictionary.shared.loading}</span>

      <div className="grid min-h-screen lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="dark:bg-nexexam-surface hidden border-r border-white/70 bg-white/72 backdrop-blur-xl lg:flex lg:flex-col dark:border-white/10">
          <div className="space-y-7 px-5 py-6">
            <div className="flex items-center gap-3">
              <Skeleton className="bg-primary/20 size-10 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            <div className="space-y-3">
              {sidebarItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3 px-5 py-6">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="dark:bg-nexexam-surface border-b border-white/60 bg-white/76 px-4 py-3 shadow-[0_10px_30px_rgb(15_23_42/0.04)] backdrop-blur-xl lg:px-7 dark:border-white/10">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg md:hidden" />
              <Skeleton className="h-12 min-w-0 flex-1 rounded-lg md:max-w-xl" />
              <Skeleton className="size-11 rounded-lg" />
              <Skeleton className="hidden h-11 w-36 rounded-lg sm:block" />
            </div>
          </header>

          <main className="min-h-[calc(100svh-73px)] flex-1 px-4 py-6 lg:px-7">
            <div className="mx-auto w-full max-w-7xl space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="w-full max-w-xl space-y-3">
                  <Skeleton className="h-8 w-3/5 max-w-sm" />
                  <Skeleton className="h-4 w-full max-w-lg" />
                  <Skeleton className="h-4 w-4/5 max-w-md" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((card) => (
                  <div
                    key={card}
                    className="border-border/70 bg-card/80 space-y-4 rounded-lg border p-5 shadow-[0_4px_12px_rgb(15_23_42/0.06)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="bg-primary/15 size-9 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                ))}
              </div>

              <div className="border-border/70 bg-card/80 rounded-lg border shadow-[0_4px_12px_rgb(15_23_42/0.06)]">
                <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg sm:w-64" />
                </div>

                <div className="overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 border-b px-4 py-3">
                    {tableColumns.map((column) => (
                      <Skeleton key={column} className="h-3 w-2/3" />
                    ))}
                  </div>
                  {tableRows.map((row) => (
                    <div
                      key={row}
                      className="grid grid-cols-4 gap-4 border-b px-4 py-4 last:border-b-0"
                    >
                      {tableColumns.map((column) => (
                        <Skeleton
                          key={column}
                          className={cn(
                            'h-4',
                            column === 0
                              ? 'w-4/5'
                              : column === 3
                                ? 'w-1/2'
                                : 'w-2/3',
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
