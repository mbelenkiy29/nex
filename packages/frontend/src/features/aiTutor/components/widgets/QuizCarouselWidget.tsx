import { LuListChecks } from 'react-icons/lu';
import { AiTutorWidgetHeader } from './AiTutorWidgetHeader';
import { QuestionCarouselBody } from './QuestionCarouselBody';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import type { QuizCarouselWidget as Widget } from '@/features/aiTutor/aiTutorTypes';

export function QuizCarouselWidget({ payload }: { payload: Widget['payload'] }) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );

  return (
    <div className="my-1 w-full">
      <AiTutorWidgetHeader
        scope={dictionary.aiTutor.widgets.quiz.title}
        icon={LuListChecks}
      />
      <QuestionCarouselBody
        moduleTitle={payload.moduleTitle}
        questions={payload.questions}
      />
    </div>
  );
}
