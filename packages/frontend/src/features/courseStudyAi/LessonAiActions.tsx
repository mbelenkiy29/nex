import { useRef, useState } from 'react';
import {
  LuBookOpen,
  LuBrain,
  LuFileText,
  LuListChecks,
  LuSparkles,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { AiQuizRunner, type AiQuizKind } from './AiQuizRunner';
import { StudyAiResultSheet } from './StudyAiResultSheet';
import type { StudyAiStreamMode } from './hooks/useCourseStudyAiStream';

interface LessonAiActionsProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  moduleId?: string | null;
  moduleTitle?: string;
}

/**
 * Per-lesson AI study actions shown inside the course player: explain /
 * summarize the current lesson, or generate a quiz / practice set from its
 * module. Each action opens a fresh (keyed) overlay so its state resets.
 */
export function LessonAiActions({
  courseId,
  lessonId,
  lessonTitle,
  moduleId,
  moduleTitle,
}: LessonAiActionsProps) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi;

  const nonceRef = useRef(0);
  const [result, setResult] = useState<{
    mode: StudyAiStreamMode;
    nonce: number;
  } | null>(null);
  const [quiz, setQuiz] = useState<{
    kind: AiQuizKind;
    nonce: number;
  } | null>(null);

  const openResult = (mode: StudyAiStreamMode) => {
    nonceRef.current += 1;
    setResult({ mode, nonce: nonceRef.current });
  };
  const openQuiz = (kind: AiQuizKind) => {
    nonceRef.current += 1;
    setQuiz({ kind, nonce: nonceRef.current });
  };

  const moduleActionsDisabled = !moduleId;

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuSparkles className="text-primary size-5" />
          {t.actions.sectionTitle}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-11 justify-start rounded-xl bg-white/70 dark:bg-white/8"
            onClick={() => openResult('explain')}
          >
            <LuBookOpen className="text-primary size-4" />
            {t.actions.explainLesson}
          </Button>
          <Button
            variant="outline"
            className="h-11 justify-start rounded-xl bg-white/70 dark:bg-white/8"
            onClick={() => openResult('summarize')}
          >
            <LuFileText className="text-primary size-4" />
            {t.actions.summarizeLesson}
          </Button>
          <Button
            variant="outline"
            className="h-11 justify-start rounded-xl bg-white/70 dark:bg-white/8"
            disabled={moduleActionsDisabled}
            onClick={() => openQuiz('quiz')}
          >
            <LuListChecks className="text-primary size-4" />
            {t.actions.quizMe}
          </Button>
          <Button
            variant="outline"
            className="h-11 justify-start rounded-xl bg-white/70 dark:bg-white/8"
            disabled={moduleActionsDisabled}
            onClick={() => openQuiz('practice')}
          >
            <LuBrain className="text-primary size-4" />
            {t.actions.generatePractice}
          </Button>
        </div>
      </CardContent>

      {result && (
        <StudyAiResultSheet
          key={result.nonce}
          courseId={courseId}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          mode={result.mode}
          onClose={() => setResult(null)}
        />
      )}

      {quiz && moduleId && (
        <AiQuizRunner
          key={quiz.nonce}
          courseId={courseId}
          moduleId={moduleId}
          moduleTitle={moduleTitle || lessonTitle}
          kind={quiz.kind}
          onClose={() => setQuiz(null)}
        />
      )}
    </Card>
  );
}
