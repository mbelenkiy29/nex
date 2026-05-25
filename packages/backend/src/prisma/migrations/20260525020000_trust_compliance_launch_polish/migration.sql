ALTER TABLE "TrustSafetyReport"
ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN "assignedToUserId" UUID,
ADD COLUMN "reviewDueAt" TIMESTAMPTZ(3),
ADD COLUMN "outcomeCategory" TEXT,
ADD COLUMN "resolutionSummary" TEXT;

CREATE TABLE "CourseReviewDecision" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "courseId" UUID NOT NULL,
  "decision" TEXT NOT NULL,
  "reviewNotes" TEXT,
  "reviewedByUserId" UUID,
  "reviewedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "previousStatus" TEXT NOT NULL,
  "nextStatus" TEXT NOT NULL,
  CONSTRAINT "CourseReviewDecision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrustSafetyReport_priority_idx" ON "TrustSafetyReport"("priority");
CREATE INDEX "TrustSafetyReport_assignedToUserId_idx" ON "TrustSafetyReport"("assignedToUserId");
CREATE INDEX "TrustSafetyReport_reviewDueAt_idx" ON "TrustSafetyReport"("reviewDueAt");
CREATE INDEX "CourseReviewDecision_courseId_reviewedAt_idx" ON "CourseReviewDecision"("courseId", "reviewedAt");
CREATE INDEX "CourseReviewDecision_decision_idx" ON "CourseReviewDecision"("decision");
CREATE INDEX "CourseReviewDecision_reviewedByUserId_idx" ON "CourseReviewDecision"("reviewedByUserId");

ALTER TABLE "TrustSafetyReport" ADD CONSTRAINT "TrustSafetyReport_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseReviewDecision" ADD CONSTRAINT "CourseReviewDecision_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseReviewDecision" ADD CONSTRAINT "CourseReviewDecision_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
