import { ReactNode, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LuBookOpen,
  LuBookmark,
  LuArrowRight,
  LuChevronDown,
  LuCircle,
  LuCircleCheck,
  LuCircleHelp,
  LuCirclePlay,
  LuDownload,
  LuFileText,
  LuLock,
  LuListChecks,
  LuPause,
  LuPictureInPicture,
  LuVolumeX,
  LuX,
} from 'react-icons/lu';
import { parseVideoEmbedUrl } from '@/features/course/courseBuilderUtils';
import { LessonBlockView } from '@/features/course/components/LessonBlockView';
import type {
  Course,
  CourseLesson,
  CourseLessonBlock,
  CourseModule,
  CourseQuiz,
} from '@/features/course/courseTypes';
import { FilesList } from '@/features/file/components/FilesList';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';

type CourseLearningPlayerProps = {
  course: Course;
  selectedLesson: CourseLesson;
  completedLessonIds: Set<string>;
  completionPercent: number;
  onSelectLesson: (lessonId: string) => void;
  onCompleteLesson?: (lessonId: string) => void;
  completeLessonPending?: boolean;
  hasSelectedQuiz?: boolean;
  quizSectionId?: string;
  noteSectionId?: string;
  afterLessonContent?: ReactNode;
  activityContent?: ReactNode;
  supportContent?: ReactNode;
  mode?: 'student' | 'preview';
};

type OutlineModule = Pick<CourseModule, 'id' | 'title' | 'description'> & {
  lessons: CourseLesson[];
};

type LessonVideoSource = {
  type: 'embed' | 'file';
  url: string;
};

export function CourseLearningPlayer({
  course,
  selectedLesson,
  completedLessonIds,
  completionPercent,
  onSelectLesson,
  onCompleteLesson,
  completeLessonPending = false,
  hasSelectedQuiz = false,
  quizSectionId,
  noteSectionId,
  afterLessonContent,
  activityContent,
  supportContent,
  mode = 'student',
}: CourseLearningPlayerProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const [miniPlayerOpen, setMiniPlayerOpen] = useState(false);
  const modules = useMemo(() => buildOutlineModules(course), [course]);
  const orderedLessons = useMemo(
    () => modules.flatMap((module) => module.lessons),
    [modules],
  );
  const nextLesson =
    orderedLessons[
      orderedLessons.findIndex((lesson) => lesson.id === selectedLesson.id) + 1
    ];
  const outlineSectionId = `course-outline-${course.id}`;
  const currentModule = useMemo(
    () =>
      modules.find((module) =>
        module.lessons.some((lesson) => lesson.id === selectedLesson.id),
      ) || null,
    [modules, selectedLesson.id],
  );
  const videoSource = getLessonVideoSource(selectedLesson);
  const formattedProgress = new Intl.NumberFormat(locale).format(
    completionPercent,
  );
  const progressLabel = dictionary.course.learn.progressComplete.replace(
    '{0}',
    formattedProgress,
  );

  useEffect(() => {
    setMiniPlayerOpen(false);
  }, [selectedLesson.id]);

  return (
    <div className="relative">
      <Card className="nex-glass-card overflow-hidden rounded-3xl border-white/70 py-0 shadow-[0_24px_60px_rgb(15_23_42/0.08)] dark:border-white/10">
        <header className="border-nexexam-line/80 border-b bg-white/86 px-4 py-4 backdrop-blur-xl md:px-5 dark:border-white/10 dark:bg-white/8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-nexexam-primary/10 text-nexexam-primary grid size-11 shrink-0 place-items-center rounded-2xl">
                <LuBookOpen className="size-5" />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-base font-extrabold md:text-lg">
                  {course.title}
                </h1>
                <p className="text-muted-foreground truncate text-xs font-semibold">
                  {currentModule
                    ? dictionary.course.learn.currentModule.replace(
                        '{0}',
                        currentModule.title,
                      )
                    : dictionary.course.learn.modules}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-56">
              <Progress value={completionPercent} className="gap-2">
                <span className="text-muted-foreground text-xs font-semibold">
                  {progressLabel}
                </span>
              </Progress>
            </div>
          </div>
        </header>

        <CardContent className="p-0">
          <div className="grid min-h-[calc(100svh-220px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_370px]">
            <main className="border-nexexam-line/80 min-w-0 bg-white/64 p-4 pb-32 md:p-6 md:pb-12 dark:border-white/10 dark:bg-white/4">
              <div className="mx-auto grid max-w-5xl gap-5">
                <LessonViewer
                  course={course}
                  lesson={selectedLesson}
                  videoSource={videoSource}
                  isComplete={completedLessonIds.has(selectedLesson.id)}
                  isCompleting={completeLessonPending}
                  onCompleteLesson={onCompleteLesson}
                  hasSelectedQuiz={hasSelectedQuiz}
                  quizSectionId={quizSectionId}
                  noteSectionId={noteSectionId}
                  onOpenMiniPlayer={
                    videoSource ? () => setMiniPlayerOpen(true) : undefined
                  }
                  mode={mode}
                />

                {afterLessonContent}
                {activityContent && (
                  <div className="grid gap-5">{activityContent}</div>
                )}
              </div>
            </main>

            <aside
              id={outlineSectionId}
              className="border-nexexam-line/80 border-t bg-white/92 xl:border-t-0 xl:border-l dark:border-white/10 dark:bg-white/6"
            >
              <div className="sticky top-20 grid max-h-none gap-4 p-4 xl:max-h-[calc(100svh-96px)] xl:overflow-y-auto">
                <CourseOutlinePanel
                  modules={modules}
                  quizzes={course.quizzes || []}
                  selectedLessonId={selectedLesson.id}
                  completedLessonIds={completedLessonIds}
                  onSelectLesson={onSelectLesson}
                />
                {supportContent}
              </div>
            </aside>
          </div>
        </CardContent>
      </Card>

      {miniPlayerOpen && videoSource && (
        <MiniPiPVideoPlayer
          lesson={selectedLesson}
          videoSource={videoSource}
          onClose={() => setMiniPlayerOpen(false)}
        />
      )}

      {mode === 'student' && (
        <MobileLearningDock
          selectedLesson={selectedLesson}
          isComplete={completedLessonIds.has(selectedLesson.id)}
          isCompleting={completeLessonPending}
          onCompleteLesson={onCompleteLesson}
          outlineSectionId={outlineSectionId}
          nextLesson={nextLesson}
          onSelectLesson={onSelectLesson}
        />
      )}
    </div>
  );
}

function MobileLearningDock({
  selectedLesson,
  isComplete,
  isCompleting,
  onCompleteLesson,
  outlineSectionId,
  nextLesson,
  onSelectLesson,
}: {
  selectedLesson: CourseLesson;
  isComplete: boolean;
  isCompleting: boolean;
  onCompleteLesson?: (lessonId: string) => void;
  outlineSectionId: string;
  nextLesson?: CourseLesson;
  onSelectLesson: (lessonId: string) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="border-nexexam-line/80 fixed inset-x-0 bottom-0 z-30 border-t bg-white/92 px-3 py-3 shadow-[0_-18px_38px_rgb(15_23_42/0.12)] backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-neutral-950/92">
      <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto_auto] items-center gap-2">
        <Button
          data-testid="course-learn-mobile-complete-button"
          className="h-11 min-w-0 rounded-xl"
          disabled={isCompleting || isComplete || !onCompleteLesson}
          onClick={() => onCompleteLesson?.(selectedLesson.id)}
        >
          <LuCircleCheck className="size-4 shrink-0" />
          <span className="truncate">
            {isComplete
              ? dictionary.course.learn.completedLesson
              : dictionary.course.learn.completeLesson}
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-xl bg-white/85 dark:bg-white/8"
          aria-label={dictionary.course.mobile.outline}
          onClick={() => scrollToSection(outlineSectionId)}
        >
          <LuListChecks className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-xl bg-white/85 dark:bg-white/8"
          aria-label={dictionary.course.mobile.nextLesson}
          disabled={!nextLesson}
          onClick={() => nextLesson && onSelectLesson(nextLesson.id)}
        >
          <LuArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function LessonViewer({
  course,
  lesson,
  videoSource,
  isComplete,
  isCompleting,
  onCompleteLesson,
  hasSelectedQuiz,
  quizSectionId,
  noteSectionId,
  onOpenMiniPlayer,
  mode,
}: {
  course: Course;
  lesson: CourseLesson;
  videoSource: LessonVideoSource | null;
  isComplete: boolean;
  isCompleting: boolean;
  onCompleteLesson?: (lessonId: string) => void;
  hasSelectedQuiz: boolean;
  quizSectionId?: string;
  noteSectionId?: string;
  onOpenMiniPlayer?: () => void;
  mode: 'student' | 'preview';
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasArticleContent =
    Boolean(lesson.content?.trim()) || Boolean(lesson.blocks?.length);
  const resourcesSectionId = `course-lesson-resources-${lesson.id}`;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/8">
      {videoSource ? (
        <VideoLessonPlayer lesson={lesson} videoSource={videoSource} />
      ) : (
        <ArticleLessonView lesson={lesson} />
      )}

      <div className="grid gap-5 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-xl">
                {course.category || dictionary.course.list.menu}
              </Badge>
              <Badge variant="outline" className="rounded-xl">
                {videoSource
                  ? dictionary.course.learn.lessonKindVideo
                  : dictionary.course.learn.lessonKindArticle}
              </Badge>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-normal">
              {lesson.title}
            </h2>
            {lesson.description && (
              <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
                {lesson.description}
              </p>
            )}
          </div>

          <LessonActionBar
            lessonId={lesson.id}
            isComplete={isComplete}
            isCompleting={isCompleting}
            onCompleteLesson={mode === 'student' ? onCompleteLesson : undefined}
            hasSelectedQuiz={hasSelectedQuiz}
            quizSectionId={quizSectionId}
            noteSectionId={noteSectionId}
            resourcesSectionId={
              lesson.resourceFiles?.length ? resourcesSectionId : undefined
            }
            onOpenMiniPlayer={onOpenMiniPlayer}
          />
        </div>

        {videoSource && hasArticleContent && (
          <ArticleBody lesson={lesson} compact />
        )}

        {!videoSource && !hasArticleContent && (
          <div className="bg-nexexam-soft/70 text-muted-foreground rounded-2xl border border-dashed p-5 text-sm font-semibold dark:bg-white/8">
            {dictionary.course.learn.noLessonContent}
          </div>
        )}

        {lesson.resourceFiles && lesson.resourceFiles.length > 0 && (
          <div id={resourcesSectionId} className="rounded-2xl border p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <LuDownload className="size-4" />
              {dictionary.course.learn.resources}
            </h3>
            <div className="mt-3">
              <FilesList files={lesson.resourceFiles} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function VideoLessonPlayer({
  lesson,
  videoSource,
}: {
  lesson: CourseLesson;
  videoSource: LessonVideoSource;
}) {
  return (
    <div className="bg-nexexam-ink relative aspect-video overflow-hidden">
      {videoSource.type === 'embed' ? (
        <iframe
          src={videoSource.url}
          title={lesson.title}
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <video
          controls
          src={videoSource.url}
          className="h-full w-full"
          preload="metadata"
        />
      )}
    </div>
  );
}

function ArticleLessonView({ lesson }: { lesson: CourseLesson }) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="border-nexexam-line/80 from-nexexam-soft/80 border-b bg-gradient-to-b to-white p-5 md:p-6 dark:border-white/10 dark:from-white/8 dark:to-white/4">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-xl">
            {dictionary.course.learn.lessonKindArticle}
          </Badge>
          <span className="text-muted-foreground text-xs font-semibold">
            {dictionary.course.learn.readingTime.replace(
              '{0}',
              String(estimateReadingMinutes(lesson)),
            )}
          </span>
        </div>
        <ArticleBody lesson={lesson} />
      </div>
    </div>
  );
}

function ArticleBody({
  lesson,
  compact = false,
}: {
  lesson: CourseLesson;
  compact?: boolean;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className={compact ? 'grid gap-4' : 'mt-5 grid gap-5'}>
      {lesson.content && (
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.content}
          </ReactMarkdown>
        </div>
      )}
      {(lesson.blocks?.length || 0) > 0 && (
        <LessonBlockView blocks={lesson.blocks || []} />
      )}
      {!compact && (
        <p className="text-muted-foreground text-xs font-semibold">
          {dictionary.course.learn.articleHint}
        </p>
      )}
    </div>
  );
}

function LessonActionBar({
  lessonId,
  isComplete,
  isCompleting,
  onCompleteLesson,
  hasSelectedQuiz,
  quizSectionId,
  noteSectionId,
  resourcesSectionId,
  onOpenMiniPlayer,
}: {
  lessonId: string;
  isComplete: boolean;
  isCompleting: boolean;
  onCompleteLesson?: (lessonId: string) => void;
  hasSelectedQuiz: boolean;
  quizSectionId?: string;
  noteSectionId?: string;
  resourcesSectionId?: string;
  onOpenMiniPlayer?: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
      <Button
        data-testid="course-learn-complete-lesson-button"
        className="h-10 flex-1 rounded-xl sm:flex-none"
        disabled={isCompleting || isComplete || !onCompleteLesson}
        onClick={() => onCompleteLesson?.(lessonId)}
      >
        <LuCircleCheck className="size-4" />
        {isComplete
          ? dictionary.course.learn.completedLesson
          : dictionary.course.learn.completeLesson}
      </Button>

      {hasSelectedQuiz && quizSectionId && (
        <Button
          type="button"
          variant="outline"
          className="h-10 flex-1 rounded-xl bg-white/80 sm:flex-none dark:bg-white/8"
          onClick={() => scrollToSection(quizSectionId)}
        >
          <LuCircleHelp className="size-4" />
          {dictionary.course.learn.takeQuiz}
        </Button>
      )}

      {noteSectionId && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 rounded-xl bg-white/80 dark:bg-white/8"
          aria-label={dictionary.course.learn.saveNote}
          onClick={() => scrollToSection(noteSectionId)}
        >
          <LuBookmark className="size-4" />
        </Button>
      )}

      {resourcesSectionId && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 rounded-xl bg-white/80 dark:bg-white/8"
          aria-label={dictionary.course.learn.downloadResources}
          onClick={() => scrollToSection(resourcesSectionId)}
        >
          <LuDownload className="size-4" />
        </Button>
      )}

      {onOpenMiniPlayer && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 rounded-xl bg-white/80 dark:bg-white/8"
          aria-label={dictionary.course.learn.openMiniPlayer}
          onClick={onOpenMiniPlayer}
        >
          <LuPictureInPicture className="size-4" />
        </Button>
      )}
    </div>
  );
}

function CourseOutlinePanel({
  modules,
  quizzes,
  selectedLessonId,
  completedLessonIds,
  onSelectLesson,
}: {
  modules: OutlineModule[];
  quizzes: CourseQuiz[];
  selectedLessonId: string;
  completedLessonIds: Set<string>;
  onSelectLesson: (lessonId: string) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const selectedModule = modules.find((module) =>
    module.lessons.some((lesson) => lesson.id === selectedLessonId),
  );
  const [openModuleIds, setOpenModuleIds] = useState<Set<string>>(
    () =>
      new Set(
        selectedModule
          ? [selectedModule.id]
          : modules[0]?.id
            ? [modules[0].id]
            : [],
      ),
  );

  useEffect(() => {
    if (selectedModule) {
      setOpenModuleIds((current) => new Set(current).add(selectedModule.id));
    }
  }, [selectedModule?.id]);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-white/8">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-extrabold">
          {dictionary.course.learn.courseOutline}
        </h2>
      </div>
      <div className="max-h-[52svh] overflow-y-auto xl:max-h-none">
        {modules.map((module) => {
          const isOpen = openModuleIds.has(module.id);

          return (
            <div key={module.id} className="border-b last:border-b-0">
              <button
                type="button"
                className="bg-nexexam-soft/70 hover:bg-nexexam-soft flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition dark:bg-white/8 dark:hover:bg-white/12"
                onClick={() =>
                  setOpenModuleIds((current) => {
                    const next = new Set(current);
                    if (next.has(module.id)) {
                      next.delete(module.id);
                    } else {
                      next.add(module.id);
                    }
                    return next;
                  })
                }
              >
                <span className="line-clamp-2 text-sm font-extrabold">
                  {module.title}
                </span>
                <LuChevronDown
                  className={cn(
                    'text-muted-foreground size-4 shrink-0 transition',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              {isOpen && (
                <div className="py-1">
                  {module.lessons.map((lesson) => (
                    <LessonOutlineRow
                      key={lesson.id}
                      lesson={lesson}
                      quizzes={quizzes}
                      isActive={lesson.id === selectedLessonId}
                      isComplete={completedLessonIds.has(lesson.id)}
                      onSelect={() => onSelectLesson(lesson.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LessonOutlineRow({
  lesson,
  quizzes,
  isActive,
  isComplete,
  onSelect,
}: {
  lesson: CourseLesson;
  quizzes: CourseQuiz[];
  isActive: boolean;
  isComplete: boolean;
  onSelect: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const kind = getLessonKind(lesson, quizzes);
  const isLocked = false;
  const duration = getLessonDurationLabel(lesson, quizzes, dictionary);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition',
        isActive
          ? 'bg-nexexam-primary/10 text-nexexam-primary'
          : 'hover:bg-nexexam-soft/80 dark:hover:bg-white/8',
        isLocked && 'cursor-not-allowed opacity-60',
      )}
    >
      <span className="mt-0.5 shrink-0">
        {isLocked ? (
          <LuLock className="text-muted-foreground size-4" />
        ) : isComplete ? (
          <LuCircleCheck className="text-nexexam-success size-4" />
        ) : isActive ? (
          <LuCircle className="text-nexexam-primary size-4" />
        ) : (
          <LuCircle className="text-muted-foreground size-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'line-clamp-2 text-sm',
            isActive ? 'font-extrabold' : 'text-foreground font-semibold',
          )}
        >
          {lesson.title}
        </span>
        <span className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs font-semibold">
          {kind === 'video' ? (
            <LuCirclePlay className="size-3.5" />
          ) : kind === 'quiz' ? (
            <LuCircleHelp className="size-3.5" />
          ) : (
            <LuFileText className="size-3.5" />
          )}
          <span>{duration}</span>
        </span>
      </span>
    </button>
  );
}

function MiniPiPVideoPlayer({
  lesson,
  videoSource,
  onClose,
}: {
  lesson: CourseLesson;
  videoSource: LessonVideoSource;
  onClose: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const status = lesson.videoDurationSeconds
    ? `${dictionary.course.learn.playing} - ${formatDurationFromSeconds(
        lesson.videoDurationSeconds,
        dictionary,
      )}`
    : dictionary.course.learn.playing;

  return (
    <div className="fixed right-4 bottom-6 z-40 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-white shadow-2xl shadow-black/15 dark:bg-neutral-950">
      <div className="bg-nexexam-ink relative aspect-video">
        {videoSource.type === 'embed' ? (
          <iframe
            src={videoSource.url}
            title={lesson.title}
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <video controls src={videoSource.url} className="h-full w-full" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold">{lesson.title}</p>
          <p className="text-muted-foreground mt-0.5 text-[11px] font-semibold">
            {status}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground hidden items-center gap-1 sm:flex">
            <LuPause className="size-3.5" />
            <LuVolumeX className="size-3.5" />
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label={dictionary.course.learn.closeMiniPlayer}
            onClick={onClose}
          >
            <LuX className="size-4" />
          </Button>
        </div>
      </div>
      <div className="bg-nexexam-soft h-1">
        <div className="bg-nexexam-primary h-full w-1/3" />
      </div>
    </div>
  );
}

function buildOutlineModules(course: Course): OutlineModule[] {
  const sortedModules = [...(course.modules || [])].sort(orderByIndex);
  const modules = sortedModules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    lessons: sortedLessons(
      module.lessons?.length
        ? module.lessons
        : (course.lessons || []).filter(
            (lesson) => lesson.moduleId === module.id,
          ),
    ),
  }));

  if (modules.length) {
    return modules;
  }

  return [
    {
      id: course.id,
      title: course.title,
      description: course.subtitle,
      lessons: sortedLessons(course.lessons || []),
    },
  ];
}

function sortedLessons(lessons: CourseLesson[]) {
  return [...lessons].sort(orderByIndex);
}

function orderByIndex<T extends { orderIndex: number }>(a: T, b: T) {
  return a.orderIndex - b.orderIndex;
}

function getLessonVideoSource(lesson: CourseLesson): LessonVideoSource | null {
  const embedUrl = parseVideoEmbedUrl(lesson.videoUrl);
  if (embedUrl) {
    return { type: 'embed', url: embedUrl };
  }

  const uploadedVideo = lesson.videoFiles?.[0];
  const uploadedVideoUrl =
    uploadedVideo?.downloadUrl ||
    uploadedVideo?.signedUrl ||
    uploadedVideo?.publicUrl;

  return uploadedVideoUrl ? { type: 'file', url: uploadedVideoUrl } : null;
}

function getLessonKind(lesson: CourseLesson, quizzes: CourseQuiz[]) {
  if (getLessonVideoSource(lesson)) {
    return 'video';
  }

  if (quizzes.some((quiz) => quiz.lessonId === lesson.id)) {
    return 'quiz';
  }

  return 'article';
}

function getLessonDurationLabel(
  lesson: CourseLesson,
  quizzes: CourseQuiz[],
  dictionary: ReturnType<typeof useAuthStore.getState>['dictionary'],
) {
  if (lesson.videoDurationSeconds) {
    return formatDurationFromSeconds(lesson.videoDurationSeconds, dictionary);
  }

  const quiz = quizzes.find((item) => item.lessonId === lesson.id);
  if (quiz) {
    return dictionary.course.learn.durationQuestions.replace(
      '{0}',
      String(quiz.questions.length),
    );
  }

  return dictionary.course.learn.readingTime.replace(
    '{0}',
    String(estimateReadingMinutes(lesson)),
  );
}

function formatDurationFromSeconds(
  seconds: number,
  dictionary: ReturnType<typeof useAuthStore.getState>['dictionary'],
) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return dictionary.course.learn.durationMinutes.replace(
    '{0}',
    String(minutes),
  );
}

function estimateReadingMinutes(lesson: CourseLesson) {
  const text = [lesson.content || '', ...(lesson.blocks || []).map(blockText)]
    .join(' ')
    .trim();
  const words = text ? text.split(/\s+/).length : 120;
  return Math.max(1, Math.ceil(words / 180));
}

function blockText(block: CourseLessonBlock) {
  const content = block.content || {};
  const text = typeof content.text === 'string' ? content.text : '';
  const items = Array.isArray(content.items)
    ? content.items.filter((item): item is string => typeof item === 'string')
    : [];
  return [text, ...items].join(' ');
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
