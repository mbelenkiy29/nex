-- Phase 7: Course Setup completeness + Flashcards. Fully additive / non-destructive.

-- ---- new Course setup columns ----
ALTER TABLE "Course" ADD COLUMN "promoVideoFiles" JSONB;
ALTER TABLE "Course" ADD COLUMN "difficulty" TEXT;
ALTER TABLE "Course" ADD COLUMN "language" TEXT;
ALTER TABLE "Course" ADD COLUMN "visibility" TEXT NOT NULL DEFAULT 'private';
ALTER TABLE "Course" ADD COLUMN "audience" TEXT[] NOT NULL DEFAULT '{}';

-- ---- lesson hide flag ----
ALTER TABLE "CourseLesson" ADD COLUMN "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- ---- new tables ----
CREATE TABLE "CourseOutcome" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CourseOutcome_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseRequirement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CourseRequirement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseFlashcardSet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "courseId" UUID NOT NULL,
    "moduleId" UUID,
    "lessonId" UUID,
    CONSTRAINT "CourseFlashcardSet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseFlashcard" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "flashcardSetId" UUID NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "hint" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CourseFlashcard_pkey" PRIMARY KEY ("id")
);

-- ---- indexes ----
CREATE INDEX "CourseOutcome_courseId_idx" ON "CourseOutcome"("courseId");
CREATE INDEX "CourseRequirement_courseId_idx" ON "CourseRequirement"("courseId");
CREATE INDEX "CourseFlashcardSet_courseId_idx" ON "CourseFlashcardSet"("courseId");
CREATE INDEX "CourseFlashcardSet_courseId_orderIndex_idx" ON "CourseFlashcardSet"("courseId", "orderIndex");
CREATE INDEX "CourseFlashcardSet_moduleId_idx" ON "CourseFlashcardSet"("moduleId");
CREATE INDEX "CourseFlashcardSet_lessonId_idx" ON "CourseFlashcardSet"("lessonId");
CREATE INDEX "CourseFlashcard_flashcardSetId_idx" ON "CourseFlashcard"("flashcardSetId");
CREATE INDEX "CourseFlashcard_flashcardSetId_orderIndex_idx" ON "CourseFlashcard"("flashcardSetId", "orderIndex");

-- ---- foreign keys ----
ALTER TABLE "CourseOutcome" ADD CONSTRAINT "CourseOutcome_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseRequirement" ADD CONSTRAINT "CourseRequirement_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcardSet" ADD CONSTRAINT "CourseFlashcardSet_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcardSet" ADD CONSTRAINT "CourseFlashcardSet_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcardSet" ADD CONSTRAINT "CourseFlashcardSet_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "CourseLesson"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseFlashcard" ADD CONSTRAINT "CourseFlashcard_flashcardSetId_fkey"
    FOREIGN KEY ("flashcardSetId") REFERENCES "CourseFlashcardSet"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
