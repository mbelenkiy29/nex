CREATE TABLE "CourseRating" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "courseId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "memberId" UUID,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "CourseRating_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CourseRating"
  ADD CONSTRAINT "CourseRating_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseRating"
  ADD CONSTRAINT "CourseRating_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "CourseRating_courseId_userId_key" ON "CourseRating"("courseId", "userId");
CREATE INDEX "CourseRating_courseId_idx" ON "CourseRating"("courseId");
CREATE INDEX "CourseRating_rating_idx" ON "CourseRating"("rating");
CREATE INDEX "CourseRating_createdAt_idx" ON "CourseRating"("createdAt");
