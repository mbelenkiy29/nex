import { storage } from '@project/backend/features/permissions';
import type { ReactNode } from 'react';
import {
  LuChevronDown,
  LuChevronRight,
  LuEye,
  LuEyeOff,
  LuFileText,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import {
  type BuilderLesson,
  type BuilderSetForm,
  type CourseBuilderForm,
} from '@/features/course/courseBuilderUtils';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
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
}: {
  lesson: BuilderLesson;
  handle: ReactNode;
  editable: boolean;
  form: CourseBuilderForm;
  setForm: BuilderSetForm;
  expanded: boolean;
  onToggle: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;

  const patch = (changes: Partial<BuilderLesson>) =>
    setForm((current) => ({
      ...current,
      lessons: current.lessons.map((item) =>
        item.id === lesson.id ? { ...item, ...changes } : item,
      ),
    }));

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
          <Textarea
            value={lesson.content}
            disabled={!editable}
            placeholder={dictionary.course.fields.lessonContent}
            onChange={(event) => patch({ content: event.target.value })}
            className="min-h-24 rounded-lg bg-white/80 dark:bg-white/10"
          />
          <p className="text-muted-foreground text-xs">{builder.contentHint}</p>

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
              onChange={(value) => patch({ videoFiles: value || [] })}
            />
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
