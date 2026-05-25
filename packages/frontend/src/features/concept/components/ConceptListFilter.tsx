import { ConceptAutocompleteInput } from '@/features/concept/components/ConceptAutocompleteInput';
import { ConceptAutocompleteMultipleInput } from '@/features/concept/components/ConceptAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { PracticeQuestionAutocompleteInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteInput';
import { PracticeQuestionAutocompleteMultipleInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteMultipleInput';
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
import { conceptEnumerators } from '@project/backend/features/concept/conceptEnumerators';
import { conceptLabel } from '@project/backend/features/concept/conceptLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { courseLabel } from '@project/backend/features/course/courseLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  conceptName: '',
  conceptCode: '',
  examDomain: '',
  difficulty: null,
  examWeight: null,
  isActive: undefined,
  course: null,
  exam: null,
  createdByMember: null,
  createdAtRange: [],
  updatedByMember: null,
  updatedAtRange: [],
  archived: undefined,
};

export function ConceptListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    conceptName: {
      label: dictionary.concept.fields.conceptName,
    },
    conceptCode: {
      label: dictionary.concept.fields.conceptCode,
    },
    examDomain: {
      label: dictionary.concept.fields.examDomain,
    },
    difficulty: {
      label: dictionary.concept.fields.difficulty,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.concept.enumerators.difficulty,
      ),
    },
    examWeight: {
      label: dictionary.concept.fields.examWeight,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.concept.enumerators.examWeight,
      ),
    },
    isActive: {
      label: dictionary.concept.fields.isActive,
      render: dataTableFilterRenders(locale, dictionary).boolean(),
    },
    course: {
      label: dictionary.concept.fields.course,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        courseLabel,
      ),
    },
    exam: {
      label: dictionary.concept.fields.exam,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        examLabel,
      ),
    },
    createdByMember: {
      label: dictionary.concept.fields.createdByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    updatedByMember: {
      label: dictionary.concept.fields.updatedByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    createdAtRange: {
      label: dictionary.concept.fields.createdAt,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    updatedAtRange: {
      label: dictionary.concept.fields.updatedAt,
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
              <FieldLabel htmlFor="conceptName">
                {dictionary.concept.fields.conceptName}
              </FieldLabel>
              <Controller
                control={form.control}
                name="conceptName"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="conceptName" disabled={isLoading} {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="conceptCode">
                {dictionary.concept.fields.conceptCode}
              </FieldLabel>
              <Controller
                control={form.control}
                name="conceptCode"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="conceptCode" disabled={isLoading} {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="examDomain">
                {dictionary.concept.fields.examDomain}
              </FieldLabel>
              <Controller
                control={form.control}
                name="examDomain"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="examDomain" disabled={isLoading} {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
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
                      disabled={isLoading}
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
            </Field>
            <Field>
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
                      disabled={isLoading}
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
            </Field>
            <Field>
              <FieldLabel>{dictionary.concept.fields.isActive}</FieldLabel>
              <Controller
                control={form.control}
                name="isActive"
                render={({ field, fieldState }) => (
                  <>
                    <SelectInput
                      options={[
                        {
                          label: dictionary.shared.yes,
                          value: 'true',
                        },
                        {
                          label: dictionary.shared.no,
                          value: 'false',
                        },
                      ]}
                      isClearable={true}
                      disabled={isLoading}
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
              <FieldLabel>{dictionary.concept.fields.course}</FieldLabel>
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
              <FieldLabel>{dictionary.concept.fields.exam}</FieldLabel>
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
                {dictionary.concept.fields.createdByMember}
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
              <FieldLabel>{dictionary.concept.fields.createdAt}</FieldLabel>
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
                {dictionary.concept.fields.updatedByMember}
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
              <FieldLabel>{dictionary.concept.fields.updatedAt}</FieldLabel>
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
