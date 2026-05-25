import { useState } from 'react';
import { LuVideo, LuCalendar } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  useMySessions,
  type OneOnOneSessionRow,
  type OneOnOneSessionStatus,
} from './hooks/useOneOnOneCall';
import { SessionDetailSheet } from './SessionDetailSheet';

type Role = 'student' | 'instructor';
type Scope = 'upcoming' | 'past';

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface SessionRowProps {
  session: OneOnOneSessionRow;
  role: Role;
  onOpen: (id: string) => void;
  statuses: Record<OneOnOneSessionStatus, string>;
}

function SessionRow({ session, role, onOpen, statuses }: SessionRowProps) {
  const counterpart =
    role === 'student' ? session.instructorUser : session.studentUser;
  const counterpartName = counterpart.name || counterpart.email;
  return (
    <button
      type="button"
      onClick={() => onOpen(session.id)}
      className="hover:bg-muted/50 flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <LuCalendar className="text-primary size-4" />
          {formatWhen(session.scheduledStartAt)}
        </div>
        <div className="text-muted-foreground mt-1 truncate text-xs">
          {session.sessionType.title} · {session.course.title} · {counterpartName}
        </div>
      </div>
      <Badge variant="secondary">{statuses[session.status]}</Badge>
    </button>
  );
}

interface Props {
  defaultRole?: Role;
}

export function MySessionsList({ defaultRole = 'student' }: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.session);
  const [role, setRole] = useState<Role>(defaultRole);
  const [scope, setScope] = useState<Scope>('upcoming');
  const [openId, setOpenId] = useState<string | null>(null);
  const sessions = useMySessions(role, scope);

  const isEmpty = !sessions.isLoading && (sessions.data?.sessions.length ?? 0) === 0;

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <h1 className="flex items-center gap-2 text-xl font-extrabold">
          <LuVideo className="text-primary size-5" />
          {t.title}
        </h1>

        <div className="flex items-center justify-between gap-3">
          <Tabs
            value={scope}
            onValueChange={(value) => setScope(value as Scope)}
          >
            <TabsList>
              <TabsTrigger value="upcoming">{t.tabs.upcoming}</TabsTrigger>
              <TabsTrigger value="past">{t.tabs.past}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={role} onValueChange={(value) => setRole(value as Role)}>
            <TabsList>
              <TabsTrigger value="student">{t.role.student}</TabsTrigger>
              <TabsTrigger value="instructor">{t.role.instructor}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={scope}>
          <TabsContent value="upcoming">
            <SessionsBody
              loading={sessions.isLoading}
              empty={isEmpty}
              emptyMessage={t.emptyUpcoming}
              sessions={sessions.data?.sessions ?? []}
              role={role}
              statuses={t.statuses}
              onOpen={setOpenId}
            />
          </TabsContent>
          <TabsContent value="past">
            <SessionsBody
              loading={sessions.isLoading}
              empty={isEmpty}
              emptyMessage={t.emptyPast}
              sessions={sessions.data?.sessions ?? []}
              role={role}
              statuses={t.statuses}
              onOpen={setOpenId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <SessionDetailSheet
        sessionId={openId}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
      />
    </Card>
  );
}

interface SessionsBodyProps {
  loading: boolean;
  empty: boolean;
  emptyMessage: string;
  sessions: OneOnOneSessionRow[];
  role: Role;
  statuses: Record<OneOnOneSessionStatus, string>;
  onOpen: (id: string) => void;
}

function SessionsBody({
  loading,
  empty,
  emptyMessage,
  sessions,
  role,
  statuses,
  onOpen,
}: SessionsBodyProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
      </div>
    );
  }
  if (empty) {
    return <p className="text-muted-foreground text-sm">{emptyMessage}</p>;
  }
  return (
    <div className="space-y-2">
      {sessions.map((s) => (
        <SessionRow
          key={s.id}
          session={s}
          role={role}
          onOpen={onOpen}
          statuses={statuses}
        />
      ))}
    </div>
  );
}
