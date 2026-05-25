import { useAuthStore } from '@/features/auth/authStore';
import { useShallow } from 'zustand/react/shallow';
import {
  LuCalendarDays,
  LuClipboardCheck,
  LuLightbulb,
  LuListChecks,
  LuSparkles,
} from 'react-icons/lu';

interface AiTutorEmptyProps {
  onSuggest: (suggestion: string) => void;
}

export function AiTutorEmpty({ onSuggest }: AiTutorEmptyProps) {
  const { dictionary } = useAuthStore(
    useShallow((s) => ({ dictionary: s.dictionary })),
  );

  const suggestions = [
    {
      icon: LuLightbulb,
      label: dictionary.aiTutor.suggestionExplain,
    },
    {
      icon: LuListChecks,
      label: dictionary.aiTutor.suggestionQuiz,
    },
    {
      icon: LuClipboardCheck,
      label: dictionary.aiTutor.suggestionPractice,
    },
    {
      icon: LuCalendarDays,
      label: dictionary.aiTutor.suggestionPlan,
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
        <LuSparkles className="size-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground">
          {dictionary.aiTutor.emptyHeroTitle}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {dictionary.aiTutor.emptyHeroBody}
        </p>
      </div>
      <div className="grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onSuggest(s.label)}
            className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white/86 px-4 py-3 text-left text-sm text-foreground shadow-sm transition hover:border-primary/30 hover:bg-white hover:text-primary dark:bg-white/8 dark:hover:bg-white/12"
          >
            <s.icon className="size-4 flex-shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
