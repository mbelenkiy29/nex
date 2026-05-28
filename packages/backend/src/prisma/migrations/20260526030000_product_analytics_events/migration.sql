CREATE TABLE "ProductAnalyticsEvent" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "eventName" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "dedupeKey" TEXT,
  "userId" UUID,
  "memberId" UUID,
  "organizationId" UUID,
  "courseId" UUID,
  "lessonId" UUID,
  "subscriptionId" UUID,
  "coursePurchaseId" UUID,
  "stripeCheckoutSessionId" TEXT,
  "stripePriceId" TEXT,
  "accessType" TEXT,
  "ctaLocation" TEXT,
  "funnelId" TEXT,
  "sessionId" TEXT,
  "anonymousId" TEXT,
  "currentPath" TEXT,
  "referrerPath" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  CONSTRAINT "ProductAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductAnalyticsEvent_dedupeKey_key" ON "ProductAnalyticsEvent"("dedupeKey");
CREATE INDEX "ProductAnalyticsEvent_eventName_createdAt_idx" ON "ProductAnalyticsEvent"("eventName", "createdAt");
CREATE INDEX "ProductAnalyticsEvent_courseId_eventName_createdAt_idx" ON "ProductAnalyticsEvent"("courseId", "eventName", "createdAt");
CREATE INDEX "ProductAnalyticsEvent_userId_createdAt_idx" ON "ProductAnalyticsEvent"("userId", "createdAt");
CREATE INDEX "ProductAnalyticsEvent_funnelId_eventName_idx" ON "ProductAnalyticsEvent"("funnelId", "eventName");
CREATE INDEX "ProductAnalyticsEvent_stripeCheckoutSessionId_idx" ON "ProductAnalyticsEvent"("stripeCheckoutSessionId");
