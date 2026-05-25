import { createLazyRoute } from '@tanstack/react-router';
import { LuClipboardCheck } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { newId } from '@/features/course/courseBuilderUtils';
import { useBuilder } from '../BuilderContext';
import { PracticeExamCard } from '../components/PracticeExamCard';
import { AddButton, BuilderCard } from '../components/primitives';

export const builderPracticeExamsLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/practice-exams',
)({ component: PracticeExamsScreen });

// "Content" phase — course-level, domain-weighted practice exams.
function PracticeExamsScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const { form, editable, mutate } = useBuilder();

  return (
    <BuilderCard
      icon={<LuClipboardCheck className="size-5" />}
      title={builder.practiceExams}
      description={builder.practiceExamsBody}
    >
      {form.practiceExams.length === 0 && (
        <p className="text-muted-foreground text-sm">
          {builder.noPracticeExams}
        </p>
      )}
      {form.practiceExams.map((exam) => (
        <PracticeExamCard
          key={exam.id}
          exam={exam}
          rules={form.practiceExamRules.filter(
            (rule) => rule.practiceExamId === exam.id,
          )}
          editable={editable}
          setForm={mutate}
        />
      ))}
      {editable && (
        <AddButton
          testId="course-builder-add-practice-exam"
          label={builder.actions.addPracticeExam}
          onClick={() =>
            mutate((current) => ({
              ...current,
              practiceExams: [
                ...current.practiceExams,
                {
                  id: newId(),
                  title: '',
                  description: '',
                  examType: '',
                  totalQuestions: 0,
                  timeLimitMinutes: null,
                  passingScore: null,
                  randomizeQuestions: true,
                  simulateRealExam: false,
                  orderIndex: current.practiceExams.length,
                },
              ],
            }))
          }
        />
      )}
    </BuilderCard>
  );
}
