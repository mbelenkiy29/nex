import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import type {
  CourseAiGenerationJob,
  CourseAiJobType,
  CourseAiQualityIssue,
} from '@/features/course/courseTypes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Progress, ProgressLabel } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import {
  mergeAiFlashcards,
  mergeAiLesson,
  mergeAiOutline,
  mergeAiQuiz,
  type AiResult,
} from '../aiMerge';
import { useBuilder } from '../BuilderContext';
import { BuilderCard } from '../components/primitives';

export const builderAiLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/ai-assistant',
)({ component: AiAssistantScreen });

function AiAssistantScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const ai = dictionary.course.builder.ai;
  const { courseId, editable, form, mutate } = useBuilder();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AiResult | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState('');

  const selectedLesson = useMemo(
    () => form.lessons.find((lesson) => lesson.id === selectedLessonId),
    [form.lessons, selectedLessonId],
  );

  const generateMutation = useMutation<
    { job: CourseAiGenerationJob },
    Error,
    { jobType: CourseAiJobType; lessonId?: string | null }
  >({
    mutationFn: (data: {
      jobType: CourseAiJobType;
      lessonId?: string | null;
    }) =>
      apiClient
        .post(`api/course-ai/${courseId}/generate`, {
          json: {
            jobType: data.jobType,
            prompt,
            lessonId: data.lessonId ?? null,
          },
        })
        .json<{ job: CourseAiGenerationJob }>(),
    onSuccess: (data) => {
      setResult(null);
      setActiveJobId(data.job.id);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const jobQuery = useQuery<{
    job: CourseAiGenerationJob;
    aiConfigured: boolean;
  }>({
    queryKey: ['courseAiJob', activeJobId],
    enabled: Boolean(activeJobId),
    refetchInterval: (query) => {
      const job = query.state.data?.job;
      return job && isActiveJob(job) ? 1500 : false;
    },
    queryFn: async ({ signal }) => {
      if (!activeJobId) {
        throw new Error(dictionary.shared.errors.unknown);
      }
      return apiClient
        .get(`api/course-ai/jobs/${activeJobId}`, { signal })
        .json<{ job: CourseAiGenerationJob; aiConfigured: boolean }>();
    },
  });

  useEffect(() => {
    const job = jobQuery.data?.job;
    if (!job) {
      return;
    }

    if (job.status === 'completed') {
      setResult({
        jobType: job.jobType,
        output: job.output || {},
        qualityReport: job.qualityReport || null,
        lessonId: extractLessonId(job.input),
      });
      setActiveJobId(null);
      return;
    }

    if (job.status === 'failed') {
      toast.error(jobErrorMessage(ai.errors, job.errorMessage));
      setActiveJobId(null);
    }
  }, [ai.errors, jobQuery.data?.job]);

  const addToCourse = () => {
    if (!result) {
      return;
    }
    if (result.jobType === 'generateOutline') {
      mergeAiOutline(result.output, mutate);
    } else if (result.jobType === 'generateFlashcards') {
      mergeAiFlashcards(result.output, mutate, {
        title: ai.merge.flashcardsTitle,
      });
    } else if (result.jobType === 'generateQuiz') {
      mergeAiQuiz(result.output, mutate, {
        moduleTitle: ai.merge.moduleTitle,
        quizTitle: ai.merge.quizTitle,
        questionSource: ai.merge.questionSource,
      });
    } else if (
      result.jobType === 'generateLesson' ||
      result.jobType === 'improveLesson'
    ) {
      mergeAiLesson(result.output, mutate, {
        lessonId: result.jobType === 'improveLesson' ? result.lessonId : null,
        moduleTitle: ai.merge.moduleTitle,
        lessonTitle: ai.merge.lessonTitle,
      });
    }
    setResult(null);
    setPrompt('');
  };

  const visibleJob =
    jobQuery.data?.job ||
    (generateMutation.data?.job.id === activeJobId
      ? generateMutation.data.job
      : null);
  const isGenerating = generateMutation.isPending || Boolean(activeJobId);
  const sources = result ? extractSources(result.output) : [];

  return (
    <BuilderCard
      icon={<Sparkles className="size-5" />}
      title={ai.title}
      description={ai.body}
    >
      <Textarea
        data-testid="course-builder-ai-prompt"
        value={prompt}
        disabled={!editable || isGenerating}
        placeholder={ai.promptPlaceholder}
        onChange={(event) => setPrompt(event.target.value)}
        className="min-h-20 rounded-xl bg-white/80 dark:bg-white/10"
      />
      {form.lessons.length > 0 && (
        <div className="grid gap-2 sm:max-w-md">
          <Label>{ai.targetLessonLabel}</Label>
          <Select
            value={selectedLessonId}
            onValueChange={(value) => setSelectedLessonId(value ?? '')}
            disabled={!editable || isGenerating}
          >
            <SelectTrigger className="w-full rounded-xl bg-white/70 dark:bg-white/8">
              <SelectValue>
                {selectedLesson?.title || ai.targetLessonPlaceholder}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {form.lessons.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.title || dictionary.course.builder.untitledLesson}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['generateOutline', ai.generateOutline],
            ['generateQuiz', ai.generateQuiz],
            ['generateFlashcards', ai.generateFlashcards],
            ['generateLesson', ai.generateLesson],
            ['improveLesson', ai.improveLesson],
          ] as const
        ).map(([jobType, label]) => (
          <Button
            key={jobType}
            type="button"
            variant="outline"
            className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
            disabled={
              !editable ||
              isGenerating ||
              !prompt.trim() ||
              (jobType === 'improveLesson' && !selectedLessonId)
            }
            onClick={() =>
              generateMutation.mutate({
                jobType,
                lessonId: jobType === 'improveLesson' ? selectedLessonId : null,
              })
            }
          >
            <Sparkles className="size-4" />
            {label}
          </Button>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{ai.draftNotice}</p>
      {visibleJob && <GenerationProgress job={visibleJob} ai={ai} />}
      {result && (
        <div className="rounded-xl border bg-white/70 p-4 dark:bg-white/8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{ai.generated}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {ai.qualityBody}
              </p>
            </div>
            <Badge variant="secondary">
              <CheckCircle2 className="size-3" />
              {ai.completed}
            </Badge>
          </div>
          <QualityReport issues={result.qualityReport?.issues || []} ai={ai} />
          {sources.length > 0 && <SourceList sources={sources} ai={ai} />}
          <pre className="text-muted-foreground mt-2 max-h-60 overflow-auto rounded-lg bg-white/80 p-2 text-xs dark:bg-white/10">
            {JSON.stringify(result.output, null, 2)}
          </pre>
          <div className="mt-3 flex gap-2">
            <Button
              data-testid="course-builder-ai-accept"
              className="h-9 rounded-xl"
              onClick={addToCourse}
            >
              {ai.addToCourse}
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-xl bg-white/70 dark:bg-white/8"
              onClick={() => setResult(null)}
            >
              {ai.discard}
            </Button>
          </div>
        </div>
      )}
    </BuilderCard>
  );
}

function GenerationProgress({
  job,
  ai,
}: {
  job: CourseAiGenerationJob;
  ai: ReturnType<
    typeof useAuthStore.getState
  >['dictionary']['course']['builder']['ai'];
}) {
  const progress = job.progressPercent || 0;
  const stage = job.progressStage
    ? ai.progressStages[job.progressStage as keyof typeof ai.progressStages] ||
      ai.processing
    : ai.queued;
  const statusLabel =
    job.status === 'queued'
      ? ai.queued
      : job.status === 'failed'
        ? ai.failed
        : job.status === 'completed'
          ? ai.completed
          : ai.processing;

  return (
    <div className="rounded-xl border bg-white/70 p-4 dark:bg-white/8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock3 className="text-primary size-4" />
          {stage}
        </div>
        <Badge
          variant={job.status === 'failed' ? 'destructive' : 'outline'}
          className="rounded-full"
        >
          {statusLabel}
        </Badge>
      </div>
      <Progress value={progress}>
        <ProgressLabel>{ai.generating}</ProgressLabel>
        <span className="text-muted-foreground ml-auto text-sm tabular-nums">
          {ai.progressLabel.replace('{0}', String(progress))}
        </span>
      </Progress>
    </div>
  );
}

function QualityReport({
  issues,
  ai,
}: {
  issues: CourseAiQualityIssue[];
  ai: ReturnType<
    typeof useAuthStore.getState
  >['dictionary']['course']['builder']['ai'];
}) {
  return (
    <div className="mt-4 rounded-xl border border-dashed bg-white/60 p-3 dark:bg-white/6">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <AlertTriangle className="text-primary size-4" />
        {ai.qualityTitle}
      </div>
      {issues.length === 0 ? (
        <p className="text-muted-foreground text-sm">{ai.noQualityIssues}</p>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, index) => (
            <div
              key={`${issue.code}-${issue.target || index}`}
              className="rounded-lg border bg-white/70 p-3 text-sm dark:bg-white/8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={severityVariant(issue.severity)}>
                  {ai.qualitySeverity[issue.severity]}
                </Badge>
                <span className="font-medium">
                  {ai.qualityIssues[issue.code]}
                </span>
              </div>
              {issue.target && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {ai.issueTarget.replace('{0}', issue.target)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceList({
  sources,
  ai,
}: {
  sources: Array<{ title: string; url: string; note: string }>;
  ai: ReturnType<
    typeof useAuthStore.getState
  >['dictionary']['course']['builder']['ai'];
}) {
  return (
    <div className="mt-4 rounded-xl border border-dashed bg-white/60 p-3 dark:bg-white/6">
      <p className="text-sm font-semibold">{ai.sourcesTitle}</p>
      <div className="mt-2 space-y-2">
        {sources.map((source, index) => (
          <div key={`${source.title}-${index}`} className="text-sm">
            {source.url ? (
              <a
                className="text-primary font-medium underline-offset-4 hover:underline"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title || ai.sourceFallback}
              </a>
            ) : (
              <p className="font-medium">{source.title || ai.sourceFallback}</p>
            )}
            <p className="text-muted-foreground text-xs">
              {source.note || ai.sourceNoteFallback}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function isActiveJob(job: CourseAiGenerationJob) {
  return job.status === 'queued' || job.status === 'processing';
}

function extractLessonId(input: Record<string, unknown>) {
  return typeof input.lessonId === 'string' ? input.lessonId : null;
}

function extractSources(output: Record<string, unknown>) {
  const sources = Array.isArray(output.sources) ? output.sources : [];
  return sources
    .map((rawSource) => {
      const source = isRecord(rawSource) ? rawSource : {};
      return {
        title: stringValue(source.title),
        url: stringValue(source.url),
        note: stringValue(source.note),
      };
    })
    .filter((source) => source.title || source.url || source.note);
}

function jobErrorMessage(
  errors: ReturnType<
    typeof useAuthStore.getState
  >['dictionary']['course']['builder']['ai']['errors'],
  code?: string | null,
) {
  if (!code) {
    return errors.courseAiGenerationFailed;
  }
  return errors[code as keyof typeof errors] || errors.courseAiGenerationFailed;
}

function severityVariant(severity: CourseAiQualityIssue['severity']) {
  if (severity === 'critical') {
    return 'destructive';
  }
  if (severity === 'warning') {
    return 'secondary';
  }
  return 'outline';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
