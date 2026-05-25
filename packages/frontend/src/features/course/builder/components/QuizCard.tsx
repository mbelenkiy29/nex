import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import { SortableList } from '@/features/course/components/SortableList';
import {
  defaultQuestionAnswers,
  emptyBuilderQuestion,
  newId,
  reorderWithinGroup,
  type BuilderQuestion,
  type BuilderQuiz,
  type BuilderQuizLink,
  type BuilderSetForm,
} from '@/features/course/courseBuilderUtils';
import type { CourseQuestionType } from '@/features/course/courseTypes';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { AddButton, IconButton, NumberField, ToggleField } from './primitives';

export function QuizCard({
  quiz,
  editable,
  links,
  questions,
  setForm,
}: {
  quiz: BuilderQuiz;
  editable: boolean;
  links: BuilderQuizLink[];
  questions: BuilderQuestion[];
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const questionById = new Map(questions.map((item) => [item.id, item]));

  const patchQuiz = (changes: Partial<BuilderQuiz>) =>
    setForm((current) => ({
      ...current,
      quizzes: current.quizzes.map((item) =>
        item.id === quiz.id ? { ...item, ...changes } : item,
      ),
    }));

  const addQuestion = () => {
    const question = emptyBuilderQuestion();
    setForm((current) => ({
      ...current,
      questions: [...current.questions, question],
      quizQuestions: [
        ...current.quizQuestions,
        {
          id: newId(),
          quizId: quiz.id,
          questionId: question.id,
          orderIndex: current.quizQuestions.filter(
            (link) => link.quizId === quiz.id,
          ).length,
          points: 1,
        },
      ],
    }));
  };

  return (
    <div className="rounded-xl border bg-white/80 p-3 dark:bg-white/10">
      <div className="flex items-center gap-2">
        <Input
          data-testid="course-builder-quiz-title"
          value={quiz.title}
          disabled={!editable}
          placeholder={builder.quizLabel}
          onChange={(event) => patchQuiz({ title: event.target.value })}
          className="h-9 rounded-lg bg-white/80 font-semibold dark:bg-white/10"
        />
        {editable && (
          <IconButton
            label={builder.actions.remove}
            onClick={() =>
              setForm((current) => ({
                ...current,
                quizzes: current.quizzes.filter((item) => item.id !== quiz.id),
                quizQuestions: current.quizQuestions.filter(
                  (link) => link.quizId !== quiz.id,
                ),
              }))
            }
          />
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-3">
        <div className="w-28">
          <NumberField
            label={dictionary.course.fields.passingScore}
            value={quiz.passingScore}
            disabled={!editable}
            onChange={(value) => patchQuiz({ passingScore: value })}
          />
        </div>
        <div className="w-28">
          <NumberField
            label={builder.quizSettings.timeLimit}
            value={quiz.timeLimitMinutes}
            disabled={!editable}
            onChange={(value) => patchQuiz({ timeLimitMinutes: value })}
          />
        </div>
        <div className="w-24">
          <NumberField
            label={builder.quizSettings.maxAttempts}
            value={quiz.maxAttempts}
            disabled={!editable}
            onChange={(value) => patchQuiz({ maxAttempts: value })}
          />
        </div>
        <ToggleField
          label={builder.quizSettings.randomizeQuestions}
          checked={quiz.randomizeQuestions}
          disabled={!editable}
          onChange={(value) => patchQuiz({ randomizeQuestions: value })}
        />
        <ToggleField
          label={builder.quizSettings.randomizeAnswers}
          checked={quiz.randomizeAnswers}
          disabled={!editable}
          onChange={(value) => patchQuiz({ randomizeAnswers: value })}
        />
        <ToggleField
          label={builder.quizSettings.showExplanations}
          checked={quiz.showExplanations}
          disabled={!editable}
          onChange={(value) => patchQuiz({ showExplanations: value })}
        />
        <ToggleField
          label={builder.quizSettings.allowRetries}
          checked={quiz.allowRetries}
          disabled={!editable}
          onChange={(value) => patchQuiz({ allowRetries: value })}
        />
      </div>

      <div className="mt-3 grid gap-3 pl-2">
        {links.length === 0 && (
          <p className="text-muted-foreground text-xs">{builder.noQuestions}</p>
        )}
        <SortableList
          items={links}
          disabled={!editable}
          onReorder={(reordered) =>
            setForm((current) => ({
              ...current,
              quizQuestions: reorderWithinGroup(
                current.quizQuestions,
                (link) => link.quizId === quiz.id,
                reordered,
              ),
            }))
          }
          renderItem={(link, linkHandle) => (
            <QuizQuestionEditor
              link={link}
              question={questionById.get(link.questionId)}
              handle={linkHandle}
              editable={editable}
              setForm={setForm}
            />
          )}
        />
        {editable && (
          <AddButton
            testId="course-builder-add-question"
            label={builder.actions.addQuestion}
            onClick={addQuestion}
          />
        )}
      </div>
    </div>
  );
}

const QUIZ_QUESTION_TYPES: CourseQuestionType[] = [
  'multipleChoice',
  'multiSelect',
  'trueFalse',
];

// Edits a reusable bank question plus its quiz link (points / order).
function QuizQuestionEditor({
  link,
  question,
  handle,
  editable,
  setForm,
}: {
  link: BuilderQuizLink;
  question: BuilderQuestion | undefined;
  handle: ReactNode;
  editable: boolean;
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;

  if (!question) {
    return null;
  }

  const patchQuestion = (changes: Partial<BuilderQuestion>) =>
    setForm((current) => ({
      ...current,
      questions: current.questions.map((item) =>
        item.id === question.id ? { ...item, ...changes } : item,
      ),
    }));

  const patchLink = (changes: Partial<BuilderQuizLink>) =>
    setForm((current) => ({
      ...current,
      quizQuestions: current.quizQuestions.map((item) =>
        item.id === link.id ? { ...item, ...changes } : item,
      ),
    }));

  const toggleCorrect = (answerId: string) => {
    const multi = question.questionType === 'multiSelect';
    patchQuestion({
      answers: question.answers.map((answer) => {
        if (answer.id === answerId) {
          return { ...answer, isCorrect: !answer.isCorrect };
        }
        return multi ? answer : { ...answer, isCorrect: false };
      }),
    });
  };

  const removeQuestion = () =>
    setForm((current) => {
      const remainingLinks = current.quizQuestions.filter(
        (item) => item.id !== link.id,
      );
      const stillUsed = remainingLinks.some(
        (item) => item.questionId === question.id,
      );
      return {
        ...current,
        quizQuestions: remainingLinks,
        questions: stillUsed
          ? current.questions
          : current.questions.filter((item) => item.id !== question.id),
      };
    });

  return (
    <div className="rounded-lg border bg-white/90 p-3 dark:bg-white/10">
      <div className="flex flex-wrap items-center gap-2">
        {editable && handle}
        <select
          value={question.questionType}
          disabled={!editable}
          onChange={(event) => {
            const type = event.target.value as CourseQuestionType;
            patchQuestion({
              questionType: type,
              answers:
                type === 'trueFalse'
                  ? defaultQuestionAnswers('trueFalse')
                  : question.answers,
            });
          }}
          className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
        >
          {QUIZ_QUESTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {dictionaryEnumerator(builder.questionType, type)}
            </option>
          ))}
        </select>
        <select
          value={question.difficulty}
          disabled={!editable}
          onChange={(event) =>
            patchQuestion({
              difficulty: event.target.value as BuilderQuestion['difficulty'],
            })
          }
          className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
        >
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <option key={level} value={level}>
              {dictionaryEnumerator(builder.difficulty, level)}
            </option>
          ))}
        </select>
        <Input
          value={question.examDomain}
          disabled={!editable}
          placeholder={dictionary.course.fields.examDomain}
          onChange={(event) => patchQuestion({ examDomain: event.target.value })}
          className="h-9 w-44 rounded-lg bg-white/80 dark:bg-white/10"
        />
        <div className="w-20">
          <NumberField
            label={dictionary.course.fields.points}
            value={link.points}
            disabled={!editable}
            onChange={(value) => patchLink({ points: value ?? 1 })}
          />
        </div>
        {editable && (
          <IconButton label={builder.actions.remove} onClick={removeQuestion} />
        )}
      </div>

      <Textarea
        data-testid="course-builder-question-prompt"
        value={question.questionText}
        disabled={!editable}
        placeholder={dictionary.course.fields.questionPrompt}
        onChange={(event) =>
          patchQuestion({ questionText: event.target.value })
        }
        className="mt-2 min-h-16 rounded-lg bg-white/80 dark:bg-white/10"
      />

      <div className="mt-2 grid gap-2">
        {question.answers.map((answer) => (
          <div key={answer.id} className="flex items-center gap-2">
            <Checkbox
              checked={answer.isCorrect}
              disabled={!editable}
              onCheckedChange={() => toggleCorrect(answer.id)}
            />
            <Input
              value={answer.answerText}
              disabled={!editable || question.questionType === 'trueFalse'}
              placeholder={builder.optionLabel}
              onChange={(event) =>
                patchQuestion({
                  answers: question.answers.map((item) =>
                    item.id === answer.id
                      ? { ...item, answerText: event.target.value }
                      : item,
                  ),
                })
              }
              className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
            />
            {editable &&
              question.questionType !== 'trueFalse' &&
              question.answers.length > 2 && (
                <IconButton
                  label={builder.actions.remove}
                  onClick={() =>
                    patchQuestion({
                      answers: question.answers.filter(
                        (item) => item.id !== answer.id,
                      ),
                    })
                  }
                />
              )}
          </div>
        ))}
        {editable && question.questionType !== 'trueFalse' && (
          <AddButton
            label={builder.actions.addOption}
            onClick={() =>
              patchQuestion({
                answers: [
                  ...question.answers,
                  {
                    id: newId(),
                    answerText: '',
                    isCorrect: false,
                    matchText: '',
                    explanation: '',
                    orderIndex: question.answers.length,
                  },
                ],
              })
            }
          />
        )}
      </div>

      <Textarea
        value={question.explanation}
        disabled={!editable}
        placeholder={dictionary.course.fields.explanation}
        onChange={(event) => patchQuestion({ explanation: event.target.value })}
        className="mt-2 min-h-12 rounded-lg bg-white/80 dark:bg-white/10"
      />
    </div>
  );
}
