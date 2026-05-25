ALTER TABLE "PracticeQuestion" ADD COLUMN "answerOptions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "CoursePracticeAttempt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(3),
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "scorePercent" INTEGER,

    CONSTRAINT "CoursePracticeAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CoursePracticeAnswer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "attemptId" UUID NOT NULL,
    "practiceQuestionId" UUID NOT NULL,
    "selectedAnswerIndex" INTEGER,
    "isCorrect" BOOLEAN,
    "answeredAt" TIMESTAMPTZ(3),

    CONSTRAINT "CoursePracticeAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseStudentNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "lessonId" UUID,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "CourseStudentNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseStudyPlanItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "plannedForDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "completedAt" TIMESTAMPTZ(3),

    CONSTRAINT "CourseStudyPlanItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CoursePracticeAttempt_courseId_userId_idx" ON "CoursePracticeAttempt"("courseId", "userId");
CREATE INDEX "CoursePracticeAttempt_userId_status_idx" ON "CoursePracticeAttempt"("userId", "status");
CREATE UNIQUE INDEX "CoursePracticeAnswer_attemptId_practiceQuestionId_key" ON "CoursePracticeAnswer"("attemptId", "practiceQuestionId");
CREATE INDEX "CoursePracticeAnswer_practiceQuestionId_idx" ON "CoursePracticeAnswer"("practiceQuestionId");
CREATE INDEX "CourseStudentNote_courseId_userId_idx" ON "CourseStudentNote"("courseId", "userId");
CREATE INDEX "CourseStudentNote_lessonId_idx" ON "CourseStudentNote"("lessonId");
CREATE INDEX "CourseStudyPlanItem_courseId_userId_idx" ON "CourseStudyPlanItem"("courseId", "userId");
CREATE INDEX "CourseStudyPlanItem_userId_status_idx" ON "CourseStudyPlanItem"("userId", "status");
CREATE INDEX "CourseStudyPlanItem_plannedForDate_idx" ON "CourseStudyPlanItem"("plannedForDate");

ALTER TABLE "CoursePracticeAttempt" ADD CONSTRAINT "CoursePracticeAttempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeAttempt" ADD CONSTRAINT "CoursePracticeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeAttempt" ADD CONSTRAINT "CoursePracticeAttempt_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeAnswer" ADD CONSTRAINT "CoursePracticeAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "CoursePracticeAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoursePracticeAnswer" ADD CONSTRAINT "CoursePracticeAnswer_practiceQuestionId_fkey" FOREIGN KEY ("practiceQuestionId") REFERENCES "PracticeQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudentNote" ADD CONSTRAINT "CourseStudentNote_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudentNote" ADD CONSTRAINT "CourseStudentNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudentNote" ADD CONSTRAINT "CourseStudentNote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseStudentNote" ADD CONSTRAINT "CourseStudentNote_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "CourseLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseStudyPlanItem" ADD CONSTRAINT "CourseStudyPlanItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudyPlanItem" ADD CONSTRAINT "CourseStudyPlanItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudyPlanItem" ADD CONSTRAINT "CourseStudyPlanItem_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
