import { LuClipboardCheck } from 'react-icons/lu';
import { AiTutorWidgetHeader } from './AiTutorWidgetHeader';
import { QuestionCarouselBody } from './QuestionCarouselBody';
import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import type { PracticeCarouselWidget as Widget } from '@/features/aiTutor/aiTutorTypes';

export function PracticeCarouselWidget({
  payload,
}: {
  payload: Widget['payload'];
}) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );

  return (
    <div className="my-1 w-full">
      <AiTutorWidgetHeader
        scope={dictionary.aiTutor.widgets.practice.title}
        icon={LuClipboardCheck}
      />
      <QuestionCarouselBody
        moduleTitle={payload.moduleTitle}
        questions={payload.questions}
      />
    </div>
  );
}
