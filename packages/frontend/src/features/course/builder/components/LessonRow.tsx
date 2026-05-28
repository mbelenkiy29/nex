import { storage } from '@project/backend/features/permissions';
import { useMutation } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  LuChevronDown,
  LuChevronRight,
  LuEye,
  LuEyeOff,
  LuFileText,
  LuLoader,
  LuRefreshCw,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import {
  type BuilderLesson,
  type BuilderSetForm,
  type CourseBuilderForm,
} from '@/features/course/courseBuilderUtils';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/shared/lib/apiClient';
import { LessonBlocksEditor } from './LessonBlocksEditor';
import { IconButton, LabeledInput } from './primitives';

// A single curriculum lecture. Collapsed by default (Udemy-style); the header
// stays editable, the body expands inline for full editing.
export function LessonRow({
  lesson,
  handle,
  editable,
  form,
  setForm,
  expanded,
  onToggle,
  courseId,
}: {
  lesson: BuilderLesson;
  handle: ReactNode;
  editable: boolean;
  form: CourseBuilderForm;
  setForm: BuilderSetForm;
  expanded: boolean;
  onToggle: () => void;
  courseId?: string | null;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const transcript = dictionary.course.videoTranscript;

  const patch = (changes: Partial<BuilderLesson>) =>
    setForm((current) => ({
      ...current,
      lessons: current.lessons.map((item) =>
        item.id === lesson.id ? { ...item, ...changes } : item,
      ),
    }));
  const retryTranscript = useMutation({
    mutationFn: async () =>
      await apiClient
        .post(
          `api/course-builder/${courseId}/lessons/${lesson.id}/video-transcript/retry`,
        )
        .json<{ lesson: Partial<BuilderLesson> }>(),
    onSuccess: (result) => {
      patch({
        videoTranscriptText: result.lesson.videoTranscriptText ?? null,
        videoTranscriptStatus: result.lesson.videoTranscriptStatus ?? 'queued',
        videoTranscriptSourceKey:
          result.lesson.videoTranscriptSourceKey ?? null,
        videoTranscriptError: result.lesson.videoTranscriptError ?? null,
        videoTranscriptGeneratedAt:
          result.lesson.videoTranscriptGeneratedAt ?? null,
      });
      toast.success(transcript.retryQueued);
    },
  });

  return (
    <div className="rounded-xl border bg-white/80 dark:bg-white/10">
      <div className="flex items-center gap-2 p-2.5">
        {editable && handle}
        <button
          type="button"
          onClick={onToggle}
          aria-label={lesson.title || builder.untitledLesson}
          className="text-muted-foreground hover:text-foreground grid size-7 shrink-0 place-items-center rounded-md"
        >
          {expanded ? (
            <LuChevronDown className="size-4" />
          ) : (
            <LuChevronRight className="size-4" />
          )}
        </button>
        <LuFileText className="text-muted-foreground size-4 shrink-0" />
        <Input
          data-testid="course-builder-lesson-title"
          value={lesson.title}
          disabled={!editable}
          placeholder={builder.lessonLabel}
          onChange={(event) => patch({ title: event.target.value })}
          className="h-9 rounded-lg bg-white/80 font-semibold dark:bg-white/10"
        />
        {lesson.isPreview && (
          <LuEye
            className="text-primary size-4 shrink-0"
            title={builder.isPreviewLesson}
          />
        )}
        {lesson.isHidden && (
          <LuEyeOff
            className="text-muted-foreground size-4 shrink-0"
            title={builder.lessonHidden}
          />
        )}
        {editable && (
          <IconButton
            label={builder.actions.remove}
            onClick={() =>
              setForm((current) => ({
                ...current,
                lessons: current.lessons.filter(
                  (item) => item.id !== lesson.id,
                ),
                blocks: current.blocks.filter(
                  (block) => block.lessonId !== lesson.id,
                ),
              }))
            }
          />
        )}
      </div>

      {expanded && (
        <div className="grid gap-3 border-t border-white/60 p-3 dark:border-white/10">
          <LessonBlocksEditor
            lessonId={lesson.id}
            blocks={form.blocks.filter((block) => block.lessonId === lesson.id)}
            form={form}
            editable={editable}
            setForm={setForm}
          />

          <div className="grid gap-2">
            <span className="text-xs font-semibold">{builder.videoUpload}</span>
            <FilesUploadDropzone
              storage={storage.courseVideos}
              max={1}
              formats={['mp4', 'webm', 'mov']}
              readonly={!editable}
              value={lesson.videoFiles}
              onChange={(value) =>
                patch({
                  videoFiles: value || [],
                  videoTranscriptText: null,
                  videoTranscriptStatus: value?.length ? 'queued' : null,
                  videoTranscriptSourceKey: null,
                  videoTranscriptError: null,
                  videoTranscriptGeneratedAt: null,
                })
              }
            />
            {lesson.videoFiles.length > 0 && (
              <div className="bg-nexexam-soft/70 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs dark:bg-white/8">
                <span className="font-semibold">
                  {transcript.statusLabel}:{' '}
                  {
                    transcript.status[
                      lesson.videoTranscriptStatus || 'notRequested'
                    ]
                  }
                </span>
                {lesson.videoTranscriptStatus === 'failed' &&
                  editable &&
                  courseId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg bg-white/80 text-xs dark:bg-white/10"
                      disabled={retryTranscript.isPending}
                      onClick={() => retryTranscript.mutate()}
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
            )}
          </div>
          <LabeledInput
            label={dictionary.course.fields.videoUrl}
            value={lesson.videoUrl}
            disabled={!editable}
            onChange={(value) => patch({ videoUrl: value })}
            hint={builder.videoEmbedHint}
          />

          <div className="grid gap-2">
            <span className="text-xs font-semibold">
              {dictionary.course.fields.resourceFiles}
            </span>
            <FilesUploadDropzone
              storage={storage.courseResources}
              max={10}
              readonly={!editable}
              value={lesson.resourceFiles}
              onChange={(value) => patch({ resourceFiles: value || [] })}
            />
            <p className="text-muted-foreground text-xs">
              {builder.resourcesHint}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={lesson.isPreview}
                disabled={!editable}
                onCheckedChange={(checked) =>
                  patch({ isPreview: Boolean(checked) })
                }
              />
              <span>{builder.isPreviewLesson}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={lesson.isHidden}
                disabled={!editable}
                onCheckedChange={(checked) =>
                  patch({ isHidden: Boolean(checked) })
                }
              />
              <span>{builder.lessonHidden}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
