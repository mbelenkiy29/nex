import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useState, type ReactNode } from 'react';
import {
  LuArrowLeft,
  LuBookOpen,
  LuClipboardCheck,
  LuLayers,
  LuListChecks,
  LuTarget,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import {
  builderFormToPayload,
  courseBuilderTemplateToForm,
  type CourseBuilderTemplateKey,
} from '@/features/course/courseBuilderUtils';
import type { Course } from '@/features/course/courseTypes';
import { useCourseCategoriesQuery } from '@/features/courseCategory/useCourseCategories';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/shared/lib/apiClient';
import { LabeledInput } from '../components/primitives';

export const courseCreateLazyRoute = createLazyRoute('/creator/courses/new')({
  component: CourseCreatePage,
});

const templateKeys: CourseBuilderTemplateKey[] = [
  'examPrep',
  'skillCourse',
  'miniCourse',
];

function CourseCreatePage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const isVerifiedCreator = useAuthStore((state) => state.isVerifiedCreator);
  const builder = dictionary.course.builder;
  const createFlow = builder.createFlow;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categoriesQuery = useCourseCategoriesQuery();
  const categoryOptions = categoriesQuery.data?.categories ?? [];

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [examType, setExamType] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('');
  const [selectedTemplate, setSelectedTemplate] =
    useState<CourseBuilderTemplateKey>('examPrep');

  const draftForm = useMemo(
    () =>
      courseBuilderTemplateToForm(
        {
          title,
          subtitle,
          categoryId,
          examType,
          difficulty,
          language,
        },
        builder.templates[selectedTemplate],
      ),
    [
      builder.templates,
      categoryId,
      difficulty,
      examType,
      language,
      selectedTemplate,
      subtitle,
      title,
    ],
  );

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post('api/course-builder', {
          json: builderFormToPayload(draftForm),
        })
        .json<{ course: Course }>(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['courseBuilder'] });
      toast.success(builder.success.created);
      navigate({
        to: '/creator/courses/$courseId/edit/curriculum',
        params: { courseId: data.course.id },
      });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const templateIcon = {
    examPrep: <LuClipboardCheck className="size-4" />,
    skillCourse: <LuTarget className="size-4" />,
    miniCourse: <LuLayers className="size-4" />,
  } satisfies Record<CourseBuilderTemplateKey, ReactNode>;

  return (
    <div className="nex-dashboard-shell mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8">
      <Link
        to="/creator/courses"
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-semibold"
      >
        <LuArrowLeft className="size-3.5" />
        {builder.backToCourses}
      </Link>

      <section className="nex-glass-card nex-gradient-hero rounded-3xl p-6 lg:p-8">
        <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
          <LuBookOpen className="size-3.5" />
          {builder.newCourse}
        </Badge>
        <h1 className="text-nexexam-ink mt-4 max-w-3xl text-3xl font-extrabold tracking-normal md:text-4xl dark:text-white">
          {createFlow.title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
          {createFlow.body}
        </p>
      </section>

      {!isVerifiedCreator && (
        <Card className="border-nexexam-warning/30 bg-nexexam-warning/10 rounded-2xl">
          <CardContent className="p-4 text-sm font-semibold">
            {builder.verifyRequired}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
            <CardContent className="p-5 lg:p-6">
              <BuilderStepHeader
                icon={<LuTarget className="size-5" />}
                title={createFlow.stepDetails}
                body={createFlow.stepDetailsBody}
              />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <LabeledInput
                  label={dictionary.course.fields.title}
                  value={title}
                  disabled={!isVerifiedCreator || createMutation.isPending}
                  testId="course-builder-title"
                  onChange={setTitle}
                />
                <LabeledInput
                  label={dictionary.course.fields.subtitle}
                  value={subtitle}
                  disabled={!isVerifiedCreator || createMutation.isPending}
                  onChange={setSubtitle}
                />
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    {dictionary.course.fields.categoryId}
                  </span>
                  <select
                    value={categoryId}
                    disabled={!isVerifiedCreator || createMutation.isPending}
                    onChange={(event) => setCategoryId(event.target.value)}
                    className="border-input h-10 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
                  >
                    <option value="">{dictionary.shared.selectPlaceholder}</option>
                    {categoryOptions.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.name}
                      </option>
                    ))}
                  </select>
                </label>
                <LabeledInput
                  label={createFlow.examGoal}
                  value={examType}
                  disabled={!isVerifiedCreator || createMutation.isPending}
                  onChange={setExamType}
                />
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    {builder.setup.difficulty}
                  </span>
                  <select
                    value={difficulty}
                    disabled={!isVerifiedCreator || createMutation.isPending}
                    onChange={(event) => setDifficulty(event.target.value)}
                    className="border-input h-10 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
                  >
                    {(['easy', 'medium', 'hard'] as const).map((value) => (
                      <option key={value} value={value}>
                        {dictionaryEnumerator(builder.difficulty, value)}
                      </option>
                    ))}
                  </select>
                </label>
                <LabeledInput
                  label={builder.setup.language}
                  value={language}
                  disabled={!isVerifiedCreator || createMutation.isPending}
                  onChange={setLanguage}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
            <CardContent className="p-5 lg:p-6">
              <BuilderStepHeader
                icon={<LuLayers className="size-5" />}
                title={createFlow.stepTemplate}
                body={createFlow.stepTemplateBody}
              />
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {templateKeys.map((key) => {
                  const template = builder.templates[key];
                  const selected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!isVerifiedCreator || createMutation.isPending}
                      onClick={() => setSelectedTemplate(key)}
                      className={[
                        'rounded-2xl border bg-white/70 p-4 text-left transition dark:bg-white/8',
                        selected
                          ? 'border-primary shadow-[var(--nexexam-glow)]'
                          : 'border-white/70 hover:border-primary/50 dark:border-white/10',
                      ].join(' ')}
                    >
                      <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
                        {templateIcon[key]}
                      </span>
                      <div className="mt-3 flex items-center gap-2">
                        <h2 className="font-extrabold">{template.title}</h2>
                        <Badge variant="outline" className="rounded-lg">
                          {template.badge}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm leading-6">
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="nex-glass-card h-fit rounded-3xl border-white/70 dark:border-white/10 lg:sticky lg:top-24">
          <CardContent className="p-5 lg:p-6">
            <BuilderStepHeader
              icon={<LuListChecks className="size-5" />}
              title={createFlow.stepReview}
              body={createFlow.stepReviewBody}
            />
            <div className="mt-5 grid gap-3">
              <OutlineMetric
                label={dictionary.course.fields.modules}
                value={draftForm.modules.length}
              />
              <OutlineMetric
                label={dictionary.course.fields.lessons}
                value={draftForm.lessons.length}
              />
              <OutlineMetric
                label={dictionary.course.fields.quizzes}
                value={draftForm.quizzes.length}
              />
              <OutlineMetric
                label={builder.setup.outcomes}
                value={draftForm.outcomes.length}
              />
            </div>

            <div className="mt-5 grid gap-2">
              {draftForm.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-xl border bg-white/70 p-3 dark:bg-white/8"
                >
                  <div className="font-bold">{module.title}</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {
                      draftForm.lessons.filter(
                        (lesson) => lesson.moduleId === module.id,
                      ).length
                    }{' '}
                    {dictionary.course.fields.lessons}
                  </div>
                </div>
              ))}
            </div>

            <Button
              data-testid="course-builder-create-button"
              className="mt-5 h-11 w-full rounded-xl"
              disabled={
                !isVerifiedCreator ||
                createMutation.isPending ||
                !title.trim()
              }
              onClick={() => createMutation.mutate()}
            >
              {createFlow.createWithTemplate}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BuilderStepHeader({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-extrabold">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm leading-6">{body}</p>
      </div>
    </div>
  );
}

function OutlineMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white/70 px-3 py-2 dark:bg-white/8">
      <span className="text-muted-foreground text-sm font-semibold">
        {label}
      </span>
      <Input
        aria-label={label}
        readOnly
        value={value}
        className="h-8 w-14 rounded-lg bg-white/80 text-center font-bold dark:bg-white/10"
      />
    </div>
  );
}
