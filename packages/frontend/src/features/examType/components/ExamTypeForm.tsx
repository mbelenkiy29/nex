import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  ExamTypeWithRelationships,
  examTypeUpdateBodyInputSchema,
} from '@project/backend/features/examType/examTypeSchemas';
import { examTypeEnumerators } from '@project/backend/features/examType/examTypeEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { ExamInstanceWithRelationships } from '@project/backend/features/examInstance/examInstanceSchemas';
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
import { ExamTypeAutocompleteInput } from '@/features/examType/components/ExamTypeAutocompleteInput';
import { ExamTypeAutocompleteMultipleInput } from '@/features/examType/components/ExamTypeAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { ExamInstanceAutocompleteInput } from '@/features/examInstance/components/ExamInstanceAutocompleteInput';
import { ExamInstanceAutocompleteMultipleInput } from '@/features/examInstance/components/ExamInstanceAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function ExamTypeForm({
  examType,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (examType: ExamTypeWithRelationships) => void;
  examType?: Partial<ExamTypeWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof examTypeUpdateBodyInputSchema>) => {
      if (examType?.id) {
        return apiClient
          .put(`api/exam-type/${examType.id}`, {
            json: data,
          })
          .json<ExamTypeWithRelationships>();
      } else {
        return apiClient
          .post('api/exam-type', {
            json: data,
          })
          .json<ExamTypeWithRelationships>();
      }
    },
    onSuccess: (examType: ExamTypeWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['examType'],
      });

      onSuccess(examType);

      toast.success(
        examType.id
          ? dictionary.examType.edit.success
          : dictionary.examType.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof examTypeUpdateBodyInputSchema>
  >({
    name: examType?.name || '',
    description: examType?.description || '',
    type:
      (examType?.type as keyof typeof examTypeEnumerators.type) ||
      examTypeEnumerators.type['mock'],
    questionCount: examType?.questionCount || '',
    timeLimitMinutes: examType?.timeLimitMinutes || '',
    passingScore: examType?.passingScore || '',
    maxAttempts: examType?.maxAttempts || '',
    shuffleQuestions: examType?.shuffleQuestions || false,
    showAnswersImmediately: examType?.showAnswersImmediately || false,
    isActive: examType?.isActive || false,
    course: examType?.course || null,
    exam: (examType?.exam as ExamWithRelationships) || null,
    updatedAt: examType?.updatedAt
      ? examType.updatedAt instanceof Date
        ? examType.updatedAt.toISOString()
        : examType.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(examTypeUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof examTypeUpdateBodyInputSchema>,
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
            <FieldLabel htmlFor="name" className="required">
              {dictionary.examType.fields.name}
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
                    autoFocus
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
            <FieldDescription>
              {dictionary.examType.hints.name}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="description">
              {dictionary.examType.fields.description}
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
              {dictionary.examType.fields.type}
            </FieldLabel>
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(examTypeEnumerators.type).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.examType.enumerators.type,
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
                    labelMap={dictionary.examType.enumerators.type}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="questionCount" className="required">
              {dictionary.examType.fields.questionCount}
            </FieldLabel>
            <Controller
              control={form.control}
              name="questionCount"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="questionCount"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="1"
                    max="500"
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
            <FieldLabel htmlFor="timeLimitMinutes">
              {dictionary.examType.fields.timeLimitMinutes}
            </FieldLabel>
            <Controller
              control={form.control}
              name="timeLimitMinutes"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="timeLimitMinutes"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="1"
                    max="600"
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
            <FieldLabel htmlFor="passingScore">
              {dictionary.examType.fields.passingScore}
            </FieldLabel>
            <Controller
              control={form.control}
              name="passingScore"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="passingScore"
                    {...field}
                    type="number"
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
            <FieldDescription>
              {dictionary.examType.hints.passingScore}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="maxAttempts">
              {dictionary.examType.fields.maxAttempts}
            </FieldLabel>
            <Controller
              control={form.control}
              name="maxAttempts"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="maxAttempts"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="1"
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
            <FieldLabel htmlFor="shuffleQuestions">
              {dictionary.examType.fields.shuffleQuestions}
            </FieldLabel>
            <Controller
              control={form.control}
              name="shuffleQuestions"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="shuffleQuestions"
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
            <FieldLabel htmlFor="showAnswersImmediately">
              {dictionary.examType.fields.showAnswersImmediately}
            </FieldLabel>
            <Controller
              control={form.control}
              name="showAnswersImmediately"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showAnswersImmediately"
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
            <FieldLabel htmlFor="isActive">
              {dictionary.examType.fields.isActive}
            </FieldLabel>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
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
            <FieldLabel>{dictionary.examType.fields.course}</FieldLabel>
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
            <FieldLabel htmlFor="exam" className="required">
              {dictionary.examType.fields.exam}
            </FieldLabel>
            <Controller
              control={form.control}
              name="exam"
              render={({ field, fieldState }) => (
                <>
                  <ExamAutocompleteInput
                    onChange={field.onChange}
                    value={field.value as ExamWithRelationships}
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
