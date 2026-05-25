import { storage } from '@project/backend/features/permissions';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import type { ReactNode } from 'react';
import { LuCirclePlus } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { SortableList } from '@/features/course/components/SortableList';
import {
  emptyBlockContent,
  newId,
  reorderWithinGroup,
  type BuilderBlock,
  type BuilderSetForm,
  type CourseBuilderForm,
} from '@/features/course/courseBuilderUtils';
import type { CourseLessonBlockType } from '@/features/course/courseTypes';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { IconButton } from './primitives';

const LESSON_BLOCK_TYPES: CourseLessonBlockType[] = [
  'heading',
  'paragraph',
  'callout',
  'bulletList',
  'numberedList',
  'divider',
  'image',
  'video',
  'quizEmbed',
  'flashcardSet',
];

export function LessonBlocksEditor({
  lessonId,
  blocks,
  form,
  editable,
  setForm,
}: {
  lessonId: string;
  blocks: BuilderBlock[];
  form: CourseBuilderForm;
  editable: boolean;
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const text = dictionary.course.builder.blocks;

  return (
    <div className="grid gap-2 rounded-lg border bg-white/60 p-3 dark:bg-white/8">
      <span className="text-xs font-bold">{text.title}</span>
      {blocks.length === 0 && (
        <p className="text-muted-foreground text-xs">{text.empty}</p>
      )}
      <SortableList
        items={blocks}
        disabled={!editable}
        onReorder={(reordered) =>
          setForm((current) => ({
            ...current,
            blocks: reorderWithinGroup(
              current.blocks,
              (block) => block.lessonId === lessonId,
              reordered,
            ),
          }))
        }
        renderItem={(block, blockHandle) => (
          <BlockEditorRow
            block={block}
            handle={blockHandle}
            form={form}
            editable={editable}
            setForm={setForm}
          />
        )}
      />
      {editable && (
        <div className="flex flex-wrap gap-1">
          {LESSON_BLOCK_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 rounded-lg bg-white/70 text-xs dark:bg-white/8"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  blocks: [
                    ...current.blocks,
                    {
                      id: newId(),
                      lessonId,
                      blockType: type,
                      content: emptyBlockContent(type),
                      orderIndex: current.blocks.filter(
                        (block) => block.lessonId === lessonId,
                      ).length,
                    },
                  ],
                }))
              }
            >
              <LuCirclePlus className="size-3" />
              {dictionaryEnumerator(text.types, type)}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function BlockEditorRow({
  block,
  handle,
  form,
  editable,
  setForm,
}: {
  block: BuilderBlock;
  handle: ReactNode;
  form: CourseBuilderForm;
  editable: boolean;
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const text = builder.blocks;
  const content = block.content || {};

  const patch = (changes: Record<string, unknown>) =>
    setForm((current) => ({
      ...current,
      blocks: current.blocks.map((item) =>
        item.id === block.id
          ? { ...item, content: { ...item.content, ...changes } }
          : item,
      ),
    }));
  const str = (key: string) =>
    typeof content[key] === 'string' ? (content[key] as string) : '';

  return (
    <div className="rounded-lg border bg-white/90 p-2 dark:bg-white/10">
      <div className="flex items-center gap-2">
        {editable && handle}
        <span className="text-muted-foreground text-xs font-bold uppercase">
          {dictionaryEnumerator(text.types, block.blockType)}
        </span>
        <div className="flex-1" />
        {editable && (
          <IconButton
            label={builder.actions.remove}
            onClick={() =>
              setForm((current) => ({
                ...current,
                blocks: current.blocks.filter((item) => item.id !== block.id),
              }))
            }
          />
        )}
      </div>
      <div className="mt-2 grid gap-2">
        {block.blockType === 'heading' && (
          <div className="flex gap-2">
            <select
              value={content.level === 3 ? '3' : '2'}
              disabled={!editable}
              onChange={(event) => patch({ level: Number(event.target.value) })}
              className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
            >
              <option value="2">H2</option>
              <option value="3">H3</option>
            </select>
            <Input
              value={str('text')}
              disabled={!editable}
              placeholder={text.textPlaceholder}
              onChange={(event) => patch({ text: event.target.value })}
              className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
            />
          </div>
        )}
        {block.blockType === 'paragraph' && (
          <Textarea
            value={str('text')}
            disabled={!editable}
            placeholder={text.textPlaceholder}
            onChange={(event) => patch({ text: event.target.value })}
            className="min-h-16 rounded-lg bg-white/80 dark:bg-white/10"
          />
        )}
        {block.blockType === 'callout' && (
          <>
            <select
              value={str('variant') || 'info'}
              disabled={!editable}
              onChange={(event) => patch({ variant: event.target.value })}
              className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
            >
              {(['info', 'warning', 'success'] as const).map((variant) => (
                <option key={variant} value={variant}>
                  {dictionaryEnumerator(text.calloutVariants, variant)}
                </option>
              ))}
            </select>
            <Textarea
              value={str('text')}
              disabled={!editable}
              placeholder={text.textPlaceholder}
              onChange={(event) => patch({ text: event.target.value })}
              className="min-h-12 rounded-lg bg-white/80 dark:bg-white/10"
            />
          </>
        )}
        {(block.blockType === 'bulletList' ||
          block.blockType === 'numberedList') && (
          <>
            <Textarea
              value={(Array.isArray(content.items)
                ? (content.items as unknown[])
                : []
              )
                .map((item) => (typeof item === 'string' ? item : ''))
                .join('\n')}
              disabled={!editable}
              onChange={(event) =>
                patch({ items: event.target.value.split('\n') })
              }
              className="min-h-16 rounded-lg bg-white/80 dark:bg-white/10"
            />
            <span className="text-muted-foreground text-xs">
              {text.listHint}
            </span>
          </>
        )}
        {block.blockType === 'divider' && <hr className="border-border" />}
        {block.blockType === 'image' && (
          <FilesUploadDropzone
            storage={storage.courseThumbnails}
            max={1}
            formats={['png', 'jpg', 'jpeg', 'webp']}
            readonly={!editable}
            value={
              Array.isArray(content.files) ? (content.files as unknown[]) : []
            }
            onChange={(value) => patch({ files: value || [] })}
          />
        )}
        {block.blockType === 'video' && (
          <Input
            value={str('url')}
            disabled={!editable}
            placeholder={text.videoUrlPlaceholder}
            onChange={(event) => patch({ url: event.target.value })}
            className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
          />
        )}
        {block.blockType === 'quizEmbed' && (
          <select
            value={str('quizId')}
            disabled={!editable}
            onChange={(event) => patch({ quizId: event.target.value })}
            className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
          >
            <option value="">{text.selectQuiz}</option>
            {form.quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title || text.types.quizEmbed}
              </option>
            ))}
          </select>
        )}
        {block.blockType === 'flashcardSet' && (
          <select
            value={str('flashcardSetId')}
            disabled={!editable}
            onChange={(event) => patch({ flashcardSetId: event.target.value })}
            className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
          >
            <option value="">{text.selectFlashcardSet}</option>
            {form.flashcardSets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.title || text.types.flashcardSet}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
