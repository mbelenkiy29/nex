import { ChapterAutocompleteInput } from '@/features/chapter/components/ChapterAutocompleteInput';
import { ChapterAutocompleteMultipleInput } from '@/features/chapter/components/ChapterAutocompleteMultipleInput';
import { ExamAutocompleteInput } from '@/features/exam/components/ExamAutocompleteInput';
import { ExamAutocompleteMultipleInput } from '@/features/exam/components/ExamAutocompleteMultipleInput';
import { LessonAutocompleteInput } from '@/features/lesson/components/LessonAutocompleteInput';
import { LessonAutocompleteMultipleInput } from '@/features/lesson/components/LessonAutocompleteMultipleInput';
import { PracticeQuestionAutocompleteInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteInput';
import { PracticeQuestionAutocompleteMultipleInput } from '@/features/practiceQuestion/components/PracticeQuestionAutocompleteMultipleInput';
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
import { chapterEnumerators } from '@project/backend/features/chapter/chapterEnumerators';
import { chapterLabel } from '@project/backend/features/chapter/chapterLabel';
import { examLabel } from '@project/backend/features/exam/examLabel';
import { lessonLabel } from '@project/backend/features/lesson/lessonLabel';
import { practiceQuestionLabel } from '@project/backend/features/practiceQuestion/practiceQuestionLabel';
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
  chapterNumberRange: [],
  xpRewardRange: [],
  orderIndexRange: [],
  workflowStatus: null,
  isPublished: undefined,
  course: null,
  exam: null,
  createdByMember: null,
  createdAtRange: [],
  updatedByMember: null,
  updatedAtRange: [],
  archived: undefined,
};

export function ChapterListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    title: {
      label: dictionary.chapter.fields.title,
    },
    chapterNumberRange: {
      label: dictionary.chapter.fields.chapterNumber,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    xpRewardRange: {
      label: dictionary.chapter.fields.xpReward,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    orderIndexRange: {
      label: dictionary.chapter.fields.orderIndex,
      render: dataTableFilterRenders(locale, dictionary).range(),
    },
    workflowStatus: {
      label: dictionary.chapter.fields.workflowStatus,
      render: dataTableFilterRenders(locale, dictionary).enumerator(
        dictionary.chapter.enumerators.workflowStatus,
      ),
    },
    isPublished: {
      label: dictionary.chapter.fields.isPublished,
      render: dataTableFilterRenders(locale, dictionary).boolean(),
    },
    course: {
      label: dictionary.chapter.fields.course,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        courseLabel,
      ),
    },
    exam: {
      label: dictionary.chapter.fields.exam,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        examLabel,
      ),
    },
    createdByMember: {
      label: dictionary.chapter.fields.createdByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    updatedByMember: {
      label: dictionary.chapter.fields.updatedByMember,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    createdAtRange: {
      label: dictionary.chapter.fields.createdAt,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    updatedAtRange: {
      label: dictionary.chapter.fields.updatedAt,
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
                {dictionary.chapter.fields.title}
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
              <FieldLabel>{dictionary.chapter.fields.chapterNumber}</FieldLabel>
              <Controller
                control={form.control}
                name="chapterNumberRange"
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
              <FieldLabel>{dictionary.chapter.fields.xpReward}</FieldLabel>
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
              <FieldLabel>{dictionary.chapter.fields.orderIndex}</FieldLabel>
              <Controller
                control={form.control}
                name="orderIndexRange"
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
                {dictionary.chapter.fields.workflowStatus}
              </FieldLabel>
              <Controller
                control={form.control}
                name="workflowStatus"
                render={({ field, fieldState }) => (
                  <>
                    <SelectInput
                      options={Object.keys(
                        chapterEnumerators.workflowStatus,
                      ).map((value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.chapter.enumerators.workflowStatus,
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
                      labelMap={dictionary.chapter.enumerators.workflowStatus}
                    />
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{dictionary.chapter.fields.isPublished}</FieldLabel>
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
              <FieldLabel>{dictionary.chapter.fields.course}</FieldLabel>
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
              <FieldLabel>{dictionary.chapter.fields.exam}</FieldLabel>
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
                {dictionary.chapter.fields.createdByMember}
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
              <FieldLabel>{dictionary.chapter.fields.createdAt}</FieldLabel>
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
                {dictionary.chapter.fields.updatedByMember}
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
              <FieldLabel>{dictionary.chapter.fields.updatedAt}</FieldLabel>
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
