import { useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useCreateNote,
  useDeleteNote,
  type SessionNote,
} from './hooks/useOneOnOneCall';

interface Props {
  sessionId: string;
  notes: SessionNote[];
}

export function SessionNotesPanel({ sessionId, notes }: Props) {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.notes);
  const me = useAuthStore((s) => s.currentUser?.id);
  const [body, setBody] = useState('');
  const [isShared, setIsShared] = useState(false);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const handleAdd = async () => {
    if (!body.trim()) return;
    await createNote.mutateAsync({ sessionId, body: body.trim(), isShared });
    setBody('');
    setIsShared(false);
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">{t.title}</h3>
      <div className="space-y-2">
        <Textarea
          value={body}
          placeholder={t.placeholder}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
        />
        <div className="flex items-center justify-between gap-3">
          <Label className="flex items-center gap-2 text-xs">
            <Switch checked={isShared} onCheckedChange={setIsShared} />
            {t.shared}
          </Label>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!body.trim() || createNote.isPending}
          >
            {t.add}
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-muted-foreground text-xs">{t.empty}</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border p-3 text-sm">
              <p className="whitespace-pre-wrap">{n.body}</p>
              <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                <span>
                  {n.authorUser.name || n.authorUser.email} ·{' '}
                  {n.isShared ? t.shared : 'Private'}
                </span>
                {me === n.authorUserId ? (
                  <button
                    type="button"
                    className="text-destructive"
                    onClick={() => deleteNote.mutate({ sessionId, noteId: n.id })}
                  >
                    {t.delete}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
