import { FileUploaded } from '@project/backend/features/file/fileSchemas';
import {
  COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
  COURSE_REVENUE_SHARE_TOTAL_BPS,
} from '@project/backend/features/course/courseRevenueShare';
import { storage } from '@project/backend/features/permissions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, Link } from '@tanstack/react-router';
import {
  LuArrowLeft,
  LuBookOpen,
  LuChevronDown,
  LuChevronUp,
  LuFileCheck,
  LuLayers3,
  LuPlus,
  LuReceipt,
  LuRefreshCw,
  LuSave,
  LuLoader,
  LuUserPlus,
} from 'react-icons/lu';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  Course,
  CourseAssignment,
  CourseAssignmentRubricScore,
  CourseAssignmentSubmission,
  CourseManageForm,
  CourseStatus,
} from '@/features/course/courseTypes';
import { useAdminCourseCategoriesQuery } from '@/features/courseCategory/useCourseCategories';
import { FilesList } from '@/features/file/components/FilesList';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { ImagesUploadDropzone } from '@/features/file/components/ImagesUploadDropzone';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export const platformCoursesLazyRoute = createLazyRoute('/admin/courses')({
  component: PlatformCoursesPage,
});

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clientId() {
  return crypto.randomUUID();
}

function blankForm(): CourseManageForm {
  return {
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    categoryId: '',
    examType: '',
    thumbnail: [],
    introVideoFiles: [],
    status: 'draft',
    accessType: 'free',
    priceCents: null,
    currency: 'USD',
    stripePriceId: '',
    lifetimeAccessEnabled: false,
    lifetimePriceCents: null,
    lifetimeStripePriceId: '',
    subscriptionPlanKey: '',
    creatorRevenueShareBps: COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
    nexVerified: false,
    creatorUserId: '',
    creatorMemberId: '',
    creatorOrganizationId: '',
    modules: [],
    lessons: [],
    assignments: [],
    blocks: [],
  };
}

function courseToForm(course: Course): CourseManageForm {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle || '',
    description: course.description || '',
    categoryId: course.categoryId || '',
    examType: course.examType || '',
    thumbnail: course.thumbnail || [],
    introVideoFiles: course.introVideoFiles || [],
    status: course.status,
    accessType: course.accessType,
    priceCents: course.priceCents ?? null,
    currency: course.currency || 'USD',
    stripePriceId: course.stripePriceId || '',
    lifetimeAccessEnabled: Boolean(course.lifetimeAccessEnabled),
    lifetimePriceCents: course.lifetimePriceCents ?? null,
    lifetimeStripePriceId: course.lifetimeStripePriceId || '',
    subscriptionPlanKey: course.subscriptionPlanKey || '',
    creatorRevenueShareBps:
      course.creatorRevenueShareBps ?? COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
    nexVerified: course.nexVerified,
    creatorUserId: course.creatorUserId || '',
    creatorMemberId: course.creatorMemberId || '',
    creatorOrganizationId: course.creatorOrganizationId || '',
    modules: course.modules.map((module) => ({
      ...module,
      clientId: module.id,
    })),
    lessons: course.lessons.map((rawLesson) => {
      const { content: _content, ...lesson } = rawLesson as NonNullable<
        Course['lessons']
      >[number] & {
        content?: string | null;
      };
      return {
        ...lesson,
        videoFiles: lesson.videoFiles || [],
        clientId: lesson.id,
      };
    }),
    assignments: course.assignments.map((assignment) => ({
      ...assignment,
      clientId: assignment.id,
    })),
    blocks: course.lessons.flatMap((lesson) => lesson.blocks || []),
  };
}

function nullableUuid(value?: string | null) {
  return value && uuidPattern.test(value) ? value : null;
}

function serializeForm(form: CourseManageForm) {
  return {
    title: form.title,
    slug: form.slug || null,
    subtitle: form.subtitle || null,
    description: form.description || null,
    categoryId: form.categoryId || null,
    examType: form.examType || null,
    thumbnail: form.thumbnail || [],
    introVideoFiles: form.introVideoFiles || [],
    status: form.status,
    accessType: form.accessType,
    priceCents: form.priceCents ?? null,
    currency: form.currency || 'USD',
    stripePriceId: form.stripePriceId || null,
    lifetimeAccessEnabled: Boolean(form.lifetimeAccessEnabled),
    lifetimePriceCents: form.lifetimePriceCents ?? null,
    lifetimeStripePriceId: form.lifetimeStripePriceId || null,
    subscriptionPlanKey: form.subscriptionPlanKey || null,
    creatorRevenueShareBps:
      form.creatorRevenueShareBps ?? COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
    nexVerified: form.nexVerified,
    creatorUserId: nullableUuid(form.creatorUserId),
    creatorMemberId: nullableUuid(form.creatorMemberId),
    creatorOrganizationId: nullableUuid(form.creatorOrganizationId),
    modules: form.modules.map(({ clientId: _clientId, ...module }, index) => ({
      ...module,
      id: nullableUuid(module.id),
      orderIndex: index,
    })),
    lessons: form.lessons.map((rawLesson, index) => {
      const {
        clientId: _clientId,
        content: _content,
        ...lesson
      } = rawLesson as CourseManageForm['lessons'][number] & {
        content?: string | null;
      };
      return {
        ...lesson,
        id: nullableUuid(lesson.id),
        moduleId: nullableUuid(lesson.moduleId),
        videoFiles: lesson.videoFiles || [],
        orderIndex: index,
      };
    }),
    assignments: form.assignments.map(
      ({ clientId: _clientId, ...assignment }, index) => ({
        ...assignment,
        id: nullableUuid(assignment.id),
        moduleId: nullableUuid(assignment.moduleId),
        lessonId: nullableUuid(assignment.lessonId),
        orderIndex: index,
      }),
    ),
    blocks: form.blocks.map((block) => {
      const id = nullableUuid(block.id);
      return {
        ...block,
        ...(id ? { id } : {}),
        lessonId: block.lessonId,
      };
    }),
  };
}

function submissionReviewDraft(
  assignment: CourseAssignment,
  submission: CourseAssignmentSubmission,
) {
  const existingScores = new Map(
    (submission.rubricScores || []).map((score) => [score.criterionId, score]),
  );

  return {
    status:
      submission.status === 'needsRevision'
        ? ('needsRevision' as const)
        : ('complete' as const),
    feedback: submission.feedback || '',
    rubricScores: (assignment.rubric || []).map((criterion) => ({
      criterionId: criterion.id,
      score: existingScores.get(criterion.id)?.score || 0,
      feedback: existingScores.get(criterion.id)?.feedback || '',
    })),
  };
}

export function PlatformCoursesPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseManageForm>(() => blankForm());
  const [enrollmentEmail, setEnrollmentEmail] = useState('');
  const [reviewDrafts, setReviewDrafts] = useState<
    Record<
      string,
      {
        status: 'complete' | 'needsRevision';
        feedback: string;
        rubricScores: CourseAssignmentRubricScore[];
      }
    >
  >({});
  const [courseReviewNotes, setCourseReviewNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CourseStatus>('all');

  const coursesQuery = useQuery({
    queryKey: ['platformAdmin', 'courses'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/platform-admin/courses', { signal })
        .json<{ count: number; courses: Course[] }>(),
  });

  const courseQuery = useQuery({
    queryKey: ['platformAdmin', 'courses', selectedCourseId],
    enabled: Boolean(selectedCourseId),
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/platform-admin/courses/${selectedCourseId}`, { signal })
        .json<{
          course: Course;
          linkedContent?: Record<string, number>;
        }>(),
  });
  const categoriesQuery = useAdminCourseCategoriesQuery();
  const categoryOptions = useMemo(
    () =>
      [
        ['', dictionary.shared.selectPlaceholder],
        ...(categoriesQuery.data?.categories || [])
          .filter(
            (category) => category.isActive || category.id === form.categoryId,
          )
          .map((category) => [category.id, category.name] as [string, string]),
      ] satisfies Array<[string, string]>,
    [
      categoriesQuery.data?.categories,
      dictionary.shared.selectPlaceholder,
      form.categoryId,
    ],
  );

  useEffect(() => {
    if (courseQuery.data?.course) {
      setForm(courseToForm(courseQuery.data.course));
    }
  }, [courseQuery.data?.course]);

  useEffect(() => {
    setCourseReviewNotes(courseQuery.data?.course?.reviewNotes || '');
  }, [courseQuery.data?.course?.id]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = serializeForm(form);
      if (form.id) {
        return apiClient
          .put(`api/platform-admin/courses/${form.id}`, { json: payload })
          .json<{ course: Course }>();
      }

      return apiClient
        .post('api/platform-admin/courses', { json: payload })
        .json<{ course: Course }>();
    },
    onSuccess: async (data) => {
      setSelectedCourseId(data.course.id);
      setForm(courseToForm(data.course));
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.success.courseSaved);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const enrollmentMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/platform-admin/courses/${form.id}/enrollments`, {
          json: { email: enrollmentEmail },
        })
        .json(),
    onSuccess: async () => {
      setEnrollmentEmail('');
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(dictionary.course.success.studentEnrolled);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      submission,
      draft,
    }: {
      submission: CourseAssignmentSubmission;
      draft: {
        status: 'complete' | 'needsRevision';
        feedback: string;
        rubricScores: CourseAssignmentRubricScore[];
      };
    }) =>
      apiClient
        .patch(`api/platform-admin/assignment-submissions/${submission.id}`, {
          json: draft,
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(dictionary.course.success.submissionReviewed);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const courseReviewMutation = useMutation({
    mutationFn: (decision: 'approve' | 'requestChanges') =>
      apiClient
        .post(`api/platform-admin/courses/${selectedCourseId}/review`, {
          json: { decision, reviewNotes: courseReviewNotes || null },
        })
        .json<{ course: Course }>(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.review.success);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const selectedCourse = courseQuery.data?.course;
  const courses = coursesQuery.data?.courses || [];
  const pendingReviewCount = courses.filter(
    (course) => course.status === 'inReview',
  ).length;
  const filteredCourses =
    statusFilter === 'all'
      ? courses
      : courses.filter((course) => course.status === statusFilter);
  const submissions = useMemo(
    () =>
      selectedCourse?.assignments.flatMap((assignment) =>
        (assignment.submissions || []).map((submission) => ({
          assignment,
          submission,
        })),
      ) || [],
    [selectedCourse],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.platformAdmin.title, '/admin'],
          [dictionary.course.admin.title],
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal">
            {dictionary.course.admin.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {dictionary.course.admin.description}
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          className="rounded-xl bg-white/70"
          render={<Link to="/admin" />}
        >
          <LuArrowLeft className="size-4" />
          {dictionary.platformAdmin.menu}
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="nex-glass-card h-fit rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="space-y-3 p-4">
            <Button
              data-testid="admin-course-new-button"
              className="h-10 w-full rounded-xl"
              onClick={() => {
                setSelectedCourseId(null);
                setForm(blankForm());
              }}
            >
              <LuPlus className="size-4" />
              {dictionary.course.admin.newCourse}
            </Button>
            <select
              data-testid="admin-course-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as 'all' | CourseStatus)
              }
              className="border-input h-9 w-full rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
            >
              <option value="all">{dictionary.course.review.filterAll}</option>
              {Object.entries(dictionary.course.enumerators.status).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {value === 'inReview' && pendingReviewCount
                      ? `${label} (${pendingReviewCount})`
                      : label}
                  </option>
                ),
              )}
            </select>
            <div className="space-y-2">
              {filteredCourses.map((course) => (
                <button
                  data-testid="admin-course-list-item"
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    selectedCourseId === course.id
                      ? 'border-nexexam-primary bg-nexexam-primary/10'
                      : 'hover:border-nexexam-primary-light/40 bg-white/70 dark:bg-white/8'
                  }`}
                >
                  <div className="line-clamp-2 font-bold">{course.title}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-lg">
                      {dictionaryEnumerator(
                        dictionary.course.enumerators.status,
                        course.status,
                      )}
                    </Badge>
                    <Badge variant="secondary" className="rounded-lg">
                      {course._count?.lessons || 0}{' '}
                      {dictionary.course.fields.lessons}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
            <CardContent className="grid gap-4 p-6 lg:grid-cols-2">
              <Field
                label={dictionary.course.fields.title}
                testId="admin-course-title-input"
                value={form.title}
                onChange={(value) => setForm({ ...form, title: value })}
              />
              <Field
                label={dictionary.course.fields.slug}
                value={form.slug || ''}
                onChange={(value) => setForm({ ...form, slug: value })}
              />
              <Field
                label={dictionary.course.fields.subtitle}
                value={form.subtitle || ''}
                onChange={(value) => setForm({ ...form, subtitle: value })}
              />
              <SelectField
                label={dictionary.course.fields.category}
                value={form.categoryId || ''}
                onChange={(value) => setForm({ ...form, categoryId: value })}
                options={categoryOptions}
              />
              <Field
                label={dictionary.course.fields.examType}
                testId="admin-course-exam-type-input"
                value={form.examType || ''}
                onChange={(value) => setForm({ ...form, examType: value })}
              />
              <SelectField
                label={dictionary.course.fields.status}
                testId="admin-course-status-select"
                value={form.status}
                onChange={(value) =>
                  setForm({ ...form, status: value as CourseStatus })
                }
                options={Object.entries(dictionary.course.enumerators.status)}
              />
              <SelectField
                label={dictionary.course.fields.accessType}
                testId="admin-course-access-select"
                value={form.accessType}
                onChange={(value) =>
                  setForm({ ...form, accessType: value as any })
                }
                options={Object.entries(
                  dictionary.course.enumerators.accessType,
                )}
              />
              <Field
                label={dictionary.course.fields.priceCents}
                testId="admin-course-price-cents-input"
                type="number"
                value={String(form.priceCents ?? '')}
                onChange={(value) =>
                  setForm({
                    ...form,
                    priceCents: value ? Number(value) : null,
                  })
                }
              />
              <Field
                label={dictionary.course.fields.currency}
                value={form.currency || ''}
                onChange={(value) =>
                  setForm({ ...form, currency: value.toUpperCase() })
                }
              />
              <Field
                label={dictionary.course.fields.stripePriceId}
                testId="admin-course-stripe-price-input"
                value={form.stripePriceId || ''}
                onChange={(value) => setForm({ ...form, stripePriceId: value })}
              />
              <label className="flex items-center justify-between rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                <span className="font-semibold">
                  {dictionary.course.fields.lifetimeAccessEnabled}
                </span>
                <Switch
                  checked={Boolean(form.lifetimeAccessEnabled)}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, lifetimeAccessEnabled: checked })
                  }
                />
              </label>
              <Field
                label={dictionary.course.fields.lifetimePriceCents}
                type="number"
                value={String(form.lifetimePriceCents ?? '')}
                onChange={(value) =>
                  setForm({
                    ...form,
                    lifetimePriceCents: value ? Number(value) : null,
                  })
                }
              />
              <Field
                label={dictionary.course.fields.lifetimeStripePriceId}
                value={form.lifetimeStripePriceId || ''}
                onChange={(value) =>
                  setForm({ ...form, lifetimeStripePriceId: value })
                }
              />
              <Field
                label={dictionary.course.fields.subscriptionPlanKey}
                testId="admin-course-subscription-plan-input"
                value={form.subscriptionPlanKey || ''}
                onChange={(value) =>
                  setForm({ ...form, subscriptionPlanKey: value })
                }
              />
              <Field
                label={dictionary.course.fields.creatorRevenueShareBps}
                testId="admin-course-revenue-share-input"
                type="number"
                value={String(
                  form.creatorRevenueShareBps ??
                    COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
                )}
                onChange={(value) =>
                  setForm({
                    ...form,
                    creatorRevenueShareBps: value ? Number(value) : 0,
                  })
                }
              />
              <div className="flex items-center rounded-2xl border bg-white/70 p-4 text-sm dark:bg-white/8">
                <LuReceipt className="text-primary mr-2 size-4" />
                <span>
                  {dictionary.course.fields.platformRevenueShare}:{' '}
                  {COURSE_REVENUE_SHARE_TOTAL_BPS -
                    (form.creatorRevenueShareBps ?? 0)}
                </span>
              </div>
              <label className="flex items-center justify-between rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                <span className="font-semibold">
                  {dictionary.course.fields.nexVerified}
                </span>
                <Switch
                  checked={form.nexVerified}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, nexVerified: checked })
                  }
                />
              </label>
              <div className="lg:col-span-2">
                <TextField
                  label={dictionary.course.fields.description}
                  value={form.description || ''}
                  onChange={(value) => setForm({ ...form, description: value })}
                />
              </div>
              <div className="lg:col-span-2">
                <span className="text-sm font-semibold">
                  {dictionary.course.fields.thumbnail}
                </span>
                <ImagesUploadDropzone
                  storage={storage.courseThumbnails}
                  value={form.thumbnail || []}
                  max={1}
                  onChange={(value) =>
                    setForm({ ...form, thumbnail: value || [] })
                  }
                />
              </div>
              <div className="lg:col-span-2">
                <span className="text-sm font-semibold">
                  {dictionary.course.fields.introVideoFiles}
                </span>
                <FilesUploadDropzone
                  testId="admin-course-intro-video-upload"
                  storage={storage.courseVideos}
                  value={form.introVideoFiles || []}
                  max={1}
                  onChange={(value) =>
                    setForm({ ...form, introVideoFiles: value || [] })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {courseQuery.data?.linkedContent && (
            <LinkedContentMap counts={courseQuery.data.linkedContent} />
          )}

          <ContentBuilder form={form} setForm={setForm} />

          {selectedCourse?.status === 'inReview' && (
            <Card className="border-nexexam-primary/30 bg-nexexam-primary/5 rounded-3xl">
              <CardContent className="space-y-4 p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold">
                  <LuFileCheck className="text-primary size-5" />
                  {dictionary.course.review.decision}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {dictionary.course.review.approveBody}
                </p>
                <div className="grid gap-2">
                  <span className="text-sm font-semibold">
                    {dictionary.course.review.notesLabel}
                  </span>
                  <Textarea
                    data-testid="admin-course-review-notes-input"
                    value={courseReviewNotes}
                    onChange={(event) =>
                      setCourseReviewNotes(event.target.value)
                    }
                    className="min-h-24 rounded-xl bg-white/80 dark:bg-white/8"
                  />
                  <span className="text-muted-foreground text-xs">
                    {dictionary.course.review.notesHint}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    data-testid="admin-course-approve-button"
                    className="h-10 rounded-xl"
                    disabled={courseReviewMutation.isPending}
                    onClick={() => courseReviewMutation.mutate('approve')}
                  >
                    {dictionary.course.review.approve}
                  </Button>
                  <Button
                    data-testid="admin-course-request-changes-button"
                    variant="outline"
                    className="h-10 rounded-xl bg-white/70 dark:bg-white/8"
                    disabled={
                      courseReviewMutation.isPending ||
                      !courseReviewNotes.trim()
                    }
                    onClick={() =>
                      courseReviewMutation.mutate('requestChanges')
                    }
                  >
                    {dictionary.course.review.requestChanges}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {form.id && (
            <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
              <CardContent className="space-y-4 p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold">
                  <LuUserPlus className="text-primary size-5" />
                  {dictionary.course.admin.enrollments}
                </h2>
                <div className="flex gap-2">
                  <Input
                    data-testid="admin-course-enrollment-email-input"
                    value={enrollmentEmail}
                    onChange={(event) => setEnrollmentEmail(event.target.value)}
                    placeholder={dictionary.platformAdmin.placeholders.email}
                    className="h-10 rounded-xl bg-white/80 dark:bg-white/8"
                  />
                  <Button
                    data-testid="admin-course-enrollment-submit-button"
                    className="h-10 rounded-xl"
                    disabled={enrollmentMutation.isPending || !enrollmentEmail}
                    onClick={() => enrollmentMutation.mutate()}
                  >
                    {dictionary.course.actions.manualEnroll}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {submissions.length > 0 && (
            <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
              <CardContent className="space-y-4 p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold">
                  <LuFileCheck className="text-primary size-5" />
                  {dictionary.course.admin.reviewSubmission}
                </h2>
                {submissions.map(({ assignment, submission }) => {
                  const draft =
                    reviewDrafts[submission.id] ||
                    submissionReviewDraft(assignment, submission);
                  const rubric = assignment.rubric || [];

                  return (
                    <div
                      key={submission.id}
                      className="grid gap-3 rounded-2xl border bg-white/72 p-4 dark:bg-white/8"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-bold">{assignment.title}</div>
                          <p className="text-muted-foreground text-sm">
                            {submission.studentUser?.name ||
                              submission.studentUser?.email ||
                              submission.userId}
                          </p>
                        </div>
                        <Badge variant="secondary" className="rounded-xl">
                          {dictionary.course.fields.attempt}{' '}
                          {submission.attemptNumber}
                        </Badge>
                      </div>
                      {submission.text && (
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                          {submission.text}
                        </p>
                      )}
                      {submission.files?.length ? (
                        <FilesList files={submission.files} />
                      ) : null}
                      <div className="mt-3 grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
                        <select
                          data-testid="admin-course-review-status-select"
                          value={draft.status}
                          onChange={(event) =>
                            setReviewDrafts((current) => ({
                              ...current,
                              [submission.id]: {
                                ...draft,
                                status: event.target.value as
                                  | 'complete'
                                  | 'needsRevision',
                              },
                            }))
                          }
                          className="border-input h-10 rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
                        >
                          {(['complete', 'needsRevision'] as const).map(
                            (status) => (
                              <option key={status} value={status}>
                                {dictionaryEnumerator(
                                  dictionary.course.enumerators
                                    .submissionStatus,
                                  status,
                                )}
                              </option>
                            ),
                          )}
                        </select>
                        <Input
                          data-testid="admin-course-review-feedback-input"
                          value={draft.feedback}
                          onChange={(event) =>
                            setReviewDrafts((current) => ({
                              ...current,
                              [submission.id]: {
                                ...draft,
                                feedback: event.target.value,
                              },
                            }))
                          }
                          placeholder={dictionary.course.fields.feedback}
                          className="h-10 rounded-xl bg-white/80 dark:bg-white/8"
                        />
                        <Button
                          data-testid="admin-course-review-submission-button"
                          className="h-10 rounded-xl"
                          disabled={reviewMutation.isPending}
                          onClick={() =>
                            reviewMutation.mutate({ submission, draft })
                          }
                        >
                          {dictionary.creatorApplication.actions.review}
                        </Button>
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
                                className="grid gap-2 rounded-xl border bg-white/70 p-3 md:grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)] dark:bg-white/8"
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
                                <label className="grid gap-1">
                                  <span className="text-muted-foreground text-xs font-semibold">
                                    {dictionary.course.fields.points} /{' '}
                                    {criterion.maxPoints}
                                  </span>
                                  <Input
                                    type="number"
                                    value={score.score}
                                    onChange={(event) =>
                                      setReviewDrafts((current) => ({
                                        ...current,
                                        [submission.id]: {
                                          ...draft,
                                          rubricScores: draft.rubricScores.map(
                                            (item) =>
                                              item.criterionId === criterion.id
                                                ? {
                                                    ...item,
                                                    score: Number(
                                                      event.target.value || 0,
                                                    ),
                                                  }
                                                : item,
                                          ),
                                        },
                                      }))
                                    }
                                    className="h-9 rounded-lg bg-white/80 dark:bg-white/8"
                                  />
                                </label>
                                <Input
                                  value={score.feedback || ''}
                                  onChange={(event) =>
                                    setReviewDrafts((current) => ({
                                      ...current,
                                      [submission.id]: {
                                        ...draft,
                                        rubricScores: draft.rubricScores.map(
                                          (item) =>
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
                                  placeholder={
                                    dictionary.course.fields.feedback
                                  }
                                  className="h-9 rounded-lg bg-white/80 dark:bg-white/8"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <div className="sticky bottom-4 flex justify-end">
            <Button
              data-testid="admin-course-save-button"
              className="h-11 rounded-xl shadow-[0_18px_40px_rgb(91_92_246/0.25)]"
              disabled={saveMutation.isPending || !form.title}
              onClick={() => saveMutation.mutate()}
            >
              <LuSave className="size-4" />
              {dictionary.course.actions.saveCourse}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentBuilder({
  form,
  setForm,
}: {
  form: CourseManageForm;
  setForm: (form: CourseManageForm) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const transcript = dictionary.course.videoTranscript;

  const updateArray = (
    key: 'modules' | 'lessons' | 'assignments',
    clientIdValue: string,
    patch: Record<string, any>,
  ) => {
    setForm({
      ...form,
      [key]: (form[key] as Array<{ clientId: string }>).map((item) =>
        item.clientId === clientIdValue ? { ...item, ...patch } : item,
      ),
    } as CourseManageForm);
  };
  const retryTranscript = useMutation({
    mutationFn: async (lesson: CourseManageForm['lessons'][number]) => {
      const response = await apiClient
        .post(
          `api/platform-admin/courses/${form.id}/lessons/${lesson.id}/video-transcript/retry`,
        )
        .json<{ lesson: CourseManageForm['lessons'][number] }>();
      return { clientId: lesson.clientId, lesson: response.lesson };
    },
    onSuccess: async ({ clientId, lesson }) => {
      updateArray('lessons', clientId, {
        videoTranscriptText: lesson.videoTranscriptText ?? null,
        videoTranscriptStatus: lesson.videoTranscriptStatus ?? 'queued',
        videoTranscriptSourceKey: lesson.videoTranscriptSourceKey ?? null,
        videoTranscriptError: lesson.videoTranscriptError ?? null,
        videoTranscriptGeneratedAt: lesson.videoTranscriptGeneratedAt ?? null,
      });
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(transcript.retryQueued);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const move = (
    key: 'modules' | 'lessons' | 'assignments',
    index: number,
    direction: -1 | 1,
  ) => {
    const next = [...(form[key] as any[])];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setForm({ ...form, [key]: next });
  };

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-6 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuLayers3 className="text-primary size-5" />
          {dictionary.course.admin.content}
        </h2>

        <BuilderSection
          title={dictionary.course.fields.modules}
          addButtonTestId="admin-course-add-module-button"
          onAdd={() =>
            setForm({
              ...form,
              modules: [
                ...form.modules,
                { clientId: clientId(), title: '', description: '' },
              ],
            })
          }
        >
          {form.modules.map((module, index) => (
            <div
              key={module.clientId}
              className="grid gap-3 rounded-2xl border bg-white/72 p-4 dark:bg-white/8"
            >
              <div className="flex justify-end gap-1">
                <MoveButtons
                  onUp={() => move('modules', index, -1)}
                  onDown={() => move('modules', index, 1)}
                />
              </div>
              <Field
                label={dictionary.course.fields.title}
                testId="admin-course-module-title-input"
                value={module.title || ''}
                onChange={(value) =>
                  updateArray('modules', module.clientId, { title: value })
                }
              />
              <TextField
                label={dictionary.course.fields.description}
                value={module.description || ''}
                onChange={(value) =>
                  updateArray('modules', module.clientId, {
                    description: value,
                  })
                }
              />
            </div>
          ))}
        </BuilderSection>

        <BuilderSection
          title={dictionary.course.fields.lessons}
          addButtonTestId="admin-course-add-lesson-button"
          onAdd={() =>
            setForm({
              ...form,
              lessons: [
                ...form.lessons,
                {
                  clientId: clientId(),
                  title: '',
                  moduleId: form.modules[0]?.id || '',
                  videoFiles: [],
                  videoTranscriptText: null,
                  videoTranscriptStatus: null,
                  videoTranscriptSourceKey: null,
                  videoTranscriptError: null,
                  videoTranscriptGeneratedAt: null,
                  isPreview: false,
                },
              ],
            })
          }
        >
          {form.lessons.map((lesson, index) => (
            <div
              key={lesson.clientId}
              className="grid gap-3 rounded-2xl border bg-white/72 p-4 dark:bg-white/8"
            >
              <div className="flex justify-end gap-1">
                <MoveButtons
                  onUp={() => move('lessons', index, -1)}
                  onDown={() => move('lessons', index, 1)}
                />
              </div>
              <Field
                label={dictionary.course.fields.title}
                testId="admin-course-lesson-title-input"
                value={lesson.title || ''}
                onChange={(value) =>
                  updateArray('lessons', lesson.clientId, { title: value })
                }
              />
              <ModuleSelect
                value={lesson.moduleId || ''}
                modules={form.modules}
                onChange={(value) =>
                  updateArray('lessons', lesson.clientId, { moduleId: value })
                }
              />
              <div>
                <span className="text-sm font-semibold">
                  {dictionary.course.fields.videoFiles}
                </span>
                <FilesUploadDropzone
                  testId="admin-course-lesson-video-upload"
                  storage={storage.courseVideos}
                  value={lesson.videoFiles || []}
                  onChange={(value) =>
                    updateArray('lessons', lesson.clientId, {
                      videoFiles: (value || []) as FileUploaded[],
                      videoTranscriptText: null,
                      videoTranscriptStatus: value?.length ? 'queued' : null,
                      videoTranscriptSourceKey: null,
                      videoTranscriptError: null,
                      videoTranscriptGeneratedAt: null,
                    })
                  }
                />
                {lesson.videoFiles?.length ? (
                  <div className="bg-nexexam-soft/70 mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs dark:bg-white/8">
                    <span className="font-semibold">
                      {transcript.statusLabel}:{' '}
                      {
                        transcript.status[
                          lesson.videoTranscriptStatus || 'notRequested'
                        ]
                      }
                    </span>
                    {lesson.videoTranscriptStatus === 'failed' &&
                      form.id &&
                      lesson.id && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg bg-white/80 text-xs dark:bg-white/10"
                          disabled={retryTranscript.isPending}
                          onClick={() => retryTranscript.mutate(lesson)}
                        >
                          {retryTranscript.isPending ? (
                            <LuLoader className="mr-1.5 size-3.5 animate-spin" />
                          ) : (
                            <LuRefreshCw className="mr-1.5 size-3.5" />
                          )}
                          {transcript.retry}
                        </Button>
                      )}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </BuilderSection>

        <BuilderSection
          title={dictionary.course.fields.assignments}
          addButtonTestId="admin-course-add-assignment-button"
          onAdd={() =>
            setForm({
              ...form,
              assignments: [
                ...form.assignments,
                {
                  clientId: clientId(),
                  title: '',
                  prompt: '',
                  moduleId: form.modules[0]?.id || '',
                  rubric: [],
                  allowResubmissions: true,
                  maxAttempts: null,
                },
              ],
            })
          }
        >
          {form.assignments.map((assignment, index) => (
            <div
              key={assignment.clientId}
              className="grid gap-3 rounded-2xl border bg-white/72 p-4 dark:bg-white/8"
            >
              <div className="flex justify-end gap-1">
                <MoveButtons
                  onUp={() => move('assignments', index, -1)}
                  onDown={() => move('assignments', index, 1)}
                />
              </div>
              <Field
                label={dictionary.course.fields.title}
                testId="admin-course-assignment-title-input"
                value={assignment.title || ''}
                onChange={(value) =>
                  updateArray('assignments', assignment.clientId, {
                    title: value,
                  })
                }
              />
              <ModuleSelect
                value={assignment.moduleId || ''}
                modules={form.modules}
                onChange={(value) =>
                  updateArray('assignments', assignment.clientId, {
                    moduleId: value,
                  })
                }
              />
              <TextField
                label={dictionary.course.fields.prompt}
                testId="admin-course-assignment-prompt-input"
                value={assignment.prompt || ''}
                onChange={(value) =>
                  updateArray('assignments', assignment.clientId, {
                    prompt: value,
                  })
                }
              />
            </div>
          ))}
        </BuilderSection>
      </CardContent>
    </Card>
  );
}

function BuilderSection({
  title,
  onAdd,
  children,
  addButtonTestId,
}: {
  title: string;
  onAdd: () => void;
  children: ReactNode;
  addButtonTestId?: string;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-extrabold">{title}</h3>
        <Button
          data-testid={addButtonTestId}
          variant="outline"
          className="h-9 rounded-xl bg-white/70"
          onClick={onAdd}
        >
          <LuPlus className="size-4" />
          {dictionary.shared.new}
        </Button>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function MoveButtons({
  onUp,
  onDown,
}: {
  onUp: () => void;
  onDown: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8"
        title={dictionary.course.actions.moveUp}
        onClick={onUp}
      >
        <LuChevronUp className="size-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8"
        title={dictionary.course.actions.moveDown}
        onClick={onDown}
      >
        <LuChevronDown className="size-4" />
      </Button>
    </>
  );
}

function ModuleSelect({
  value,
  modules,
  onChange,
}: {
  value: string;
  modules: CourseManageForm['modules'];
  onChange: (value: string) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">
        {dictionary.course.fields.modules}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-input h-10 rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
      >
        <option value="">{dictionary.shared.selectPlaceholder}</option>
        {modules.map((module) => (
          <option key={module.clientId} value={module.id || module.clientId}>
            {module.title || dictionary.course.fields.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function LinkedContentMap({ counts }: { counts: Record<string, number> }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const items: Array<[string, string, number | undefined]> = [
    ['exams', dictionary.exam.list.menu, counts.exams],
    ['chapters', dictionary.chapter.list.menu, counts.chapters],
    ['concepts', dictionary.concept.list.menu, counts.concepts],
    [
      'practice-questions',
      dictionary.practiceQuestion.list.menu,
      counts.practiceQuestions,
    ],
    ['study-notes', dictionary.studyNote.list.menu, counts.studyNotes],
    [
      'document-uploads',
      dictionary.documentUpload.list.menu,
      counts.documentUploads,
    ],
    ['exam-types', dictionary.examType.list.menu, counts.examTypes],
    ['exam-instances', dictionary.examInstance.list.menu, counts.examInstances],
  ];

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuBookOpen className="text-primary size-5" />
          {dictionary.course.admin.linkedContent}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([key, label, count]) => (
            <div
              key={label}
              data-testid={`admin-course-linked-count-${key}`}
              className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8"
            >
              <div className="text-muted-foreground text-sm">{label}</div>
              <div className="mt-1 text-2xl font-extrabold">{count || 0}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  testId,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testId?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <Input
        data-testid={testId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl bg-white/80 dark:bg-white/8"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
  testId?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <select
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-input h-10 rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testId?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <Textarea
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 rounded-xl bg-white/80 dark:bg-white/8"
      />
    </label>
  );
}
