import { createLazyRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import {
  LuChevronDown,
  LuChevronRight,
  LuClipboardCheck,
  LuFileText,
  LuListChecks,
  LuPlus,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { SortableList } from '@/features/course/components/SortableList';
import {
  insertIntoGroup,
  newId,
  courseBuilderTemplateToForm,
  reindexOrder,
  reorderWithinGroup,
  type BuilderAssignment,
  type BuilderLesson,
  type BuilderSetForm,
  type CourseBuilderForm,
} from '@/features/course/courseBuilderUtils';
import type {
  Course,
  CourseAssignment,
  CourseAssignmentRubricScore,
  CourseAssignmentSubmission,
} from '@/features/course/courseTypes';
import { FilesList } from '@/features/file/components/FilesList';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useBuilder } from '../BuilderContext';
import { LessonRow } from '../components/LessonRow';
import {
  AddButton,
  BuilderCard,
  IconButton,
  ItemGroup,
  NumberField,
  ToggleField,
} from '../components/primitives';
import { QuizCard } from '../components/QuizCard';

type BuilderModule = CourseBuilderForm['modules'][number];

export const builderCurriculumLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/curriculum',
)({ component: CurriculumScreen });

// Thin hover-to-insert affordance shown between curriculum rows.
function InsertAffordance({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="group/insert relative flex h-3 items-center justify-center">
      <span className="bg-primary/20 absolute inset-x-4 h-px opacity-0 transition group-hover/insert:opacity-100" />
      <button
        type="button"
        onClick={onClick}
        className="border-primary/30 text-primary relative z-10 flex items-center gap-1 rounded-full border bg-white px-2 py-0.5 text-[11px] font-bold opacity-0 transition group-hover/insert:opacity-100 dark:bg-neutral-900"
      >
        <LuPlus className="size-3" />
        {label}
      </button>
    </div>
  );
}

function AssignmentEditor({
  assignment,
  editable,
  setForm,
}: {
  assignment: BuilderAssignment;
  editable: boolean;
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;

  const patch = (changes: Partial<BuilderAssignment>) =>
    setForm((current) => ({
      ...current,
      assignments: current.assignments.map((item) =>
        item.id === assignment.id ? { ...item, ...changes } : item,
      ),
    }));
  const patchRubric = (
    criterionId: string,
    changes: Partial<BuilderAssignment['rubric'][number]>,
  ) =>
    patch({
      rubric: assignment.rubric.map((criterion) =>
        criterion.id === criterionId ? { ...criterion, ...changes } : criterion,
      ),
    });

  return (
    <div className="grid gap-3 rounded-xl border bg-white/80 p-3 dark:bg-white/10">
      <div className="flex items-center gap-2">
        <Input
          value={assignment.title}
          disabled={!editable}
          placeholder={builder.assignmentLabel}
          onChange={(event) => patch({ title: event.target.value })}
          className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
        />
        {editable && (
          <IconButton
            label={builder.actions.remove}
            onClick={() =>
              setForm((current) => ({
                ...current,
                assignments: current.assignments.filter(
                  (item) => item.id !== assignment.id,
                ),
              }))
            }
          />
        )}
      </div>
      <Textarea
        value={assignment.prompt}
        disabled={!editable}
        placeholder={dictionary.course.fields.prompt}
        onChange={(event) => patch({ prompt: event.target.value })}
        className="min-h-20 rounded-lg bg-white/80 dark:bg-white/10"
      />
      <div className="grid gap-3 md:grid-cols-3">
        <NumberField
          label={dictionary.course.fields.dueDaysAfterEnroll}
          value={assignment.dueDaysAfterEnroll}
          disabled={!editable}
          onChange={(value) => patch({ dueDaysAfterEnroll: value })}
        />
        <ToggleField
          label={dictionary.course.fields.allowResubmissions}
          checked={assignment.allowResubmissions}
          disabled={!editable}
          onChange={(value) => patch({ allowResubmissions: value })}
        />
        <NumberField
          label={dictionary.course.fields.maxAttempts}
          value={assignment.maxAttempts}
          disabled={!editable || !assignment.allowResubmissions}
          onChange={(value) => patch({ maxAttempts: value })}
        />
      </div>
      <ItemGroup label={dictionary.course.fields.rubric}>
        {assignment.rubric.length ? (
          assignment.rubric.map((criterion) => (
            <div
              key={criterion.id}
              className="grid gap-2 rounded-lg border bg-white/80 p-3 dark:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <Input
                  value={criterion.title}
                  disabled={!editable}
                  placeholder={dictionary.course.builder.rubricCriterionLabel}
                  onChange={(event) =>
                    patchRubric(criterion.id, { title: event.target.value })
                  }
                  className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
                />
                <div className="w-28">
                  <NumberField
                    label={dictionary.course.fields.points}
                    value={criterion.maxPoints}
                    disabled={!editable}
                    onChange={(value) =>
                      patchRubric(criterion.id, { maxPoints: value || 1 })
                    }
                  />
                </div>
                {editable && (
                  <IconButton
                    label={builder.actions.remove}
                    onClick={() =>
                      patch({
                        rubric: reindexOrder(
                          assignment.rubric.filter(
                            (item) => item.id !== criterion.id,
                          ),
                        ),
                      })
                    }
                  />
                )}
              </div>
              <Textarea
                value={criterion.description || ''}
                disabled={!editable}
                placeholder={dictionary.course.fields.rubricDescription}
                onChange={(event) =>
                  patchRubric(criterion.id, {
                    description: event.target.value,
                  })
                }
                className="min-h-16 rounded-lg bg-white/80 dark:bg-white/10"
              />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground rounded-lg border bg-white/70 p-3 text-sm dark:bg-white/8">
            {dictionary.course.builder.noRubricCriteria}
          </p>
        )}
        {editable && (
          <AddButton
            label={dictionary.course.builder.actions.addRubricCriterion}
            onClick={() =>
              patch({
                rubric: [
                  ...assignment.rubric,
                  {
                    id: newId(),
                    title: '',
                    description: '',
                    maxPoints: 10,
                    orderIndex: assignment.rubric.length,
                  },
                ],
              })
            }
          />
        )}
      </ItemGroup>
    </div>
  );
}

function CountChip({ icon, value }: { icon: ReactNode; value: number }) {
  return (
    <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
      {icon}
      {value}
    </span>
  );
}

function ModuleRow({
  module,
  handle,
  editable,
  form,
  setForm,
  expanded,
  onToggle,
  expandedLessons,
  onToggleLesson,
  onExpandLesson,
  courseId,
}: {
  module: BuilderModule;
  handle: ReactNode;
  editable: boolean;
  form: CourseBuilderForm;
  setForm: BuilderSetForm;
  expanded: boolean;
  onToggle: () => void;
  expandedLessons: Set<string>;
  onToggleLesson: (id: string) => void;
  onExpandLesson: (id: string) => void;
  courseId?: string | null;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;

  const lessons = form.lessons.filter(
    (lesson) => lesson.moduleId === module.id,
  );
  const quizzes = form.quizzes.filter((quiz) => quiz.moduleId === module.id);
  const assignments = form.assignments.filter(
    (item) => item.moduleId === module.id,
  );

  const addLesson = (position: number) => {
    const id = newId();
    setForm((current) => ({
      ...current,
      lessons: insertIntoGroup(
        current.lessons,
        (lesson) => lesson.moduleId === module.id,
        {
          id,
          moduleId: module.id,
          title: '',
          description: '',
          videoFiles: [],
          videoUrl: '',
          resourceFiles: [],
          videoTranscriptText: null,
          videoTranscriptStatus: null,
          videoTranscriptSourceKey: null,
          videoTranscriptError: null,
          videoTranscriptGeneratedAt: null,
          videoDurationSeconds: null,
          isPreview: false,
          isHidden: false,
          orderIndex: position,
        },
        position,
      ),
    }));
    onExpandLesson(id);
  };

  const removeModule = () =>
    setForm((current) => ({
      ...current,
      modules: reindexOrder(
        current.modules.filter((item) => item.id !== module.id),
      ),
      lessons: current.lessons.filter((item) => item.moduleId !== module.id),
      quizzes: current.quizzes.filter((item) => item.moduleId !== module.id),
      assignments: current.assignments.filter(
        (item) => item.moduleId !== module.id,
      ),
      quizQuestions: current.quizQuestions.filter((question) =>
        current.quizzes.some(
          (quiz) => quiz.id === question.quizId && quiz.moduleId !== module.id,
        ),
      ),
      blocks: current.blocks.filter(
        (block) =>
          !current.lessons.some(
            (lesson) =>
              lesson.id === block.lessonId && lesson.moduleId === module.id,
          ),
      ),
    }));

  return (
    <div className="rounded-2xl border bg-white/70 dark:bg-white/8">
      <div className="flex items-center gap-2 p-3">
        {editable && handle}
        <button
          type="button"
          onClick={onToggle}
          aria-label={module.title || builder.untitledModule}
          className="text-muted-foreground hover:text-foreground grid size-7 shrink-0 place-items-center rounded-md"
        >
          {expanded ? (
            <LuChevronDown className="size-4" />
          ) : (
            <LuChevronRight className="size-4" />
          )}
        </button>
        <Input
          data-testid="course-builder-module-title"
          value={module.title}
          disabled={!editable}
          placeholder={builder.moduleLabel}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              modules: current.modules.map((item) =>
                item.id === module.id
                  ? { ...item, title: event.target.value }
                  : item,
              ),
            }))
          }
          className="h-9 rounded-lg bg-white/80 font-semibold dark:bg-white/10"
        />
        <div className="hidden items-center gap-3 sm:flex">
          <CountChip
            icon={<LuFileText className="size-3.5" />}
            value={lessons.length}
          />
          <CountChip
            icon={<LuListChecks className="size-3.5" />}
            value={quizzes.length}
          />
          <CountChip
            icon={<LuClipboardCheck className="size-3.5" />}
            value={assignments.length}
          />
        </div>
        {editable && (
          <IconButton onClick={removeModule} label={builder.actions.remove} />
        )}
      </div>

      {expanded && (
        <div className="grid gap-4 border-t border-white/60 p-3 pl-4 dark:border-white/10">
          <ItemGroup label={dictionary.course.fields.lessons}>
            <SortableList
              items={lessons}
              disabled={!editable}
              onReorder={(reordered) =>
                setForm((current) => ({
                  ...current,
                  lessons: reorderWithinGroup(
                    current.lessons,
                    (lesson) => lesson.moduleId === module.id,
                    reordered,
                  ),
                }))
              }
              renderGap={
                editable
                  ? (afterId) => {
                      const index =
                        afterId === null
                          ? 0
                          : lessons.findIndex(
                              (lesson) => lesson.id === afterId,
                            ) + 1;
                      return (
                        <InsertAffordance
                          label={builder.actions.addLesson}
                          onClick={() => addLesson(index)}
                        />
                      );
                    }
                  : undefined
              }
              renderItem={(lesson: BuilderLesson, lessonHandle) => (
                <LessonRow
                  lesson={lesson}
                  handle={lessonHandle}
                  editable={editable}
                  form={form}
                  setForm={setForm}
                  expanded={expandedLessons.has(lesson.id)}
                  onToggle={() => onToggleLesson(lesson.id)}
                  courseId={courseId}
                />
              )}
            />
            {editable && (
              <AddButton
                testId="course-builder-add-lesson"
                label={builder.actions.addLesson}
                onClick={() => addLesson(lessons.length)}
              />
            )}
          </ItemGroup>

          <ItemGroup label={dictionary.course.fields.quizzes}>
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                editable={editable}
                links={form.quizQuestions.filter(
                  (link) => link.quizId === quiz.id,
                )}
                questions={form.questions}
                setForm={setForm}
              />
            ))}
            {editable && (
              <AddButton
                testId="course-builder-add-quiz"
                label={builder.actions.addQuiz}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    quizzes: [
                      ...current.quizzes,
                      {
                        id: newId(),
                        moduleId: module.id,
                        lessonId: null,
                        title: '',
                        description: '',
                        passingScore: null,
                        timeLimitMinutes: null,
                        randomizeQuestions: false,
                        randomizeAnswers: false,
                        showExplanations: true,
                        allowRetries: true,
                        maxAttempts: null,
                        orderIndex: current.quizzes.length,
                      },
                    ],
                  }))
                }
              />
            )}
          </ItemGroup>

          <ItemGroup label={dictionary.course.learn.assignments}>
            {assignments.map((assignment) => (
              <AssignmentEditor
                key={assignment.id}
                assignment={assignment}
                editable={editable}
                setForm={setForm}
              />
            ))}
            {editable && (
              <AddButton
                testId="course-builder-add-assignment"
                label={builder.actions.addAssignment}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    assignments: [
                      ...current.assignments,
                      {
                        id: newId(),
                        moduleId: module.id,
                        lessonId: null,
                        title: '',
                        prompt: '',
                        dueDaysAfterEnroll: null,
                        rubric: [],
                        allowResubmissions: true,
                        maxAttempts: null,
                        orderIndex: current.assignments.length,
                      },
                    ],
                  }))
                }
              />
            )}
          </ItemGroup>
        </div>
      )}
    </div>
  );
}

type ReviewDraft = {
  status: 'complete' | 'needsRevision';
  feedback: string;
  rubricScores: CourseAssignmentRubricScore[];
};

function submissionReviewDraft(
  assignment: CourseAssignment,
  submission: CourseAssignmentSubmission,
): ReviewDraft {
  const existingScores = new Map(
    (submission.rubricScores || []).map((score) => [score.criterionId, score]),
  );

  return {
    status:
      submission.status === 'needsRevision' ? 'needsRevision' : 'complete',
    feedback: submission.feedback || '',
    rubricScores: (assignment.rubric || []).map((criterion) => ({
      criterionId: criterion.id,
      score: existingScores.get(criterion.id)?.score || 0,
      feedback: existingScores.get(criterion.id)?.feedback || '',
    })),
  };
}

function latestSubmissionRows(course: Course) {
  return course.assignments.flatMap((assignment) => {
    const seen = new Set<string>();
    return (assignment.submissions || [])
      .filter((submission) => {
        const key = `${assignment.id}:${submission.userId}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .map((submission) => ({
        assignment,
        submission,
        attempts: (assignment.submissions || []).filter(
          (item) => item.userId === submission.userId,
        ),
      }));
  });
}

function CreatorSubmissionReviewPanel({
  course,
  courseId,
}: {
  course: Course | null;
  courseId: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>({});
  const rows = course ? latestSubmissionRows(course) : [];

  const reviewMutation = useMutation({
    mutationFn: ({
      submission,
      draft,
    }: {
      submission: CourseAssignmentSubmission;
      draft: ReviewDraft;
    }) =>
      apiClient
        .patch(
          `api/course-builder/${courseId}/assignment-submissions/${submission.id}/review`,
          { json: draft },
        )
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courseBuilder'] });
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      await queryClient.invalidateQueries({ queryKey: ['studentExperience'] });
      toast.success(dictionary.course.success.submissionReviewed);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  if (!rows.length) {
    return null;
  }

  return (
    <BuilderCard
      icon={<LuClipboardCheck className="size-5" />}
      title={dictionary.course.builder.submissionsTitle}
      description={dictionary.course.builder.submissionsBody}
    >
      {rows.map(({ assignment, submission, attempts }) => {
        const draft =
          drafts[submission.id] ||
          submissionReviewDraft(assignment, submission);
        const rubric = assignment.rubric || [];

        return (
          <div
            key={submission.id}
            className="grid gap-3 rounded-xl border bg-white/80 p-4 dark:bg-white/10"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold">{assignment.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {submission.studentUser?.name ||
                    submission.studentUser?.email ||
                    submission.userId}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-xl">
                  {dictionaryEnumerator(
                    dictionary.course.enumerators.submissionStatus,
                    submission.status,
                  )}
                </Badge>
                <Badge variant="secondary" className="rounded-xl">
                  {dictionary.course.fields.attempt} {submission.attemptNumber}
                </Badge>
              </div>
            </div>
            {submission.text && (
              <p className="text-muted-foreground rounded-lg border bg-white/70 p-3 text-sm whitespace-pre-wrap dark:bg-white/8">
                {submission.text}
              </p>
            )}
            {submission.files?.length ? (
              <FilesList files={submission.files} />
            ) : null}
            {attempts.length > 1 && (
              <p className="text-muted-foreground text-xs">
                {dictionary.course.fields.attempts}: {attempts.length}
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-xs font-semibold">
                  {dictionary.course.fields.status}
                </span>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [submission.id]: {
                        ...draft,
                        status: event.target.value as ReviewDraft['status'],
                      },
                    }))
                  }
                  className="border-input h-10 rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
                >
                  {(['complete', 'needsRevision'] as const).map((status) => (
                    <option key={status} value={status}>
                      {dictionaryEnumerator(
                        dictionary.course.enumerators.submissionStatus,
                        status,
                      )}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-xs font-semibold">
                  {dictionary.course.fields.feedback}
                </span>
                <Input
                  value={draft.feedback}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [submission.id]: {
                        ...draft,
                        feedback: event.target.value,
                      },
                    }))
                  }
                  className="h-10 rounded-xl bg-white/80 dark:bg-white/8"
                />
              </label>
            </div>
            {rubric.length > 0 && (
              <div className="grid gap-2">
                <span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                  {dictionary.course.fields.rubric}
                </span>
                {rubric.map((criterion) => {
                  const score = draft.rubricScores.find(
                    (item) => item.criterionId === criterion.id,
                  ) || {
                    criterionId: criterion.id,
                    score: 0,
                    feedback: '',
                  };

                  return (
                    <div
                      key={criterion.id}
                      className="grid gap-2 rounded-lg border bg-white/70 p-3 md:grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)] dark:bg-white/8"
                    >
                      <div>
                        <div className="text-sm font-semibold">
                          {criterion.title}
                        </div>
                        {criterion.description && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {criterion.description}
                          </p>
                        )}
                      </div>
                      <NumberField
                        label={`${dictionary.course.fields.points} / ${criterion.maxPoints}`}
                        value={score.score}
                        onChange={(value) =>
                          setDrafts((current) => ({
                            ...current,
                            [submission.id]: {
                              ...draft,
                              rubricScores: draft.rubricScores.map((item) =>
                                item.criterionId === criterion.id
                                  ? { ...item, score: value || 0 }
                                  : item,
                              ),
                            },
                          }))
                        }
                      />
                      <Input
                        value={score.feedback || ''}
                        placeholder={dictionary.course.fields.feedback}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [submission.id]: {
                              ...draft,
                              rubricScores: draft.rubricScores.map((item) =>
                                item.criterionId === criterion.id
                                  ? {
                                      ...item,
                                      feedback: event.target.value,
                                    }
                                  : item,
                              ),
                            },
                          }))
                        }
                        className="h-9 rounded-lg bg-white/80 dark:bg-white/8"
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              type="button"
              className="h-10 justify-self-start rounded-xl"
              disabled={reviewMutation.isPending}
              onClick={() => reviewMutation.mutate({ submission, draft })}
            >
              {dictionary.course.builder.actions.saveFeedback}
            </Button>
          </div>
        );
      })}
    </BuilderCard>
  );
}

// "Content" phase — the Udemy-style curriculum: collapsed section / lecture
// rows, expand-to-edit, and hover-to-insert between rows.
function CurriculumScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const { courseId, course, form, editable, mutate } = useBuilder();

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(),
  );

  const toggleSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
  ) =>
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const expandInSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
  ) =>
    setter((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

  const addModule = (position: number) => {
    const id = newId();
    mutate((current) => ({
      ...current,
      modules: reindexOrder(
        insertIntoGroup(
          current.modules,
          () => true,
          { id, title: '', description: '', orderIndex: position },
          position,
        ),
      ),
    }));
    expandInSet(setExpandedModules, id);
  };

  const applyMiniCourseTemplate = () => {
    const templateForm = courseBuilderTemplateToForm(
      {
        title: form.title,
        subtitle: form.subtitle,
        categoryId: form.categoryId,
        examType: form.examType,
        difficulty: form.difficulty,
        language: form.language,
      },
      builder.templates.miniCourse,
    );

    mutate((current) => ({
      ...current,
      modules: templateForm.modules,
      lessons: templateForm.lessons,
      assignments: templateForm.assignments,
      quizzes: templateForm.quizzes,
      outcomes: current.outcomes.length
        ? current.outcomes
        : templateForm.outcomes,
      requirements: current.requirements.length
        ? current.requirements
        : templateForm.requirements,
    }));
    setExpandedModules(
      new Set(templateForm.modules.map((module) => module.id)),
    );
  };

  return (
    <>
      <BuilderCard
        icon={<LuListChecks className="size-5" />}
        title={builder.curriculum}
        description={builder.curriculumBody}
        actions={
          form.modules.length > 0 ? (
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg bg-white/70 text-xs dark:bg-white/8"
                onClick={() =>
                  setExpandedModules(new Set(form.modules.map((m) => m.id)))
                }
              >
                {builder.curriculumExpandAll}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg bg-white/70 text-xs dark:bg-white/8"
                onClick={() => setExpandedModules(new Set())}
              >
                {builder.curriculumCollapseAll}
              </Button>
            </div>
          ) : undefined
        }
      >
        {form.modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white/60 p-5 dark:bg-white/8">
            <p className="text-muted-foreground text-sm">{builder.noModules}</p>
            {editable && (
              <div className="mt-4 flex flex-wrap gap-2">
                <AddButton
                  testId="course-builder-add-module"
                  label={builder.actions.addModule}
                  onClick={() => addModule(0)}
                />
                <AddButton
                  label={builder.actions.applyMiniTemplate}
                  onClick={applyMiniCourseTemplate}
                />
              </div>
            )}
          </div>
        ) : (
          <SortableList
            items={form.modules}
            disabled={!editable}
            onReorder={(modules) =>
              mutate((current) => ({
                ...current,
                modules: reindexOrder(modules),
              }))
            }
            renderGap={
              editable
                ? (afterId) => {
                    const index =
                      afterId === null
                        ? 0
                        : form.modules.findIndex((m) => m.id === afterId) + 1;
                    return (
                      <InsertAffordance
                        label={builder.actions.addModule}
                        onClick={() => addModule(index)}
                      />
                    );
                  }
                : undefined
            }
            renderItem={(module, handle) => (
              <ModuleRow
                module={module}
                handle={handle}
                editable={editable}
                form={form}
                setForm={mutate}
                expanded={expandedModules.has(module.id)}
                onToggle={() => toggleSet(setExpandedModules, module.id)}
                expandedLessons={expandedLessons}
                onToggleLesson={(id) => toggleSet(setExpandedLessons, id)}
                onExpandLesson={(id) => expandInSet(setExpandedLessons, id)}
                courseId={courseId}
              />
            )}
          />
        )}

        {editable && form.modules.length > 0 && (
          <AddButton
            testId="course-builder-add-module"
            label={builder.actions.addModule}
            onClick={() => addModule(form.modules.length)}
          />
        )}
      </BuilderCard>
      <CreatorSubmissionReviewPanel course={course} courseId={courseId} />
    </>
  );
}
