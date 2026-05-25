-- Creator Verification: structured certifications, payout onboarding status,
-- and the admin-granted "Nex Verified" creator badge.
-- All columns are additive (defaults / nullable) — non-destructive.

ALTER TABLE "CreatorApplication"
  ADD COLUMN "certifications" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "payoutOnboardingStatus" TEXT NOT NULL DEFAULT 'notStarted',
  ADD COLUMN "payoutOnboardingNotes" TEXT,
  ADD COLUMN "payoutOnboardingUpdatedAt" TIMESTAMPTZ(3),
  ADD COLUMN "nexVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "nexVerifiedAt" TIMESTAMPTZ(3),
  ADD COLUMN "nexVerifiedByUserId" UUID;

-- CreateIndex
CREATE INDEX "CreatorApplication_nexVerified_idx" ON "CreatorApplication"("nexVerified");
