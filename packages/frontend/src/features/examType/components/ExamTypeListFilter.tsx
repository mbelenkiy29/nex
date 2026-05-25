import { ExamTypeAutocompleteInput } from '@/features/examType/components/ExamTypeAutocompleteInput';
import { ExamTypeAutocompleteMultipleInput } from '@/features/examType/components/ExamTypeAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { ExamInstanceAutocompleteInput } from '@/features/examInstance/components/ExamInstanceAutocompleteInput';
import { ExamInstanceAutocompleteMultipleInput } from '@/features/examInstance/components/ExamInstanceAutocompleteMultipleInput';
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
import { examTypeEnumerators } from '@project/backend/features/examType/examTypeEnumerators';
import { examTypeLabel } from '@project/backend/features/examType/examTypeLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { examInstanceLabel } from '@project/backend/features/examInstance/examInstanceLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { courseLabel } from '@project/backend/features/course/courseLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  name: '',
  type: null,
  questionCountRange: [],
  timeLimitMinutesRange: [],
  passingScoreRange: [],
  maxAttemptsRange: [],
  shuffleQuestions: undefined,
  showAnswersImmediately: undefined,
  isActive: undefined,
  course: null,
  exam: null,
  createdByMember: null,
  createdAtRange: [],
  updatedByMember: null,
  updatedAtRange: [],
  archived: undefined,
};

export function ExamTypeListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    name: {
      label: dictionary.examType.fields.name,
    },
    type: {
      label: dictionary.examType.fields.type,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.examType.enumerators.type,
      ),
    },
    questionCountRange: {
      label: dictionary.examType.fields.questionCount,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    timeLimitMinutesRange: {
      label: dictionary.examType.fields.timeLimitMinutes,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    passingScoreRange: {
      label: dictionary.examType.fields.passingScore,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    maxAttemptsRange: {
      label: dictionary.examType.fields.maxAttempts,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    shuffleQuestions: {
      label: dictionary.examType.fields.shuffleQuestions,
      render: dataTableFilterRenders(locale, dictionary).boolean(),
    },
    showAnswersImmediately: {
      label: dictionary.examType.fields.showAnswersImmediately,
      render: dataTableFilterRenders(locale, dictionary).boolean(),
    },
    isActive: {
      label: dictionary.examType.fields.isActive,
      render: dataTableFilterRenders(locale, dictionary).boolean(),
    },
    course: {
      label: dictionary.examType.fields.course,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        courseLabel,
      ),
    },
    exam: {
      label: dictionary.examType.fields.exam,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        examLabel,
      ),
    },
    createdByMember: {
      label: dictionary.examType.fields.createdByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    updatedByMember: {
      label: dictionary.examType.fields.updatedByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    createdAtRange: {
      label: dictionary.examType.fields.createdAt,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    updatedAtRange: {
      label: dictionary.examType.fields.updatedAt,
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
              <FieldLabel htmlFor="name">
                {dictionary.examType.fields.name}
              </FieldLabel>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="name" disabled={isLoading} {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.examType.fields.type}</FieldLabel>
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
                      isClearable={true}
                      disabled={isLoading}
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
            </Field>
            <Field>
              <FieldLabel>
                {dictionary.examType.fields.questionCount}
              </FieldLabel>
              <Controller
                control={form.control}
                name="questionCountRange"
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
                {dictionary.examType.fields.timeLimitMinutes}
              </FieldLabel>
              <Controller
                control={form.control}
                name="timeLimitMinutesRange"
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
              <FieldLabel>{dictionary.examType.fields.passingScore}</FieldLabel>
              <Controller
                control={form.control}
                name="passingScoreRange"
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
              <FieldLabel>{dictionary.examType.fields.maxAttempts}</FieldLabel>
              <Controller
                control={form.control}
                name="maxAttemptsRange"
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
                {dictionary.examType.fields.shuffleQuestions}
              </FieldLabel>
              <Controller
                control={form.control}
                name="shuffleQuestions"
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
              <FieldLabel>
                {dictionary.examType.fields.showAnswersImmediately}
              </FieldLabel>
              <Controller
                control={form.control}
                name="showAnswersImmediately"
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
              <FieldLabel>{dictionary.examType.fields.isActive}</FieldLabel>
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
              <FieldLabel>{dictionary.examType.fields.course}</FieldLabel>
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
              <FieldLabel>{dictionary.examType.fields.exam}</FieldLabel>
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
                {dictionary.examType.fields.createdByMember}
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
              <FieldLabel>{dictionary.examType.fields.createdAt}</FieldLabel>
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
                {dictionary.examType.fields.updatedByMember}
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
              <FieldLabel>{dictionary.examType.fields.updatedAt}</FieldLabel>
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
