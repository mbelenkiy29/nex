export type StudentReadinessSignalKey =
  | 'courseProgress'
  | 'homework'
  | 'practice'
  | 'exam'
  | 'recentActivity';

export type StudentReadinessSignal = {
  key: StudentReadinessSignalKey;
  weight: number;
  score: number | null;
  available: boolean;
};

export type StudentReadinessScore = {
  score: number;
  insufficientData: boolean;
  signals: StudentReadinessSignal[];
};

export function studentExperienceReadinessCalculate(input: {
  courseProgressPercent?: number | null;
  homeworkScorePercent?: number | null;
  practiceScorePercent?: number | null;
  examScorePercent?: number | null;
  recentActivityScorePercent?: number | null;
}): StudentReadinessScore {
  const signals: StudentReadinessSignal[] = [
    {
      key: 'courseProgress',
      weight: 35,
      score: normalizePercent(input.courseProgressPercent),
      available: input.courseProgressPercent != null,
    },
    {
      key: 'homework',
      weight: 20,
      score: normalizePercent(input.homeworkScorePercent),
      available: input.homeworkScorePercent != null,
    },
    {
      key: 'practice',
      weight: 25,
      score: normalizePercent(input.practiceScorePercent),
      available: input.practiceScorePercent != null,
    },
    {
      key: 'exam',
      weight: 15,
      score: normalizePercent(input.examScorePercent),
      available: input.examScorePercent != null,
    },
    {
      key: 'recentActivity',
      weight: 5,
      score: normalizePercent(input.recentActivityScorePercent),
      available: input.recentActivityScorePercent != null,
    },
  ];

  const availableSignals = signals.filter(
    (signal) => signal.available && signal.score != null,
  );
  const availableWeight = availableSignals.reduce(
    (total, signal) => total + signal.weight,
    0,
  );

  const score = availableWeight
    ? Math.round(
        availableSignals.reduce(
          (total, signal) => total + (signal.score || 0) * signal.weight,
          0,
        ) / availableWeight,
      )
    : 0;

  return {
    score,
    insufficientData:
      availableWeight < 80 ||
      input.practiceScorePercent == null ||
      input.examScorePercent == null,
    signals,
  };
}

function normalizePercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}
