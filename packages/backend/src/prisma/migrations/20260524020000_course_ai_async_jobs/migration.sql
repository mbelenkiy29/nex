ALTER TABLE "CourseAiGenerationJob" ADD COLUMN "qualityReport" JSONB;
ALTER TABLE "CourseAiGenerationJob" ADD COLUMN "progressPercent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CourseAiGenerationJob" ADD COLUMN "progressStage" TEXT;
ALTER TABLE "CourseAiGenerationJob" ADD COLUMN "queuedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now();
ALTER TABLE "CourseAiGenerationJob" ADD COLUMN "startedAt" TIMESTAMPTZ(3);

CREATE INDEX "CourseAiGenerationJob_userId_status_idx" ON "CourseAiGenerationJob"("userId", "status");
CREATE INDEX "CourseAiGenerationJob_status_createdAt_idx" ON "CourseAiGenerationJob"("status", "createdAt");
