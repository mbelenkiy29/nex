CREATE TABLE "StudentOnboardingProfile" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "organizationId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "memberId" UUID,
  "examGoal" TEXT NOT NULL,
  "timeline" TEXT NOT NULL,
  "currentLevel" TEXT NOT NULL,
  "studyMinutesPerWeek" INTEGER NOT NULL,
  "targetScore" TEXT NOT NULL,
  "generatedPlan" JSONB,
  "recommendedCourseIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "completedAt" TIMESTAMPTZ(3),
  "createdByUserId" UUID,
  "createdByMemberId" UUID,
  "updatedByUserId" UUID,
  "updatedByMemberId" UUID,

  CONSTRAINT "StudentOnboardingProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudentOnboardingProfile_userId_organizationId_key"
  ON "StudentOnboardingProfile"("userId", "organizationId");

CREATE INDEX "StudentOnboardingProfile_organizationId_idx"
  ON "StudentOnboardingProfile"("organizationId");

CREATE INDEX "StudentOnboardingProfile_memberId_idx"
  ON "StudentOnboardingProfile"("memberId");

CREATE INDEX "StudentOnboardingProfile_completedAt_idx"
  ON "StudentOnboardingProfile"("completedAt");

ALTER TABLE "StudentOnboardingProfile"
  ADD CONSTRAINT "StudentOnboardingProfile_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StudentOnboardingProfile"
  ADD CONSTRAINT "StudentOnboardingProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StudentOnboardingProfile"
  ADD CONSTRAINT "StudentOnboardingProfile_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "Member"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
