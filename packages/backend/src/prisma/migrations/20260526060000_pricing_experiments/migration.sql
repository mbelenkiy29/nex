ALTER TABLE "Course"
  ADD COLUMN "lifetimeAccessEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "lifetimePriceCents" INTEGER,
  ADD COLUMN "lifetimeStripePriceId" TEXT;

ALTER TABLE "CourseEnrollment"
  ADD COLUMN "accessDuration" TEXT NOT NULL DEFAULT 'standard',
  ADD COLUMN "accessSource" TEXT,
  ADD COLUMN "pricingPackageId" TEXT;

ALTER TABLE "CoursePurchase"
  ADD COLUMN "packageType" TEXT,
  ADD COLUMN "pricingPackageId" TEXT,
  ADD COLUMN "pricingExperimentId" TEXT,
  ADD COLUMN "pricingVariantId" TEXT,
  ADD COLUMN "accessDuration" TEXT NOT NULL DEFAULT 'standard';

CREATE TABLE "PricingExperiment" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "surface" TEXT NOT NULL DEFAULT 'global',
  "trafficPercent" INTEGER NOT NULL DEFAULT 100,
  "startsAt" TIMESTAMPTZ(3),
  "endsAt" TIMESTAMPTZ(3),
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,

  CONSTRAINT "PricingExperiment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PricingVariant" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "experimentId" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "allocationBps" INTEGER NOT NULL DEFAULT 10000,
  "isControl" BOOLEAN NOT NULL DEFAULT false,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "packageConfig" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "PricingVariant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PricingExposure" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" UUID,
  "organizationId" UUID,
  "memberId" UUID,
  "experimentId" UUID NOT NULL,
  "variantId" UUID NOT NULL,
  "surface" TEXT NOT NULL,
  "sessionId" TEXT,
  "anonymousId" TEXT,
  "currentPath" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "PricingExposure_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiCreditPack" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "tokenAmount" INTEGER NOT NULL,
  "bonusTokenAmount" INTEGER NOT NULL DEFAULT 0,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "stripeProductId" TEXT,
  "stripePriceId" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 1000,

  CONSTRAINT "AiCreditPack_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiCreditPurchase" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "aiCreditPackId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "memberId" UUID,
  "organizationId" UUID,
  "stripeCheckoutSessionId" TEXT NOT NULL,
  "stripePaymentIntentId" TEXT,
  "tokensPurchased" INTEGER NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "paidAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "pricingPackageId" TEXT,
  "pricingExperimentId" TEXT,
  "pricingVariantId" TEXT,

  CONSTRAINT "AiCreditPurchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiCreditLedgerEntry" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" UUID NOT NULL,
  "organizationId" UUID,
  "entryType" TEXT NOT NULL,
  "tokenAmount" INTEGER NOT NULL,
  "source" TEXT,
  "aiCreditPackId" UUID,
  "purchaseId" UUID,
  "metadata" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "AiCreditLedgerEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseBundlePurchase" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "bundleId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "memberId" UUID,
  "organizationId" UUID,
  "stripeCheckoutSessionId" TEXT NOT NULL,
  "stripePaymentIntentId" TEXT,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "paidAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "packageType" TEXT NOT NULL DEFAULT 'course_bundle',
  "pricingPackageId" TEXT,
  "pricingExperimentId" TEXT,
  "pricingVariantId" TEXT,

  CONSTRAINT "CourseBundlePurchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PricingExperiment_key_key" ON "PricingExperiment"("key");
CREATE INDEX "PricingExperiment_status_surface_idx" ON "PricingExperiment"("status", "surface");
CREATE INDEX "PricingExperiment_createdByUserId_idx" ON "PricingExperiment"("createdByUserId");
CREATE UNIQUE INDEX "PricingVariant_experimentId_key_key" ON "PricingVariant"("experimentId", "key");
CREATE INDEX "PricingVariant_experimentId_orderIndex_idx" ON "PricingVariant"("experimentId", "orderIndex");
CREATE UNIQUE INDEX "PricingExposure_experimentId_userId_key" ON "PricingExposure"("experimentId", "userId");
CREATE INDEX "PricingExposure_userId_createdAt_idx" ON "PricingExposure"("userId", "createdAt");
CREATE INDEX "PricingExposure_surface_createdAt_idx" ON "PricingExposure"("surface", "createdAt");
CREATE INDEX "PricingExposure_variantId_createdAt_idx" ON "PricingExposure"("variantId", "createdAt");
CREATE UNIQUE INDEX "AiCreditPack_key_key" ON "AiCreditPack"("key");
CREATE INDEX "AiCreditPack_status_displayOrder_idx" ON "AiCreditPack"("status", "displayOrder");
CREATE UNIQUE INDEX "AiCreditPurchase_stripeCheckoutSessionId_key" ON "AiCreditPurchase"("stripeCheckoutSessionId");
CREATE INDEX "AiCreditPurchase_userId_createdAt_idx" ON "AiCreditPurchase"("userId", "createdAt");
CREATE INDEX "AiCreditPurchase_aiCreditPackId_idx" ON "AiCreditPurchase"("aiCreditPackId");
CREATE INDEX "AiCreditLedgerEntry_userId_createdAt_idx" ON "AiCreditLedgerEntry"("userId", "createdAt");
CREATE INDEX "AiCreditLedgerEntry_purchaseId_idx" ON "AiCreditLedgerEntry"("purchaseId");
CREATE UNIQUE INDEX "CourseBundlePurchase_stripeCheckoutSessionId_key" ON "CourseBundlePurchase"("stripeCheckoutSessionId");
CREATE INDEX "CourseBundlePurchase_userId_idx" ON "CourseBundlePurchase"("userId");
CREATE INDEX "CourseBundlePurchase_bundleId_idx" ON "CourseBundlePurchase"("bundleId");

ALTER TABLE "PricingExperiment"
  ADD CONSTRAINT "PricingExperiment_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PricingVariant"
  ADD CONSTRAINT "PricingVariant_experimentId_fkey"
  FOREIGN KEY ("experimentId") REFERENCES "PricingExperiment"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PricingExposure"
  ADD CONSTRAINT "PricingExposure_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PricingExposure"
  ADD CONSTRAINT "PricingExposure_experimentId_fkey"
  FOREIGN KEY ("experimentId") REFERENCES "PricingExperiment"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PricingExposure"
  ADD CONSTRAINT "PricingExposure_variantId_fkey"
  FOREIGN KEY ("variantId") REFERENCES "PricingVariant"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AiCreditPurchase"
  ADD CONSTRAINT "AiCreditPurchase_aiCreditPackId_fkey"
  FOREIGN KEY ("aiCreditPackId") REFERENCES "AiCreditPack"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AiCreditPurchase"
  ADD CONSTRAINT "AiCreditPurchase_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AiCreditLedgerEntry"
  ADD CONSTRAINT "AiCreditLedgerEntry_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AiCreditLedgerEntry"
  ADD CONSTRAINT "AiCreditLedgerEntry_aiCreditPackId_fkey"
  FOREIGN KEY ("aiCreditPackId") REFERENCES "AiCreditPack"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AiCreditLedgerEntry"
  ADD CONSTRAINT "AiCreditLedgerEntry_purchaseId_fkey"
  FOREIGN KEY ("purchaseId") REFERENCES "AiCreditPurchase"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CourseBundlePurchase"
  ADD CONSTRAINT "CourseBundlePurchase_bundleId_fkey"
  FOREIGN KEY ("bundleId") REFERENCES "CourseBundle"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CourseBundlePurchase"
  ADD CONSTRAINT "CourseBundlePurchase_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
