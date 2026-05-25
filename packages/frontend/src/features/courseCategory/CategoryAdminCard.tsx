import { FormEvent, useEffect, useState } from 'react';
import { LuPencil, LuPlus, LuTag } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  CourseCategoryAdminRow,
  useAdminCourseCategoriesQuery,
  useCreateCourseCategory,
  useSetCourseCategoryActive,
  useUpdateCourseCategory,
} from './useCourseCategories';

type DraftState = {
  id: string | null;
  name: string;
  description: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
};

const emptyDraft: DraftState = {
  id: null,
  name: '',
  description: '',
  iconName: '',
  displayOrder: 1000,
  isActive: true,
};

/**
 * Admin-only card mounted in `PlatformAdminPage` for managing the curated
 * marketplace taxonomy. One job per card per DESIGN.md: list + create/edit
 * dialog + soft-delete toggle. The list itself stays as a simple table — the
 * row count is small (low double digits at most), no virtualization needed.
 */
export function CategoryAdminCard() {
  const t = useAuthStore((s) => s.dictionary.adminCourseCategories);
  const query = useAdminCourseCategoriesQuery();
  const createMutation = useCreateCourseCategory();
  const updateMutation = useUpdateCourseCategory();
  const setActiveMutation = useSetCourseCategoryActive();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftState>(emptyDraft);

  // Reset the draft each time the dialog opens for create. For edit, the
  // caller seeds the draft via `startEdit`.
  useEffect(() => {
    if (!open) {
      setDraft(emptyDraft);
    }
  }, [open]);

  function startCreate() {
    setDraft(emptyDraft);
    setOpen(true);
  }

  function startEdit(row: CourseCategoryAdminRow) {
    setDraft({
      id: row.id,
      name: row.name,
      description: row.description ?? '',
      iconName: row.iconName ?? '',
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setOpen(true);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    const trimmedName = draft.name.trim();
    if (!trimmedName) {
      return;
    }
    const payload = {
      name: trimmedName,
      description: draft.description.trim() || null,
      iconName: draft.iconName.trim() || null,
      displayOrder: draft.displayOrder,
      isActive: draft.isActive,
    };
    if (draft.id) {
      await updateMutation.mutateAsync({ id: draft.id, input: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpen(false);
  }

  async function toggleActive(row: CourseCategoryAdminRow) {
    await setActiveMutation.mutateAsync({
      id: row.id,
      isActive: !row.isActive,
    });
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isEditing = draft.id !== null;
  const rows = query.data?.categories ?? [];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 font-extrabold">
              <LuTag className="text-primary size-5" />
              {t.title}
            </h2>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <Button onClick={startCreate} aria-label={t.actions.create}>
            <LuPlus className="mr-1 size-4" />
            {t.actions.create}
          </Button>
        </div>

        {query.isLoading ? (
          <Spinner className="size-4" />
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.empty}</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/60 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">{t.columns.name}</th>
                  <th className="px-4 py-2 text-left">{t.columns.slug}</th>
                  <th className="px-4 py-2 text-right">
                    {t.columns.displayOrder}
                  </th>
                  <th className="px-4 py-2 text-center">
                    {t.columns.isActive}
                  </th>
                  <th className="px-4 py-2 text-right">{t.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-white/40 dark:border-white/10"
                  >
                    <td className="px-4 py-2 font-medium">{row.name}</td>
                    <td className="text-muted-foreground px-4 py-2">
                      <code className="text-xs">{row.slug}</code>
                    </td>
                    <td className="text-muted-foreground px-4 py-2 text-right">
                      {row.displayOrder}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {row.isActive ? (
                        <Badge variant="secondary">{t.actions.enable}</Badge>
                      ) : (
                        <Badge variant="outline">{t.actions.disable}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(row)}
                          aria-label={t.actions.edit}
                        >
                          <LuPencil className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(row)}
                          disabled={setActiveMutation.isPending}
                        >
                          {row.isActive ? t.actions.disable : t.actions.enable}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t.actions.edit : t.actions.create}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="courseCategoryName">{t.fields.name}</Label>
              <Input
                id="courseCategoryName"
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="courseCategoryDescription">
                {t.fields.description}
              </Label>
              <Textarea
                id="courseCategoryDescription"
                rows={2}
                maxLength={500}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="courseCategoryIcon">{t.fields.iconName}</Label>
                <Input
                  id="courseCategoryIcon"
                  value={draft.iconName}
                  placeholder="LuBookOpen"
                  maxLength={60}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, iconName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="courseCategoryDisplayOrder">
                  {t.fields.displayOrder}
                </Label>
                <Input
                  id="courseCategoryDisplayOrder"
                  type="number"
                  min={0}
                  max={100000}
                  value={draft.displayOrder}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      displayOrder: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="courseCategoryActive"
                checked={draft.isActive}
                onCheckedChange={(v) =>
                  setDraft((d) => ({ ...d, isActive: Boolean(v) }))
                }
              />
              <Label htmlFor="courseCategoryActive">{t.fields.isActive}</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                {t.actions.cancel}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Spinner className="size-4" /> : t.actions.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
