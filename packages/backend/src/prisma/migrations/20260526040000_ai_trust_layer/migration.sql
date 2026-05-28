CREATE TABLE "AiTrustPreference" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "userId" UUID NOT NULL,
  "useLessonContent" BOOLEAN NOT NULL DEFAULT true,
  "useLessonProgress" BOOLEAN NOT NULL DEFAULT true,
  "usePracticeResults" BOOLEAN NOT NULL DEFAULT true,
  "useChatHistory" BOOLEAN NOT NULL DEFAULT true,
  "useAttachments" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "AiTrustPreference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiTrustPreference_userId_key"
  ON "AiTrustPreference"("userId");

CREATE INDEX "AiTrustPreference_userId_idx"
  ON "AiTrustPreference"("userId");

ALTER TABLE "AiTrustPreference"
  ADD CONSTRAINT "AiTrustPreference_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatbotMessage"
  ADD COLUMN "trustSignals" JSONB;

ALTER TABLE "CourseStudyPlanItem"
  ADD COLUMN "trustSignals" JSONB;
