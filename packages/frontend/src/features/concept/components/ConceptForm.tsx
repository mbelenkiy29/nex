import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  ConceptWithRelationships,
  conceptUpdateBodyInputSchema,
} from '@project/backend/features/concept/conceptSchemas';
import { conceptEnumerators } from '@project/backend/features/concept/conceptEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
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
import { ConceptAutocompleteInput } from '@/features/concept/components/ConceptAutocompleteInput';
import { ConceptAutocompleteMultipleInput } from '@/features/concept/components/ConceptAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { PracticeQuestionAutocompleteInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteInput';
import { PracticeQuestionAutocompleteMultipleInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function ConceptForm({
  concept,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (concept: ConceptWithRelationships) => void;
  concept?: Partial<ConceptWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof conceptUpdateBodyInputSchema>) => {
      if (concept?.id) {
        return apiClient
          .put(`api/concept/${concept.id}`, {
            json: data,
          })
          .json<ConceptWithRelationships>();
      } else {
        return apiClient
          .post('api/concept', {
            json: data,
          })
          .json<ConceptWithRelationships>();
      }
    },
    onSuccess: (concept: ConceptWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['concept'],
      });

      onSuccess(concept);

      toast.success(
        concept.id
          ? dictionary.concept.edit.success
          : dictionary.concept.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof conceptUpdateBodyInputSchema>
  >({
    conceptName: concept?.conceptName || '',
    conceptCode: concept?.conceptCode || '',
    conceptDescription: concept?.conceptDescription || '',
    explanation: concept?.explanation || '',
    examDomain: concept?.examDomain || '',
    difficulty:
      concept?.difficulty as keyof typeof conceptEnumerators.difficulty,
    examWeight:
      concept?.examWeight as keyof typeof conceptEnumerators.examWeight,
    typicalMistakes: (concept?.typicalMistakes as string[]) || [],
    examTips: (concept?.examTips as string[]) || [],
    isActive: concept?.isActive || false,
    course: concept?.course || null,
    exam: (concept?.exam as ExamWithRelationships) || null,
    updatedAt: concept?.updatedAt
      ? concept.updatedAt instanceof Date
        ? concept.updatedAt.toISOString()
        : concept.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(conceptUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof conceptUpdateBodyInputSchema>,
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
            <FieldLabel htmlFor="conceptName" className="required">
              {dictionary.concept.fields.conceptName}
            </FieldLabel>
            <Controller
              control={form.control}
              name="conceptName"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="conceptName"
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
            <FieldLabel htmlFor="conceptCode" className="required">
              {dictionary.concept.fields.conceptCode}
            </FieldLabel>
            <Controller
              control={form.control}
              name="conceptCode"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="conceptCode"
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
            <FieldDescription>
              {dictionary.concept.hints.conceptCode}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="conceptDescription" className="required">
              {dictionary.concept.fields.conceptDescription}
            </FieldLabel>
            <Controller
              control={form.control}
              name="conceptDescription"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="conceptDescription"
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
            <FieldLabel htmlFor="explanation" className="required">
              {dictionary.concept.fields.explanation}
            </FieldLabel>
            <Controller
              control={form.control}
              name="explanation"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="explanation"
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
            <FieldDescription>
              {dictionary.concept.hints.explanation}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="examDomain">
              {dictionary.concept.fields.examDomain}
            </FieldLabel>
            <Controller
              control={form.control}
              name="examDomain"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="examDomain"
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
            <FieldLabel>{dictionary.concept.fields.difficulty}</FieldLabel>
            <Controller
              control={form.control}
              name="difficulty"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(conceptEnumerators.difficulty).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.concept.enumerators.difficulty,
                          value,
                        ),
                      }),
                    )}
                    isClearable={true}
                    disabled={mutation.isPending || mutation.isSuccess}
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <EnumFieldError
                    error={fieldState.error}
                    labelMap={dictionary.concept.enumerators.difficulty}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.concept.fields.examWeight}</FieldLabel>
            <Controller
              control={form.control}
              name="examWeight"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(conceptEnumerators.examWeight).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.concept.enumerators.examWeight,
                          value,
                        ),
                      }),
                    )}
                    isClearable={true}
                    disabled={mutation.isPending || mutation.isSuccess}
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <EnumFieldError
                    error={fieldState.error}
                    labelMap={dictionary.concept.enumerators.examWeight}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="typicalMistakes">
              {dictionary.concept.fields.typicalMistakes}
            </FieldLabel>
            <Controller
              control={form.control}
              name="typicalMistakes"
              render={({ field, fieldState }) => (
                <>
                  <TagsInput
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
            <FieldLabel htmlFor="examTips">
              {dictionary.concept.fields.examTips}
            </FieldLabel>
            <Controller
              control={form.control}
              name="examTips"
              render={({ field, fieldState }) => (
                <>
                  <TagsInput
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
            <FieldLabel htmlFor="isActive">
              {dictionary.concept.fields.isActive}
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
            <FieldLabel>{dictionary.concept.fields.course}</FieldLabel>
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
              {dictionary.concept.fields.exam}
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
