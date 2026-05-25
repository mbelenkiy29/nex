import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatbotMarkdownComponents } from '@/features/aiTutor/chatbotMarkdownComponents';
import type { AiTutorMessage, AiTutorWidget } from '@/features/aiTutor/aiTutorTypes';
import { LessonExplainCardWidget } from './widgets/LessonExplainCardWidget';
import { LessonSummaryCardWidget } from './widgets/LessonSummaryCardWidget';
import { QuizCarouselWidget } from './widgets/QuizCarouselWidget';
import { PracticeCarouselWidget } from './widgets/PracticeCarouselWidget';
import { StudyPlanListWidget } from './widgets/StudyPlanListWidget';

function WidgetSwitch({ widget }: { widget: AiTutorWidget }) {
  switch (widget.kind) {
    case 'lessonExplainCard':
      return <LessonExplainCardWidget payload={widget.payload} />;
    case 'lessonSummaryCard':
      return <LessonSummaryCardWidget payload={widget.payload} />;
    case 'quizCarousel':
      return <QuizCarouselWidget payload={widget.payload} />;
    case 'practiceCarousel':
      return <PracticeCarouselWidget payload={widget.payload} />;
    case 'studyPlanList':
      return <StudyPlanListWidget payload={widget.payload} />;
    default:
      // Forward-compat — older clients silently ignore unknown widget kinds.
      return null;
  }
}

export function AiTutorAssistantBody({ message }: { message: AiTutorMessage }) {
  return (
    <div className="flex w-full gap-4">
      <div className="mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm dark:bg-card">
        <div className="flex size-4 items-center justify-center rounded-sm bg-primary">
          <div className="size-1.5 rounded-full bg-primary-foreground" />
        </div>
      </div>
      <div className="flex min-w-0 max-w-[calc(100%-3rem)] flex-1 flex-col gap-4 pt-1">
        {message.content ? (
          <div className="prose prose-sm dark:prose-invert max-w-none break-words text-base leading-relaxed text-foreground prose-p:my-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={chatbotMarkdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : null}
        {message.widgets?.map((w, i) => (
          <WidgetSwitch key={`${message.id}-w${i}`} widget={w} />
        ))}
      </div>
    </div>
  );
}
