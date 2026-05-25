import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { createLazyRoute } from '@tanstack/react-router';
import { LuBookOpen, LuListChecks } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import type { CourseBuilderForm } from '@/features/course/courseBuilderUtils';
import { useCourseCategoriesQuery } from '@/features/courseCategory/useCourseCategories';
import { useBuilder } from '../BuilderContext';
import {
  BuilderCard,
  LabeledInput,
  LabeledTextarea,
  TextItemList,
} from '../components/primitives';

export const builderGoalsLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/goals',
)({ component: GoalsScreen });

// "Plan" phase — the core course identity plus learning outcomes.
function GoalsScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const { form, editable, update, mutate } = useBuilder();
  // Active CourseCategory rows for the curated dropdown. The legacy
  // freeform `category` text input is gone — categoryId is the source of
  // truth, the mirror string is server-managed.
  const categoriesQuery = useCourseCategoriesQuery();
  const categoryOptions = categoriesQuery.data?.categories ?? [];

  return (
    <>
      <BuilderCard
        icon={<LuBookOpen className="size-5" />}
        title={builder.details}
        description={builder.detailsBody}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput
            label={dictionary.course.fields.title}
            value={form.title}
            disabled={!editable}
            testId="course-builder-title"
            onChange={(value) => update({ title: value })}
          />
          <LabeledInput
            label={dictionary.course.fields.subtitle}
            value={form.subtitle}
            disabled={!editable}
            onChange={(value) => update({ subtitle: value })}
          />
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              {dictionary.course.fields.categoryId}
            </span>
            <select
              data-testid="course-builder-category"
              value={form.categoryId}
              disabled={!editable}
              onChange={(event) => update({ categoryId: event.target.value })}
              className="border-input h-10 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
            >
              <option value="">{dictionary.shared.all}</option>
              {categoryOptions.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </label>
          <LabeledInput
            label={dictionary.course.fields.examType}
            value={form.examType}
            disabled={!editable}
            onChange={(value) => update({ examType: value })}
          />
          <LabeledInput
            label={builder.setup.difficulty}
            value={form.difficulty}
            disabled={!editable}
            onChange={(value) => update({ difficulty: value })}
          />
          <LabeledInput
            label={builder.setup.language}
            value={form.language}
            disabled={!editable}
            onChange={(value) => update({ language: value })}
          />
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              {builder.setup.visibility}
            </span>
            <select
              data-testid="course-builder-visibility"
              value={form.visibility}
              disabled={!editable}
              onChange={(event) =>
                update({
                  visibility: event.target
                    .value as CourseBuilderForm['visibility'],
                })
              }
              className="border-input h-10 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
            >
              {(['private', 'unlisted', 'public'] as const).map((value) => (
                <option key={value} value={value}>
                  {dictionaryEnumerator(builder.visibility, value)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-2 text-sm font-semibold dark:bg-white/8">
            <input
              type="checkbox"
              checked={form.certificateEnabled}
              disabled={!editable}
              onChange={(event) =>
                update({ certificateEnabled: event.target.checked })
              }
              className="size-4 accent-current"
            />
            <span>{builder.setup.certificateEnabled}</span>
          </label>
          <div className="md:col-span-2">
            <LabeledTextarea
              label={dictionary.course.fields.description}
              value={form.description}
              disabled={!editable}
              onChange={(value) => update({ description: value })}
            />
          </div>
        </div>
      </BuilderCard>

      <BuilderCard
        icon={<LuListChecks className="size-5" />}
        title={builder.setup.outcomes}
        description={builder.setup.outcomesBody}
      >
        <TextItemList
          items={form.outcomes}
          editable={editable}
          placeholder={builder.setup.outcomePlaceholder}
          addLabel={builder.actions.addOutcome}
          onChange={(outcomes) =>
            mutate((current) => ({ ...current, outcomes }))
          }
        />
        <div className="mt-5">
          <h3 className="text-sm font-extrabold">
            {builder.setup.requirements}
          </h3>
          <p className="text-muted-foreground mt-1 mb-2 text-xs">
            {builder.setup.requirementsBody}
          </p>
          <TextItemList
            items={form.requirements}
            editable={editable}
            placeholder={builder.setup.requirementPlaceholder}
            addLabel={builder.actions.addRequirement}
            onChange={(requirements) =>
              mutate((current) => ({ ...current, requirements }))
            }
          />
        </div>
      </BuilderCard>
    </>
  );
}
