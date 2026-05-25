ALTER TABLE "CreatorApplication"
  ADD COLUMN "legalName" TEXT,
  ADD COLUMN "professionalTitle" TEXT,
  ADD COLUMN "teachingExperience" TEXT,
  ADD COLUMN "audience" TEXT,
  ADD COLUMN "courseTopics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "sampleLessonPlan" TEXT,
  ADD COLUMN "identityDocumentFiles" JSONB,
  ADD COLUMN "identityVerificationConsent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "identityStatus" TEXT NOT NULL DEFAULT 'notStarted',
  ADD COLUMN "identityScanStatus" TEXT NOT NULL DEFAULT 'notStarted',
  ADD COLUMN "identityScanSummary" TEXT,
  ADD COLUMN "identityScanChecks" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "identityScannedAt" TIMESTAMPTZ(3),
  ADD COLUMN "identityReviewedByUserId" UUID,
  ADD COLUMN "identityReviewedAt" TIMESTAMPTZ(3);

CREATE INDEX "CreatorApplication_identityStatus_idx" ON "CreatorApplication"("identityStatus");
