import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LuLayers, LuListChecks } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { parseVideoEmbedUrl } from '@/features/course/courseBuilderUtils';
import type {
  CourseFile,
  CourseLessonBlock,
} from '@/features/course/courseTypes';
import { FilesList } from '@/features/file/components/FilesList';

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asFiles(value: unknown): CourseFile[] {
  return Array.isArray(value) ? (value as CourseFile[]) : [];
}

/**
 * Read-only renderer for a lesson's typed content blocks. Shared by the student
 * learn page and the creator's student-preview page.
 */
export function LessonBlockView({ blocks }: { blocks: CourseLessonBlock[] }) {
  if (!blocks.length) {
    return null;
  }
  return (
    <div className="grid gap-4">
      {blocks.map((block) => (
        <BlockRender key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockRender({ block }: { block: CourseLessonBlock }) {
  const text = useAuthStore((s) => s.dictionary.course.builder.blocks);
  const content = block.content || {};

  switch (block.blockType) {
    case 'heading': {
      const text = asText(content.text);
      return content.level === 3 ? (
        <h3 className="text-lg font-extrabold">{text}</h3>
      ) : (
        <h2 className="text-xl font-extrabold">{text}</h2>
      );
    }

    case 'paragraph':
    case 'aiTutorPrompt':
      return (
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {asText(content.text)}
          </ReactMarkdown>
        </div>
      );

    case 'callout': {
      const variant = asText(content.variant) || 'info';
      const cls =
        variant === 'warning'
          ? 'border-nexexam-warning/30 bg-nexexam-warning/10'
          : variant === 'success'
            ? 'border-nexexam-success/30 bg-nexexam-success/10'
            : 'border-nexexam-primary/30 bg-nexexam-primary/10';
      return (
        <div className={`rounded-xl border p-3 text-sm leading-6 ${cls}`}>
          {asText(content.text)}
        </div>
      );
    }

    case 'bulletList':
    case 'numberedList': {
      const items = Array.isArray(content.items)
        ? (content.items as unknown[]).map(asText).filter(Boolean)
        : [];
      if (!items.length) {
        return null;
      }
      return block.blockType === 'numberedList' ? (
        <ol className="ml-5 list-decimal text-sm leading-7">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="ml-5 list-disc text-sm leading-7">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    case 'divider':
      return <hr className="border-border" />;

    case 'image': {
      const file = asFiles(content.files)[0];
      const url = file?.signedUrl || file?.publicUrl || asText(content.url);
      return url ? <img src={url} alt="" className="rounded-xl" /> : null;
    }

    case 'video': {
      const embed = parseVideoEmbedUrl(asText(content.url));
      if (embed) {
        return (
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={embed}
              title={text.lessonVideoTitle}
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        );
      }
      const file = asFiles(content.files)[0];
      const fileUrl = file?.signedUrl || file?.publicUrl || asText(content.url);
      return fileUrl ? (
        <video controls src={fileUrl} className="w-full rounded-xl" />
      ) : null;
    }

    case 'pdf': {
      const file = asFiles(content.files)[0];
      return file ? <FilesList files={[file]} /> : null;
    }

    case 'quizEmbed':
      return (
        <div className="flex items-center gap-2 rounded-xl border bg-white/60 p-3 text-sm dark:bg-white/8">
          <LuListChecks className="text-primary size-4" />
          <span className="text-muted-foreground">{text.embeddedQuiz}</span>
        </div>
      );

    case 'flashcardSet':
      return (
        <div className="flex items-center gap-2 rounded-xl border bg-white/60 p-3 text-sm dark:bg-white/8">
          <LuLayers className="text-primary size-4" />
          <span className="text-muted-foreground">
            {text.embeddedFlashcards}
          </span>
        </div>
      );

    default:
      return asText(content.text) ? (
        <p className="text-sm leading-7">{asText(content.text)}</p>
      ) : null;
  }
}
