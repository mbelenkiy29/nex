import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  ExamInstanceWithRelationships,
  examInstanceUpdateBodyInputSchema,
} from '@project/backend/features/examInstance/examInstanceSchemas';
import { examInstanceEnumerators } from '@project/backend/features/examInstance/examInstanceEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ExamTypeWithRelationships } from '@project/backend/features/examType/examTypeSchemas';
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
import { ExamInstanceAutocompleteInput } from '@/features/examInstance/components/ExamInstanceAutocompleteInput';
import { ExamInstanceAutocompleteMultipleInput } from '@/features/examInstance/components/ExamInstanceAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ExamTypeAutocompleteInput } from '@/features/examType/components/ExamTypeAutocompleteInput';
import { ExamTypeAutocompleteMultipleInput } from '@/features/examType/components/ExamTypeAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function ExamInstanceForm({
  examInstance,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (examInstance: ExamInstanceWithRelationships) => void;
  examInstance?: Partial<ExamInstanceWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof examInstanceUpdateBodyInputSchema>) => {
      if (examInstance?.id) {
        return apiClient
          .put(`api/exam-instance/${examInstance.id}`, {
            json: data,
          })
          .json<ExamInstanceWithRelationships>();
      } else {
        return apiClient
          .post('api/exam-instance', {
            json: data,
          })
          .json<ExamInstanceWithRelationships>();
      }
    },
    onSuccess: (examInstance: ExamInstanceWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['examInstance'],
      });

      onSuccess(examInstance);

      toast.success(
        examInstance.id
          ? dictionary.examInstance.edit.success
          : dictionary.examInstance.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof examInstanceUpdateBodyInputSchema>
  >({
    status:
      (examInstance?.status as keyof typeof examInstanceEnumerators.status) ||
      examInstanceEnumerators.status['started'],
    score: examInstance?.score ? Number(examInstance?.score) : '',
    passed: examInstance?.passed || false,
    startedAt: examInstance?.startedAt || '',
    completedAt: examInstance?.completedAt || '',
    timeSpentSeconds: examInstance?.timeSpentSeconds || '',
    course: examInstance?.course || null,
    examType: (examInstance?.examType as ExamTypeWithRelationships) || null,
    student: (examInstance?.student as MemberWithRelationships) || null,
    updatedAt: examInstance?.updatedAt
      ? examInstance.updatedAt instanceof Date
        ? examInstance.updatedAt.toISOString()
        : examInstance.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(examInstanceUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof examInstanceUpdateBodyInputSchema>,
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
            <FieldLabel className="required">
              {dictionary.examInstance.fields.status}
            </FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(examInstanceEnumerators.status).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.examInstance.enumerators.status,
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
                    labelMap={dictionary.examInstance.enumerators.status}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="score">
              {dictionary.examInstance.fields.score}
            </FieldLabel>
            <Controller
              control={form.control}
              name="score"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="score"
                    {...field}
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="0"
                    max="100"
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
            <FieldLabel htmlFor="passed">
              {dictionary.examInstance.fields.passed}
            </FieldLabel>
            <Controller
              control={form.control}
              name="passed"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="passed"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending || mutation.isSuccess}
                    />
                  </div>
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
            <FieldLabel htmlFor="startedAt">
              {dictionary.examInstance.fields.startedAt}
            </FieldLabel>
            <Controller
              control={form.control}
              name="startedAt"
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
            <FieldLabel htmlFor="completedAt">
              {dictionary.examInstance.fields.completedAt}
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
            <FieldLabel htmlFor="timeSpentSeconds">
              {dictionary.examInstance.fields.timeSpentSeconds}
            </FieldLabel>
            <Controller
              control={form.control}
              name="timeSpentSeconds"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="timeSpentSeconds"
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
            <FieldLabel>{dictionary.examInstance.fields.course}</FieldLabel>
            <Controller
              control={form.control}
              name="course"
              render={({ field, fieldState }) => (
                <>
                  <CourseAutocompleteInput
                    onChange={field.onChange}
                    value={field.value as any}
                    disabled={mutation.isPending || mutation.isSuccess}
                    isClearable={true}
                    mode="async"
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
            <FieldLabel htmlFor="examType" className="required">
              {dictionary.examInstance.fields.examType}
            </FieldLabel>
            <Controller
              control={form.control}
              name="examType"
              render={({ field, fieldState }) => (
                <>
                  <ExamTypeAutocompleteInput
                    onChange={field.onChange}
                    value={field.value as ExamTypeWithRelationships}
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
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="student" className="required">
              {dictionary.examInstance.fields.student}
            </FieldLabel>
            <Controller
              control={form.control}
              name="student"
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
