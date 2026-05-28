ALTER TABLE "ChatbotMessage"
  ADD COLUMN "attachments" JSONB;

ALTER TABLE "CourseLesson"
  ADD COLUMN "videoTranscriptText" TEXT,
  ADD COLUMN "videoTranscriptStatus" TEXT NOT NULL DEFAULT 'notRequested',
  ADD COLUMN "videoTranscriptSourceKey" TEXT,
  ADD COLUMN "videoTranscriptError" TEXT,
  ADD COLUMN "videoTranscriptGeneratedAt" TIMESTAMPTZ(3);

CREATE INDEX "CourseLesson_videoTranscriptStatus_idx"
  ON "CourseLesson"("videoTranscriptStatus");

CREATE INDEX "CourseLesson_videoTranscriptSourceKey_idx"
  ON "CourseLesson"("videoTranscriptSourceKey");
