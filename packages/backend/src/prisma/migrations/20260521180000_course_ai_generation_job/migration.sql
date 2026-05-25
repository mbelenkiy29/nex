-- Phase 9: AI Course Builder Assistant. Fully additive — one new table.

CREATE TABLE "CourseAiGenerationJob" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "userId" UUID NOT NULL,
    "courseId" UUID,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB,
    "errorMessage" TEXT,
    "completedAt" TIMESTAMPTZ(3),
    CONSTRAINT "CourseAiGenerationJob_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseAiGenerationJob_userId_idx" ON "CourseAiGenerationJob"("userId");
CREATE INDEX "CourseAiGenerationJob_courseId_idx" ON "CourseAiGenerationJob"("courseId");
