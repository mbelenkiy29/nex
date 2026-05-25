ALTER TABLE "CourseAssignment"
  ADD COLUMN "rubric" JSONB,
  ADD COLUMN "allowResubmissions" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "maxAttempts" INTEGER;

ALTER TABLE "CourseAssignmentSubmission"
  ADD COLUMN "attemptNumber" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "rubricScores" JSONB,
  ADD COLUMN "score" INTEGER,
  ADD COLUMN "maxScore" INTEGER;

DROP INDEX "CourseAssignmentSubmission_assignmentId_userId_key";

CREATE UNIQUE INDEX "CourseAssignmentSubmission_assignmentId_userId_attemptNumber_key"
  ON "CourseAssignmentSubmission"("assignmentId", "userId", "attemptNumber");

CREATE INDEX "CourseAssignmentSubmission_assignmentId_userId_submittedAt_idx"
  ON "CourseAssignmentSubmission"("assignmentId", "userId", "submittedAt");
