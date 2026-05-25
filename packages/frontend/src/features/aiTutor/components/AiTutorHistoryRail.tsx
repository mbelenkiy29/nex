import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LuEllipsis, LuMessageSquarePlus, LuSearch } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/shared/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  useAiTutorConversationListQuery,
} from '@/features/aiTutor/hooks/useAiTutorConversationList';
import { useAiTutorCreateConversation } from '@/features/aiTutor/hooks/useAiTutorCreateConversation';
import { useAiTutorArchiveConversation } from '@/features/aiTutor/hooks/useAiTutorArchiveConversation';
import { useAiTutorRenameConversation } from '@/features/aiTutor/hooks/useAiTutorRenameConversation';
import type { AiTutorConversationSummary } from '@/features/aiTutor/aiTutorTypes';

interface AiTutorHistoryRailProps {
  activeConversationId: string | null;
}

interface Bucket {
  key: 'today' | 'yesterday' | 'previousWeek' | 'older';
  label: string;
  rows: AiTutorConversationSummary[];
}

function groupByRecency(
  rows: AiTutorConversationSummary[],
  labels: { today: string; yesterday: string; previousWeek: string; older: string },
): Bucket[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart.getTime() - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = todayStart.getTime() - 7 * 24 * 60 * 60 * 1000;

  const today: AiTutorConversationSummary[] = [];
  const yesterday: AiTutorConversationSummary[] = [];
  const previousWeek: AiTutorConversationSummary[] = [];
  const older: AiTutorConversationSummary[] = [];

  for (const row of rows) {
    const t = new Date(row.updatedAt).getTime();
    if (t >= todayStart.getTime()) today.push(row);
    else if (t >= yesterdayStart) yesterday.push(row);
    else if (t >= sevenDaysAgo) previousWeek.push(row);
    else older.push(row);
  }

  const all: Bucket[] = [
    { key: 'today', label: labels.today, rows: today },
    { key: 'yesterday', label: labels.yesterday, rows: yesterday },
    { key: 'previousWeek', label: labels.previousWeek, rows: previousWeek },
    { key: 'older', label: labels.older, rows: older },
  ];
  return all.filter((b) => b.rows.length > 0);
}

export function AiTutorHistoryRail({
  activeConversationId,
}: AiTutorHistoryRailProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );
  const navigate = useNavigate();
  const query = useAiTutorConversationListQuery();
  const createMutation = useAiTutorCreateConversation();
  const archiveMutation = useAiTutorArchiveConversation();
  const renameMutation = useAiTutorRenameConversation();
  const [search, setSearch] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const filtered = useMemo(() => {
    const rows = query.data?.conversations ?? [];
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => r.title.toLowerCase().includes(q));
  }, [query.data, search]);

  const groups = useMemo(
    () =>
      groupByRecency(filtered, {
        today: dictionary.aiTutor.history.todayGroup,
        yesterday: dictionary.aiTutor.history.yesterdayGroup,
        previousWeek: dictionary.aiTutor.history.previousWeekGroup,
        older: dictionary.aiTutor.history.olderGroup,
      }),
    [filtered, dictionary],
  );

  const handleNewChat = async () => {
    const result = await createMutation.mutateAsync({});
    navigate({
      to: '/student/ai-tutor/$conversationId',
      params: { conversationId: result.conversation.id },
    });
  };

  const commitRename = async () => {
    if (!renamingId) return;
    const title = renameDraft.trim();
    if (!title) {
      setRenamingId(null);
      return;
    }
    await renameMutation.mutateAsync({ id: renamingId, title });
    setRenamingId(null);
  };

  return (
    <div className="flex h-full flex-col gap-3 border-r border-border/80 bg-white/64 p-3 backdrop-blur-xl dark:bg-white/5">
      <button
        type="button"
        onClick={handleNewChat}
        disabled={createMutation.isPending}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_34px_rgb(91_92_246/0.22)] transition-opacity disabled:opacity-60"
      >
        <LuMessageSquarePlus className="size-4" />
        {dictionary.aiTutor.newChat}
      </button>
      <div className="relative">
        <LuSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dictionary.aiTutor.search}
          className="w-full rounded-xl border border-border/80 bg-white/80 py-2 pr-3 pl-9 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-white/8"
        />
      </div>
      <div className="-mr-2 flex-1 overflow-y-auto pr-1">
        {query.isLoading ? (
          <div className="px-2 py-6 text-center text-xs text-muted-foreground">
            …
          </div>
        ) : groups.length === 0 ? (
          <div className="px-2 py-6 text-center text-xs text-muted-foreground">
            {dictionary.aiTutor.history.empty}
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.key} className="space-y-1">
                <div className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </div>
                {group.rows.map((row) => {
                  const active = row.id === activeConversationId;
                  return (
                    <div
                      key={row.id}
                      className={cn(
                        'group flex items-center gap-1 rounded-xl px-2 py-1.5 text-sm transition-colors',
                        active
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                    >
                      {renamingId === row.id ? (
                        <input
                          autoFocus
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitRename();
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          className="min-w-0 flex-1 truncate bg-transparent outline-none"
                        />
                      ) : (
                        <Link
                          to="/student/ai-tutor/$conversationId"
                          params={{ conversationId: row.id }}
                          className="min-w-0 flex-1 truncate"
                          title={row.title}
                        >
                          {row.title}
                        </Link>
                      )}
                      <Popover>
                        <PopoverTrigger
                          aria-label={dictionary.aiTutor.history.actions}
                          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                        >
                          <LuEllipsis className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="w-44 p-1 text-sm"
                        >
                          <button
                            type="button"
                            className="w-full rounded px-2 py-1.5 text-left hover:bg-muted"
                            onClick={() => {
                              setRenameDraft(row.title);
                              setRenamingId(row.id);
                            }}
                          >
                            {dictionary.aiTutor.history.rename}
                          </button>
                          <button
                            type="button"
                            className="w-full rounded px-2 py-1.5 text-left text-destructive hover:bg-muted"
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  dictionary.aiTutor.history.confirmArchive,
                                )
                              )
                                return;
                              await archiveMutation.mutateAsync(row.id);
                              if (active) {
                                navigate({ to: '/student/ai-tutor' });
                              }
                            }}
                          >
                            {dictionary.aiTutor.history.archive}
                          </button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
