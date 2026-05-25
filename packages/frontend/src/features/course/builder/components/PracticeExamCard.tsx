import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useAuthStore } from '@/features/auth/authStore';
import {
  newId,
  type BuilderPracticeExam,
  type BuilderPracticeExamRule,
  type BuilderQuestion,
  type BuilderSetForm,
} from '@/features/course/courseBuilderUtils';
import { Input } from '@/shared/components/ui/input';
import { AddButton, IconButton, NumberField, ToggleField } from './primitives';

export function PracticeExamCard({
  exam,
  rules,
  editable,
  setForm,
}: {
  exam: BuilderPracticeExam;
  rules: BuilderPracticeExamRule[];
  editable: boolean;
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;

  const patchExam = (changes: Partial<BuilderPracticeExam>) =>
    setForm((current) => ({
      ...current,
      practiceExams: current.practiceExams.map((item) =>
        item.id === exam.id ? { ...item, ...changes } : item,
      ),
    }));

  const patchRule = (
    ruleId: string,
    changes: Partial<BuilderPracticeExamRule>,
  ) =>
    setForm((current) => ({
      ...current,
      practiceExamRules: current.practiceExamRules.map((item) =>
        item.id === ruleId ? { ...item, ...changes } : item,
      ),
    }));

  return (
    <div className="rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
      <div className="flex items-center gap-2">
        <Input
          data-testid="course-builder-practice-exam-title"
          value={exam.title}
          disabled={!editable}
          placeholder={builder.practiceExamLabel}
          onChange={(event) => patchExam({ title: event.target.value })}
          className="h-9 rounded-lg bg-white/80 font-semibold dark:bg-white/10"
        />
        {editable && (
          <IconButton
            label={builder.actions.remove}
            onClick={() =>
              setForm((current) => ({
                ...current,
                practiceExams: current.practiceExams.filter(
                  (item) => item.id !== exam.id,
                ),
                practiceExamRules: current.practiceExamRules.filter(
                  (rule) => rule.practiceExamId !== exam.id,
                ),
              }))
            }
          />
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-3">
        <Input
          value={exam.examType}
          disabled={!editable}
          placeholder={dictionary.course.fields.examType}
          onChange={(event) => patchExam({ examType: event.target.value })}
          className="h-9 w-40 rounded-lg bg-white/80 dark:bg-white/10"
        />
        <div className="w-28">
          <NumberField
            label={builder.examSettings.totalQuestions}
            value={exam.totalQuestions}
            disabled={!editable}
            onChange={(value) => patchExam({ totalQuestions: value ?? 0 })}
          />
        </div>
        <div className="w-28">
          <NumberField
            label={builder.quizSettings.timeLimit}
            value={exam.timeLimitMinutes}
            disabled={!editable}
            onChange={(value) => patchExam({ timeLimitMinutes: value })}
          />
        </div>
        <div className="w-28">
          <NumberField
            label={dictionary.course.fields.passingScore}
            value={exam.passingScore}
            disabled={!editable}
            onChange={(value) => patchExam({ passingScore: value })}
          />
        </div>
        <ToggleField
          label={builder.quizSettings.randomizeQuestions}
          checked={exam.randomizeQuestions}
          disabled={!editable}
          onChange={(value) => patchExam({ randomizeQuestions: value })}
        />
        <ToggleField
          label={builder.examSettings.simulateRealExam}
          checked={exam.simulateRealExam}
          disabled={!editable}
          onChange={(value) => patchExam({ simulateRealExam: value })}
        />
      </div>

      <div className="mt-3 grid gap-2 pl-2">
        <span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
          {builder.examRules}
        </span>
        {rules.length === 0 && (
          <p className="text-muted-foreground text-xs">
            {builder.examRulesHint}
          </p>
        )}
        {rules.map((rule) => (
          <div key={rule.id} className="flex flex-wrap items-center gap-2">
            <Input
              value={rule.examDomain}
              disabled={!editable}
              placeholder={dictionary.course.fields.examDomain}
              onChange={(event) =>
                patchRule(rule.id, { examDomain: event.target.value })
              }
              className="h-9 w-52 rounded-lg bg-white/80 dark:bg-white/10"
            />
            <div className="w-28">
              <NumberField
                label={builder.examSettings.questionCount}
                value={rule.questionCount}
                disabled={!editable}
                onChange={(value) =>
                  patchRule(rule.id, { questionCount: value ?? 0 })
                }
              />
            </div>
            <select
              value={rule.difficulty ?? ''}
              disabled={!editable}
              onChange={(event) =>
                patchRule(rule.id, {
                  difficulty:
                    (event.target.value as BuilderQuestion['difficulty']) ||
                    null,
                })
              }
              className="h-9 rounded-lg border bg-white/80 px-2 text-sm dark:bg-white/10"
            >
              <option value="">{builder.anyDifficulty}</option>
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <option key={level} value={level}>
                  {dictionaryEnumerator(builder.difficulty, level)}
                </option>
              ))}
            </select>
            {editable && (
              <IconButton
                label={builder.actions.remove}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    practiceExamRules: current.practiceExamRules.filter(
                      (item) => item.id !== rule.id,
                    ),
                  }))
                }
              />
            )}
          </div>
        ))}
        {editable && (
          <AddButton
            label={builder.actions.addExamRule}
            onClick={() =>
              setForm((current) => ({
                ...current,
                practiceExamRules: [
                  ...current.practiceExamRules,
                  {
                    id: newId(),
                    practiceExamId: exam.id,
                    examDomain: '',
                    questionCount: 0,
                    difficulty: null,
                    orderIndex: current.practiceExamRules.filter(
                      (item) => item.practiceExamId === exam.id,
                    ).length,
                  },
                ],
              }))
            }
          />
        )}
      </div>
    </div>
  );
}
