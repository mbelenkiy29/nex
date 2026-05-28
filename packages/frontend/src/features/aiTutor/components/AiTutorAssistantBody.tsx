import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatbotMarkdownComponents } from '@/features/aiTutor/chatbotMarkdownComponents';
import type {
  AiTutorMessage,
  AiTutorWidget,
} from '@/features/aiTutor/aiTutorTypes';
import { LessonExplainCardWidget } from './widgets/LessonExplainCardWidget';
import { LessonSummaryCardWidget } from './widgets/LessonSummaryCardWidget';
import { QuizCarouselWidget } from './widgets/QuizCarouselWidget';
import { PracticeCarouselWidget } from './widgets/PracticeCarouselWidget';
import { StudyPlanListWidget } from './widgets/StudyPlanListWidget';
import { AiTrustPanel } from '@/features/aiTrust/AiTrustPanel';
import type { AiTrustSignal } from '@project/backend/features/aiTrust/aiTrustSchemas';

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
  const widgetTrust = message.widgets
    ?.map((widget) => widget.payload.trust)
    .find(Boolean) as AiTrustSignal | undefined;
  const trust = message.trustSignals ?? widgetTrust ?? null;

  return (
    <div className="flex w-full gap-4">
      <div className="border-border dark:bg-card mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full border bg-white shadow-sm">
        <div className="bg-primary flex size-4 items-center justify-center rounded-sm">
          <div className="bg-primary-foreground size-1.5 rounded-full" />
        </div>
      </div>
      <div className="flex max-w-[calc(100%-3rem)] min-w-0 flex-1 flex-col gap-4 pt-1">
        {message.content ? (
          <div className="prose prose-sm dark:prose-invert text-foreground prose-p:my-0 max-w-none text-base leading-relaxed break-words">
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
        <AiTrustPanel trust={trust} />
      </div>
    </div>
  );
}
