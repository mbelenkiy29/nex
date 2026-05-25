ALTER TABLE "Course" ADD COLUMN "certificateEnabled" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "CourseWishlist" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "name" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "userId" UUID NOT NULL,

  CONSTRAINT "CourseWishlist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseWishlistItem" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "userId" UUID NOT NULL,
  "wishlistId" UUID NOT NULL,
  "courseId" UUID NOT NULL,

  CONSTRAINT "CourseWishlistItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseBundle" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail" JSONB,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "priceCents" INTEGER,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "stripePriceId" TEXT,
  "creatorUserId" UUID,
  "creatorMemberId" UUID,
  "publishedAt" TIMESTAMPTZ(3),

  CONSTRAINT "CourseBundle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseBundleCourse" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "bundleId" UUID NOT NULL,
  "courseId" UUID NOT NULL,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "CourseBundleCourse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseCoupon" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "discountType" TEXT NOT NULL,
  "percentOff" INTEGER,
  "amountOffCents" INTEGER,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "startsAt" TIMESTAMPTZ(3),
  "endsAt" TIMESTAMPTZ(3),
  "maxRedemptions" INTEGER,
  "maxRedemptionsPerUser" INTEGER NOT NULL DEFAULT 1,
  "redeemedCount" INTEGER NOT NULL DEFAULT 0,
  "courseId" UUID,
  "bundleId" UUID,
  "creatorUserId" UUID,

  CONSTRAINT "CourseCoupon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseCouponRedemption" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "couponId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "courseId" UUID,
  "bundleId" UUID,
  "purchaseId" UUID,
  "discountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',

  CONSTRAINT "CourseCouponRedemption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseCertificate" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "courseId" UUID NOT NULL,
  "enrollmentId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "certificateNumber" TEXT NOT NULL,
  "verificationCode" TEXT NOT NULL,
  "issuedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMPTZ(3),
  "artifactUrl" TEXT,
  "metadata" JSONB,

  CONSTRAINT "CourseCertificate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CourseWishlist_userId_name_key" ON "CourseWishlist"("userId", "name");
CREATE INDEX "CourseWishlist_userId_idx" ON "CourseWishlist"("userId");
CREATE INDEX "CourseWishlist_userId_isDefault_idx" ON "CourseWishlist"("userId", "isDefault");

CREATE UNIQUE INDEX "CourseWishlistItem_wishlistId_courseId_key" ON "CourseWishlistItem"("wishlistId", "courseId");
CREATE INDEX "CourseWishlistItem_userId_idx" ON "CourseWishlistItem"("userId");
CREATE INDEX "CourseWishlistItem_courseId_idx" ON "CourseWishlistItem"("courseId");

CREATE UNIQUE INDEX "CourseBundle_slug_key" ON "CourseBundle"("slug");
CREATE INDEX "CourseBundle_status_idx" ON "CourseBundle"("status");
CREATE INDEX "CourseBundle_creatorUserId_idx" ON "CourseBundle"("creatorUserId");
CREATE INDEX "CourseBundle_publishedAt_idx" ON "CourseBundle"("publishedAt");

CREATE UNIQUE INDEX "CourseBundleCourse_bundleId_courseId_key" ON "CourseBundleCourse"("bundleId", "courseId");
CREATE INDEX "CourseBundleCourse_courseId_idx" ON "CourseBundleCourse"("courseId");

CREATE UNIQUE INDEX "CourseCoupon_code_key" ON "CourseCoupon"("code");
CREATE INDEX "CourseCoupon_courseId_idx" ON "CourseCoupon"("courseId");
CREATE INDEX "CourseCoupon_bundleId_idx" ON "CourseCoupon"("bundleId");
CREATE INDEX "CourseCoupon_creatorUserId_idx" ON "CourseCoupon"("creatorUserId");
CREATE INDEX "CourseCoupon_status_idx" ON "CourseCoupon"("status");

CREATE INDEX "CourseCouponRedemption_couponId_idx" ON "CourseCouponRedemption"("couponId");
CREATE INDEX "CourseCouponRedemption_userId_idx" ON "CourseCouponRedemption"("userId");
CREATE INDEX "CourseCouponRedemption_courseId_idx" ON "CourseCouponRedemption"("courseId");
CREATE INDEX "CourseCouponRedemption_bundleId_idx" ON "CourseCouponRedemption"("bundleId");

CREATE UNIQUE INDEX "CourseCertificate_enrollmentId_key" ON "CourseCertificate"("enrollmentId");
CREATE UNIQUE INDEX "CourseCertificate_certificateNumber_key" ON "CourseCertificate"("certificateNumber");
CREATE UNIQUE INDEX "CourseCertificate_verificationCode_key" ON "CourseCertificate"("verificationCode");
CREATE INDEX "CourseCertificate_courseId_idx" ON "CourseCertificate"("courseId");
CREATE INDEX "CourseCertificate_userId_idx" ON "CourseCertificate"("userId");
CREATE INDEX "CourseCertificate_issuedAt_idx" ON "CourseCertificate"("issuedAt");

ALTER TABLE "CourseWishlist" ADD CONSTRAINT "CourseWishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseWishlistItem" ADD CONSTRAINT "CourseWishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseWishlistItem" ADD CONSTRAINT "CourseWishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "CourseWishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseWishlistItem" ADD CONSTRAINT "CourseWishlistItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseBundle" ADD CONSTRAINT "CourseBundle_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseBundleCourse" ADD CONSTRAINT "CourseBundleCourse_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "CourseBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseBundleCourse" ADD CONSTRAINT "CourseBundleCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CourseCoupon" ADD CONSTRAINT "CourseCoupon_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseCoupon" ADD CONSTRAINT "CourseCoupon_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "CourseBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseCoupon" ADD CONSTRAINT "CourseCoupon_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseCouponRedemption" ADD CONSTRAINT "CourseCouponRedemption_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "CourseCoupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseCouponRedemption" ADD CONSTRAINT "CourseCouponRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseCouponRedemption" ADD CONSTRAINT "CourseCouponRedemption_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseCouponRedemption" ADD CONSTRAINT "CourseCouponRedemption_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "CourseBundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseCouponRedemption" ADD CONSTRAINT "CourseCouponRedemption_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "CoursePurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseCertificate" ADD CONSTRAINT "CourseCertificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseCertificate" ADD CONSTRAINT "CourseCertificate_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "CourseEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseCertificate" ADD CONSTRAINT "CourseCertificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
