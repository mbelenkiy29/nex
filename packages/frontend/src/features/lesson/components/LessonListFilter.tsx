import { LessonAutocompleteInput } from '@/features/lesson/components/LessonAutocompleteInput';
import { LessonAutocompleteMultipleInput } from '@/features/lesson/components/LessonAutocompleteMultipleInput';
import { ChapterAutocompleteInput } from '@/features/chapter/components/ChapterAutocompleteInput';
import { ChapterAutocompleteMultipleInput } from '@/features/chapter/components/ChapterAutocompleteMultipleInput';
import { StudyNoteAutocompleteInput } from '@/features/studyNote/components/StudyNoteAutocompleteInput';
import { StudyNoteAutocompleteMultipleInput } from '@/features/studyNote/components/StudyNoteAutocompleteMultipleInput';
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
import { lessonEnumerators } from '@project/backend/features/lesson/lessonEnumerators';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { studyNoteLabel } from '@project/backend/features/studyNote/studyNoteLabel';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { courseLabel } from '@project/backend/features/course/courseLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  title: '',
  lessonNumberRange: [],
  estimatedMinutesRange: [],
  xpRewardRange: [],
  workflowStatus: null,
  isPublished: undefined,
  course: null,
  chapter: null,
  createdByMember: null,
  createdAtRange: [],
  updatedByMember: null,
  updatedAtRange: [],
  archived: undefined,
};

export function LessonListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    title: {
      label: dictionary.lesson.fields.title,
    },
    lessonNumberRange: {
      label: dictionary.lesson.fields.lessonNumber,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    estimatedMinutesRange: {
      label: dictionary.lesson.fields.estimatedMinutes,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    xpRewardRange: {
      label: dictionary.lesson.fields.xpReward,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    workflowStatus: {
      label: dictionary.lesson.fields.workflowStatus,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.lesson.enumerators.workflowStatus,
      ),
    },
    isPublished: {
      label: dictionary.lesson.fields.isPublished,
      render: dataTableFilterRenders(locale, dictionary).boolean(),
    },
    course: {
      label: dictionary.lesson.fields.course,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        courseLabel,
      ),
    },
    chapter: {
      label: dictionary.lesson.fields.chapter,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        chapterLabel,
      ),
    },
    createdByMember: {
      label: dictionary.lesson.fields.createdByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    updatedByMember: {
      label: dictionary.lesson.fields.updatedByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    createdAtRange: {
      label: dictionary.lesson.fields.createdAt,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    updatedAtRange: {
      label: dictionary.lesson.fields.updatedAt,
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
              <FieldLabel htmlFor="title">
                {dictionary.lesson.fields.title}
              </FieldLabel>
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="title" disabled={isLoading} {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.lesson.fields.lessonNumber}</FieldLabel>
              <Controller
                control={form.control}
                name="lessonNumberRange"
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
                {dictionary.lesson.fields.estimatedMinutes}
              </FieldLabel>
              <Controller
                control={form.control}
                name="estimatedMinutesRange"
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
              <FieldLabel>{dictionary.lesson.fields.xpReward}</FieldLabel>
              <Controller
                control={form.control}
                name="xpRewardRange"
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
              <FieldLabel>{dictionary.lesson.fields.workflowStatus}</FieldLabel>
              <Controller
                control={form.control}
                name="workflowStatus"
                render={({ field, fieldState }) => (
                  <>
                    <SelectInput
                      options={Object.keys(
                        lessonEnumerators.workflowStatus,
                      ).map((value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.lesson.enumerators.workflowStatus,
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
                      labelMap={dictionary.lesson.enumerators.workflowStatus}
                    />
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.lesson.fields.isPublished}</FieldLabel>
              <Controller
                control={form.control}
                name="isPublished"
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
              <FieldLabel>{dictionary.lesson.fields.course}</FieldLabel>
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
              <FieldLabel>{dictionary.lesson.fields.chapter}</FieldLabel>
              <Controller
                control={form.control}
                name="chapter"
                render={({ field, fieldState }) => (
                  <>
                    <ChapterAutocompleteInput
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
                {dictionary.lesson.fields.createdByMember}
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
              <FieldLabel>{dictionary.lesson.fields.createdAt}</FieldLabel>
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
                {dictionary.lesson.fields.updatedByMember}
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
              <FieldLabel>{dictionary.lesson.fields.updatedAt}</FieldLabel>
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
