import { useEffect, useState } from 'react';
import { LuPlus, LuTrash } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  useMyAvailability,
  usePutAvailability,
  type AvailabilityWindow,
} from './hooks/useOneOnOneCall';

function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function minutesToHHMM(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function hhmmToMinutes(value: string): number {
  const [h, m] = value.split(':').map((part) => Number(part));
  return (h || 0) * 60 + (m || 0);
}

export function InstructorAvailabilityEditor() {
  const t = useAuthStore((s) => s.dictionary.oneOnOneCall.availability);
  const query = useMyAvailability();
  const put = usePutAvailability();

  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);

  // Seed local state from server once data arrives. After that the editor
  // owns the buffer — every save round-trips it.
  useEffect(() => {
    if (query.data) {
      setWindows(
        query.data.windows.map((w) => ({
          dayOfWeek: w.dayOfWeek,
          startMinute: w.startMinute,
          endMinute: w.endMinute,
          timezone: w.timezone,
          isActive: w.isActive,
        })),
      );
    }
  }, [query.data]);

  const update = (index: number, patch: Partial<AvailabilityWindow>) => {
    setWindows((prev) =>
      prev.map((w, i) => (i === index ? { ...w, ...patch } : w)),
    );
  };
  const remove = (index: number) => {
    setWindows((prev) => prev.filter((_, i) => i !== index));
  };
  const add = () => {
    setWindows((prev) => [
      ...prev,
      {
        dayOfWeek: 1,
        startMinute: 9 * 60,
        endMinute: 10 * 60,
        timezone: browserTimezone(),
        isActive: true,
      },
    ]);
  };

  const handleSave = async () => {
    await put.mutateAsync(windows);
  };

  const days = [
    { value: 0, label: t.days.sunday },
    { value: 1, label: t.days.monday },
    { value: 2, label: t.days.tuesday },
    { value: 3, label: t.days.wednesday },
    { value: 4, label: t.days.thursday },
    { value: 5, label: t.days.friday },
    { value: 6, label: t.days.saturday },
  ];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold">{t.title}</h2>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <Button onClick={handleSave} disabled={put.isPending}>
            {put.isPending ? <Spinner className="size-4" /> : t.save}
          </Button>
        </header>

        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : windows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.empty}</p>
        ) : (
          <ul className="space-y-3">
            {windows.map((w, index) => (
              <li
                key={index}
                className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_auto] items-end gap-3"
              >
                <div className="space-y-1">
                  <Label className="text-xs">{t.dayOfWeek}</Label>
                  <Select
                    value={String(w.dayOfWeek)}
                    onValueChange={(value) =>
                      update(index, { dayOfWeek: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((d) => (
                        <SelectItem key={d.value} value={String(d.value)}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t.startTime}</Label>
                  <Input
                    type="time"
                    value={minutesToHHMM(w.startMinute)}
                    onChange={(event) =>
                      update(index, {
                        startMinute: hhmmToMinutes(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t.endTime}</Label>
                  <Input
                    type="time"
                    value={minutesToHHMM(w.endMinute)}
                    onChange={(event) =>
                      update(index, {
                        endMinute: hhmmToMinutes(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t.timezoneLabel}</Label>
                  <Input
                    value={w.timezone}
                    onChange={(event) =>
                      update(index, { timezone: event.target.value })
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t.removeWindow}
                  onClick={() => remove(index)}
                >
                  <LuTrash className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Button variant="outline" size="sm" onClick={add}>
          <LuPlus className="mr-2 size-4" /> {t.addWindow}
        </Button>
      </CardContent>
    </Card>
  );
}
