CREATE TABLE "CourseDiagnosticAttempt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "completedAt" TIMESTAMPTZ(3),
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "scorePercent" INTEGER,
    "domainScores" JSONB NOT NULL DEFAULT '[]',
    CONSTRAINT "CourseDiagnosticAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseDiagnosticAnswer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "attemptId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "sourceQuestionId" UUID NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerOptions" JSONB NOT NULL DEFAULT '[]',
    "correctAnswerIndex" INTEGER NOT NULL,
    "selectedAnswerIndex" INTEGER,
    "isCorrect" BOOLEAN,
    "explanation" TEXT,
    "difficulty" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "answeredAt" TIMESTAMPTZ(3),
    CONSTRAINT "CourseDiagnosticAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseDomainMastery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "scorePercent" INTEGER NOT NULL DEFAULT 0,
    "confidence" TEXT NOT NULL DEFAULT 'low',
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMPTZ(3),
    "recommendedAction" TEXT,
    CONSTRAINT "CourseDomainMastery_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseFlashcardReview" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "flashcardId" UUID NOT NULL,
    "easeFactor" INTEGER NOT NULL DEFAULT 250,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "lastReviewedAt" TIMESTAMPTZ(3),
    "lastRating" TEXT,
    CONSTRAINT "CourseFlashcardReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseStudyStreak" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" DATE,
    CONSTRAINT "CourseStudyStreak_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseRemediationPlan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'deterministic',
    "completedAt" TIMESTAMPTZ(3),
    CONSTRAINT "CourseRemediationPlan_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseDiagnosticAttempt_courseId_userId_idx" ON "CourseDiagnosticAttempt"("courseId", "userId");
CREATE INDEX "CourseDiagnosticAttempt_userId_status_idx" ON "CourseDiagnosticAttempt"("userId", "status");
CREATE UNIQUE INDEX "CourseDiagnosticAnswer_attemptId_source_sourceQuestionId_key" ON "CourseDiagnosticAnswer"("attemptId", "source", "sourceQuestionId");
CREATE INDEX "CourseDiagnosticAnswer_attemptId_idx" ON "CourseDiagnosticAnswer"("attemptId");
CREATE INDEX "CourseDiagnosticAnswer_userId_idx" ON "CourseDiagnosticAnswer"("userId");
CREATE INDEX "CourseDiagnosticAnswer_domain_idx" ON "CourseDiagnosticAnswer"("domain");
CREATE UNIQUE INDEX "CourseDomainMastery_courseId_userId_domain_key" ON "CourseDomainMastery"("courseId", "userId", "domain");
CREATE INDEX "CourseDomainMastery_courseId_userId_idx" ON "CourseDomainMastery"("courseId", "userId");
CREATE INDEX "CourseDomainMastery_userId_scorePercent_idx" ON "CourseDomainMastery"("userId", "scorePercent");
CREATE UNIQUE INDEX "CourseFlashcardReview_userId_flashcardId_key" ON "CourseFlashcardReview"("userId", "flashcardId");
CREATE INDEX "CourseFlashcardReview_courseId_userId_dueAt_idx" ON "CourseFlashcardReview"("courseId", "userId", "dueAt");
CREATE INDEX "CourseFlashcardReview_flashcardId_idx" ON "CourseFlashcardReview"("flashcardId");
CREATE UNIQUE INDEX "CourseStudyStreak_courseId_userId_key" ON "CourseStudyStreak"("courseId", "userId");
CREATE INDEX "CourseStudyStreak_userId_idx" ON "CourseStudyStreak"("userId");
CREATE INDEX "CourseRemediationPlan_courseId_userId_status_idx" ON "CourseRemediationPlan"("courseId", "userId", "status");
CREATE INDEX "CourseRemediationPlan_userId_status_idx" ON "CourseRemediationPlan"("userId", "status");
CREATE INDEX "CourseRemediationPlan_domain_idx" ON "CourseRemediationPlan"("domain");

ALTER TABLE "CourseDiagnosticAttempt" ADD CONSTRAINT "CourseDiagnosticAttempt_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseDiagnosticAttempt" ADD CONSTRAINT "CourseDiagnosticAttempt_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseDiagnosticAnswer" ADD CONSTRAINT "CourseDiagnosticAnswer_attemptId_fkey"
    FOREIGN KEY ("attemptId") REFERENCES "CourseDiagnosticAttempt"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseDomainMastery" ADD CONSTRAINT "CourseDomainMastery_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseDomainMastery" ADD CONSTRAINT "CourseDomainMastery_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcardReview" ADD CONSTRAINT "CourseFlashcardReview_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcardReview" ADD CONSTRAINT "CourseFlashcardReview_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcardReview" ADD CONSTRAINT "CourseFlashcardReview_flashcardId_fkey"
    FOREIGN KEY ("flashcardId") REFERENCES "CourseFlashcard"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudyStreak" ADD CONSTRAINT "CourseStudyStreak_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseStudyStreak" ADD CONSTRAINT "CourseStudyStreak_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseRemediationPlan" ADD CONSTRAINT "CourseRemediationPlan_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseRemediationPlan" ADD CONSTRAINT "CourseRemediationPlan_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
