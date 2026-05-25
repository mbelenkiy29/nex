import { DocumentUploadAutocompleteInput } from '@/features/documentUpload/components/DocumentUploadAutocompleteInput';
import { DocumentUploadAutocompleteMultipleInput } from '@/features/documentUpload/components/DocumentUploadAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { MemberAutocompleteMultipleInput } from '@/features/member/components/MemberAutocompleteMultipleInput';
import { CourseAutocompleteInput } from '@/features/course/components/CourseAutocompleteInput';
import { FilterPreview } from '@/shared/components/dataTable/DataTableFilterPreview';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableFilterRenders } from '@/shared/components/dataTable/dataTableFilterRenders';
import { DatePickerRangeInput } from '@/shared/components/form/DatePickerRangeInput';
import { DateTimePickerRangeInput } from '@/shared/components/form/DateTimePickerRangeInput';
import { EnumFieldError } from '@/shared/components/form/EnumFieldError';
import { RangeInput } from '@/shared/components/form/RangeInput';
import { SelectInput } from '@/shared/components/form/SelectInput';
import { SelectMultipleInput } from '@/shared/components/form/SelectMultipleInput';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { documentUploadEnumerators } from '@project/backend/features/documentUpload/documentUploadEnumerators';
import { documentUploadLabel } from '@project/backend/features/documentUpload/documentUploadLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { courseLabel } from '@project/backend/features/course/courseLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  originalFilename: '',
  status: null,
  pageCountRange: [],
  wordCountRange: [],
  course: null,
  exam: null,
  uploadedBy: null,
  createdByMember: null,
  createdAtRange: [],
  updatedByMember: null,
  updatedAtRange: [],
  archived: undefined,
};

export function DocumentUploadListFilter({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    originalFilename: {
      label: dictionary.documentUpload.fields.originalFilename,
    },
    status: {
      label: dictionary.documentUpload.fields.status,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.documentUpload.enumerators.status,
      ),
    },
    pageCountRange: {
      label: dictionary.documentUpload.fields.pageCount,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    wordCountRange: {
      label: dictionary.documentUpload.fields.wordCount,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    course: {
      label: dictionary.documentUpload.fields.course,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        courseLabel,
      ),
    },
    exam: {
      label: dictionary.documentUpload.fields.exam,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        examLabel,
      ),
    },
    uploadedBy: {
      label: dictionary.documentUpload.fields.uploadedBy,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    createdByMember: {
      label: dictionary.documentUpload.fields.createdByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    updatedByMember: {
      label: dictionary.documentUpload.fields.updatedByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    createdAtRange: {
      label: dictionary.documentUpload.fields.createdAt,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    updatedAtRange: {
      label: dictionary.documentUpload.fields.updatedAt,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    archived: {
      label: dictionary.shared.showArchived,
      render: dataTableFilterRenders(locale, dictionary).booleanTrueOnly(),
    },
  };

  const filter = searchParams.filter;

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: emptyValues,
  });

  useEffect(() => {
    form.reset({
      ...emptyValues,
      ...filter,
    });
  }, [searchParams]);

  const onRemove = (key: string) => {
    DataTableQueryParams.onFilterChange(
      { ...filter, [key]: undefined },
      navigate,
      searchParams,
    );
  };

  const onSubmit = (data: any) => {
    DataTableQueryParams.onFilterChange(data, navigate, searchParams);
    setExpanded(false);
  };

  const doReset = () => {
    DataTableQueryParams.onFilterChange({}, navigate, searchParams);
    setExpanded(false);
  };

  return (
    <div className="rounded-md border">
      <FilterPreview
        onClick={() => {
          setExpanded(!expanded);
        }}
        renders={previewRenders}
        values={filter}
        expanded={expanded}
        onRemove={onRemove}
      />
      <div className={cn(expanded ? 'block' : 'hidden', 'p-4')}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="originalFilename">
                {dictionary.documentUpload.fields.originalFilename}
              </FieldLabel>
              <Controller
                control={form.control}
                name="originalFilename"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="originalFilename"
                      disabled={isLoading}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.documentUpload.fields.status}</FieldLabel>
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <>
                    <SelectInput
                      options={Object.keys(
                        documentUploadEnumerators.status,
                      ).map((value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.documentUpload.enumerators.status,
                          value,
                        ),
                      }))}
                      isClearable={true}
                      disabled={isLoading}
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
            </Field>
            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.pageCount}
              </FieldLabel>
              <Controller
                control={form.control}
                name="pageCountRange"
                render={({ field, fieldState }) => (
                  <>
                    <RangeInput
                      type="number"
                      disabled={isLoading}
                      onChange={field.onChange}
                      value={field.value as number[]}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.wordCount}
              </FieldLabel>
              <Controller
                control={form.control}
                name="wordCountRange"
                render={({ field, fieldState }) => (
                  <>
                    <RangeInput
                      type="number"
                      disabled={isLoading}
                      onChange={field.onChange}
                      value={field.value as number[]}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.documentUpload.fields.course}</FieldLabel>
              <Controller
                control={form.control}
                name="course"
                render={({ field, fieldState }) => (
                  <>
                    <CourseAutocompleteInput
                      onChange={field.onChange}
                      value={field.value as any}
                      isClearable={true}
                      disabled={isLoading}
                      mode="async"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.documentUpload.fields.exam}</FieldLabel>
              <Controller
                control={form.control}
                name="exam"
                render={({ field, fieldState }) => (
                  <>
                    <ExamAutocompleteInput
                      onChange={field.onChange}
                      value={field.value as any}
                      isClearable={true}
                      disabled={isLoading}
                      hideFormButton={true}
                      mode="memory"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.uploadedBy}
              </FieldLabel>
              <Controller
                control={form.control}
                name="uploadedBy"
                render={({ field, fieldState }) => (
                  <>
                    <MemberAutocompleteInput
                      onChange={field.onChange}
                      value={field.value as any}
                      isClearable={true}
                      disabled={isLoading}
                      mode="memory"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.createdByMember}
              </FieldLabel>
              <Controller
                control={form.control}
                name="createdByMember"
                render={({ field, fieldState }) => (
                  <>
                    <MemberAutocompleteInput
                      onChange={field.onChange}
                      value={field.value as any}
                      isClearable={true}
                      disabled={isLoading}
                      mode="memory"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.createdAt}
              </FieldLabel>
              <Controller
                control={form.control}
                name="createdAtRange"
                render={({ field, fieldState }) => (
                  <>
                    <DateTimePickerRangeInput
                      locale={locale}
                      disabled={isLoading}
                      isClearable={true}
                      onChange={field.onChange}
                      value={field.value}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.updatedByMember}
              </FieldLabel>
              <Controller
                control={form.control}
                name="updatedByMember"
                render={({ field, fieldState }) => (
                  <>
                    <MemberAutocompleteInput
                      onChange={field.onChange}
                      value={field.value as any}
                      isClearable={true}
                      disabled={isLoading}
                      mode="memory"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>
                {dictionary.documentUpload.fields.updatedAt}
              </FieldLabel>
              <Controller
                control={form.control}
                name="updatedAtRange"
                render={({ field, fieldState }) => (
                  <>
                    <DateTimePickerRangeInput
                      locale={locale}
                      disabled={isLoading}
                      isClearable={true}
                      onChange={field.onChange}
                      value={field.value}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.shared.showArchived}</FieldLabel>
              <Controller
                control={form.control}
                name="archived"
                render={({ field, fieldState }) => (
                  <div>
                    <Switch
                      checked={field.value === 'true'}
                      onCheckedChange={(val) =>
                        field.onChange(val ? 'true' : 'false')
                      }
                      disabled={isLoading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </div>
                )}
              />
            </Field>
          </FieldGroup>
          <div className="mt-4 flex justify-end gap-2">
            <Button disabled={isLoading} type="submit" size={'sm'}>
              {isLoading ? (
                <LuLoader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LuSearch className="mr-2 h-4 w-4" />
              )}
              {dictionary.shared.search}
            </Button>

            <Button
              disabled={isLoading}
              type="button"
              variant={'secondary'}
              onClick={doReset}
              size={'sm'}
            >
              <RxReset className="mr-2 h-4 w-4" />
              {dictionary.shared.reset}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
