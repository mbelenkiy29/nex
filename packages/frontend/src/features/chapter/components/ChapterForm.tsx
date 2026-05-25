import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  ChapterWithRelationships,
  chapterUpdateBodyInputSchema,
} from '@project/backend/features/chapter/chapterSchemas';
import { chapterEnumerators } from '@project/backend/features/chapter/chapterEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
import { PracticeQuestionWithRelationships } from '@project/backend/features/practiceQuestion/practiceQuestionSchemas';
import { StudyNoteWithRelationships } from '@project/backend/features/studyNote/studyNoteSchemas';
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
import { ChapterAutocompleteInput } from '@/features/chapter/components/ChapterAutocompleteInput';
import { ChapterAutocompleteMultipleInput } from '@/features/chapter/components/ChapterAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { LessonAutocompleteInput } from '@/features/lesson/components/LessonAutocompleteInput';
import { LessonAutocompleteMultipleInput } from '@/features/lesson/components/LessonAutocompleteMultipleInput';
import { PracticeQuestionAutocompleteInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteInput';
import { PracticeQuestionAutocompleteMultipleInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteMultipleInput';
import { StudyNoteAutocompleteInput } from '@/features/studyNote/components/StudyNoteAutocompleteInput';
import { StudyNoteAutocompleteMultipleInput } from '@/features/studyNote/components/StudyNoteAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function ChapterForm({
  chapter,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (chapter: ChapterWithRelationships) => void;
  chapter?: Partial<ChapterWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof chapterUpdateBodyInputSchema>) => {
      if (chapter?.id) {
        return apiClient
          .put(`api/chapter/${chapter.id}`, {
            json: data,
          })
          .json<ChapterWithRelationships>();
      } else {
        return apiClient
          .post('api/chapter', {
            json: data,
          })
          .json<ChapterWithRelationships>();
      }
    },
    onSuccess: (chapter: ChapterWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['chapter'],
      });

      onSuccess(chapter);

      toast.success(
        chapter.id
          ? dictionary.chapter.edit.success
          : dictionary.chapter.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof chapterUpdateBodyInputSchema>
  >({
    title: chapter?.title || '',
    chapterNumber: chapter?.chapterNumber || '',
    description: chapter?.description || '',
    aiTutorPrompt: chapter?.aiTutorPrompt || '',
    xpReward: chapter?.xpReward || '',
    orderIndex: chapter?.orderIndex || '',
    workflowStatus:
      (chapter?.workflowStatus as keyof typeof chapterEnumerators.workflowStatus) ||
      chapterEnumerators.workflowStatus['draft'],
    isPublished: chapter?.isPublished || false,
    version: chapter?.version || '',
    objectives: (chapter?.objectives as string[]) || [],
    course: chapter?.course || null,
    exam: (chapter?.exam as ExamWithRelationships) || null,
    updatedAt: chapter?.updatedAt
      ? chapter.updatedAt instanceof Date
        ? chapter.updatedAt.toISOString()
        : chapter.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(chapterUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof chapterUpdateBodyInputSchema>,
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
              {dictionary.chapter.fields.title}
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
            <FieldLabel htmlFor="chapterNumber" className="required">
              {dictionary.chapter.fields.chapterNumber}
            </FieldLabel>
            <Controller
              control={form.control}
              name="chapterNumber"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="chapterNumber"
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
            <FieldLabel htmlFor="description">
              {dictionary.chapter.fields.description}
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
            <FieldLabel htmlFor="aiTutorPrompt">
              {dictionary.chapter.fields.aiTutorPrompt}
            </FieldLabel>
            <Controller
              control={form.control}
              name="aiTutorPrompt"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="aiTutorPrompt"
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
              {dictionary.chapter.hints.aiTutorPrompt}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="xpReward">
              {dictionary.chapter.fields.xpReward}
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
            <FieldLabel htmlFor="orderIndex" className="required">
              {dictionary.chapter.fields.orderIndex}
            </FieldLabel>
            <Controller
              control={form.control}
              name="orderIndex"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="orderIndex"
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
            <FieldLabel className="required">
              {dictionary.chapter.fields.workflowStatus}
            </FieldLabel>
            <Controller
              control={form.control}
              name="workflowStatus"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(chapterEnumerators.workflowStatus).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.chapter.enumerators.workflowStatus,
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
                    labelMap={dictionary.chapter.enumerators.workflowStatus}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="isPublished">
              {dictionary.chapter.fields.isPublished}
            </FieldLabel>
            <Controller
              control={form.control}
              name="isPublished"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPublished"
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
            <FieldLabel htmlFor="version">
              {dictionary.chapter.fields.version}
            </FieldLabel>
            <Controller
              control={form.control}
              name="version"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="version"
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
            <FieldLabel htmlFor="objectives">
              {dictionary.chapter.fields.objectives}
            </FieldLabel>
            <Controller
              control={form.control}
              name="objectives"
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
            <FieldDescription>
              {dictionary.chapter.hints.objectives}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.chapter.fields.course}</FieldLabel>
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
              {dictionary.chapter.fields.exam}
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
