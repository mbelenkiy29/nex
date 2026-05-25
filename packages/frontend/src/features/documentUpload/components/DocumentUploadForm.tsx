import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlocker } from '@tanstack/react-router';
import {
  DocumentUploadWithRelationships,
  documentUploadUpdateBodyInputSchema,
} from '@project/backend/features/documentUpload/documentUploadSchemas';
import { documentUploadEnumerators } from '@project/backend/features/documentUpload/documentUploadEnumerators';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { ExamWithRelationships } from '@project/backend/features/exam/examSchemas';
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
import { DocumentUploadAutocompleteInput } from '@/features/documentUpload/components/DocumentUploadAutocompleteInput';
import { DocumentUploadAutocompleteMultipleInput } from '@/features/documentUpload/components/DocumentUploadAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';

export function DocumentUploadForm({
  documentUpload,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (documentUpload: DocumentUploadWithRelationships) => void;
  documentUpload?: Partial<DocumentUploadWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (
      data: z.output<typeof documentUploadUpdateBodyInputSchema>,
    ) => {
      if (documentUpload?.id) {
        return apiClient
          .put(`api/document-upload/${documentUpload.id}`, {
            json: data,
          })
          .json<DocumentUploadWithRelationships>();
      } else {
        return apiClient
          .post('api/document-upload', {
            json: data,
          })
          .json<DocumentUploadWithRelationships>();
      }
    },
    onSuccess: (documentUpload: DocumentUploadWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['documentUpload'],
      });

      onSuccess(documentUpload);

      toast.success(
        documentUpload.id
          ? dictionary.documentUpload.edit.success
          : dictionary.documentUpload.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const [defaultValues] = useState<
    z.input<typeof documentUploadUpdateBodyInputSchema>
  >({
    originalFilename: documentUpload?.originalFilename || '',
    status:
      (documentUpload?.status as keyof typeof documentUploadEnumerators.status) ||
      documentUploadEnumerators.status['uploaded'],
    pageCount: documentUpload?.pageCount || '',
    wordCount: documentUpload?.wordCount || '',
    processingError: documentUpload?.processingError || '',
    sourceFiles: (documentUpload?.sourceFiles as FileUploaded[]) || [],
    course: documentUpload?.course || null,
    exam: (documentUpload?.exam as ExamWithRelationships) || null,
    uploadedBy: (documentUpload?.uploadedBy as MemberWithRelationships) || null,
    updatedAt: documentUpload?.updatedAt
      ? documentUpload.updatedAt instanceof Date
        ? documentUpload.updatedAt.toISOString()
        : documentUpload.updatedAt
      : '',
  });

  const form = useForm({
    resolver: zodResolver(documentUploadUpdateBodyInputSchema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (
    data: z.output<typeof documentUploadUpdateBodyInputSchema>,
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
            <FieldLabel htmlFor="originalFilename" className="required">
              {dictionary.documentUpload.fields.originalFilename}
            </FieldLabel>
            <Controller
              control={form.control}
              name="originalFilename"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="originalFilename"
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
              {dictionary.documentUpload.fields.status}
            </FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <>
                  <SelectInput
                    options={Object.keys(documentUploadEnumerators.status).map(
                      (value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.documentUpload.enumerators.status,
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
                    labelMap={dictionary.documentUpload.enumerators.status}
                  />
                </>
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="pageCount">
              {dictionary.documentUpload.fields.pageCount}
            </FieldLabel>
            <Controller
              control={form.control}
              name="pageCount"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="pageCount"
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
            <FieldLabel htmlFor="wordCount">
              {dictionary.documentUpload.fields.wordCount}
            </FieldLabel>
            <Controller
              control={form.control}
              name="wordCount"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="wordCount"
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
            <FieldLabel htmlFor="processingError">
              {dictionary.documentUpload.fields.processingError}
            </FieldLabel>
            <Controller
              control={form.control}
              name="processingError"
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="processingError"
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
            <FieldLabel htmlFor="sourceFiles" className="required">
              {dictionary.documentUpload.fields.sourceFiles}
            </FieldLabel>
            <Controller
              control={form.control}
              name="sourceFiles"
              render={({ field, fieldState }) => (
                <>
                  <FilesUploadDropzone
                    value={field.value}
                    onChange={field.onChange}
                    storage={storage.documentUploadSourceFiles}
                    disabled={mutation.isPending || mutation.isSuccess}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
            <FieldDescription>
              {dictionary.documentUpload.hints.sourceFiles}
            </FieldDescription>
          </div>
        </Field>
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel>{dictionary.documentUpload.fields.course}</FieldLabel>
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
              {dictionary.documentUpload.fields.exam}
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
        <Field>
          <div className="grid max-w-lg gap-1">
            <FieldLabel htmlFor="uploadedBy">
              {dictionary.documentUpload.fields.uploadedBy}
            </FieldLabel>
            <Controller
              control={form.control}
              name="uploadedBy"
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
