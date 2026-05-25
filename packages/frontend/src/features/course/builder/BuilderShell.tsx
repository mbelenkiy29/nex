import {
  createLazyRoute,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import {
  LuArrowRight,
  LuCircleCheck,
  LuLoaderCircle,
  LuRotateCcw,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import {
  courseBuilderCompletion,
  courseBuilderNextStep,
  type CourseBuilderSection,
} from '@/features/course/courseBuilderUtils';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { BuilderProvider, useBuilder } from './BuilderContext';
import { BuilderSidebar } from './BuilderSidebar';
import { BuilderTopBar } from './BuilderTopBar';
import {
  builderLastSectionWrite,
  builderSectionFromPath,
} from './builderLocalState';

export const builderShellLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit',
)({
  component: BuilderShellRoute,
});

// Layout route for the whole course builder. Stays mounted while the creator
// moves between section sub-routes, so form state and autosave survive.
function BuilderShellRoute() {
  const { courseId } = useParams({ from: '/creator/courses/$courseId/edit' });
  const { pathname } = useLocation();

  useEffect(() => {
    const section = builderSectionFromPath(pathname);
    if (section) {
      builderLastSectionWrite(courseId, section);
    }
  }, [courseId, pathname]);

  return (
    <BuilderProvider key={courseId} courseId={courseId}>
      <BuilderShell />
    </BuilderProvider>
  );
}

function BuilderShell() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const { isLoading, isError, isVerifiedCreator, status, reviewNotes } =
    useBuilder();

  return (
    <div className="nex-dashboard-shell flex flex-col gap-5 px-4 py-6 lg:px-7">
      <BuilderTopBar />
      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <BuilderSidebar />
        <main className="flex min-w-0 flex-col gap-4">
          {!isVerifiedCreator && (
            <Card className="border-nexexam-warning/30 bg-nexexam-warning/10 rounded-2xl">
              <CardContent className="p-4 text-sm font-semibold">
                {builder.verifyRequired}
              </CardContent>
            </Card>
          )}
          {status === 'draft' && reviewNotes && (
            <Card className="border-nexexam-warning/30 bg-nexexam-warning/10 rounded-2xl">
              <CardContent className="p-4">
                <h2 className="text-sm font-extrabold">
                  {builder.reviewNotesTitle}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                  {reviewNotes}
                </p>
              </CardContent>
            </Card>
          )}
          {isLoading ? (
            <div className="text-muted-foreground grid place-items-center py-24">
              <LuLoaderCircle className="size-6 animate-spin" />
            </div>
          ) : isError ? (
            <Card className="rounded-2xl">
              <CardContent className="p-6 text-sm font-semibold">
                {builder.loadError}
              </CardContent>
            </Card>
          ) : (
            <>
              <BuilderNextStepPanel />
              <Outlet />
            </>
          )}
        </main>
      </div>
      <BuilderRecoveryDialog />
    </div>
  );
}

function navigateToBuilderSection(
  navigate: ReturnType<typeof useNavigate>,
  courseId: string,
  section: CourseBuilderSection,
) {
  if (section === 'goals') {
    navigate({ to: '/creator/courses/$courseId/edit/goals', params: { courseId } });
    return;
  }
  if (section === 'landing-page') {
    navigate({
      to: '/creator/courses/$courseId/edit/landing-page',
      params: { courseId },
    });
    return;
  }
  if (section === 'practice-exams') {
    navigate({
      to: '/creator/courses/$courseId/edit/practice-exams',
      params: { courseId },
    });
    return;
  }
  if (section === 'flashcards') {
    navigate({
      to: '/creator/courses/$courseId/edit/flashcards',
      params: { courseId },
    });
    return;
  }
  if (section === 'ai-assistant') {
    navigate({
      to: '/creator/courses/$courseId/edit/ai-assistant',
      params: { courseId },
    });
    return;
  }
  if (section === 'submit') {
    navigate({ to: '/creator/courses/$courseId/edit/submit', params: { courseId } });
    return;
  }
  navigate({
    to: '/creator/courses/$courseId/edit/curriculum',
    params: { courseId },
  });
}

function BuilderNextStepPanel() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const navigate = useNavigate();
  const { courseId, form, status, editable } = useBuilder();
  const completion = courseBuilderCompletion(form);
  const nextStep = courseBuilderNextStep(form);
  const checklistLabels = builder.checklist as Record<string, string>;

  if (status !== 'draft') {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-2xl border-white/70 dark:border-white/10">
      <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-extrabold">
              {builder.nextStep.title}
            </h2>
            <span className="text-muted-foreground text-xs font-semibold">
              {completion.percent}%
            </span>
          </div>
          <Progress value={completion.percent} className="mt-2 h-2" />
          <p className="text-muted-foreground mt-2 text-sm">
            {nextStep
              ? checklistLabels[nextStep.key]
              : builder.nextStep.ready}
          </p>
        </div>
        {nextStep ? (
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
            disabled={!editable}
            onClick={() =>
              navigateToBuilderSection(navigate, courseId, nextStep.section)
            }
          >
            <LuArrowRight className="size-4" />
            {builder.nextStep.fix}
          </Button>
        ) : (
          <Button
            type="button"
            className="h-9 rounded-xl"
            disabled={!editable}
            onClick={() =>
              navigateToBuilderSection(navigate, courseId, 'submit')
            }
          >
            <LuCircleCheck className="size-4" />
            {builder.nextStep.review}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function BuilderRecoveryDialog() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder.recovery;
  const {
    recoverySnapshot,
    restoreRecovery,
    discardRecovery,
    dismissRecovery,
  } = useBuilder();

  if (!recoverySnapshot) {
    return null;
  }

  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && dismissRecovery()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LuRotateCcw className="size-5" />
            {builder.title}
          </AlertDialogTitle>
          <AlertDialogDescription>{builder.body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={dismissRecovery}>
            {builder.later}
          </Button>
          <Button variant="destructive" onClick={discardRecovery}>
            {builder.discard}
          </Button>
          <Button onClick={restoreRecovery}>{builder.restore}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
