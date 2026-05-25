-- Course metadata
ALTER TABLE "Course" ADD COLUMN "examType" TEXT;
ALTER TABLE "Course" ADD COLUMN "introVideoFiles" JSONB;
ALTER TABLE "Course" ADD COLUMN "priceCents" INTEGER;
ALTER TABLE "Course" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "Course" ADD COLUMN "stripePriceId" TEXT;
ALTER TABLE "Course" ADD COLUMN "subscriptionPlanKey" TEXT;
ALTER TABLE "Course" ADD COLUMN "creatorRevenueShareBps" INTEGER NOT NULL DEFAULT 7000;

-- Nullable legacy learning links
ALTER TABLE "Exam" ADD COLUMN "courseId" UUID;
ALTER TABLE "Chapter" ADD COLUMN "courseId" UUID;
ALTER TABLE "Lesson" ADD COLUMN "courseId" UUID;
ALTER TABLE "PracticeQuestion" ADD COLUMN "courseId" UUID;
ALTER TABLE "Concept" ADD COLUMN "courseId" UUID;
ALTER TABLE "ExamType" ADD COLUMN "courseId" UUID;
ALTER TABLE "ExamInstance" ADD COLUMN "courseId" UUID;
ALTER TABLE "StudyNote" ADD COLUMN "courseId" UUID;
ALTER TABLE "DocumentUpload" ADD COLUMN "courseId" UUID;

-- Course ownership relations
ALTER TABLE "Course" ADD CONSTRAINT "Course_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Course" ADD CONSTRAINT "Course_creatorMemberId_fkey" FOREIGN KEY ("creatorMemberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Course" ADD CONSTRAINT "Course_creatorOrganizationId_fkey" FOREIGN KEY ("creatorOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Course" ADD CONSTRAINT "Course_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Legacy learning foreign keys
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PracticeQuestion" ADD CONSTRAINT "PracticeQuestion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExamType" ADD CONSTRAINT "ExamType_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExamInstance" ADD CONSTRAINT "ExamInstance_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StudyNote" ADD CONSTRAINT "StudyNote_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DocumentUpload" ADD CONSTRAINT "DocumentUpload_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Course filtering indexes
CREATE INDEX "Course_category_idx" ON "Course"("category");
CREATE INDEX "Course_examType_idx" ON "Course"("examType");
CREATE INDEX "Course_creatorMemberId_idx" ON "Course"("creatorMemberId");
CREATE INDEX "Course_creatorOrganizationId_idx" ON "Course"("creatorOrganizationId");
CREATE INDEX "Exam_courseId_idx" ON "Exam"("courseId");
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");
CREATE INDEX "PracticeQuestion_courseId_idx" ON "PracticeQuestion"("courseId");
CREATE INDEX "Concept_courseId_idx" ON "Concept"("courseId");
CREATE INDEX "ExamType_courseId_idx" ON "ExamType"("courseId");
CREATE INDEX "ExamInstance_courseId_idx" ON "ExamInstance"("courseId");
CREATE INDEX "StudyNote_courseId_idx" ON "StudyNote"("courseId");
CREATE INDEX "DocumentUpload_courseId_idx" ON "DocumentUpload"("courseId");
