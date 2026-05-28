import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useQuery } from '@tanstack/react-query';
import {
  createLazyRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import {
  LuAward,
  LuBookOpen,
  LuBrain,
  LuCheck,
  LuCircleAlert,
  LuClipboardList,
  LuLayers,
  LuPlay,
  LuRefreshCw,
  LuShieldCheck,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAiTutorCreateConversation } from '@/features/aiTutor/hooks/useAiTutorCreateConversation';
import { useAuthStore } from '@/features/auth/authStore';
import { useChatbotStore } from '@/features/chatbot/chatbotStore';
import type { CourseActivationResponse } from '@/features/course/courseTypes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Spinner } from '@/shared/components/ui/spinner';
import { apiClient } from '@/shared/lib/apiClient';
import {
  productAnalyticsTrack,
  productAnalyticsTrackOnce,
} from '@/shared/lib/productAnalytics';

export const courseActivationLazyRoute = createLazyRoute(
  '/course/$id/activation',
)({
  component: CourseActivationPage,
});

export function CourseActivationPage() {
  const { dictionary } = useAuthStore(
    useShallow((state) => ({ dictionary: state.dictionary })),
  );
  const { id } = useParams({ from: '/course/$id/activation' });
  const search = useSearch({ strict: false }) as { session_id?: string };
  const navigate = useNavigate();
  const createConversation = useAiTutorCreateConversation();
  const setChatbotContext = useChatbotStore((state) => state.setContext);
  const [pollUntil] = useState(() => Date.now() + 20_000);

  const activationQuery = useQuery({
    queryKey: ['course', 'activation', id, search.session_id || null],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/course/${id}/activation`, { signal })
        .json<CourseActivationResponse>(),
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && !data.activationReady && Date.now() < pollUntil
        ? 1500
        : false;
    },
  });

  const activation = activationQuery.data;
  const t = dictionary.course.activation;
  const tutorPrompt = useMemo(() => {
    if (!activation) {
      return '';
    }
    if (activation.aiTutorStarter.lessonTitle) {
      return dictionaryFormat(
        t.aiTutorPromptLesson,
        activation.course.title,
        activation.aiTutorStarter.lessonTitle,
      );
    }

    return dictionaryFormat(t.aiTutorPromptCourse, activation.course.title);
  }, [activation, t]);

  useEffect(() => {
    if (!activation) {
      return;
    }

    productAnalyticsTrackOnce(
      `activation_seen:course:${activation.course.id}`,
      {
        eventName: 'activation_seen',
        courseId: activation.course.id,
        accessType: activation.course.accessType,
        stripeCheckoutSessionId: search.session_id || null,
        ctaLocation: 'course_activation',
        funnelId: `course:${activation.course.id}`,
        metadata: {
          activationReady: activation.activationReady,
          hasRecommendedLesson: Boolean(activation.recommendedLesson),
        },
      },
    );
  }, [activation, search.session_id]);

  const trackActivationClick = (ctaLocation: string) => {
    if (!activation) {
      return;
    }

    productAnalyticsTrack({
      eventName: 'activation_cta_click',
      courseId: activation.course.id,
      lessonId: activation.recommendedLesson?.id ?? null,
      accessType: activation.course.accessType,
      stripeCheckoutSessionId: search.session_id || null,
      ctaLocation,
      funnelId: `course:${activation.course.id}`,
      metadata: {
        activationReady: activation.activationReady,
      },
    });
  };

  const handleTutorStart = async () => {
    if (!activation || !tutorPrompt.trim()) {
      return;
    }

    productAnalyticsTrack({
      eventName: 'ai_tutor_starter_click',
      courseId: activation.course.id,
      lessonId: activation.aiTutorStarter.lessonId ?? null,
      accessType: activation.course.accessType,
      stripeCheckoutSessionId: search.session_id || null,
      ctaLocation: 'course_activation_ai_tutor',
      funnelId: `course:${activation.course.id}`,
      metadata: {
        promptSource: 'post_purchase_activation',
      },
    });

    setChatbotContext({
      courseId: activation.course.id,
      lessonId: activation.aiTutorStarter.lessonId || undefined,
      courseTitle: activation.course.title,
    });
    const result = await createConversation.mutateAsync({
      courseId: activation.course.id,
      lessonId: activation.aiTutorStarter.lessonId || undefined,
      initialMessage: tutorPrompt,
    });
    await navigate({
      to: '/student/ai-tutor/$conversationId',
      params: { conversationId: result.conversation.id },
    });
  };

  if (activationQuery.isLoading || !activation) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
          <p className="text-muted-foreground text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!activation.activationReady) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-8 lg:px-7">
        <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="p-7 text-center lg:p-9">
            <span className="bg-nexexam-primary/10 text-nexexam-primary mx-auto grid size-14 place-items-center rounded-2xl">
              <LuRefreshCw className="size-6 animate-spin" />
            </span>
            <h1 className="text-nexexam-ink mt-5 text-3xl font-extrabold tracking-normal dark:text-white">
              {t.unlockingTitle}
            </h1>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
              {dictionaryFormat(t.unlockingBody, activation.course.title)}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                className="h-11 rounded-xl"
                onClick={() => activationQuery.refetch()}
              >
                <LuRefreshCw className="size-4" />
                {t.retryUnlock}
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                className="h-11 rounded-xl"
                render={
                  <Link
                    to="/course/$slug"
                    params={{ slug: activation.course.slug }}
                  />
                }
              >
                {t.viewCourse}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasPractice = Boolean(activation.practiceSet.availableQuestionCount);
  const hasCertificate = Boolean(activation.certificatePath.certificate);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <section className="nex-glass-card nex-gradient-hero overflow-hidden rounded-3xl p-7 lg:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-xl">
                {t.unlockedPlan}
              </Badge>
              <Badge variant="outline" className="rounded-xl bg-white/70">
                {dictionaryEnumerator(
                  dictionary.course.enumerators.accessType,
                  activation.course.accessType,
                )}
              </Badge>
              <Badge variant="outline" className="rounded-xl bg-white/70">
                <LuShieldCheck className="size-3.5" />
                {dictionary.checkoutTrust.secureAfterPayment}
              </Badge>
            </div>
            <h1 className="text-nexexam-ink mt-4 text-4xl font-extrabold tracking-normal dark:text-white">
              {activation.course.title}
            </h1>
            {activation.course.subtitle && (
              <p className="text-muted-foreground mt-3 text-lg">
                {activation.course.subtitle}
              </p>
            )}
          </div>
          <Button
            nativeButton={false}
            className="h-12 rounded-xl"
            onClick={() => trackActivationClick('activation_start_lesson')}
            render={
              <Link
                to="/course/$id/learn"
                params={{ id: activation.course.id }}
                search={{
                  lessonId: activation.recommendedLesson?.id,
                  activation: '1',
                }}
              />
            }
          >
            <LuPlay className="size-4" />
            {activation.recommendedLesson ? t.startLesson : t.openPlayer}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-5">
          <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <LuCheck className="text-nexexam-success size-5" />
                {t.whatUnlocked}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <ActivationMetric
                  icon={<LuLayers className="size-5" />}
                  label={dictionary.course.fields.modules}
                  value={String(activation.unlockedPlan.moduleCount)}
                />
                <ActivationMetric
                  icon={<LuBookOpen className="size-5" />}
                  label={dictionary.course.fields.lessons}
                  value={String(activation.unlockedPlan.lessonCount)}
                />
                <ActivationMetric
                  icon={<LuClipboardList className="size-5" />}
                  label={dictionary.course.fields.assignments}
                  value={String(activation.unlockedPlan.assignmentCount)}
                />
                <ActivationMetric
                  icon={<LuBrain className="size-5" />}
                  label={t.aiTutor}
                  value={t.included}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <LuBookOpen className="text-primary size-5" />
                {t.recommendedLesson}
              </h2>
              {activation.recommendedLesson ? (
                <div className="mt-4 rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
                  <div className="font-bold">
                    {activation.recommendedLesson.title}
                  </div>
                  {activation.recommendedLesson.description && (
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                      {activation.recommendedLesson.description}
                    </p>
                  )}
                  <Button
                    nativeButton={false}
                    className="mt-4 h-10 rounded-xl"
                    onClick={() =>
                      trackActivationClick('activation_recommended_lesson')
                    }
                    render={
                      <Link
                        to="/course/$id/learn"
                        params={{ id: activation.course.id }}
                        search={{
                          lessonId: activation.recommendedLesson.id,
                          activation: '1',
                        }}
                      />
                    }
                  >
                    <LuPlay className="size-4" />
                    {t.startLesson}
                  </Button>
                </div>
              ) : (
                <EmptyActivationState
                  icon={<LuCircleAlert className="size-5" />}
                  text={t.noLesson}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <LuTarget className="text-primary size-5" />
                {t.practiceSet}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {dictionaryFormat(
                  t.practiceQuestions,
                  activation.practiceSet.availableQuestionCount ?? 0,
                )}
              </p>
              {hasPractice ? (
                <Button
                  nativeButton={false}
                  className="mt-4 h-10 w-full rounded-xl"
                  onClick={() => trackActivationClick('activation_practice')}
                  render={
                    <Link
                      to="/student/course/$courseId/practice"
                      params={{ courseId: activation.course.id }}
                    />
                  }
                >
                  {t.startPractice}
                </Button>
              ) : (
                <Button className="mt-4 h-10 w-full rounded-xl" disabled>
                  {t.practiceUnavailable}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <LuAward className="text-primary size-5" />
                {t.certificatePath}
              </h2>
              <Progress
                value={activation.certificatePath.percent}
                className="mt-4 h-2"
              />
              <p className="text-muted-foreground mt-3 text-sm">
                {dictionaryFormat(
                  t.certificateProgress,
                  activation.certificatePath.completedLessons,
                  activation.certificatePath.totalLessons,
                )}
              </p>
              {hasCertificate ? (
                <Button
                  nativeButton={false}
                  variant="outline"
                  className="mt-4 h-10 w-full rounded-xl bg-white/70"
                  onClick={() => trackActivationClick('activation_certificate')}
                  render={
                    <Link
                      to="/course/$id/certificate"
                      params={{ id: activation.course.id }}
                    />
                  }
                >
                  {dictionary.course.certificate.view}
                </Button>
              ) : (
                <p className="text-muted-foreground mt-3 text-sm">
                  {activation.certificatePath.enabled
                    ? t.certificateLocked
                    : t.certificateUnavailable}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <LuSparkles className="text-primary size-5" />
                {t.aiTutorStarter}
              </h2>
              <p className="bg-nexexam-primary/10 text-nexexam-primary mt-4 rounded-2xl p-4 text-sm font-semibold">
                {tutorPrompt}
              </p>
              <Button
                type="button"
                className="mt-4 h-10 w-full rounded-xl"
                disabled={createConversation.isPending}
                onClick={handleTutorStart}
              >
                {t.askTutor}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function ActivationMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
      <div className="text-primary">{icon}</div>
      <div className="text-muted-foreground mt-3 text-xs font-semibold">
        {label}
      </div>
      <div className="mt-1 text-xl font-extrabold">{value}</div>
    </div>
  );
}

function EmptyActivationState({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="text-muted-foreground mt-4 flex items-center gap-2 rounded-2xl border bg-white/72 p-4 text-sm dark:bg-white/8">
      {icon}
      {text}
    </div>
  );
}
