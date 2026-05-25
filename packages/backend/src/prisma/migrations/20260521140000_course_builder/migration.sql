-- Phase 5: Course Builder — additive, non-destructive schema changes.
-- This project uses a `prisma db push` workflow; this file is kept only as a
-- record. Apply to the Neon production branch via the Neon MCP `run_sql` as a
-- separate, explicitly user-confirmed step.

-- New columns on existing tables (all nullable -> safe).
ALTER TABLE "CourseLesson" ADD COLUMN "videoUrl" TEXT;
ALTER TABLE "CourseLesson" ADD COLUMN "resourceFiles" JSONB;

ALTER TABLE "Course" ADD COLUMN "submittedForReviewAt" TIMESTAMPTZ(3);
ALTER TABLE "Course" ADD COLUMN "reviewedByUserId" UUID;
ALTER TABLE "Course" ADD COLUMN "reviewedAt" TIMESTAMPTZ(3);
ALTER TABLE "Course" ADD COLUMN "reviewNotes" TEXT;

-- New quiz tables. NOTE: these deliberately carry no organizationId column, so
-- setupRowLevelSecurity does not enable a tenant policy on them — course
-- content is application-guarded, consistent with the other Course* tables.
CREATE TABLE "CourseQuiz" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "passingScore" INTEGER,
    "courseId" UUID NOT NULL,
    "moduleId" UUID,
    "lessonId" UUID,
    CONSTRAINT "CourseQuiz_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseQuizQuestion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "quizId" UUID NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "questionType" TEXT NOT NULL DEFAULT 'multipleChoice',
    "prompt" TEXT NOT NULL,
    "explanation" TEXT,
    "options" JSONB NOT NULL DEFAULT '[]',
    "points" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CourseQuizQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseQuizAttempt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "quizId" UUID,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "scorePercent" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "submittedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    CONSTRAINT "CourseQuizAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseQuiz_courseId_idx" ON "CourseQuiz"("courseId");
CREATE INDEX "CourseQuiz_courseId_orderIndex_idx" ON "CourseQuiz"("courseId", "orderIndex");
CREATE INDEX "CourseQuiz_moduleId_idx" ON "CourseQuiz"("moduleId");
CREATE INDEX "CourseQuiz_lessonId_idx" ON "CourseQuiz"("lessonId");
CREATE INDEX "CourseQuizQuestion_quizId_idx" ON "CourseQuizQuestion"("quizId");
CREATE INDEX "CourseQuizQuestion_quizId_orderIndex_idx" ON "CourseQuizQuestion"("quizId", "orderIndex");
CREATE INDEX "CourseQuizAttempt_courseId_userId_idx" ON "CourseQuizAttempt"("courseId", "userId");
CREATE INDEX "CourseQuizAttempt_quizId_userId_idx" ON "CourseQuizAttempt"("quizId", "userId");

ALTER TABLE "Course" ADD CONSTRAINT "Course_reviewedByUserId_fkey"
    FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseQuiz" ADD CONSTRAINT "CourseQuiz_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseQuiz" ADD CONSTRAINT "CourseQuiz_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseQuiz" ADD CONSTRAINT "CourseQuiz_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "CourseLesson"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseQuizQuestion" ADD CONSTRAINT "CourseQuizQuestion_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "CourseQuiz"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseQuizAttempt" ADD CONSTRAINT "CourseQuizAttempt_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "CourseQuiz"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseQuizAttempt" ADD CONSTRAINT "CourseQuizAttempt_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
