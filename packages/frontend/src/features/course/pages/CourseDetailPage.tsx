import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import {
  LuActivity,
  LuArrowRight,
  LuAward,
  LuBrain,
  LuBookOpen,
  LuCheck,
  LuCircleCheck,
  LuClock,
  LuFlag,
  LuFileText,
  LuHeart,
  LuLayers3,
  LuLock,
  LuLoader,
  LuPlay,
  LuShieldCheck,
  LuSparkles,
  LuStar,
  LuTags,
  LuVideo,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Course,
  CourseCertificate,
  CourseLesson,
} from '@/features/course/courseTypes';
import { LessonBlockView } from '@/features/course/components/LessonBlockView';
import {
  missingTrustSafetyPolicies,
  PolicyAcceptanceDialog,
  useTrustSafetyPolicies,
} from '@/features/trustSafety/PolicyAcceptanceDialog';
import { ReportDialog } from '@/features/trustSafety/ReportDialog';
import { CheckoutTrustPanel } from '@/features/checkout/CheckoutTrustPanel';
import {
  formatPackagePrice,
  PricingPackageSelector,
} from '@/features/pricing/PricingPackageSelector';
import {
  PricingPackage,
  PricingPackagesResponse,
} from '@/features/pricing/pricingTypes';
import { ContextualPaywall } from '@/features/pricing/ContextualPaywall';
import { useAuthStore } from '@/features/auth/authStore';
import { FilesList } from '@/features/file/components/FilesList';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import {
  productAnalyticsTrack,
  productAnalyticsTrackOnce,
} from '@/shared/lib/productAnalytics';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export const courseDetailLazyRoute = createLazyRoute('/course/$slug')({
  component: CourseDetailPage,
});

export function CourseDetailPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { slug } = useParams({ strict: false }) as { slug: string };
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [selectedPricingPackageId, setSelectedPricingPackageId] = useState<
    string | null
  >(null);
  const [pendingPolicyCheckoutPackage, setPendingPolicyCheckoutPackage] =
    useState<PricingPackage | null>(null);

  const courseQuery = useQuery({
    queryKey: ['course', 'detail', slug],
    queryFn: async ({ signal }) =>
      apiClient.get(`api/course/${slug}`, { signal }).json<{
        course: Course;
        isEnrolled: boolean;
        certificate: CourseCertificate | null;
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

  // Paid courses route through Stripe Checkout. The webhook writes the
  // enrollment; the user is redirected back with ?purchase=success which we
  // consume in the useEffect below to fire the toast + cache invalidation.
  const checkoutMutation = useMutation({
    mutationFn: ({
      courseId,
      couponCode,
      pricingPackage,
    }: {
      courseId: string;
      couponCode: string;
      pricingPackage?: PricingPackage | null;
    }) =>
      apiClient
        .post(`api/course/${courseId}/checkout`, {
          json: {
            couponCode: couponCode || null,
            pricingPackageId: pricingPackage?.id ?? null,
            pricingExperimentId: pricingPackage?.pricingExperimentId ?? null,
            pricingVariantId: pricingPackage?.pricingVariantId ?? null,
            packageType: pricingPackage?.packageType ?? 'course_purchase',
          },
        })
        .json<{ url: string }>(),
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
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
      toast.success(
        variables.saved
          ? dictionary.course.success.courseUnsaved
          : dictionary.course.success.courseSaved,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  // Pick up the post-Stripe redirect (`?purchase=success`). The catalog
  // cache is invalidated so the "Continue learning" button replaces "Buy".
  // The query param is stripped after the side effect to avoid double-firing
  // on tab refocus.
  const search = useSearch({ strict: false }) as {
    purchase?: 'success' | 'cancelled';
  };
  useEffect(() => {
    if (search.purchase === 'success') {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success(dictionary.course.success.purchased);
      navigate({
        to: '/course/$slug',
        params: { slug },
        search: {},
        replace: true,
      });
    } else if (search.purchase === 'cancelled') {
      toast.info(dictionary.checkoutTrust.checkoutCancelled);
      navigate({
        to: '/course/$slug',
        params: { slug },
        search: {},
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.purchase, slug]);

  const course = courseQuery.data?.course;
  const isEnrolled = Boolean(courseQuery.data?.isEnrolled);
  const pricingPackagesQuery = useQuery({
    queryKey: ['pricing', 'packages', 'course_detail', course?.id],
    enabled: Boolean(course?.id && course.accessType === 'paid' && !isEnrolled),
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/pricing/packages?${objectToQuery({
            surface: 'course_detail',
            courseId: course?.id,
            currentPath:
              typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : undefined,
          })}`,
          { signal },
        )
        .json<PricingPackagesResponse>(),
  });
  const certificate = courseQuery.data?.certificate;
  const policiesQuery = useTrustSafetyPolicies(
    Boolean(course && !isEnrolled && currentUser),
  );
  const missingStudentPolicies = missingTrustSafetyPolicies(
    policiesQuery.data?.policies,
    ['studentTerms'],
  );
  const thumbnail = course?.thumbnail?.[0];
  const imageUrl =
    thumbnail?.downloadUrl || thumbnail?.publicUrl || thumbnail?.signedUrl;
  const introVideo = course?.introVideoFiles?.[0];
  const introVideoUrl =
    introVideo?.downloadUrl || introVideo?.publicUrl || introVideo?.signedUrl;
  const isPremiumCourse = Boolean(
    course &&
    (course.accessType === 'paid' || course.accessType === 'subscription'),
  );
  const freeSampleQuery = useQuery({
    queryKey: ['course', 'freeSample', course?.id],
    enabled: Boolean(course?.id && isPremiumCourse && !isEnrolled),
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/course/${course!.id}/free-sample`, { signal })
        .json<CourseFreeSampleResponse>(),
  });
  const showPurchaseProof = Boolean(
    course?.purchaseProof && isPremiumCourse && !isEnrolled,
  );
  const coursePricingPackages =
    pricingPackagesQuery.data?.packages.filter(
      (pkg) =>
        pkg.packageType === 'course_purchase' ||
        pkg.packageType === 'selected_lifetime_course_access',
    ) || [];
  const selectedPricingPackage =
    coursePricingPackages.find((pkg) => pkg.id === selectedPricingPackageId) ||
    coursePricingPackages.find((pkg) => pkg.recommended) ||
    coursePricingPackages[0] ||
    null;
  const selectedPriceLabel = selectedPricingPackage
    ? formatPackagePrice(selectedPricingPackage, locale)
    : course
      ? coursePriceLabel(course, dictionary, locale)
      : '';

  useEffect(() => {
    if (selectedPricingPackageId || !coursePricingPackages.length) {
      return;
    }
    setSelectedPricingPackageId(
      (coursePricingPackages.find((pkg) => pkg.recommended) ||
        coursePricingPackages[0])!.id,
    );
  }, [coursePricingPackages, selectedPricingPackageId]);

  useEffect(() => {
    if (!course) {
      return;
    }

    productAnalyticsTrackOnce(`course_view:${course.id}`, {
      eventName: 'course_view',
      courseId: course.id,
      accessType: course.accessType,
      funnelId: `course:${course.id}`,
      metadata: {
        courseSlug: course.slug,
        isEnrolled,
      },
    });
  }, [course, isEnrolled]);

  useEffect(() => {
    if (
      !course ||
      isEnrolled ||
      (course.accessType !== 'paid' && course.accessType !== 'subscription')
    ) {
      return;
    }

    productAnalyticsTrackOnce(`paywall_seen:course_detail:${course.id}`, {
      eventName: 'paywall_seen',
      courseId: course.id,
      accessType: course.accessType,
      ctaLocation: 'course_detail_unlock_panel',
      funnelId: `course:${course.id}`,
      metadata: {
        courseSlug: course.slug,
        checkoutTrustShown: true,
        localPaymentMethodsShown: true,
        noSurpriseFeesShown: true,
      },
    });
  }, [course, isEnrolled]);

  useEffect(() => {
    if (!course || !showPurchaseProof) {
      return;
    }

    productAnalyticsTrackOnce(`proof_review_seen:course_detail:${course.id}`, {
      eventName: 'proof_review_seen',
      courseId: course.id,
      accessType: course.accessType,
      ctaLocation: 'course_detail_purchase_proof',
      funnelId: `course:${course.id}`,
      metadata: {
        courseSlug: course.slug,
      },
    });
  }, [course, showPurchaseProof]);

  useEffect(() => {
    const curriculum = course?.purchaseProof?.previewCurriculum;
    if (!course || !showPurchaseProof || !curriculum?.totalLessonCount) {
      return;
    }

    productAnalyticsTrackOnce(
      `preview_curriculum_seen:course_detail:${course.id}`,
      {
        eventName: 'preview_curriculum_seen',
        courseId: course.id,
        accessType: course.accessType,
        ctaLocation: 'course_detail_preview_curriculum',
        funnelId: `course:${course.id}`,
        metadata: {
          courseSlug: course.slug,
          previewLessonCount: curriculum.previewLessonCount,
          lockedLessonCount: curriculum.lockedLessonCount,
        },
      },
    );
  }, [course, showPurchaseProof]);

  const requestCourseCheckout = (pricingPackage: PricingPackage | null) => {
    if (!course) {
      return;
    }

    if (!currentUser) {
      navigate({
        to: '/auth/sign-in',
        search: { redirect: `/course/${slug}` },
      });
      return;
    }

    if (pricingPackage) {
      setSelectedPricingPackageId(pricingPackage.id);
    }

    if (policiesQuery.isLoading || missingStudentPolicies.length) {
      setPendingPolicyCheckoutPackage(pricingPackage);
      setPolicyDialogOpen(true);
      return;
    }

    checkoutMutation.mutate({
      courseId: course.id,
      couponCode,
      pricingPackage,
    });
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.course.list.title, '/course'],
          [course?.title || dictionary.course.detail.title],
        ]}
      />

      {course && (
        <>
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="nex-glass-card overflow-hidden rounded-3xl border-white/70 dark:border-white/10">
              <div className="relative h-72 bg-[linear-gradient(135deg,var(--nexexam-soft-blue),var(--nexexam-accent))]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-nexexam-primary grid h-full place-items-center">
                    <LuBookOpen className="size-20" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {course.categoryRef?.name && (
                    <Badge className="bg-nexexam-soft-blue text-nexexam-secondary hover:bg-nexexam-soft-blue rounded-xl">
                      {course.categoryRef.name}
                    </Badge>
                  )}
                  {course.examType && (
                    <Badge className="bg-nexexam-soft-blue text-nexexam-secondary hover:bg-nexexam-soft-blue rounded-xl">
                      {course.examType}
                    </Badge>
                  )}
                  {course.nexVerified && (
                    <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                      <LuShieldCheck className="size-3.5" />
                      {dictionary.course.fields.nexVerified}
                    </Badge>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-normal md:text-4xl">
                  {course.title}
                </h1>
                {course.subtitle && (
                  <p className="text-muted-foreground mt-3 text-lg">
                    {course.subtitle}
                  </p>
                )}
                {course.description && (
                  <p className="text-muted-foreground mt-5 whitespace-pre-wrap">
                    {course.description}
                  </p>
                )}
                {introVideoUrl && (
                  <video
                    className="mt-6 aspect-video w-full rounded-2xl border bg-black"
                    src={introVideoUrl}
                    controls
                    onPlay={() =>
                      productAnalyticsTrackOnce(
                        `preview_start:intro:${course.id}`,
                        {
                          eventName: 'preview_start',
                          courseId: course.id,
                          accessType: course.accessType,
                          ctaLocation: 'course_intro_video',
                          funnelId: `course:${course.id}`,
                          metadata: {
                            courseSlug: course.slug,
                          },
                        },
                      )
                    }
                  />
                )}
              </div>
            </div>

            <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
              <CardContent className="p-6">
                <CourseUnlockPanel
                  course={course}
                  isEnrolled={isEnrolled}
                  dictionary={dictionary}
                />
                {showPurchaseProof && course.purchaseProof && (
                  <CreatorCredibilityPanel
                    course={course}
                    dictionary={dictionary}
                  />
                )}
                <div className="grid gap-3">
                  <Stat
                    icon={<LuLayers3 className="size-5" />}
                    label={dictionary.course.fields.modules}
                    value={String(course.modules.length)}
                  />
                  <Stat
                    icon={<LuBookOpen className="size-5" />}
                    label={dictionary.course.fields.lessons}
                    value={String(course.lessons.length)}
                  />
                  <Stat
                    icon={<LuFileText className="size-5" />}
                    label={dictionary.course.fields.assignments}
                    value={String(course.assignments.length)}
                  />
                  <Stat
                    icon={<LuStar className="size-5" />}
                    label={dictionary.course.ratings.title}
                    value={courseRatingLabel(course, dictionary, locale)}
                  />
                  <Stat
                    icon={<LuClock className="size-5" />}
                    label={dictionary.course.marketplace.duration}
                    value={
                      courseDurationLabel(course.durationSeconds, dictionary) ||
                      dictionary.course.marketplace.noDuration
                    }
                  />
                </div>
                <div className="mt-6 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                  <div className="text-muted-foreground text-xs font-semibold">
                    {dictionary.course.fields.accessType}
                  </div>
                  <div className="mt-1 font-bold">
                    {dictionaryEnumerator(
                      dictionary.course.enumerators.accessType,
                      course.accessType,
                    )}
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                  <div className="text-muted-foreground text-xs font-semibold">
                    {dictionary.course.fields.price}
                  </div>
                  <div className="mt-1 font-bold">
                    {coursePriceLabel(course, dictionary, locale)}
                  </div>
                </div>
                {course.accessType === 'paid' &&
                  !courseQuery.data?.isEnrolled && (
                    <CheckoutTrustPanel
                      variant="course"
                      priceLabel={selectedPriceLabel}
                      couponApplied={Boolean(couponCode.trim())}
                      className="mt-3"
                      compact
                    />
                  )}
                {course.accessType === 'paid' &&
                  !courseQuery.data?.isEnrolled &&
                  coursePricingPackages.length > 1 && (
                    <div className="mt-3">
                      <PricingPackageSelector
                        packages={coursePricingPackages}
                        selectedPackageId={selectedPricingPackage?.id}
                        onSelect={(pkg) => setSelectedPricingPackageId(pkg.id)}
                      />
                    </div>
                  )}
                {course.creatorUser && !showPurchaseProof && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    render={
                      <Link
                        to="/creator/$creatorId"
                        params={{ creatorId: course.creatorUser.id }}
                      />
                    }
                  >
                    {dictionary.course.marketplace.viewCreator}
                  </Button>
                )}
                {course.accessType === 'paid' &&
                  !courseQuery.data?.isEnrolled && (
                    <label className="mt-3 grid gap-2">
                      <span className="text-muted-foreground text-xs font-semibold">
                        {dictionary.course.marketplace.couponCode}
                      </span>
                      <div className="relative">
                        <LuTags className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          value={couponCode}
                          onChange={(event) =>
                            setCouponCode(event.target.value)
                          }
                          placeholder={
                            dictionary.course.marketplace.couponPlaceholder
                          }
                          className="h-10 rounded-xl bg-white/80 pl-10 dark:bg-white/8"
                        />
                      </div>
                    </label>
                  )}
                {certificate && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    render={
                      <Link
                        to="/course/$id/certificate"
                        params={{ id: course.id }}
                      />
                    }
                  >
                    <LuAward className="size-4" />
                    {dictionary.course.certificate.view}
                  </Button>
                )}
                <div className="mt-6">
                  {isEnrolled ? (
                    <Button
                      nativeButton={false}
                      data-testid="course-detail-continue-button"
                      className="h-11 w-full rounded-xl"
                      render={
                        <Link
                          to="/course/$id/learn"
                          params={{ id: course.id }}
                        />
                      }
                    >
                      {dictionary.course.actions.continue}
                    </Button>
                  ) : course.accessType === 'paid' ? (
                    /* Paid course → Stripe Checkout. Policy dialog still
                       gates the buy click so the buyer accepts terms
                       before money moves. */
                    <Button
                      data-testid="course-detail-buy-button"
                      className="h-11 w-full rounded-xl"
                      disabled={
                        checkoutMutation.isPending ||
                        !course.priceCents ||
                        course.priceCents <= 0
                      }
                      onClick={() => {
                        productAnalyticsTrack({
                          eventName: 'cta_click',
                          courseId: course.id,
                          accessType: course.accessType,
                          ctaLocation: 'course_detail_buy',
                          funnelId: `course:${course.id}`,
                          metadata: {
                            courseSlug: course.slug,
                            priceCents:
                              selectedPricingPackage?.priceCents ??
                              course.priceCents,
                            currency: course.currency,
                            packageType:
                              selectedPricingPackage?.packageType ??
                              'course_purchase',
                            pricingPackageId: selectedPricingPackage?.id,
                            pricingExperimentId:
                              selectedPricingPackage?.pricingExperimentId,
                            pricingVariantId:
                              selectedPricingPackage?.pricingVariantId,
                            couponApplied: Boolean(couponCode.trim()),
                            checkoutTrustShown: true,
                            refundPolicyShown: true,
                            localPaymentMethodsShown: true,
                          },
                        });
                        if (
                          policiesQuery.isLoading ||
                          missingStudentPolicies.length
                        ) {
                          setPendingPolicyCheckoutPackage(
                            selectedPricingPackage,
                          );
                          setPolicyDialogOpen(true);
                          return;
                        }
                        requestCourseCheckout(selectedPricingPackage);
                      }}
                    >
                      {dictionary.course.actions.buyCourseWithPrice.replace(
                        '{0}',
                        selectedPriceLabel,
                      )}
                    </Button>
                  ) : (
                    <Button
                      data-testid="course-detail-enroll-button"
                      className="h-11 w-full rounded-xl"
                      disabled={
                        enrollMutation.isPending || course.accessType !== 'free'
                      }
                      onClick={() => {
                        if (!currentUser) {
                          navigate({
                            to: '/auth/sign-in',
                            search: { redirect: `/course/${slug}` },
                          });
                          return;
                        }
                        if (
                          policiesQuery.isLoading ||
                          missingStudentPolicies.length
                        ) {
                          setPolicyDialogOpen(true);
                          return;
                        }
                        enrollMutation.mutate(course.id);
                      }}
                    >
                      {dictionary.course.actions.enroll}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    onClick={() => {
                      if (!currentUser) {
                        navigate({
                          to: '/auth/sign-in',
                          search: { redirect: `/course/${slug}` },
                        });
                        return;
                      }
                      saveMutation.mutate({
                        courseId: course.id,
                        saved: Boolean(course.isSaved),
                      });
                    }}
                    disabled={saveMutation.isPending}
                  >
                    <LuHeart
                      className={
                        course.isSaved ? 'text-primary fill-current' : undefined
                      }
                    />
                    {course.isSaved
                      ? dictionary.course.marketplace.unsave
                      : dictionary.course.actions.saveCourse}
                  </Button>
                  {course.accessType === 'paid' && (
                    <RefundPolicyProof dictionary={dictionary} />
                  )}
                  <Button
                    variant="outline"
                    className="mt-3 h-10 w-full rounded-xl"
                    onClick={() => setReportDialogOpen(true)}
                  >
                    <LuFlag className="size-4" />
                    {dictionary.trustSafety.report.reportCourse}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {isPremiumCourse && !isEnrolled && (
            <FreeValueSampleSection
              course={course}
              sample={freeSampleQuery.data || null}
              isLoading={freeSampleQuery.isLoading}
              currentUser={currentUser}
              checkoutPending={checkoutMutation.isPending}
              onCheckoutPackage={requestCourseCheckout}
            />
          )}

          <PolicyAcceptanceDialog
            open={policyDialogOpen}
            onOpenChange={setPolicyDialogOpen}
            requiredTypes={['studentTerms']}
            onAccepted={() => {
              if (course.accessType === 'paid') {
                checkoutMutation.mutate({
                  courseId: course.id,
                  couponCode,
                  pricingPackage:
                    pendingPolicyCheckoutPackage || selectedPricingPackage,
                });
                setPendingPolicyCheckoutPackage(null);
              } else {
                enrollMutation.mutate(course.id);
              }
            }}
          />

          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            target={{
              targetType: 'course',
              courseId: course.id,
              teacherUserId: course.creatorUserId,
            }}
          />

          {showPurchaseProof && course.purchaseProof ? (
            <>
              <PaidCourseProofBand
                course={course}
                dictionary={dictionary}
                locale={locale}
              />
              <PreviewCurriculumSection
                course={course}
                dictionary={dictionary}
                checkoutPending={checkoutMutation.isPending}
                onCheckoutPackage={requestCourseCheckout}
              />
              <VerifiedReviewsSection
                course={course}
                dictionary={dictionary}
                locale={locale}
              />
            </>
          ) : (
            <CourseModulesSection
              course={course}
              isEnrolled={isEnrolled}
              dictionary={dictionary}
            />
          )}
        </>
      )}
    </div>
  );
}

type CourseFreeSampleDiagnosticQuestion = {
  answerId: string;
  questionId: string;
  source: string;
  questionText: string;
  answerOptions: string[];
  difficulty: string;
  domain: string;
  selectedAnswerIndex?: number | null;
  isCorrect?: boolean | null;
  correctAnswerIndex?: number | null;
  explanation?: string | null;
  answeredAt?: string | null;
};

type CourseFreeSampleDiagnosticAttempt = {
  id: string;
  courseId: string;
  status: string;
  startedAt: string;
  completedAt?: string | null;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent?: number | null;
  domainScores: Array<{
    domain: string;
    correct: number;
    total: number;
    percent: number;
  }>;
  questions: CourseFreeSampleDiagnosticQuestion[];
};

type CourseFreeSampleResponse = {
  course: {
    id: string;
    slug: string;
    title: string;
    accessType: Course['accessType'];
  };
  previewLesson: CourseLesson | null;
  diagnostic: {
    availableQuestions: number;
    sampleQuestionCount: number;
    activeAttempt: CourseFreeSampleDiagnosticAttempt | null;
    completedAttempt: CourseFreeSampleDiagnosticAttempt | null;
    canStart: boolean;
    requiresSignIn: boolean;
    sampleLimitReached: boolean;
  };
};

function FreeValueSampleSection({
  course,
  sample,
  isLoading,
  currentUser,
  checkoutPending,
  onCheckoutPackage,
}: {
  course: Course;
  sample: CourseFreeSampleResponse | null;
  isLoading: boolean;
  currentUser: ReturnType<typeof useAuthStore.getState>['currentUser'];
  checkoutPending: boolean;
  onCheckoutPackage: (pkg: PricingPackage) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const t = dictionary.course.freeSample;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewCompleted, setPreviewCompleted] = useState(false);
  const previewLesson = sample?.previewLesson || null;

  if (isLoading) {
    return (
      <section className="nex-glass-card rounded-3xl border-white/70 p-6 dark:border-white/10">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <LuLoader className="text-primary size-4 animate-spin" />
          {t.loading}
        </div>
      </section>
    );
  }

  if (!sample || !previewLesson) {
    return null;
  }

  const videoUrl = courseFreeSampleLessonVideoUrl(previewLesson);
  const resources = previewLesson.resourceFiles || [];

  const handleStartPreview = () => {
    setPreviewOpen(true);
    productAnalyticsTrackOnce(`value_sample_started:${course.id}`, {
      eventName: 'value_sample_started',
      courseId: course.id,
      lessonId: previewLesson.id,
      accessType: course.accessType,
      ctaLocation: 'course_detail_free_sample',
      funnelId: `course:${course.id}`,
      metadata: {
        courseSlug: course.slug,
        sampleType: 'preview_lesson_diagnostic',
      },
    });
    productAnalyticsTrackOnce(`preview_start:free_sample:${course.id}`, {
      eventName: 'preview_start',
      courseId: course.id,
      lessonId: previewLesson.id,
      accessType: course.accessType,
      ctaLocation: 'course_detail_free_sample',
      funnelId: `course:${course.id}`,
      metadata: {
        courseSlug: course.slug,
        sampleType: 'preview_lesson_diagnostic',
      },
    });
  };

  const handleCompletePreview = () => {
    handleStartPreview();
    setPreviewCompleted(true);
    productAnalyticsTrackOnce(`value_sample_completed:${course.id}`, {
      eventName: 'value_sample_completed',
      courseId: course.id,
      lessonId: previewLesson.id,
      accessType: course.accessType,
      ctaLocation: 'course_detail_free_sample',
      funnelId: `course:${course.id}`,
      metadata: {
        courseSlug: course.slug,
        sampleType: 'preview_lesson_diagnostic',
      },
    });
  };

  return (
    <section className="nex-glass-card overflow-hidden rounded-3xl border-white/70 dark:border-white/10">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
        <div className="border-white/70 p-6 xl:border-r dark:border-white/10">
          <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
            <LuSparkles className="size-3.5" />
            {t.badge}
          </Badge>
          <h2 className="mt-3 text-2xl font-extrabold tracking-normal">
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-2">{t.body}</p>

          <div className="mt-5 rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                  <LuVideo className="size-3.5" />
                  {t.previewLesson}
                </div>
                <h3 className="mt-1 text-lg font-extrabold">
                  {previewLesson.title}
                </h3>
                {previewLesson.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {previewLesson.description}
                  </p>
                )}
              </div>
              {previewLesson.videoDurationSeconds ? (
                <Badge variant="outline" className="w-fit rounded-xl">
                  {courseDurationLabel(
                    previewLesson.videoDurationSeconds,
                    dictionary,
                  )}
                </Badge>
              ) : null}
            </div>

            {!previewOpen ? (
              <Button
                type="button"
                className="mt-4 h-10 rounded-xl"
                onClick={handleStartPreview}
              >
                <LuPlay className="size-4" />
                {t.startPreview}
              </Button>
            ) : (
              <div className="mt-5 grid gap-4">
                {videoUrl && (
                  <video
                    src={videoUrl}
                    controls
                    className="aspect-video w-full rounded-2xl border bg-black"
                    onPlay={handleStartPreview}
                  />
                )}
                {previewLesson.blocks?.length ? (
                  <LessonBlockView blocks={previewLesson.blocks} />
                ) : (
                  <p className="text-muted-foreground rounded-xl border bg-white/70 p-3 text-sm dark:bg-white/8">
                    {t.emptyPreview}
                  </p>
                )}
                {resources.length > 0 && (
                  <div className="rounded-xl border bg-white/70 p-3 dark:bg-white/8">
                    <div className="mb-2 text-sm font-extrabold">
                      {t.resourcesTitle}
                    </div>
                    <FilesList files={resources} />
                  </div>
                )}
                <Button
                  type="button"
                  variant={previewCompleted ? 'outline' : 'default'}
                  className="h-10 w-fit rounded-xl"
                  onClick={handleCompletePreview}
                >
                  {previewCompleted ? (
                    <LuCircleCheck className="size-4" />
                  ) : (
                    <LuArrowRight className="size-4" />
                  )}
                  {previewCompleted ? t.previewComplete : t.completePreview}
                </Button>
              </div>
            )}
          </div>
        </div>

        <CourseFreeSampleDiagnosticPanel
          course={course}
          diagnostic={sample.diagnostic}
          currentUser={currentUser}
          previewCompleted={previewCompleted}
          previewLessonId={previewLesson.id}
          locale={locale}
          checkoutPending={checkoutPending}
          onCheckoutPackage={onCheckoutPackage}
        />
      </div>
    </section>
  );
}

function CourseFreeSampleDiagnosticPanel({
  course,
  diagnostic,
  currentUser,
  previewCompleted,
  previewLessonId,
  locale,
  checkoutPending,
  onCheckoutPackage,
}: {
  course: Course;
  diagnostic: CourseFreeSampleResponse['diagnostic'];
  currentUser: ReturnType<typeof useAuthStore.getState>['currentUser'];
  previewCompleted: boolean;
  previewLessonId: string;
  locale: string;
  checkoutPending: boolean;
  onCheckoutPackage: (pkg: PricingPackage) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const t = dictionary.course.freeSample;
  const [attempt, setAttempt] =
    useState<CourseFreeSampleDiagnosticAttempt | null>(
      diagnostic.completedAttempt || diagnostic.activeAttempt || null,
    );
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );
  const [showPaywall, setShowPaywall] = useState(
    Boolean(diagnostic.completedAttempt),
  );

  useEffect(() => {
    const nextAttempt = diagnostic.completedAttempt || diagnostic.activeAttempt;
    if (nextAttempt) {
      setAttempt(nextAttempt);
      setShowPaywall(nextAttempt.status === 'sampleCompleted');
    }
  }, [diagnostic.activeAttempt, diagnostic.completedAttempt]);

  const unansweredQuestion =
    attempt?.status === 'sampleActive'
      ? attempt.questions.find(
          (question) => question.selectedAnswerIndex == null,
        ) || null
      : null;
  const answeredCount =
    attempt?.questions.filter(
      (question) => question.selectedAnswerIndex != null,
    ).length || 0;
  const questionTotal =
    attempt?.questions.length || diagnostic.sampleQuestionCount;
  const progress = questionTotal
    ? Math.round((answeredCount / questionTotal) * 100)
    : 0;

  useEffect(() => {
    setSelectedAnswerIndex(unansweredQuestion?.selectedAnswerIndex ?? null);
  }, [unansweredQuestion?.answerId, unansweredQuestion?.selectedAnswerIndex]);

  const startMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/course/${course.id}/free-sample/diagnostic/start`)
        .json<{
          attempt: CourseFreeSampleDiagnosticAttempt;
          sampleLimitReached: boolean;
        }>(),
    onSuccess: (data) => {
      setAttempt(data.attempt);
      setShowPaywall(data.sampleLimitReached);
      if (!data.sampleLimitReached) {
        productAnalyticsTrackOnce(
          `sample_diagnostic_started:${course.id}:${data.attempt.id}`,
          {
            eventName: 'sample_diagnostic_started',
            courseId: course.id,
            lessonId: previewLessonId,
            accessType: course.accessType,
            ctaLocation: 'course_detail_free_sample',
            funnelId: `course:${course.id}`,
            metadata: {
              courseSlug: course.slug,
              sampleType: 'preview_lesson_diagnostic',
              questionCount: data.attempt.totalQuestions,
            },
          },
        );
      }
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const answerMutation = useMutation({
    mutationFn: (input: {
      attemptId: string;
      answerId: string;
      selectedAnswerIndex: number;
    }) =>
      apiClient
        .post(
          `api/course/${course.id}/free-sample/diagnostic/${input.attemptId}/answer`,
          {
            json: {
              answerId: input.answerId,
              selectedAnswerIndex: input.selectedAnswerIndex,
            },
          },
        )
        .json<{ answer: CourseFreeSampleDiagnosticQuestion }>(),
    onSuccess: (data) => {
      setAttempt((current) =>
        current
          ? {
              ...current,
              questions: current.questions.map((question) =>
                question.answerId === data.answer.answerId
                  ? data.answer
                  : question,
              ),
            }
          : current,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const completeMutation = useMutation({
    mutationFn: (attemptId: string) =>
      apiClient
        .post(
          `api/course/${course.id}/free-sample/diagnostic/${attemptId}/complete`,
        )
        .json<{ attempt: CourseFreeSampleDiagnosticAttempt }>(),
    onSuccess: async (data) => {
      setAttempt(data.attempt);
      setShowPaywall(true);
      await queryClient.invalidateQueries({
        queryKey: ['course', 'freeSample', course.id],
      });
      toast.success(dictionary.studentExperience.success.diagnosticCompleted);
      productAnalyticsTrackOnce(
        `sample_diagnostic_completed:${course.id}:${data.attempt.id}`,
        {
          eventName: 'sample_diagnostic_completed',
          courseId: course.id,
          lessonId: previewLessonId,
          accessType: course.accessType,
          ctaLocation: 'course_detail_free_sample',
          funnelId: `course:${course.id}`,
          metadata: {
            courseSlug: course.slug,
            sampleType: 'preview_lesson_diagnostic',
            scorePercent: data.attempt.scorePercent,
            totalQuestions: data.attempt.totalQuestions,
            weakDomains: courseFreeSampleWeakDomains(data.attempt),
          },
        },
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const completedAttempt =
    attempt?.status === 'sampleCompleted'
      ? attempt
      : diagnostic.completedAttempt;

  return (
    <aside className="bg-primary/5 dark:bg-primary/10 p-6">
      <Badge className="text-primary rounded-xl bg-white/80 hover:bg-white/80 dark:bg-white/10">
        <LuBrain className="size-3.5" />
        {t.diagnosticBadge}
      </Badge>
      <h3 className="mt-3 text-xl font-extrabold tracking-normal">
        {t.diagnosticTitle}
      </h3>
      <p className="text-muted-foreground mt-2 text-sm">{t.diagnosticBody}</p>

      <div className="mt-5 rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
        {completedAttempt ? (
          <CourseFreeSampleDiagnosticResult
            course={course}
            attempt={completedAttempt}
            previewLessonId={previewLessonId}
            locale={locale}
            showPaywall={showPaywall}
            checkoutPending={checkoutPending}
            onCheckoutPackage={onCheckoutPackage}
          />
        ) : !currentUser ? (
          <div>
            <h4 className="font-extrabold">{t.signInTitle}</h4>
            <p className="text-muted-foreground mt-1 text-sm">{t.signInBody}</p>
            <Button
              nativeButton={false}
              render={
                <Link
                  to="/auth/sign-in"
                  search={{ redirect: `/course/${course.slug}` }}
                />
              }
              className="mt-4 h-10 rounded-xl"
            >
              {t.signInCta}
            </Button>
          </div>
        ) : !diagnostic.availableQuestions ? (
          <p className="text-muted-foreground text-sm">{t.noQuestions}</p>
        ) : !previewCompleted && !attempt ? (
          <div>
            <h4 className="font-extrabold">{t.previewFirstTitle}</h4>
            <p className="text-muted-foreground mt-1 text-sm">
              {t.previewFirstBody}
            </p>
          </div>
        ) : !attempt ? (
          <div>
            <div className="text-sm font-semibold">
              {dictionaryFormat(
                t.questionCount,
                diagnostic.sampleQuestionCount,
              )}
            </div>
            <Button
              type="button"
              className="mt-4 h-10 w-full rounded-xl"
              disabled={startMutation.isPending}
              onClick={() => startMutation.mutate()}
            >
              {startMutation.isPending ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                <LuActivity className="size-4" />
              )}
              {t.startDiagnostic}
            </Button>
          </div>
        ) : unansweredQuestion ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">
                {dictionaryFormat(t.answered, answeredCount, questionTotal)}
              </span>
              <Badge variant="outline" className="rounded-xl bg-white/70">
                {unansweredQuestion.domain}
              </Badge>
            </div>
            <Progress value={progress} className="mt-3 h-2" />
            <p className="mt-4 text-sm font-semibold">
              {unansweredQuestion.questionText}
            </p>
            <div className="mt-3 grid gap-2">
              {unansweredQuestion.answerOptions.map((option, index) => (
                <Button
                  key={`${unansweredQuestion.answerId}-${index}`}
                  type="button"
                  variant={
                    selectedAnswerIndex === index ? 'default' : 'outline'
                  }
                  className="h-auto justify-start rounded-xl px-3 py-2 text-left whitespace-normal"
                  onClick={() => setSelectedAnswerIndex(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              className="mt-4 h-10 w-full rounded-xl"
              disabled={answerMutation.isPending || selectedAnswerIndex == null}
              onClick={() =>
                selectedAnswerIndex != null &&
                answerMutation.mutate({
                  attemptId: attempt.id,
                  answerId: unansweredQuestion.answerId,
                  selectedAnswerIndex,
                })
              }
            >
              {answerMutation.isPending && (
                <LuLoader className="size-4 animate-spin" />
              )}
              {t.saveAnswer}
            </Button>
          </div>
        ) : (
          <div>
            <div className="font-extrabold">{t.readyToScoreTitle}</div>
            <p className="text-muted-foreground mt-1 text-sm">
              {t.readyToScoreBody}
            </p>
            <Button
              type="button"
              className="mt-4 h-10 w-full rounded-xl"
              disabled={completeMutation.isPending}
              onClick={() => completeMutation.mutate(attempt.id)}
            >
              {completeMutation.isPending ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                <LuCircleCheck className="size-4" />
              )}
              {t.completeDiagnostic}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

function CourseFreeSampleDiagnosticResult({
  course,
  attempt,
  previewLessonId,
  locale,
  showPaywall,
  checkoutPending,
  onCheckoutPackage,
}: {
  course: Course;
  attempt: CourseFreeSampleDiagnosticAttempt;
  previewLessonId: string;
  locale: string;
  showPaywall: boolean;
  checkoutPending: boolean;
  onCheckoutPackage: (pkg: PricingPackage) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.freeSample;
  const weakDomains = courseFreeSampleWeakDomains(attempt);
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-extrabold">{t.resultTitle}</h4>
          <p className="text-muted-foreground mt-1 text-sm">{t.resultBody}</p>
        </div>
        <div className="bg-primary/10 text-primary rounded-2xl px-4 py-3 text-center">
          <div className="text-2xl font-extrabold">
            {dictionaryFormat(
              dictionary.studentExperience.score,
              attempt.scorePercent || 0,
            )}
          </div>
          <div className="text-xs font-bold">{t.scoreLabel}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-white/70 p-3 dark:bg-white/8">
        <div className="text-sm font-extrabold">{t.weakDomains}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {weakDomains.length ? (
            weakDomains.map((domain) => (
              <Badge key={domain} variant="outline" className="rounded-xl">
                {domain}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">
              {t.noWeakDomains}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-extrabold">{t.reviewAnswers}</div>
        <div className="mt-2 grid gap-2">
          {attempt.questions.map((question, index) => (
            <div
              key={question.answerId}
              className="rounded-xl border bg-white/70 p-3 text-sm dark:bg-white/8"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold">
                  {numberFormatter.format(index + 1)}. {question.questionText}
                </div>
                <Badge
                  variant={question.isCorrect ? 'secondary' : 'outline'}
                  className="rounded-lg"
                >
                  {question.isCorrect ? t.correct : t.incorrect}
                </Badge>
              </div>
              {question.explanation && (
                <p className="text-muted-foreground mt-2">
                  {question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {showPaywall && (
        <ContextualPaywall
          source="diagnostic_result"
          courseId={course.id}
          courseSlug={course.slug}
          lessonId={previewLessonId}
          attemptId={attempt.id}
          preferredPackageTypes={
            course.accessType === 'paid'
              ? ['course_purchase', 'selected_lifetime_course_access']
              : ['annual_subscription', 'monthly_subscription']
          }
          compact
          className="mt-4"
          checkoutPending={checkoutPending}
          onCheckoutPackage={
            course.accessType === 'paid' ? onCheckoutPackage : undefined
          }
          metadata={{
            courseSlug: course.slug,
            sampleType: 'preview_lesson_diagnostic',
            scorePercent: attempt.scorePercent,
            totalQuestions: attempt.totalQuestions,
            weakDomains,
            previewLessonId,
          }}
        />
      )}
    </div>
  );
}

function courseFreeSampleLessonVideoUrl(lesson: CourseLesson) {
  const file = lesson.videoFiles?.[0];
  return (
    file?.downloadUrl ||
    file?.signedUrl ||
    file?.publicUrl ||
    lesson.videoUrl ||
    null
  );
}

function courseFreeSampleWeakDomains(
  attempt: CourseFreeSampleDiagnosticAttempt,
) {
  return attempt.domainScores
    .filter((score) => score.percent < 70)
    .map((score) => score.domain);
}

function CourseUnlockPanel({
  course,
  isEnrolled,
  dictionary,
}: {
  course: Course;
  isEnrolled: boolean;
  dictionary: any;
}) {
  const t = dictionary.course.marketplace.unlock;
  const title =
    course.accessType === 'subscription' ? t.subscriptionTitle : t.paidTitle;
  const body =
    course.accessType === 'subscription' ? t.subscriptionBody : t.paidBody;
  const isPremiumAccess =
    course.accessType === 'paid' || course.accessType === 'subscription';

  return (
    <div className="border-primary/20 bg-primary/5 mb-6 rounded-2xl border p-4">
      <Badge className="text-primary rounded-xl bg-white/80 hover:bg-white/80 dark:bg-white/10">
        {isEnrolled ? (
          <LuCheck className="size-3.5" />
        ) : isPremiumAccess ? (
          <LuLock className="size-3.5" />
        ) : (
          <LuSparkles className="size-3.5" />
        )}
        {t.badge}
      </Badge>
      <h2 className="mt-3 font-extrabold">
        {isPremiumAccess ? title : t.title}
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        {isPremiumAccess ? body : t.body}
      </p>
      <div className="mt-4 grid gap-2">
        {t.items.map((item: string) => (
          <div key={item} className="flex items-start gap-2 text-sm">
            <LuCircleCheckIcon />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatorCredibilityPanel({
  course,
  dictionary,
}: {
  course: Course;
  dictionary: any;
}) {
  const proof = course.purchaseProof;
  const creator = proof?.creator;
  const t = dictionary.course.marketplace.proof;

  if (!creator) {
    return null;
  }

  const creatorName =
    creator.name || course.creatorUser?.name || t.creatorProfileFallback;

  return (
    <div className="mb-6 rounded-2xl border bg-white/75 p-4 dark:bg-white/8">
      <div className="flex items-start gap-3">
        <Avatar className="size-12">
          {creator.image && (
            <AvatarImage src={creator.image} alt={creatorName} />
          )}
          <AvatarFallback>{avatarInitials(creatorName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold">{creatorName}</h3>
            {creator.nexVerified && (
              <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                <LuShieldCheck className="size-3.5" />
                {t.creatorVerified}
              </Badge>
            )}
          </div>
          {creator.professionalTitle && (
            <p className="text-muted-foreground mt-1 text-sm">
              {creator.professionalTitle}
            </p>
          )}
        </div>
      </div>

      {creator.bio && (
        <p className="text-muted-foreground mt-4 text-sm">{creator.bio}</p>
      )}

      <div className="mt-4 grid gap-3">
        {creator.credentials && (
          <ProofTextBlock label={t.credentials} value={creator.credentials} />
        )}
        {creator.expertise && (
          <ProofTextBlock label={t.expertise} value={creator.expertise} />
        )}
      </div>

      {course.creatorUser && (
        <Button
          nativeButton={false}
          variant="outline"
          className="mt-4 h-10 w-full rounded-xl"
          render={
            <Link
              to="/creator/$creatorId"
              params={{ creatorId: course.creatorUser.id }}
            />
          }
        >
          {dictionary.course.marketplace.viewCreator}
        </Button>
      )}
    </div>
  );
}

function ProofTextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs font-semibold">{label}</div>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function RefundPolicyProof({ dictionary }: { dictionary: any }) {
  const t = dictionary.course.marketplace.proof;

  return (
    <div className="border-primary/15 bg-primary/5 mt-3 rounded-2xl border p-4">
      <div className="flex items-center gap-2 text-sm font-bold">
        <LuShieldCheck className="text-primary size-4" />
        {t.refundTitle}
      </div>
      <Badge variant="secondary" className="mt-2 rounded-lg">
        {t.refundBadge}
      </Badge>
      <p className="text-muted-foreground mt-2 text-xs">
        {dictionary.trustSafety.policies.refundPolicy.checkoutSummary}
      </p>
    </div>
  );
}

function PaidCourseProofBand({
  course,
  dictionary,
  locale,
}: {
  course: Course;
  dictionary: any;
  locale: string;
}) {
  const proof = course.purchaseProof;
  if (!proof) {
    return null;
  }

  const t = dictionary.course.marketplace.proof;
  const numberFormatter = new Intl.NumberFormat(locale);
  const stats = proof.completionStats;
  const completionValue =
    stats.showCompletionRate && stats.completionRate != null
      ? dictionaryFormat(t.completionRateValue, stats.completionRate)
      : dictionaryFormat(t.learnerCountValue, stats.enrollmentCount);
  const completionHelper =
    stats.showCompletionRate && stats.completionRate != null
      ? dictionaryFormat(
          t.completionRateHelper,
          numberFormatter.format(stats.completedCount),
          numberFormatter.format(stats.enrollmentCount),
        )
      : t.learnerCountHelper;
  const reviewValue = stats.ratingCount
    ? dictionaryFormat(
        t.reviewsValue,
        numberFormatter.format(stats.ratingCount),
      )
    : t.reviewsEmptyValue;

  return (
    <section className="nex-glass-card rounded-3xl border-white/70 p-6 dark:border-white/10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        <div>
          <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
            <LuShieldCheck className="size-3.5" />
            {t.badge}
          </Badge>
          <h2 className="mt-3 text-2xl font-extrabold tracking-normal">
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-2">
            {proof.sampleOutcome || t.outcomeFallback}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ProofMetric
            icon={<LuAward className="size-5" />}
            label={t.outcomeLabel}
            value={t.outcomeValue}
            helper={proof.sampleOutcome || t.outcomeFallback}
          />
          <ProofMetric
            icon={<LuCheck className="size-5" />}
            label={t.completionLabel}
            value={completionValue}
            helper={completionHelper}
          />
          <ProofMetric
            icon={<LuStar className="size-5" />}
            label={t.reviewsLabel}
            value={reviewValue}
            helper={
              stats.ratingCount
                ? courseRatingLabel(course, dictionary, locale)
                : t.reviewsEmptyHelper
            }
          />
          <ProofMetric
            icon={<LuBookOpen className="size-5" />}
            label={t.previewLabel}
            value={dictionaryFormat(
              t.previewValue,
              numberFormatter.format(
                proof.previewCurriculum.previewLessonCount,
              ),
            )}
            helper={dictionaryFormat(
              t.previewHelper,
              numberFormatter.format(proof.previewCurriculum.totalLessonCount),
            )}
          />
        </div>
      </div>
    </section>
  );
}

function ProofMetric({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border bg-white/75 p-4 dark:bg-white/8">
      <div className="text-primary bg-nexexam-primary/10 grid size-10 place-items-center rounded-xl">
        {icon}
      </div>
      <div className="text-muted-foreground mt-3 text-xs font-semibold">
        {label}
      </div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
      <p className="text-muted-foreground mt-1 text-xs">{helper}</p>
    </div>
  );
}

function PreviewCurriculumSection({
  course,
  dictionary,
  checkoutPending,
  onCheckoutPackage,
}: {
  course: Course;
  dictionary: any;
  checkoutPending: boolean;
  onCheckoutPackage: (pkg: PricingPackage) => void;
}) {
  const proof = course.purchaseProof;
  if (!proof) {
    return null;
  }

  const t = dictionary.course.marketplace.proof;
  const curriculum = proof.previewCurriculum;

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">{t.previewCurriculumTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {dictionaryFormat(
              t.previewCurriculumBody,
              curriculum.previewLessonCount,
              curriculum.lockedLessonCount,
            )}
          </p>
        </div>
        <Badge variant="secondary" className="w-fit rounded-xl">
          {dictionaryFormat(
            t.certificatesIssued,
            proof.completionStats.certificateCount,
          )}
        </Badge>
      </div>

      {curriculum.modules.map((module) => (
        <CurriculumModuleCard
          key={module.id}
          module={module}
          dictionary={dictionary}
        />
      ))}

      {curriculum.standaloneLessons.length > 0 && (
        <CurriculumModuleCard
          module={{
            id: 'standalone-lessons',
            title: t.standaloneLessons,
            description: null,
            orderIndex: 0,
            lessons: curriculum.standaloneLessons,
          }}
          dictionary={dictionary}
        />
      )}

      {curriculum.lockedLessonCount > 0 && (
        <ContextualPaywall
          source="preview_lesson_complete"
          courseId={course.id}
          courseSlug={course.slug}
          preferredPackageTypes={
            course.accessType === 'paid'
              ? ['course_purchase', 'selected_lifetime_course_access']
              : ['annual_subscription', 'monthly_subscription']
          }
          checkoutPending={checkoutPending}
          onCheckoutPackage={
            course.accessType === 'paid' ? onCheckoutPackage : undefined
          }
          metadata={{
            courseSlug: course.slug,
            previewLessonCount: curriculum.previewLessonCount,
            lockedLessonCount: curriculum.lockedLessonCount,
          }}
        />
      )}
    </section>
  );
}

function CurriculumModuleCard({
  module,
  dictionary,
}: {
  module: NonNullable<
    Course['purchaseProof']
  >['previewCurriculum']['modules'][number];
  dictionary: any;
}) {
  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary mt-0.5 grid size-10 place-items-center rounded-xl">
            <LuLayers3 className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold">{module.title}</h3>
            {module.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {module.description}
              </p>
            )}
            <div className="mt-4 grid gap-2">
              {module.lessons.map((lesson) => (
                <CurriculumLessonRow
                  key={lesson.id}
                  lesson={lesson}
                  dictionary={dictionary}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CurriculumLessonRow({
  lesson,
  dictionary,
}: {
  lesson: NonNullable<
    Course['purchaseProof']
  >['previewCurriculum']['modules'][number]['lessons'][number];
  dictionary: any;
}) {
  const t = dictionary.course.marketplace.proof;
  const duration = courseDurationLabel(lesson.videoDurationSeconds, dictionary);

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-2 text-sm dark:bg-white/8">
      {lesson.isLocked ? (
        <LuLock className="text-primary size-4 shrink-0" />
      ) : (
        <LuCheck className="text-muted-foreground size-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1 font-semibold">{lesson.title}</span>
      {duration && (
        <span className="text-muted-foreground hidden text-xs sm:inline">
          {duration}
        </span>
      )}
      {lesson.isPreview && (
        <Badge variant="secondary" className="rounded-lg">
          {t.freePreview}
        </Badge>
      )}
      {lesson.isLocked && (
        <Badge variant="outline" className="rounded-lg">
          {t.lockedAfterPurchase}
        </Badge>
      )}
    </div>
  );
}

function VerifiedReviewsSection({
  course,
  dictionary,
  locale,
}: {
  course: Course;
  dictionary: any;
  locale: string;
}) {
  const proof = course.purchaseProof;
  if (!proof) {
    return null;
  }

  const t = dictionary.course.marketplace.proof;
  const reviews = proof.verifiedReviews;

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-xl font-extrabold">{t.reviewsTitle}</h2>
        <p className="text-muted-foreground text-sm">{t.reviewsBody}</p>
      </div>

      {reviews.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="nex-glass-card rounded-2xl border-white/70 p-5 dark:border-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {review.reviewer.image && (
                      <AvatarImage
                        src={review.reviewer.image}
                        alt={review.reviewer.name || t.verifiedLearner}
                      />
                    )}
                    <AvatarFallback>
                      {avatarInitials(
                        review.reviewer.name || t.verifiedLearner,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">
                      {review.reviewer.name || t.verifiedLearner}
                    </div>
                    {review.verifiedLearner && (
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <LuShieldCheck className="size-3.5" />
                        {t.verifiedLearner}
                      </div>
                    )}
                  </div>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="nex-glass-card rounded-2xl border-white/70 p-6 dark:border-white/10">
          <div className="flex items-start gap-3">
            <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
              <LuStar className="size-5" />
            </span>
            <div>
              <h3 className="font-extrabold">{t.noReviewsTitle}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {t.noReviewsBody}
              </p>
            </div>
          </div>
        </div>
      )}

      {proof.completionStats.ratingCount > 0 && (
        <p className="text-muted-foreground text-sm">
          {courseRatingLabel(course, dictionary, locale)}
        </p>
      )}
    </section>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <LuStar
          key={value}
          className={
            value <= rating
              ? 'text-primary size-4 fill-current'
              : 'text-muted-foreground/40 size-4'
          }
        />
      ))}
    </div>
  );
}

function CourseModulesSection({
  course,
  isEnrolled,
  dictionary,
}: {
  course: Course;
  isEnrolled: boolean;
  dictionary: any;
}) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-extrabold">
        {dictionary.course.learn.modules}
      </h2>
      {course.modules.map((module) => (
        <Card
          key={module.id}
          className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10"
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <span className="bg-primary/10 text-primary mt-0.5 grid size-10 place-items-center rounded-xl">
                <LuLayers3 className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold">{module.title}</h3>
                {module.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {module.description}
                  </p>
                )}
                <div className="mt-4 grid gap-2">
                  {(module.lessons || []).map((lesson) => {
                    const isLocked =
                      !isEnrolled &&
                      course.accessType !== 'free' &&
                      !lesson.isPreview;
                    const isPreview =
                      !isEnrolled &&
                      course.accessType !== 'free' &&
                      lesson.isPreview;

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-2 text-sm dark:bg-white/8"
                      >
                        {isLocked ? (
                          <LuLock className="text-primary size-4" />
                        ) : (
                          <LuCheck className="text-muted-foreground size-4" />
                        )}
                        <span className="min-w-0 flex-1 font-semibold">
                          {lesson.title}
                        </span>
                        {isPreview && (
                          <Badge variant="secondary" className="rounded-lg">
                            {dictionary.course.marketplace.unlock.previewLesson}
                          </Badge>
                        )}
                        {isLocked && (
                          <Badge variant="outline" className="rounded-lg">
                            {dictionary.course.marketplace.unlock.lockedLesson}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function avatarInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function LuCircleCheckIcon() {
  return <LuCheck className="text-primary mt-0.5 size-4 shrink-0" />;
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

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
      <div className="flex items-center gap-3">
        <span className="text-primary bg-nexexam-primary/10 grid size-10 place-items-center rounded-xl">
          {icon}
        </span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className="text-lg font-extrabold">{value}</span>
    </div>
  );
}
