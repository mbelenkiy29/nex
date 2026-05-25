import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  StudyNoteWithRelationships,
  studyNoteUpdateBodyInputSchema,
} from '@project/backend/features/studyNote/studyNoteSchemas';
import { studyNoteEnumerators } from '@project/backend/features/studyNote/studyNoteEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ChapterWithRelationships } from '@project/backend/features/chapter/chapterSchemas';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';
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
import { StudyNoteAutocompleteInput } from '@/features/studyNote/components/StudyNoteAutocompleteInput';
import { StudyNoteAutocompleteMultipleInput } from '@/features/studyNote/components/StudyNoteAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ChapterAutocompleteInput } from '@/features/chapter/components/ChapterAutocompleteInput';
import { ChapterAutocompleteMultipleInput } from '@/features/chapter/components/ChapterAutocompleteMultipleInput';
import { LessonAutocompleteInput } from '@/features/lesson/components/LessonAutocompleteInput';
import { LessonAutocompleteMultipleInput } from '@/features/lesson/components/LessonAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function StudyNoteForm({
  studyNote,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (studyNote: StudyNoteWithRelationships) => void;
  studyNote?: Partial<StudyNoteWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.output<typeof studyNoteUpdateBodyInputSchema>) => {
      if (studyNote?.id) {
        return apiClient
          .put(`api/study-note/${studyNote.id}`, {
            json: data,
          })
          .json<StudyNoteWithRelationships>();
      } else {
        return apiClient
          .post('api/study-note', {
            json: data,
          })
          .json<StudyNoteWithRelationships>();
      }
    },
    onSuccess: (studyNote: StudyNoteWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['studyNote'],
      });

      onSuccess(studyNote);

      toast.success(
        studyNote.id
          ? dictionary.studyNote.edit.success
          : dictionary.studyNote.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof studyNoteUpdateBodyInputSchema>
  >({
    title: studyNote?.title || '',
    content: studyNote?.content || '',
    isFavorite: studyNote?.isFavorite || false,
    tags: (studyNote?.tags as string[]) || [],
    course: studyNote?.course || null,
    chapter: (studyNote?.chapter as ChapterWithRelationships) || null,
    lesson: (studyNote?.lesson as LessonWithRelationships) || null,
    author: (studyNote?.author as MemberWithRelationships) || null,
    updatedAt: studyNote?.updatedAt
      ? studyNote.updatedAt instanceof Date
        ? studyNote.updatedAt.toISOString()
        : studyNote.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(studyNoteUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof studyNoteUpdateBodyInputSchema>,
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
              {dictionary.studyNote.fields.title}
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
            <FieldLabel htmlFor="content" className="required">
              {dictionary.studyNote.fields.content}
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
              {dictionary.studyNote.hints.content}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="isFavorite">
              {dictionary.studyNote.fields.isFavorite}
            </FieldLabel>
            <Controller
              control={form.control}
              name="isFavorite"
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isFavorite"
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
              {dictionary.studyNote.fields.tags}
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
            <FieldLabel>{dictionary.studyNote.fields.course}</FieldLabel>
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
            <FieldLabel htmlFor="chapter">
              {dictionary.studyNote.fields.chapter}
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
            <FieldLabel htmlFor="lesson">
              {dictionary.studyNote.fields.lesson}
            </FieldLabel>
            <Controller
              control={form.control}
              name="lesson"
              render={({ field, fieldState }) => (
                <>
                  <LessonAutocompleteInput
                    onChange={field.onChange}
                    value={field.value as LessonWithRelationships}
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
            <FieldLabel htmlFor="author" className="required">
              {dictionary.studyNote.fields.author}
            </FieldLabel>
            <Controller
              control={form.control}
              name="author"
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
