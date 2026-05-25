import { useState } from 'react';
import { LuPlus, LuTrash } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  useCreateSessionType,
  useDeleteSessionType,
  useMyAvailability,
} from './hooks/useOneOnOneCall';

export function SessionTypeEditor() {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.sessionType);
  const query = useMyAvailability();
  const create = useCreateSessionType();
  const remove = useDeleteSessionType();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isFree, setIsFree] = useState(true);
  const [priceCents, setPriceCents] = useState(0);
  const [bufferMinutes, setBufferMinutes] = useState(0);
  const [minNoticeHours, setMinNoticeHours] = useState(12);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDurationMinutes(30);
    setIsFree(true);
    setPriceCents(0);
    setBufferMinutes(0);
    setMinNoticeHours(12);
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    await create.mutateAsync({
      title: title.trim(),
      description: description.trim() || null,
      durationMinutes,
      isFree,
      priceCents: isFree ? null : priceCents,
      bufferMinutes,
      minNoticeHours,
    });
    resetForm();
  };

  const sessionTypes = query.data?.sessionTypes ?? [];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold">{t.title}</h2>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <Button
            variant={showForm ? 'ghost' : 'default'}
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            <LuPlus className="mr-1 size-4" /> {t.add}
          </Button>
        </header>

        {showForm ? (
          <div className="space-y-3 rounded-xl border p-4">
            <div className="space-y-2">
              <Label>{t.fields.title}</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.fields.description}</Label>
              <Textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>{t.fields.durationMinutes}</Label>
                <Input
                  type="number"
                  min={10}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.fields.bufferMinutes}</Label>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={bufferMinutes}
                  onChange={(e) => setBufferMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.fields.minNoticeHours}</Label>
                <Input
                  type="number"
                  min={0}
                  max={720}
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                />
              </div>
            </div>
            <Label className="flex items-center gap-2">
              <Switch checked={isFree} onCheckedChange={setIsFree} />
              {t.fields.isFree}
            </Label>
            {!isFree ? (
              <>
                <div className="space-y-2">
                  <Label>{t.fields.priceCents}</Label>
                  <Input
                    type="number"
                    min={50}
                    max={1_000_000}
                    value={priceCents}
                    onChange={(e) => setPriceCents(Number(e.target.value))}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  {t.paidDisabledHint}
                </p>
              </>
            ) : null}
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || create.isPending}
              >
                {t.save}
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : sessionTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.empty}</p>
        ) : (
          <ul className="space-y-2">
            {sessionTypes.map((st) => (
              <li
                key={st.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"
              >
                <div>
                  <div className="font-semibold">{st.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {st.durationMinutes} min ·{' '}
                    {st.isFree
                      ? 'Free'
                      : `${(st.priceCents ?? 0) / 100} ${st.currency}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t.disable}
                  onClick={() => remove.mutate(st.id)}
                >
                  <LuTrash className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
