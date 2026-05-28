CREATE TABLE "CourseReadinessSnapshot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "insufficientData" BOOLEAN NOT NULL DEFAULT true,
    "signals" JSONB NOT NULL DEFAULT '[]',
    "capturedOn" DATE NOT NULL DEFAULT CURRENT_DATE,
    "capturedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseReadinessSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CourseReadinessSnapshot_courseId_userId_capturedOn_key"
    ON "CourseReadinessSnapshot"("courseId", "userId", "capturedOn");

CREATE INDEX "CourseReadinessSnapshot_courseId_userId_capturedOn_idx"
    ON "CourseReadinessSnapshot"("courseId", "userId", "capturedOn");

CREATE INDEX "CourseReadinessSnapshot_userId_capturedOn_idx"
    ON "CourseReadinessSnapshot"("userId", "capturedOn");

ALTER TABLE "CourseReadinessSnapshot"
    ADD CONSTRAINT "CourseReadinessSnapshot_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseReadinessSnapshot"
    ADD CONSTRAINT "CourseReadinessSnapshot_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
