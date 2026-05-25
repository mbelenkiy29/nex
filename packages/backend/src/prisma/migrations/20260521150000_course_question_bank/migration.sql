-- Phase 6: Question Bank + Practice Exams.
-- Mostly additive. The one destructive step (dropping the now-dead inline columns
-- on "CourseQuizQuestion") runs only AFTER the backfill copies that data into the
-- new "CourseQuestion" bank. Apply to the Neon production branch via the Neon MCP
-- as a single transaction, after explicit confirmation.

-- ---- new tables ----
CREATE TABLE "CourseQuestion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "createdByUserId" UUID,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL DEFAULT 'multipleChoice',
    "explanation" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "examDomain" TEXT,
    "tags" TEXT[] NOT NULL DEFAULT '{}',
    "source" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "meta" JSONB,
    CONSTRAINT "CourseQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseQuestionAnswer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "questionId" UUID NOT NULL,
    "answerText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "matchText" TEXT,
    "explanation" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CourseQuestionAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CoursePracticeExam" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "examType" TEXT,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "timeLimitMinutes" INTEGER,
    "passingScore" INTEGER,
    "randomizeQuestions" BOOLEAN NOT NULL DEFAULT true,
    "simulateRealExam" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CoursePracticeExam_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CoursePracticeExamRule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "practiceExamId" UUID NOT NULL,
    "examDomain" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CoursePracticeExamRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CoursePracticeExamAttempt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "practiceExamId" UUID,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "questionIds" JSONB NOT NULL DEFAULT '[]',
    "answers" JSONB NOT NULL DEFAULT '[]',
    "scorePercent" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "domainScores" JSONB NOT NULL DEFAULT '[]',
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "submittedAt" TIMESTAMPTZ(3),
    CONSTRAINT "CoursePracticeExamAttempt_pkey" PRIMARY KEY ("id")
);

-- ---- extend CourseQuiz ----
ALTER TABLE "CourseQuiz" ADD COLUMN "timeLimitMinutes" INTEGER;
ALTER TABLE "CourseQuiz" ADD COLUMN "randomizeQuestions" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CourseQuiz" ADD COLUMN "randomizeAnswers" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CourseQuiz" ADD COLUMN "showExplanations" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CourseQuiz" ADD COLUMN "allowRetries" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CourseQuiz" ADD COLUMN "maxAttempts" INTEGER;

-- ---- convert CourseQuizQuestion (inline) into a quiz<->question join ----
ALTER TABLE "CourseQuizQuestion" ADD COLUMN "questionId" UUID;

-- backfill: each inline quiz question becomes a bank CourseQuestion (+ answers)
DO $$
DECLARE
  r RECORD;
  new_qid UUID;
  opt JSONB;
  idx INT;
BEGIN
  FOR r IN
    SELECT cqq.id AS cqq_id, cqq.prompt, cqq.explanation,
           cqq."questionType" AS qtype, cqq.options, q."courseId" AS course_id
    FROM "CourseQuizQuestion" cqq
    JOIN "CourseQuiz" q ON q.id = cqq."quizId"
    WHERE cqq."questionId" IS NULL
  LOOP
    new_qid := gen_random_uuid();
    INSERT INTO "CourseQuestion"
      ("id", "createdAt", "updatedAt", "courseId", "questionText",
       "questionType", "explanation", "difficulty", "tags",
       "aiGenerated", "status")
    VALUES
      (new_qid, now(), now(), r.course_id, r.prompt,
       COALESCE(r.qtype, 'multipleChoice'), r.explanation, 'medium', '{}',
       false, 'approved');
    idx := 0;
    FOR opt IN
      SELECT * FROM jsonb_array_elements(COALESCE(r.options, '[]'::jsonb))
    LOOP
      INSERT INTO "CourseQuestionAnswer"
        ("id", "createdAt", "updatedAt", "questionId", "answerText",
         "isCorrect", "orderIndex")
      VALUES
        (gen_random_uuid(), now(), now(), new_qid,
         COALESCE(opt->>'text', ''),
         COALESCE((opt->>'isCorrect')::boolean, false), idx);
      idx := idx + 1;
    END LOOP;
    UPDATE "CourseQuizQuestion" SET "questionId" = new_qid WHERE id = r.cqq_id;
  END LOOP;
END $$;

-- drop any join row that could not be backfilled (defensive; none expected)
DELETE FROM "CourseQuizQuestion" WHERE "questionId" IS NULL;

ALTER TABLE "CourseQuizQuestion" ALTER COLUMN "questionId" SET NOT NULL;
ALTER TABLE "CourseQuizQuestion" DROP COLUMN "questionType";
ALTER TABLE "CourseQuizQuestion" DROP COLUMN "prompt";
ALTER TABLE "CourseQuizQuestion" DROP COLUMN "explanation";
ALTER TABLE "CourseQuizQuestion" DROP COLUMN "options";

-- ---- indexes ----
CREATE INDEX "CourseQuestion_courseId_idx" ON "CourseQuestion"("courseId");
CREATE INDEX "CourseQuestion_courseId_status_idx" ON "CourseQuestion"("courseId", "status");
CREATE INDEX "CourseQuestion_courseId_examDomain_idx" ON "CourseQuestion"("courseId", "examDomain");
CREATE INDEX "CourseQuestion_courseId_difficulty_idx" ON "CourseQuestion"("courseId", "difficulty");
CREATE INDEX "CourseQuestionAnswer_questionId_idx" ON "CourseQuestionAnswer"("questionId");
CREATE INDEX "CourseQuestionAnswer_questionId_orderIndex_idx" ON "CourseQuestionAnswer"("questionId", "orderIndex");
CREATE INDEX "CourseQuizQuestion_questionId_idx" ON "CourseQuizQuestion"("questionId");
CREATE UNIQUE INDEX "CourseQuizQuestion_quizId_questionId_key" ON "CourseQuizQuestion"("quizId", "questionId");
CREATE INDEX "CoursePracticeExam_courseId_idx" ON "CoursePracticeExam"("courseId");
CREATE INDEX "CoursePracticeExam_courseId_orderIndex_idx" ON "CoursePracticeExam"("courseId", "orderIndex");
CREATE INDEX "CoursePracticeExamRule_practiceExamId_idx" ON "CoursePracticeExamRule"("practiceExamId");
CREATE INDEX "CoursePracticeExamAttempt_courseId_userId_idx" ON "CoursePracticeExamAttempt"("courseId", "userId");
CREATE INDEX "CoursePracticeExamAttempt_practiceExamId_userId_idx" ON "CoursePracticeExamAttempt"("practiceExamId", "userId");

-- ---- foreign keys ----
ALTER TABLE "CourseQuestion" ADD CONSTRAINT "CourseQuestion_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseQuestionAnswer" ADD CONSTRAINT "CourseQuestionAnswer_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "CourseQuestion"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseQuizQuestion" ADD CONSTRAINT "CourseQuizQuestion_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "CourseQuestion"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeExam" ADD CONSTRAINT "CoursePracticeExam_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeExamRule" ADD CONSTRAINT "CoursePracticeExamRule_practiceExamId_fkey"
    FOREIGN KEY ("practiceExamId") REFERENCES "CoursePracticeExam"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeExamAttempt" ADD CONSTRAINT "CoursePracticeExamAttempt_practiceExamId_fkey"
    FOREIGN KEY ("practiceExamId") REFERENCES "CoursePracticeExam"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeExamAttempt" ADD CONSTRAINT "CoursePracticeExamAttempt_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
