import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  DailyGoalWithRelationships,
  dailyGoalUpdateBodyInputSchema,
} from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { dailyGoalEnumerators } from '@project/backend/features/dailyGoal/dailyGoalEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { storage } from '@project/backend/features/permissions';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { EnumFieldError } from '@/shared/components/form/EnumFieldError';
import { SelectInput } from '@/shared/components/form/SelectInput';
import { SelectMultipleInput } from '@/shared/components/form/SelectMultipleInput';
import { DatePickerInput } from '@/shared/components/form/DatePickerInput';
import { DateTimePickerInput } from '@/shared/components/form/DateTimePickerInput';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { ImagesUploadDropzone } from '@/features/file/components/ImagesUploadDropzone';
import { DailyGoalAutocompleteInput } from '@/features/dailyGoal/components/DailyGoalAutocompleteInput';
import { DailyGoalAutocompleteMultipleInput } from '@/features/dailyGoal/components/DailyGoalAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function DailyGoalForm({
  dailyGoal,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (dailyGoal: DailyGoalWithRelationships) => void;
  dailyGoal?: Partial<DailyGoalWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof dailyGoalUpdateBodyInputSchema>) => {
      if (dailyGoal?.id) {
        return apiClient
          .put(`api/daily-goal/${dailyGoal.id}`, {
            json: data,
          })
          .json<DailyGoalWithRelationships>();
      } else {
        return apiClient
          .post('api/daily-goal', {
            json: data,
          })
          .json<DailyGoalWithRelationships>();
      }
    },
    onSuccess: (dailyGoal: DailyGoalWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['dailyGoal'],
      });

      onSuccess(dailyGoal);

      toast.success(
        dailyGoal.id
          ? dictionary.dailyGoal.edit.success
          : dictionary.dailyGoal.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof dailyGoalUpdateBodyInputSchema>
  >({
    title: dailyGoal?.title || '',
    goalType:
      (dailyGoal?.goalType as keyof typeof dailyGoalEnumerators.goalType) ||
      dailyGoalEnumerators.goalType['questions_answered'],
    targetValue: dailyGoal?.targetValue || '',
    currentValue: dailyGoal?.currentValue || '',
    xpReward: dailyGoal?.xpReward || '',
    goalDate: dailyGoal?.goalDate || '',
    completedAt: dailyGoal?.completedAt || '',
    owner: (dailyGoal?.owner as MemberWithRelationships) || null,
    updatedAt: dailyGoal?.updatedAt
      ? dailyGoal.updatedAt instanceof Date
        ? dailyGoal.updatedAt.toISOString()
        : dailyGoal.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(dailyGoalUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof dailyGoalUpdateBodyInputSchema>,
  ) => {
    mutation.mutateAsync(data);
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        form.handleSubmit(onSubmit)(e);
      }}
    >
      <Controller
        control={form.control}
        name="updatedAt"
        render={({ field }) => (
          <input type="hidden" {...field} value={field.value as any} />
        )}
      />
      <div className="grid w-full gap-8">
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="title" className="required">
              {dictionary.dailyGoal.fields.title}
            </FieldLabel>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="title"
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
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel className="required">
              {dictionary.dailyGoal.fields.goalType}
            </FieldLabel>
            <Controller
              control={form.control}
              name="goalType"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(dailyGoalEnumerators.goalType).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.dailyGoal.enumerators.goalType,
                          value,
                        ),
                      }),
                    )}
                    isClearable={false}
                    disabled={mutation.isPending || mutation.isSuccess}
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <EnumFieldError
                    error={fieldState.error}
                    labelMap={dictionary.dailyGoal.enumerators.goalType}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="targetValue" className="required">
              {dictionary.dailyGoal.fields.targetValue}
            </FieldLabel>
            <Controller
              control={form.control}
              name="targetValue"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="targetValue"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="1"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="currentValue">
              {dictionary.dailyGoal.fields.currentValue}
            </FieldLabel>
            <Controller
              control={form.control}
              name="currentValue"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="currentValue"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="0"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="xpReward">
              {dictionary.dailyGoal.fields.xpReward}
            </FieldLabel>
            <Controller
              control={form.control}
              name="xpReward"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="xpReward"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="0"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="goalDate" className="required">
              {dictionary.dailyGoal.fields.goalDate}
            </FieldLabel>
            <Controller
              control={form.control}
              name="goalDate"
              render={({ field, fieldState }) => (
                <>
                  <DatePickerInput
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
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="completedAt">
              {dictionary.dailyGoal.fields.completedAt}
            </FieldLabel>
            <Controller
              control={form.control}
              name="completedAt"
              render={({ field, fieldState }) => (
                <>
                  <DateTimePickerInput
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
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="owner" className="required">
              {dictionary.dailyGoal.fields.owner}
            </FieldLabel>
            <Controller
              control={form.control}
              name="owner"
              render={({ field, fieldState }) => (
                <>
                  <MemberAutocompleteInput
                    onChange={field.onChange}
                    value={field.value as MemberWithRelationships}
                    disabled={mutation.isPending || mutation.isSuccess}
                    isClearable={true}
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
