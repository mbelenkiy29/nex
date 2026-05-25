-- Phase 8: Block-based lesson editor. Fully additive — one new table.

CREATE TABLE "CourseLessonBlock" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "lessonId" UUID NOT NULL,
    "blockType" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CourseLessonBlock_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseLessonBlock_lessonId_idx" ON "CourseLessonBlock"("lessonId");
CREATE INDEX "CourseLessonBlock_lessonId_orderIndex_idx" ON "CourseLessonBlock"("lessonId", "orderIndex");

ALTER TABLE "CourseLessonBlock" ADD CONSTRAINT "CourseLessonBlock_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "CourseLesson"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
