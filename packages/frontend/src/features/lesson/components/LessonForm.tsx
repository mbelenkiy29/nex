import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  LessonWithRelationships,
  lessonUpdateBodyInputSchema,
} from '@project/backend/features/lesson/lessonSchemas';
import { lessonEnumerators } from '@project/backend/features/lesson/lessonEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
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
import { LessonAutocompleteInput } from '@/features/lesson/components/LessonAutocompleteInput';
import { LessonAutocompleteMultipleInput } from '@/features/lesson/components/LessonAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ChapterAutocompleteInput } from '@/features/chapter/components/ChapterAutocompleteInput';
import { ChapterAutocompleteMultipleInput } from '@/features/chapter/components/ChapterAutocompleteMultipleInput';
import { StudyNoteAutocompleteInput } from '@/features/studyNote/components/StudyNoteAutocompleteInput';
import { StudyNoteAutocompleteMultipleInput } from '@/features/studyNote/components/StudyNoteAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function LessonForm({
  lesson,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (lesson: LessonWithRelationships) => void;
  lesson?: Partial<LessonWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof lessonUpdateBodyInputSchema>) => {
      if (lesson?.id) {
        return apiClient
          .put(`api/lesson/${lesson.id}`, {
            json: data,
          })
          .json<LessonWithRelationships>();
      } else {
        return apiClient
          .post('api/lesson', {
            json: data,
          })
          .json<LessonWithRelationships>();
      }
    },
    onSuccess: (lesson: LessonWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['lesson'],
      });

      onSuccess(lesson);

      toast.success(
        lesson.id
          ? dictionary.lesson.edit.success
          : dictionary.lesson.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<z.input<typeof lessonUpdateBodyInputSchema>>(
    {
      title: lesson?.title || '',
      lessonNumber: lesson?.lessonNumber || '',
      content: lesson?.content || '',
      estimatedMinutes: lesson?.estimatedMinutes || '',
      xpReward: lesson?.xpReward || '',
      workflowStatus:
        (lesson?.workflowStatus as keyof typeof lessonEnumerators.workflowStatus) ||
        lessonEnumerators.workflowStatus['draft'],
      isPublished: lesson?.isPublished || false,
      course: lesson?.course || null,
      chapter: (lesson?.chapter as ChapterWithRelationships) || null,
      updatedAt: lesson?.updatedAt
        ? lesson.updatedAt instanceof Date
          ? lesson.updatedAt.toISOString()
          : lesson.updatedAt
        : '',
    },
  );

  const form = useForm({
    resolver: zodResolver(lessonUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof lessonUpdateBodyInputSchema>,
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
              {dictionary.lesson.fields.title}
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
            <FieldLabel htmlFor="lessonNumber" className="required">
              {dictionary.lesson.fields.lessonNumber}
            </FieldLabel>
            <Controller
              control={form.control}
              name="lessonNumber"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="lessonNumber"
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
            <FieldLabel htmlFor="content">
              {dictionary.lesson.fields.content}
            </FieldLabel>
            <Controller
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="content"
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
              {dictionary.lesson.hints.content}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="estimatedMinutes">
              {dictionary.lesson.fields.estimatedMinutes}
            </FieldLabel>
            <Controller
              control={form.control}
              name="estimatedMinutes"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="estimatedMinutes"
                    {...field}
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? '' : value);
                    }}
                    disabled={mutation.isPending || mutation.isSuccess}
                    min="1"
                    max="300"
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
              {dictionary.lesson.fields.xpReward}
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
            <FieldLabel className="required">
              {dictionary.lesson.fields.workflowStatus}
            </FieldLabel>
            <Controller
              control={form.control}
              name="workflowStatus"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(lessonEnumerators.workflowStatus).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.lesson.enumerators.workflowStatus,
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
                    labelMap={dictionary.lesson.enumerators.workflowStatus}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="isPublished">
              {dictionary.lesson.fields.isPublished}
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
            <FieldLabel>{dictionary.lesson.fields.course}</FieldLabel>
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
              {dictionary.lesson.fields.chapter}
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
