import type { ReactNode } from 'react';
import { LuCirclePlus, LuTrash2 } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { newId } from '@/features/course/courseBuilderUtils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

// Shared building blocks for the course builder screens. Extracted verbatim
// from the original monolithic CourseBuilderPage so every section route can
// reuse them.

export function BuilderCard({
  icon,
  title,
  description,
  actions,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
              {icon}
            </span>
            <div>
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {description}
              </p>
            </div>
          </div>
          {actions}
        </div>
        <div className="mt-5 grid gap-3">{children}</div>
      </CardContent>
    </Card>
  );
}

export function ItemGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

export function LabeledInput({
  label,
  value,
  onChange,
  disabled,
  hint,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
  testId?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <Input
        data-testid={testId}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl bg-white/80 dark:bg-white/10"
      />
      {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
    </label>
  );
}

export function LabeledTextarea({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <Textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 rounded-xl bg-white/80 dark:bg-white/10"
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-muted-foreground text-xs font-semibold">
        {label}
      </span>
      <Input
        type="number"
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === '' ? null : Number(raw));
        }}
        className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
      />
    </label>
  );
}

export function AddButton({
  label,
  onClick,
  testId,
}: {
  label: string;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <Button
      data-testid={testId}
      type="button"
      variant="outline"
      className="h-9 justify-self-start rounded-xl bg-white/70 dark:bg-white/8"
      onClick={onClick}
    >
      <LuCirclePlus className="size-4" />
      {label}
    </Button>
  );
}

export function IconButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="size-9 shrink-0 rounded-lg bg-white/70 p-0 dark:bg-white/8"
    >
      <LuTrash2 className="size-4" />
    </Button>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 pb-1 text-xs font-semibold">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange(Boolean(value))}
      />
      {label}
    </label>
  );
}

// An ordered list of plain text rows — used for learning outcomes and
// requirements.
export function TextItemList({
  items,
  editable,
  placeholder,
  addLabel,
  onChange,
}: {
  items: Array<{ id: string; text: string; orderIndex: number }>;
  editable: boolean;
  placeholder: string;
  addLabel: string;
  onChange: (
    items: Array<{ id: string; text: string; orderIndex: number }>,
  ) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Input
            value={item.text}
            disabled={!editable}
            placeholder={placeholder}
            onChange={(event) =>
              onChange(
                items.map((row) =>
                  row.id === item.id
                    ? { ...row, text: event.target.value }
                    : row,
                ),
              )
            }
            className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
          />
          {editable && (
            <IconButton
              label={dictionary.course.builder.actions.remove}
              onClick={() =>
                onChange(items.filter((row) => row.id !== item.id))
              }
            />
          )}
        </div>
      ))}
      {editable && (
        <AddButton
          label={addLabel}
          onClick={() =>
            onChange([
              ...items,
              { id: newId(), text: '', orderIndex: items.length },
            ])
          }
        />
      )}
    </div>
  );
}
