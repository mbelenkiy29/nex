import { createLazyRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { LuCircle, LuCircleCheck, LuSend } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { evaluatePublishChecklist } from '@/features/course/courseBuilderUtils';
import {
  missingTrustSafetyPolicies,
  PolicyAcceptanceDialog,
  useTrustSafetyPolicies,
} from '@/features/trustSafety/PolicyAcceptanceDialog';
import { Button } from '@/shared/components/ui/button';
import { useBuilder } from '../BuilderContext';
import { BuilderCard } from '../components/primitives';

export const builderSubmitLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/submit',
)({ component: PublishChecklistScreen });

// Links a checklist row to the builder section where it can be fixed.
function SectionLink({
  section,
  courseId,
  children,
}: {
  section: string;
  courseId: string;
  children: ReactNode;
}) {
  const className = 'text-primary shrink-0 text-xs font-bold hover:underline';
  if (section === 'goals') {
    return (
      <Link
        to="/creator/courses/$courseId/edit/goals"
        params={{ courseId }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  if (section === 'landing-page') {
    return (
      <Link
        to="/creator/courses/$courseId/edit/landing-page"
        params={{ courseId }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  if (section === 'practice-exams') {
    return (
      <Link
        to="/creator/courses/$courseId/edit/practice-exams"
        params={{ courseId }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  if (section === 'flashcards') {
    return (
      <Link
        to="/creator/courses/$courseId/edit/flashcards"
        params={{ courseId }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      to="/creator/courses/$courseId/edit/curriculum"
      params={{ courseId }}
      className={className}
    >
      {children}
    </Link>
  );
}

// "Publish" phase — mirrors the backend submit checklist and gates submission.
function PublishChecklistScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const checklist = builder.checklist;
  const labels = checklist as Record<string, string>;
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const {
    courseId,
    form,
    status,
    editable,
    saveStatus,
    saveNow,
    submit,
    submitPending,
  } = useBuilder();

  const items = evaluatePublishChecklist(form);
  const requiredItems = items.filter((item) => item.severity !== 'warning');
  const recommendedItems = items.filter((item) => item.severity === 'warning');
  const allMet = requiredItems.every((item) => item.met);
  const policiesQuery = useTrustSafetyPolicies(status === 'draft');
  const missingTeacherPolicies = missingTrustSafetyPolicies(
    policiesQuery.data?.policies,
    ['teacherTerms'],
  );

  const statusHint =
    status === 'inReview'
      ? builder.statusInReview
      : status === 'published'
        ? builder.statusPublished
        : status === 'archived'
          ? builder.statusArchived
          : builder.statusDraft;

  const handleSubmit = async () => {
    if (policiesQuery.isLoading || missingTeacherPolicies.length) {
      setPolicyDialogOpen(true);
      return;
    }

    if (!window.confirm(builder.submitConfirm)) {
      return;
    }
    const saved = await saveNow();
    if (saved) {
      submit();
    }
  };

  return (
    <BuilderCard
      icon={<LuSend className="size-5" />}
      title={checklist.title}
      description={checklist.intro}
    >
      {status !== 'draft' ? (
        <p className="text-muted-foreground text-sm">{statusHint}</p>
      ) : (
        <>
          <ul className="grid gap-1.5">
            <li className="text-muted-foreground px-1 text-xs font-bold uppercase">
              {checklist.required}
            </li>
            {requiredItems.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-2 rounded-xl border bg-white/70 p-3 text-sm dark:bg-white/8"
              >
                {item.met ? (
                  <LuCircleCheck className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <LuCircle className="text-muted-foreground size-4 shrink-0" />
                )}
                <span
                  className={
                    item.met
                      ? 'text-muted-foreground flex-1 line-through'
                      : 'flex-1 font-semibold'
                  }
                >
                  {labels[item.key]}
                </span>
                {!item.met && (
                  <SectionLink section={item.section} courseId={courseId}>
                    {checklist.fix}
                  </SectionLink>
                )}
              </li>
            ))}
            <li className="text-muted-foreground px-1 pt-3 text-xs font-bold uppercase">
              {checklist.recommended}
            </li>
            {recommendedItems.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-2 rounded-xl border bg-white/70 p-3 text-sm dark:bg-white/8"
              >
                {item.met ? (
                  <LuCircleCheck className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <LuCircle className="text-muted-foreground size-4 shrink-0" />
                )}
                <span
                  className={
                    item.met
                      ? 'text-muted-foreground flex-1 line-through'
                      : 'flex-1 font-semibold'
                  }
                >
                  {labels[item.key]}
                </span>
                {!item.met && (
                  <SectionLink section={item.section} courseId={courseId}>
                    {checklist.fix}
                  </SectionLink>
                )}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-sm">
            {allMet ? checklist.ready : checklist.notReady}
          </p>
          {missingTeacherPolicies.length > 0 && (
            <div className="rounded-xl border bg-white/70 p-3 text-sm dark:bg-white/8">
              <div className="font-bold">
                {dictionary.trustSafety.policies.teacherTermsRequired}
              </div>
              <p className="text-muted-foreground mt-1">
                {dictionary.trustSafety.policies.teacherTermsRequiredBody}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                {dictionary.trustSafety.policies.teacherTerms.onboardingSummary}
              </p>
              <Button
                variant="outline"
                className="mt-3 h-9 rounded-lg"
                onClick={() => setPolicyDialogOpen(true)}
              >
                {dictionary.trustSafety.policies.reviewTerms}
              </Button>
            </div>
          )}
          <Button
            data-testid="course-builder-submit-confirm"
            className="h-10 justify-self-start rounded-xl"
            disabled={
              !allMet ||
              !editable ||
              submitPending ||
              saveStatus === 'saving' ||
              policiesQuery.isLoading ||
              missingTeacherPolicies.length > 0
            }
            onClick={handleSubmit}
          >
            <LuSend className="size-4" />
            {builder.actions.submitForReview}
          </Button>
          <PolicyAcceptanceDialog
            open={policyDialogOpen}
            onOpenChange={setPolicyDialogOpen}
            requiredTypes={['teacherTerms']}
          />
        </>
      )}
    </BuilderCard>
  );
}
