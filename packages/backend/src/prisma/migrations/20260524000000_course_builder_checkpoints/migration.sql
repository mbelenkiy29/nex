CREATE TABLE "CourseBuilderCheckpoint" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "label" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "CourseBuilderCheckpoint_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseBuilderCheckpoint_courseId_userId_createdAt_idx" ON "CourseBuilderCheckpoint"("courseId", "userId", "createdAt");
CREATE INDEX "CourseBuilderCheckpoint_courseId_userId_source_idx" ON "CourseBuilderCheckpoint"("courseId", "userId", "source");
CREATE INDEX "CourseBuilderCheckpoint_userId_idx" ON "CourseBuilderCheckpoint"("userId");
