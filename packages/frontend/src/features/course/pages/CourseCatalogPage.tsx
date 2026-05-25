import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  LuBookOpenCheck,
  LuClock,
  LuFilter,
  LuGitCompare,
  LuGraduationCap,
  LuHeart,
  LuLanguages,
  LuSearch,
  LuShieldCheck,
  LuSparkles,
  LuStar,
  LuUsers,
} from 'react-icons/lu';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Course, CourseBundle } from '@/features/course/courseTypes';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export const courseCatalogLazyRoute = createLazyRoute('/course')({
  component: CourseCatalogPage,
});

// Public shape returned alongside the catalog payload. Kept locally so the
// catalog page does not have to import the courseCategory feature module
// during the bundle split for this route.
interface CatalogCategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  displayOrder: number;
}

type SortKey =
  | 'trending'
  | 'topRated'
  | 'newest'
  | 'mostPopular'
  | 'priceAsc'
  | 'priceDesc'
  | 'durationAsc';
type PriceBucket = 'any' | 'free' | 'paid';
type MinRating = 0 | 4 | 4.5;
type DurationBucket = 'any' | 'short' | 'medium' | 'long';

interface CatalogFacets {
  examTypes: string[];
  difficulties: string[];
  languages: string[];
  durationBuckets: Array<'short' | 'medium' | 'long'>;
  priceBuckets: string[];
}

const PAGE_SIZE = 24;

export function CourseCatalogPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  // `null` is the "All" chip. The backend keys filter results off the FK,
  // so the legacy freeform string is no longer passed from this page.
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('trending');
  const [priceBucket, setPriceBucket] = useState<PriceBucket>('any');
  const [minRating, setMinRating] = useState<MinRating>(0);
  const [examType, setExamType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');
  const [durationBucket, setDurationBucket] = useState<DurationBucket>('any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  const catalogQuery = useQuery({
    queryKey: [
      'course',
      'catalog',
      search,
      categoryId,
      sort,
      priceBucket,
      minRating,
      examType,
      difficulty,
      language,
      durationBucket,
      verifiedOnly,
      page,
    ],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/course?${objectToQuery({
            filter: {
              search: search || undefined,
              categoryId: categoryId || undefined,
              sort,
              priceBucket: priceBucket === 'any' ? undefined : priceBucket,
              minRating: minRating || undefined,
              examType: examType || undefined,
              difficulty: difficulty || undefined,
              language: language || undefined,
              durationBucket:
                durationBucket === 'any' ? undefined : durationBucket,
              verifiedOnly: verifiedOnly || undefined,
            },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
          })}`,
          { signal },
        )
        .json<{
          count: number;
          categories: CatalogCategoryRow[];
          facets: CatalogFacets;
          featured: Course[];
          bundles: CourseBundle[];
          courses: Course[];
        }>(),
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) =>
      apiClient.post(`api/course/${courseId}/enroll`).json(),
    onSuccess: async (_data, courseId) => {
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.success.enrolled);
      navigate({ to: '/course/$id/learn', params: { id: courseId } });
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const saveMutation = useMutation({
    mutationFn: ({ courseId, saved }: { courseId: string; saved: boolean }) =>
      saved
        ? apiClient.delete(`api/course/${courseId}/save`).json()
        : apiClient.post(`api/course/${courseId}/save`).json(),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['course'] });
      await queryClient.invalidateQueries({
        queryKey: ['course', 'wishlists'],
      });
      toast.success(
        variables.saved
          ? dictionary.course.success.courseUnsaved
          : dictionary.course.success.courseSaved,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const courses = catalogQuery.data?.courses || [];
  const categories = catalogQuery.data?.categories || [];
  const facets = catalogQuery.data?.facets;
  const featured = catalogQuery.data?.featured || [];
  const bundles = catalogQuery.data?.bundles || [];
  const totalCount = catalogQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const featuredCourse = useMemo(
    () => courses.find((course) => course.nexVerified) || courses[0],
    [courses],
  );
  const toggleComparison = (courseId: string) => {
    setComparisonIds((current) => {
      if (current.includes(courseId)) {
        return current.filter((id) => id !== courseId);
      }
      if (current.length >= 4) {
        toast.error(dictionary.course.marketplace.compareLimit);
        return current;
      }
      return [...current, courseId];
    });
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader items={[[dictionary.course.list.title]]} />

      <section className="nex-glass-card relative overflow-hidden rounded-3xl border-white/70 p-6 dark:border-white/10">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
              <LuSparkles className="size-3.5" />
              {dictionary.course.list.menu}
            </Badge>
            <h1 className="text-nexexam-ink mt-4 text-3xl font-extrabold tracking-normal md:text-4xl dark:text-white">
              {dictionary.course.list.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base">
              {dictionary.course.list.empty}
            </p>
            <div className="mt-6 grid gap-3">
              <label className="relative">
                <span className="sr-only">{dictionary.shared.search}</span>
                <LuSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={dictionary.shared.searchPlaceholder}
                  className="h-11 rounded-xl bg-white/80 pl-10 dark:bg-white/8"
                />
              </label>
              {/* Curated category chip row — keyed off the new
                  CourseCategory taxonomy. Hidden when no categories exist
                  so the hero stays tidy on fresh installs. */}
              {categories.length > 0 && (
                <div
                  role="radiogroup"
                  aria-label={dictionary.course.fields.category}
                  className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1 pb-1"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={categoryId === null}
                    onClick={() => setCategoryId(null)}
                    className={
                      categoryId === null
                        ? 'bg-nexexam-primary rounded-full px-4 py-1.5 text-sm font-semibold text-white'
                        : 'rounded-full border bg-white/80 px-4 py-1.5 text-sm font-semibold hover:bg-white dark:bg-white/8'
                    }
                  >
                    {dictionary.shared.all}
                  </button>
                  {categories.map((item) => {
                    const active = categoryId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCategoryId(item.id)}
                        className={
                          active
                            ? 'bg-nexexam-primary rounded-full px-4 py-1.5 text-sm font-semibold text-white'
                            : 'rounded-full border bg-white/80 px-4 py-1.5 text-sm font-semibold hover:bg-white dark:bg-white/8'
                        }
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <span>{dictionary.course.list.sortLabel}</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SortKey);
                      setPage(1);
                    }}
                    className="border-input h-9 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
                  >
                    <option value="trending">
                      {dictionary.course.list.sortTrending}
                    </option>
                    <option value="topRated">
                      {dictionary.course.list.sortTopRated}
                    </option>
                    <option value="newest">
                      {dictionary.course.list.sortNewest}
                    </option>
                    <option value="mostPopular">
                      {dictionary.course.list.sortMostPopular}
                    </option>
                    <option value="priceAsc">
                      {dictionary.course.list.sortPriceAsc}
                    </option>
                    <option value="priceDesc">
                      {dictionary.course.list.sortPriceDesc}
                    </option>
                    <option value="durationAsc">
                      {dictionary.course.list.sortDurationAsc}
                    </option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <span>{dictionary.course.list.filterPriceLabel}</span>
                  <select
                    value={priceBucket}
                    onChange={(e) => {
                      setPriceBucket(e.target.value as PriceBucket);
                      setPage(1);
                    }}
                    className="border-input h-9 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
                  >
                    <option value="any">
                      {dictionary.course.list.filterPriceAny}
                    </option>
                    <option value="free">
                      {dictionary.course.list.filterPriceFree}
                    </option>
                    <option value="paid">
                      {dictionary.course.list.filterPricePaid}
                    </option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <span>{dictionary.course.list.filterRatingLabel}</span>
                  <select
                    value={String(minRating)}
                    onChange={(e) => {
                      setMinRating(Number(e.target.value) as MinRating);
                      setPage(1);
                    }}
                    className="border-input h-9 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
                  >
                    <option value="0">
                      {dictionary.course.list.filterRatingAny}
                    </option>
                    <option value="4">
                      {dictionary.course.list.filterRating4}
                    </option>
                    <option value="4.5">
                      {dictionary.course.list.filterRating45}
                    </option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => {
                      setVerifiedOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="size-4 accent-current"
                  />
                  <span>{dictionary.course.list.verifiedOnly}</span>
                </label>
              </div>
              <div className="grid gap-2 rounded-2xl border bg-white/70 p-3 md:grid-cols-4 dark:bg-white/8">
                <FacetSelect
                  label={dictionary.course.fields.examType}
                  value={examType}
                  options={facets?.examTypes || []}
                  allLabel={dictionary.shared.all}
                  onChange={(value) => {
                    setExamType(value);
                    setPage(1);
                  }}
                />
                <FacetSelect
                  label={dictionary.course.fields.difficulty}
                  value={difficulty}
                  options={facets?.difficulties || []}
                  allLabel={dictionary.shared.all}
                  onChange={(value) => {
                    setDifficulty(value);
                    setPage(1);
                  }}
                />
                <FacetSelect
                  label={dictionary.course.fields.language}
                  value={language}
                  options={facets?.languages || []}
                  allLabel={dictionary.shared.all}
                  onChange={(value) => {
                    setLanguage(value);
                    setPage(1);
                  }}
                />
                <label className="grid gap-1 text-xs font-semibold">
                  <span>{dictionary.course.marketplace.duration}</span>
                  <select
                    value={durationBucket}
                    onChange={(event) => {
                      setDurationBucket(event.target.value as DurationBucket);
                      setPage(1);
                    }}
                    className="border-input h-9 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
                  >
                    <option value="any">{dictionary.shared.all}</option>
                    {(['short', 'medium', 'long'] as const).map((bucket) => (
                      <option key={bucket} value={bucket}>
                        {dictionary.course.marketplace.durationBuckets[bucket]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/72 p-5 shadow-[0_18px_42px_rgb(91_92_246/0.12)] dark:border-white/10 dark:bg-white/8">
            <div className="flex items-center gap-3">
              <span className="bg-nexexam-soft-blue text-nexexam-secondary grid size-12 place-items-center rounded-2xl">
                <LuGraduationCap className="size-6" />
              </span>
              <div>
                <div className="text-muted-foreground text-xs font-semibold">
                  {dictionary.course.detail.enrolled}
                </div>
                <div className="text-2xl font-extrabold">
                  {courses.filter((course) => course.isEnrolled).length}
                </div>
              </div>
            </div>
            {featuredCourse && (
              <div className="mt-5 border-t pt-5">
                <p className="text-muted-foreground text-xs font-semibold">
                  {dictionary.course.actions.continue}
                </p>
                <p className="mt-1 line-clamp-2 font-bold">
                  {featuredCourse.title}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {featured.length > 0 && page === 1 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase">
            <LuShieldCheck className="text-primary size-4" />
            {dictionary.course.list.featured}
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrolling={enrollMutation.isPending}
                onEnroll={() => enrollMutation.mutate(course.id)}
                saving={saveMutation.isPending}
                onToggleSave={() =>
                  saveMutation.mutate({
                    courseId: course.id,
                    saved: Boolean(course.isSaved),
                  })
                }
                selectedForComparison={comparisonIds.includes(course.id)}
                onToggleCompare={() => toggleComparison(course.id)}
              />
            ))}
          </div>
        </section>
      )}

      {bundles.length > 0 && page === 1 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase">
            <LuBookOpenCheck className="text-primary size-4" />
            {dictionary.course.marketplace.bundles}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            enrolling={enrollMutation.isPending}
            onEnroll={() => enrollMutation.mutate(course.id)}
            saving={saveMutation.isPending}
            onToggleSave={() =>
              saveMutation.mutate({
                courseId: course.id,
                saved: Boolean(course.isSaved),
              })
            }
            selectedForComparison={comparisonIds.includes(course.id)}
            onToggleCompare={() => toggleComparison(course.id)}
          />
        ))}
      </section>

      {comparisonIds.length > 0 && (
        <div className="sticky bottom-4 z-20 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border bg-white/95 p-3 shadow-[0_18px_48px_rgb(15_23_42/0.18)] backdrop-blur dark:bg-slate-950/95">
          <div className="min-w-0">
            <p className="text-sm font-extrabold">
              {dictionary.course.marketplace.compareSelected.replace(
                '{0}',
                String(comparisonIds.length),
              )}
            </p>
            <p className="text-muted-foreground text-xs">
              {dictionary.course.marketplace.compareHint}
            </p>
          </div>
          <Button
            nativeButton={false}
            className="h-10 rounded-xl"
            render={
              <Link
                to="/course/compare"
                search={{ ids: comparisonIds.join(',') }}
              />
            }
          >
            <LuGitCompare className="size-4" />
            {dictionary.course.marketplace.compare}
          </Button>
        </div>
      )}

      {!catalogQuery.isLoading && courses.length === 0 && (
        <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <LuBookOpenCheck className="text-muted-foreground size-10" />
            <h2 className="text-lg font-extrabold">
              {dictionary.course.list.noResults}
            </h2>
            <p className="text-muted-foreground max-w-md text-sm">
              {dictionary.course.list.empty}
            </p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="pagination"
          className="flex items-center justify-center gap-3 pt-2"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ←
          </Button>
          <span className="text-sm font-semibold">
            {dictionary.course.list.page} {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            →
          </Button>
        </nav>
      )}
    </div>
  );
}

function CourseCard({
  course,
  enrolling,
  saving,
  onEnroll,
  onToggleSave,
  selectedForComparison,
  onToggleCompare,
}: {
  course: Course;
  enrolling: boolean;
  saving: boolean;
  onEnroll: () => void;
  onToggleSave: () => void;
  selectedForComparison: boolean;
  onToggleCompare: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const thumbnail = course.thumbnail?.[0];
  const imageUrl =
    thumbnail?.downloadUrl || thumbnail?.publicUrl || thumbnail?.signedUrl;
  const priceLabel = coursePriceLabel(course, dictionary, locale);
  const durationLabel = courseDurationLabel(course.durationSeconds, dictionary);
  const enrollmentCount = course.socialProof?.enrollmentCount ?? 0;

  return (
    <Card
      data-testid="course-catalog-card"
      className="nex-glass-card overflow-hidden rounded-2xl border-white/70 p-0 transition hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgb(91_92_246/0.14)] dark:border-white/10"
    >
      <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,var(--nexexam-soft-blue),var(--nexexam-accent))]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-nexexam-primary grid h-full place-items-center">
            <LuBookOpenCheck className="size-16" />
          </div>
        )}
        {course.nexVerified && (
          <Badge className="text-nexexam-primary absolute top-3 left-3 rounded-xl bg-white/90 shadow-sm hover:bg-white">
            <LuShieldCheck className="size-3.5" />
            {dictionary.course.fields.nexVerified}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/course/$slug"
              params={{ slug: course.slug }}
              className="hover:text-nexexam-primary line-clamp-2 text-lg font-extrabold"
            >
              {course.title}
            </Link>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {course.subtitle || course.description}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {course.category && (
            <Badge variant="secondary" className="rounded-lg">
              {course.category}
            </Badge>
          )}
          {course.examType && (
            <Badge variant="secondary" className="rounded-lg">
              {course.examType}
            </Badge>
          )}
          <Badge variant="outline" className="rounded-lg">
            {dictionaryEnumerator(
              dictionary.course.enumerators.accessType,
              course.accessType,
            )}
          </Badge>
          <Badge variant="outline" className="rounded-lg">
            {priceLabel}
          </Badge>
          <Badge variant="outline" className="rounded-lg">
            <LuStar className="size-3.5" />
            {courseRatingLabel(course, dictionary, locale)}
          </Badge>
          {durationLabel && (
            <Badge variant="outline" className="rounded-lg">
              <LuClock className="size-3.5" />
              {durationLabel}
            </Badge>
          )}
          {course.language && (
            <Badge variant="outline" className="rounded-lg">
              <LuLanguages className="size-3.5" />
              {course.language}
            </Badge>
          )}
        </div>
        {course.creatorUser && (
          <Link
            to="/creator/$creatorId"
            params={{ creatorId: course.creatorUser.id }}
            className="text-muted-foreground hover:text-primary mt-4 flex items-center gap-2 text-xs font-semibold"
          >
            {course.creatorUser.image ? (
              <img
                src={course.creatorUser.image}
                alt={
                  course.creatorUser.name ||
                  dictionary.course.marketplace.creator
                }
                className="size-6 rounded-full object-cover"
              />
            ) : (
              <span className="bg-primary/10 text-primary grid size-6 place-items-center rounded-full">
                <LuUsers className="size-3.5" />
              </span>
            )}
            <span className="truncate">
              {course.creatorUser.name || dictionary.course.marketplace.creator}
            </span>
          </Link>
        )}
        <div className="text-muted-foreground mt-5 grid grid-cols-4 gap-2 text-center text-xs">
          <span>
            {course.counts?.modules || 0} {dictionary.course.fields.modules}
          </span>
          <span>
            {course.counts?.lessons || 0} {dictionary.course.fields.lessons}
          </span>
          <span>
            {course.counts?.assignments || 0}{' '}
            {dictionary.course.fields.assignments}
          </span>
          <span>
            {new Intl.NumberFormat(locale).format(enrollmentCount)}{' '}
            {dictionary.course.marketplace.learners}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
          {course.isEnrolled ? (
            <Button
              nativeButton={false}
              data-testid="course-catalog-continue-button"
              className="h-10 flex-1 rounded-xl"
              render={
                <Link to="/course/$id/learn" params={{ id: course.id }} />
              }
            >
              {dictionary.course.actions.continue}
            </Button>
          ) : course.accessType === 'free' ? (
            <Button
              data-testid="course-catalog-enroll-button"
              className="h-10 flex-1 rounded-xl"
              onClick={onEnroll}
              disabled={enrolling}
            >
              {dictionary.course.actions.enroll}
            </Button>
          ) : (
            /* Paid / manual / subscription routes to the detail page. The
               actual buy lives there to keep the catalog grid fast and
               avoid double-policy gates in the card click handler. */
            <Button
              nativeButton={false}
              data-testid="course-catalog-view-button"
              className="h-10 flex-1 rounded-xl"
              render={
                <Link to="/course/$slug" params={{ slug: course.slug }} />
              }
            >
              {dictionary.course.actions.viewCourse}
            </Button>
          )}
          <Button
            variant="outline"
            className="h-10 rounded-xl bg-white/70 px-3"
            onClick={onToggleSave}
            disabled={saving}
            aria-label={
              course.isSaved
                ? dictionary.course.marketplace.unsave
                : dictionary.course.actions.saveCourse
            }
          >
            <LuHeart
              className={
                course.isSaved ? 'text-primary fill-current' : undefined
              }
            />
          </Button>
          <Button
            variant={selectedForComparison ? 'default' : 'outline'}
            className="h-10 rounded-xl px-3"
            onClick={onToggleCompare}
            aria-label={dictionary.course.marketplace.compare}
          >
            <LuGitCompare className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BundleCard({ bundle }: { bundle: CourseBundle }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const thumbnail = bundle.thumbnail?.[0];
  const imageUrl =
    thumbnail?.downloadUrl || thumbnail?.publicUrl || thumbnail?.signedUrl;
  const priceLabel =
    bundle.priceCents != null
      ? new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: bundle.currency || 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(bundle.priceCents / 100)
      : dictionary.course.enumerators.accessType.manual;

  return (
    <Card className="nex-glass-card overflow-hidden rounded-2xl border-white/70 p-0 dark:border-white/10">
      <div className="relative h-36 overflow-hidden bg-[linear-gradient(135deg,var(--nexexam-soft-blue),var(--nexexam-accent))]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bundle.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-nexexam-primary grid h-full place-items-center">
            <LuBookOpenCheck className="size-12" />
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <Badge variant="secondary" className="rounded-lg">
          {dictionary.course.marketplace.bundle}
        </Badge>
        <h3 className="mt-3 line-clamp-2 text-lg font-extrabold">
          {bundle.title}
        </h3>
        {bundle.description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {bundle.description}
          </p>
        )}
        <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
          <span>
            {bundle.counts?.courses || bundle.courses?.length || 0}{' '}
            {dictionary.course.marketplace.coursesIncluded}
          </span>
          <span className="text-foreground font-bold">{priceLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function FacetSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-input h-9 rounded-xl border bg-white/80 px-3 text-sm dark:bg-white/10"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function courseRatingLabel(course: Course, dictionary: any, locale: string) {
  const summary = course.ratingSummary;

  if (!summary?.count) {
    return dictionary.course.ratings.noRatings;
  }

  return dictionary.course.ratings.summary
    .replace(
      '{0}',
      new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
        summary.average,
      ),
    )
    .replace('{1}', new Intl.NumberFormat(locale).format(summary.count));
}

function courseDurationLabel(
  durationSeconds: number | null | undefined,
  dictionary: any,
) {
  if (!durationSeconds) {
    return null;
  }

  const minutes = Math.max(1, Math.round(durationSeconds / 60));
  if (minutes < 60) {
    return dictionary.course.learn.durationMinutes.replace(
      '{0}',
      String(minutes),
    );
  }

  return dictionary.course.marketplace.durationHours.replace(
    '{0}',
    String(Math.round((minutes / 60) * 10) / 10),
  );
}

function coursePriceLabel(course: Course, dictionary: any, locale: string) {
  if (course.accessType === 'free') {
    return dictionary.course.enumerators.accessType.free;
  }

  if (course.accessType === 'paid' && course.priceCents != null) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: course.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(course.priceCents / 100);
  }

  if (course.accessType === 'subscription') {
    return (
      course.subscriptionPlanKey ||
      dictionary.course.enumerators.accessType.subscription
    );
  }

  return dictionary.course.enumerators.accessType.manual;
}
