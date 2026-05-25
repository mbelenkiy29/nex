import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  PracticeQuestionWithRelationships,
  practiceQuestionUpdateBodyInputSchema,
} from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { practiceQuestionEnumerators } from '@project/backend/features/practiceQuestion/practiceQuestionEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { ConceptWithRelationships } from '@project/backend/features/concept/conceptSchemas';
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
import { PracticeQuestionAutocompleteInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteInput';
import { PracticeQuestionAutocompleteMultipleInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ChapterAutocompleteInput } from '@/features/chapter/components/ChapterAutocompleteInput';
import { ChapterAutocompleteMultipleInput } from '@/features/chapter/components/ChapterAutocompleteMultipleInput';
import { ConceptAutocompleteInput } from '@/features/concept/components/ConceptAutocompleteInput';
import { ConceptAutocompleteMultipleInput } from '@/features/concept/components/ConceptAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function PracticeQuestionForm({
  practiceQuestion,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (practiceQuestion: PracticeQuestionWithRelationships) => void;
  practiceQuestion?: Partial<PracticeQuestionWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (
      data: z.output<typeof practiceQuestionUpdateBodyInputSchema>,
    ) => {
      if (practiceQuestion?.id) {
        return apiClient
          .put(`api/practice-question/${practiceQuestion.id}`, {
            json: data,
          })
          .json<PracticeQuestionWithRelationships>();
      } else {
        return apiClient
          .post('api/practice-question', {
            json: data,
          })
          .json<PracticeQuestionWithRelationships>();
      }
    },
    onSuccess: (practiceQuestion: PracticeQuestionWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['practiceQuestion'],
      });

      onSuccess(practiceQuestion);

      toast.success(
        practiceQuestion.id
          ? dictionary.practiceQuestion.edit.success
          : dictionary.practiceQuestion.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof practiceQuestionUpdateBodyInputSchema>
  >({
    questionText: practiceQuestion?.questionText || '',
    correctAnswerIndex: practiceQuestion?.correctAnswerIndex || '',
    answerOptions: (practiceQuestion?.answerOptions as string[]) || [],
    explanation: practiceQuestion?.explanation || '',
    difficulty:
      (practiceQuestion?.difficulty as keyof typeof practiceQuestionEnumerators.difficulty) ||
      practiceQuestionEnumerators.difficulty['easy'],
    category: practiceQuestion?.category || '',
    isActive: practiceQuestion?.isActive || false,
    tags: (practiceQuestion?.tags as string[]) || [],
    course: practiceQuestion?.course || null,
    chapter: (practiceQuestion?.chapter as ChapterWithRelationships) || null,
    concepts: (practiceQuestion?.concepts as ConceptWithRelationships[]) || [],
    updatedAt: practiceQuestion?.updatedAt
      ? practiceQuestion.updatedAt instanceof Date
        ? practiceQuestion.updatedAt.toISOString()
        : practiceQuestion.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(practiceQuestionUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof practiceQuestionUpdateBodyInputSchema>,
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
            <FieldLabel htmlFor="questionText" className="required">
              {dictionary.practiceQuestion.fields.questionText}
            </FieldLabel>
            <Controller
              control={form.control}
              name="questionText"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="questionText"
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
            <FieldLabel htmlFor="correctAnswerIndex" className="required">
              {dictionary.practiceQuestion.fields.correctAnswerIndex}
            </FieldLabel>
            <Controller
              control={form.control}
              name="correctAnswerIndex"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="correctAnswerIndex"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="0"
                    max="10"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
            <FieldDescription>
              {dictionary.practiceQuestion.hints.correctAnswerIndex}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="answerOptions">
              {dictionary.practiceQuestion.fields.answerOptions}
            </FieldLabel>
            <Controller
              control={form.control}
              name="answerOptions"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="answerOptions"
                    value={(field.value || []).join('\n')}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split('\n')
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
            <FieldDescription>
              {dictionary.practiceQuestion.hints.answerOptions}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="explanation">
              {dictionary.practiceQuestion.fields.explanation}
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
              {dictionary.practiceQuestion.hints.explanation}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel className="required">
              {dictionary.practiceQuestion.fields.difficulty}
            </FieldLabel>
            <Controller
              control={form.control}
              name="difficulty"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(
                      practiceQuestionEnumerators.difficulty,
                    ).map((value) => ({
                      value,
                      label: dictionaryEnumerator(
                        dictionary.practiceQuestion.enumerators.difficulty,
                        value,
                      ),
                    }))}
                    isClearable={false}
                    disabled={mutation.isPending || mutation.isSuccess}
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <EnumFieldError
                    error={fieldState.error}
                    labelMap={
                      dictionary.practiceQuestion.enumerators.difficulty
                    }
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="category">
              {dictionary.practiceQuestion.fields.category}
            </FieldLabel>
            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="category"
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
            <FieldLabel htmlFor="isActive">
              {dictionary.practiceQuestion.fields.isActive}
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
            <FieldLabel htmlFor="tags">
              {dictionary.practiceQuestion.fields.tags}
            </FieldLabel>
            <Controller
              control={form.control}
              name="tags"
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
            <FieldLabel>{dictionary.practiceQuestion.fields.course}</FieldLabel>
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
            <FieldLabel htmlFor="chapter" className="required">
              {dictionary.practiceQuestion.fields.chapter}
            </FieldLabel>
            <Controller
              control={form.control}
              name="chapter"
              render={({ field, fieldState }) => (
                <>
                  <ChapterAutocompleteInput
                    onChange={field.onChange}
                    value={field.value as ChapterWithRelationships}
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
            <FieldLabel htmlFor="concepts">
              {dictionary.practiceQuestion.fields.concepts}
            </FieldLabel>
            <Controller
              control={form.control}
              name="concepts"
              render={({ field, fieldState }) => (
                <>
                  <ConceptAutocompleteMultipleInput
                    onChange={field.onChange}
                    value={field.value as ConceptWithRelationships[]}
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
