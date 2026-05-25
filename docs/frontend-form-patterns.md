# Frontend Form Patterns

This document contains comprehensive form component patterns with all field types. For backend patterns and overview, see [Entity CRUD Reference](entity-crud-reference.md).

## Form Component with All Field Types

Forms use React Hook Form with Zod validation. This example shows all possible field types.

```typescript
// features/entity/components/EntityForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { useRef, useState } from 'react';

// Imports for UI components
import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';

// Imports for form components
import { SelectInput } from '@/shared/components/form/SelectInput';
import { SelectMultipleInput } from '@/shared/components/form/SelectMultipleInput';
import { DatePickerInput } from '@/shared/components/form/DatePickerInput';
import { DateTimePickerInput } from '@/shared/components/form/DateTimePickerInput';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { ImagesUploadDropzone } from '@/features/file/components/ImagesUploadDropzone';

// Import autocomplete components for relationships
import { RelatedEntityAutocompleteInput } from '@/features/relatedEntity/components/RelatedEntityAutocompleteInput';
import { RelatedEntityAutocompleteMultipleInput } from '@/features/relatedEntity/components/RelatedEntityAutocompleteMultipleInput';

// Import backend types and schemas
import { EntityWithRelationships, entityUpdateBodyInputSchema } from '@project/backend/features/entity/entitySchemas';
import { entityEnumerators } from '@project/backend/features/entity/entityEnumerators';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { storage } from '@project/backend/features/permissions';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';

// Import stores and utilities
import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from '@/shared/lib/apiClient';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function EntityForm({
  entity,
  onSuccess,
  onCancel,
}: {
  entity?: Partial<EntityWithRelationships>;
  onSuccess: (entity: EntityWithRelationships) => void;
  onCancel: () => void;
}) {
  const { dictionary } = useAuthStore();
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  // Mutation for create/update
  const mutation = useMutation({
    mutationFn: (data: z.output<typeof entityUpdateBodyInputSchema>) => {
      if (entity?.id) {
        return apiClient
          .put(`api/entity/${entity.id}`, { json: data })
          .json<Entity>();
      } else {
        return apiClient.post('api/entity', { json: data }).json<Entity>();
      }
    },
    onSuccess: (entity: Entity) => {
      isBypassBlockerRef.current = true;
      queryClient.invalidateQueries({ queryKey: ['entity'] });
      onSuccess(entity);
      toast.success(
        entity.id
          ? dictionary.entity.edit.success
          : dictionary.entity.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  // Default values for form
  const [defaultValues] = useState<z.input<typeof entityUpdateBodyInputSchema>>({
    // Text input
    code: entity?.code || '',
    name: entity?.name || '',

    // Textarea input
    description: entity?.description || '',

    // Number input
    year: entity?.year || '',

    // Decimal input
    budget: entity?.budget ? Number(entity?.budget) : '',

    // Single select (enumerator)
    status: (entity?.status as keyof typeof entityEnumerators.status) || '',

    // Multi-select (enumerator array)
    tags: (entity?.tags as Array<keyof typeof entityEnumerators.tags>) || [],

    // Date input
    startDate: entity?.startDate || '',

    // DateTime input
    milestone: entity?.milestone || '',

    // Boolean (switch)
    active: entity?.active || false,

    // File upload (multiple files)
    documents: (entity?.documents as FileUploaded[]) || [],

    // Image upload (multiple images)
    images: (entity?.images as FileUploaded[]) || [],

    // Single relationship (one-to-one or many-to-one)
    relatedEntity: (entity?.relatedEntity as RelatedEntityWithRelationships) || null,

    // Multiple relationships (one-to-many or many-to-many)
    relatedEntities: (entity?.relatedEntities as RelatedEntityWithRelationships[]) || [],

    // Hidden field for optimistic concurrency control
    updatedAt: entity?.updatedAt
      ? entity.updatedAt instanceof Date
        ? entity.updatedAt.toISOString()
        : entity.updatedAt
      : '',
  });

  // Form setup with Zod validation
  const form = useForm({
    resolver: zodResolver(entityUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  // Unsaved changes protection
  const isDirty = form.formState.isDirty;
  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (data: z.output<typeof entityUpdateBodyInputSchema>) => {
    mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={(e) => { e.stopPropagation(); form.handleSubmit(onSubmit)(e); }}>
      {/* Hidden field for optimistic concurrency control */}
      <Controller
        control={form.control}
        name="updatedAt"
        render={({ field }) => (
          <input type="hidden" {...field} value={field.value as any} />
        )}
      />

      <div className="grid w-full gap-8">
        {/* 1. TEXT INPUT (required) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="code" className="required">
              {dictionary.entity.fields.code}
            </FieldLabel>
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="code"
                    {...field}
                    value={field.value ?? ''}
                    disabled={mutation.isPending || mutation.isSuccess}
                    autoFocus
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 2. TEXT INPUT (optional) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="name">
              {dictionary.entity.fields.name}
            </FieldLabel>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="name"
                    {...field}
                    value={field.value ?? ''}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 3. TEXTAREA INPUT */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="description">
              {dictionary.entity.fields.description}
            </FieldLabel>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="description"
                    {...field}
                    value={field.value ?? ''}
                    disabled={mutation.isPending || mutation.isSuccess}
                    rows={4}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 4. NUMBER INPUT */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="year" className="required">
              {dictionary.entity.fields.year}
            </FieldLabel>
            <Controller
              control={form.control}
              name="year"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="year"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 5. DECIMAL INPUT (number with decimals) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="budget" className="required">
              {dictionary.entity.fields.budget}
            </FieldLabel>
            <Controller
              control={form.control}
              name="budget"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="budget"
                    {...field}
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 6. SELECT INPUT (single select - enumerator) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel className="required">
              {dictionary.entity.fields.status}
            </FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(entityEnumerators.status).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.entity.enumerators.status,
                          value,
                        ),
                      }),
                    )}
                    value={field.value}
                    onChange={field.onChange}
                    isClearable={true}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 7. SELECT MULTIPLE INPUT (multi-select - enumerator array) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.entity.fields.tags}</FieldLabel>
            <Controller
              control={form.control}
              name="tags"
              render={({ field, fieldState }) => (
                <>
                  <SelectMultipleInput
                    options={Object.keys(entityEnumerators.tags).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.entity.enumerators.tags,
                          value,
                        ),
                      }),
                    )}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 8. DATE PICKER INPUT */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.entity.fields.startDate}</FieldLabel>
            <Controller
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <>
                  <DatePickerInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mutation.isPending || mutation.isSuccess}
                    isClearable={true}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 9. DATETIME PICKER INPUT */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.entity.fields.milestone}</FieldLabel>
            <Controller
              control={form.control}
              name="milestone"
              render={({ field, fieldState }) => (
                <>
                  <DateTimePickerInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mutation.isPending || mutation.isSuccess}
                    isClearable={true}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 10. SWITCH (boolean) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="active"
                render={({ field, fieldState }) => (
                  <>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending || mutation.isSuccess}
                    />
                    <FieldLabel>{dictionary.entity.fields.active}</FieldLabel>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </Field>

        {/* 11. FILES UPLOAD DROPZONE */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel className="required">
              {dictionary.entity.fields.documents}
            </FieldLabel>
            <Controller
              control={form.control}
              name="documents"
              render={({ field, fieldState }) => (
                <>
                  <FilesUploadDropzone
                    value={field.value}
                    onChange={field.onChange}
                    storage={storage.entityDocuments}
                    max={2}
                    formats={['pdf', 'doc', 'txt', 'csv']}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 12. IMAGES UPLOAD DROPZONE */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel className="required">
              {dictionary.entity.fields.images}
            </FieldLabel>
            <Controller
              control={form.control}
              name="images"
              render={({ field, fieldState }) => (
                <>
                  <ImagesUploadDropzone
                    value={field.value}
                    onChange={field.onChange}
                    storage={storage.entityImages}
                    max={5}
                    formats={['jpg', 'png', 'gif']}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 13. AUTOCOMPLETE INPUT (single relationship) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.entity.fields.relatedEntity}</FieldLabel>
            <Controller
              control={form.control}
              name="relatedEntity"
              render={({ field, fieldState }) => (
                <>
                  <RelatedEntityAutocompleteInput
                    value={field.value as RelatedEntityWithRelationships}
                    onChange={field.onChange}
                    isClearable={true}
                    disabled={mutation.isPending || mutation.isSuccess}
                    mode="memory"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* 14. AUTOCOMPLETE MULTIPLE INPUT (multiple relationships) */}
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.entity.fields.relatedEntities}</FieldLabel>
            <Controller
              control={form.control}
              name="relatedEntities"
              render={({ field, fieldState }) => (
                <>
                  <RelatedEntityAutocompleteMultipleInput
                    value={field.value as RelatedEntityWithRelationships[]}
                    onChange={field.onChange}
                    disabled={mutation.isPending || mutation.isSuccess}
                    mode="memory"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>

        {/* FORM ACTIONS */}
        <div className="flex gap-2">
          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.shared.save}
          </Button>

          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="button"
            variant={'secondary'}
            onClick={() => {
              isBypassBlockerRef.current = true;
              onCancel();
            }}
          >
            {dictionary.shared.cancel}
          </Button>
        </div>
      </div>

      {/* UNSAVED CHANGES MODAL */}
      {blocker.status === 'blocked' && (
        <UnsavedChangesModal
          title={dictionary.shared.unsavedChanges.title}
          message={dictionary.shared.unsavedChanges.message}
          discardText={dictionary.shared.unsavedChanges.proceed}
          cancelText={dictionary.shared.unsavedChanges.dismiss}
          saveChangesText={dictionary.shared.unsavedChanges.saveChanges}
          onDiscard={blocker.proceed}
          onCancel={blocker.reset}
          onSaveChanges={async () => {
            await form.handleSubmit(onSubmit)();
            blocker.proceed();
          }}
          loading={mutation.isPending}
        />
      )}
    </form>
  );
}
```

## Key Form Patterns

1. **Form Setup**: Use `useForm` with `zodResolver` for type-safe validation
2. **Controller Pattern**: Wrap each field with `<Controller>` for React Hook Form integration
3. **Field Structure**: Each field uses `<Field>` container with `<FieldLabel>` and error display
4. **Text Inputs**: Use `{...field}` spread for native inputs (`Input`, `Textarea`), always add `value={field.value ?? ''}` after the spread to coerce null to empty string
5. **Custom Components**: Use explicit `value` and `onChange` for custom components
6. **Number Inputs**: Use `z.input`/`z.output` types with `numberSchema`; handle `valueAsNumber` and NaN (see [Number Input Patterns](#number-input-patterns))
7. **Disabled State**: Use `mutation.isPending || mutation.isSuccess` instead of `form.formState.isSubmitting`
8. **Loading Indicator**: Show spinner icon during submission
9. **Unsaved Changes**: Use `useBlocker` with `UnsavedChangesModal` to prevent data loss
10. **Hidden Fields**: Use for optimistic concurrency control (`updatedAt`)
11. **File Uploads**: Pre-configured dropzone components for files and images
12. **Relationships**: Autocomplete components for single and multiple relationships

## All Field Types Summary

| #   | Field Type              | Component                           | Key Props                                              |
| --- | ----------------------- | ----------------------------------- | ------------------------------------------------------ |
| 1   | Text (required)         | `<Input>`                           | `{...field}`, `value={field.value ?? ''}`, `autoFocus` |
| 2   | Text (optional)         | `<Input>`                           | `{...field}`, `value={field.value ?? ''}`              |
| 3   | Textarea                | `<Textarea>`                        | `{...field}`, `value={field.value ?? ''}`, `rows={4}`  |
| 4   | Integer                 | `<Input type="number" step="1">`    | `numberSchema` + `.int()`, see below                   |
| 5   | Decimal                 | `<Input type="number" step="0.01">` | `numberOptionalSchema`, see below                      |
| 6   | Select (single)         | `<SelectInput>`                     | `options`, `isClearable`                               |
| 7   | Select (multiple)       | `<SelectMultipleInput>`             | `options`                                              |
| 8   | Date                    | `<DatePickerInput>`                 | `value`, `onChange`, `isClearable`                     |
| 9   | DateTime                | `<DateTimePickerInput>`             | `value`, `onChange`, `isClearable`                     |
| 10  | Boolean                 | `<Switch>`                          | `checked`, `onCheckedChange`                           |
| 11  | Files                   | `<FilesUploadDropzone>`             | `storage`, `max`, `formats`                            |
| 12  | Images                  | `<ImagesUploadDropzone>`            | `storage`, `max`, `formats`                            |
| 13  | Relationship (single)   | `<EntityAutocompleteInput>`         | `mode="memory"`, `isClearable`                         |
| 14  | Relationship (multiple) | `<EntityAutocompleteMultipleInput>` | `mode="memory"`                                        |

## Number Input Patterns

Number inputs require special handling because HTML inputs work with strings, but forms need numbers. Use Zod's input/output type distinction:

### Schema Definition

```typescript
import { z } from 'zod';
import {
  numberSchema,
  numberOptionalSchema,
} from '@project/backend/shared/schemas/numberSchema';

const formSchema = z.object({
  // Required integer with min/max validation
  quantity: numberSchema.pipe(z.number().int().min(1).max(100)),

  // Optional integer
  cargoKg: numberOptionalSchema.pipe(z.number().int().min(0).max(100)),

  // Required decimal
  price: numberSchema.pipe(z.number().min(0)),

  // Optional decimal
  discount: numberOptionalSchema.pipe(z.number().min(0).max(100)),
});

// Separate types for form state (strings) vs submission (numbers)
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;
```

### Form Setup

```typescript
const form = useForm<FormInput, unknown, FormOutput>({
  resolver: zodResolver(formSchema),
  mode: 'onSubmit',
  defaultValues: {
    quantity: '', // Empty string for optional
    cargoKg: '',
    price: '',
    discount: '',
  },
});

const onSubmit = async (data: FormOutput) => {
  // data.quantity is number, not string
  mutation.mutate(data);
};
```

### Input Component

```typescript
// Integer input (step="1" or omit step)
<Controller
  control={form.control}
  name="quantity"
  render={({ field, fieldState }) => (
    <>
      <Input
        type="number"
        step="1"
        min="1"
        max="100"
        value={field.value ?? ''}
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          field.onChange(isNaN(value) ? '' : value);
        }}
        disabled={mutation.isPending}
      />
      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </>
  )}
/>

// Decimal input (step="0.01" for cents)
<Controller
  control={form.control}
  name="price"
  render={({ field, fieldState }) => (
    <>
      <Input
        type="number"
        step="0.01"
        min="0"
        value={field.value ?? ''}
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          field.onChange(isNaN(value) ? '' : value);
        }}
        disabled={mutation.isPending}
      />
      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </>
  )}
/>
```

### Key Points

1. **`numberSchema`** - Transforms string→number, required field
2. **`numberOptionalSchema`** - Transforms string→number, allows empty/null/undefined
3. **`.pipe()`** - Chain additional validations after transformation
4. **`.int()`** - Ensures integer (no decimals)
5. **`z.input` vs `z.output`** - Form state accepts strings, submission returns numbers
6. **`valueAsNumber`** - Get numeric value from input event
7. **`isNaN` check** - Convert NaN (empty input) to undefined
8. **`step` attribute** - `"1"` for integers, `"0.01"` for decimals

## Related Documentation

- [Entity CRUD Reference](entity-crud-reference.md) - Backend patterns, overview, testing
- [Frontend List Patterns](frontend-list-patterns.md) - Data table and list column patterns
- [Frontend View Patterns](frontend-view-patterns.md) - View page and component patterns
