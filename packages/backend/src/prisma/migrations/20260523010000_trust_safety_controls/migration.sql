ALTER TABLE "Course"
ADD COLUMN "safetyHold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "safetyHoldReason" TEXT,
ADD COLUMN "safetyHoldByUserId" UUID,
ADD COLUMN "safetyHoldAt" TIMESTAMPTZ(3);

ALTER TABLE "CreatorApplication"
ADD COLUMN "safetyStatus" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "safetyDisabledAt" TIMESTAMPTZ(3),
ADD COLUMN "safetyDisabledByUserId" UUID,
ADD COLUMN "safetyDisabledReason" TEXT;

CREATE TABLE "TrustSafetyPolicyVersion" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "type" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "contentKey" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "publishedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUserId" UUID,
  CONSTRAINT "TrustSafetyPolicyVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrustSafetyPolicyAcceptance" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" UUID NOT NULL,
  "memberId" UUID,
  "policyVersionId" UUID NOT NULL,
  "policyType" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "acceptedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrustSafetyPolicyAcceptance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrustSafetyReport" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "targetType" TEXT NOT NULL,
  "courseId" UUID,
  "teacherUserId" UUID,
  "ratingId" UUID,
  "reporterUserId" UUID NOT NULL,
  "reporterMemberId" UUID,
  "reason" TEXT NOT NULL,
  "details" TEXT,
  "status" TEXT NOT NULL DEFAULT 'open',
  "adminNotes" TEXT,
  "resolvedByUserId" UUID,
  "resolvedAt" TIMESTAMPTZ(3),
  CONSTRAINT "TrustSafetyReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrustSafetyRiskFlag" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "targetType" TEXT NOT NULL,
  "severity" TEXT NOT NULL DEFAULT 'medium',
  "source" TEXT NOT NULL DEFAULT 'manual',
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "adminNotes" TEXT,
  "courseId" UUID,
  "creatorUserId" UUID,
  "creatorApplicationId" UUID,
  "reportId" UUID,
  "payoutId" UUID,
  "oneOnOneSessionId" UUID,
  "createdByUserId" UUID,
  "resolvedByUserId" UUID,
  "resolvedAt" TIMESTAMPTZ(3),
  CONSTRAINT "TrustSafetyRiskFlag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrustSafetyPolicyVersion_type_version_key" ON "TrustSafetyPolicyVersion"("type", "version");
CREATE UNIQUE INDEX "TrustSafetyPolicyAcceptance_userId_policyVersionId_key" ON "TrustSafetyPolicyAcceptance"("userId", "policyVersionId");
CREATE INDEX "Course_safetyHold_idx" ON "Course"("safetyHold");
CREATE INDEX "CreatorApplication_safetyStatus_idx" ON "CreatorApplication"("safetyStatus");
CREATE INDEX "TrustSafetyPolicyVersion_type_isActive_idx" ON "TrustSafetyPolicyVersion"("type", "isActive");
CREATE INDEX "TrustSafetyPolicyAcceptance_userId_policyType_idx" ON "TrustSafetyPolicyAcceptance"("userId", "policyType");
CREATE INDEX "TrustSafetyPolicyAcceptance_policyType_version_idx" ON "TrustSafetyPolicyAcceptance"("policyType", "version");
CREATE INDEX "TrustSafetyReport_status_idx" ON "TrustSafetyReport"("status");
CREATE INDEX "TrustSafetyReport_targetType_idx" ON "TrustSafetyReport"("targetType");
CREATE INDEX "TrustSafetyReport_courseId_idx" ON "TrustSafetyReport"("courseId");
CREATE INDEX "TrustSafetyReport_teacherUserId_idx" ON "TrustSafetyReport"("teacherUserId");
CREATE INDEX "TrustSafetyReport_reporterUserId_idx" ON "TrustSafetyReport"("reporterUserId");
CREATE INDEX "TrustSafetyReport_createdAt_idx" ON "TrustSafetyReport"("createdAt");
CREATE INDEX "TrustSafetyRiskFlag_status_idx" ON "TrustSafetyRiskFlag"("status");
CREATE INDEX "TrustSafetyRiskFlag_severity_idx" ON "TrustSafetyRiskFlag"("severity");
CREATE INDEX "TrustSafetyRiskFlag_source_idx" ON "TrustSafetyRiskFlag"("source");
CREATE INDEX "TrustSafetyRiskFlag_targetType_idx" ON "TrustSafetyRiskFlag"("targetType");
CREATE INDEX "TrustSafetyRiskFlag_courseId_idx" ON "TrustSafetyRiskFlag"("courseId");
CREATE INDEX "TrustSafetyRiskFlag_creatorUserId_idx" ON "TrustSafetyRiskFlag"("creatorUserId");
CREATE INDEX "TrustSafetyRiskFlag_creatorApplicationId_idx" ON "TrustSafetyRiskFlag"("creatorApplicationId");
CREATE INDEX "TrustSafetyRiskFlag_reportId_idx" ON "TrustSafetyRiskFlag"("reportId");
CREATE INDEX "TrustSafetyRiskFlag_payoutId_idx" ON "TrustSafetyRiskFlag"("payoutId");
CREATE INDEX "TrustSafetyRiskFlag_oneOnOneSessionId_idx" ON "TrustSafetyRiskFlag"("oneOnOneSessionId");
CREATE INDEX "TrustSafetyRiskFlag_createdAt_idx" ON "TrustSafetyRiskFlag"("createdAt");

ALTER TABLE "Course" ADD CONSTRAINT "Course_safetyHoldByUserId_fkey" FOREIGN KEY ("safetyHoldByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_safetyDisabledByUserId_fkey" FOREIGN KEY ("safetyDisabledByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyPolicyVersion" ADD CONSTRAINT "TrustSafetyPolicyVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyPolicyAcceptance" ADD CONSTRAINT "TrustSafetyPolicyAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyPolicyAcceptance" ADD CONSTRAINT "TrustSafetyPolicyAcceptance_policyVersionId_fkey" FOREIGN KEY ("policyVersionId") REFERENCES "TrustSafetyPolicyVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyReport" ADD CONSTRAINT "TrustSafetyReport_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyReport" ADD CONSTRAINT "TrustSafetyReport_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyReport" ADD CONSTRAINT "TrustSafetyReport_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "CourseRating"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyReport" ADD CONSTRAINT "TrustSafetyReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyReport" ADD CONSTRAINT "TrustSafetyReport_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_creatorApplicationId_fkey" FOREIGN KEY ("creatorApplicationId") REFERENCES "CreatorApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "TrustSafetyReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "CreatorPayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_oneOnOneSessionId_fkey" FOREIGN KEY ("oneOnOneSessionId") REFERENCES "OneOnOneSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrustSafetyRiskFlag" ADD CONSTRAINT "TrustSafetyRiskFlag_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "TrustSafetyPolicyVersion" ("type", "version", "contentKey", "isActive", "publishedAt")
VALUES
  ('refundPolicy', '2026-05-23', 'trustSafety.policies.refundPolicy.body', true, CURRENT_TIMESTAMP),
  ('teacherTerms', '2026-05-23', 'trustSafety.policies.teacherTerms.body', true, CURRENT_TIMESTAMP),
  ('studentTerms', '2026-05-23', 'trustSafety.policies.studentTerms.body', true, CURRENT_TIMESTAMP)
ON CONFLICT ("type", "version") DO NOTHING;
