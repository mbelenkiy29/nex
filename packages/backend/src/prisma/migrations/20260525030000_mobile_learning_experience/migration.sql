CREATE TABLE "CourseLearningSession" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "memberId" UUID,
    "lessonId" UUID,
    "practiceAttemptId" UUID,
    "lastRoute" TEXT,
    "lastPositionSeconds" INTEGER,
    "lastScrollPercent" INTEGER,
    "lastActivityAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceType" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "CourseLearningSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentReminderPreference" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "userId" UUID NOT NULL,
    "courseId" UUID,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "channels" TEXT[] NOT NULL DEFAULT ARRAY['mobilePush']::TEXT[],
    "smartRemindersEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudentReminderPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentReminderDelivery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "reminderType" TEXT NOT NULL,
    "deliveryKey" TEXT NOT NULL,
    "sentAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentReminderDelivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CourseLearningSession_courseId_userId_key" ON "CourseLearningSession"("courseId", "userId");
CREATE INDEX "CourseLearningSession_userId_lastActivityAt_idx" ON "CourseLearningSession"("userId", "lastActivityAt");
CREATE INDEX "CourseLearningSession_lessonId_idx" ON "CourseLearningSession"("lessonId");
CREATE INDEX "CourseLearningSession_practiceAttemptId_idx" ON "CourseLearningSession"("practiceAttemptId");

CREATE UNIQUE INDEX "StudentReminderPreference_userId_courseId_key" ON "StudentReminderPreference"("userId", "courseId");
CREATE INDEX "StudentReminderPreference_userId_idx" ON "StudentReminderPreference"("userId");
CREATE INDEX "StudentReminderPreference_courseId_idx" ON "StudentReminderPreference"("courseId");
CREATE INDEX "StudentReminderPreference_enabled_idx" ON "StudentReminderPreference"("enabled");

CREATE UNIQUE INDEX "StudentReminderDelivery_deliveryKey_key" ON "StudentReminderDelivery"("deliveryKey");
CREATE INDEX "StudentReminderDelivery_userId_createdAt_idx" ON "StudentReminderDelivery"("userId", "createdAt");
CREATE INDEX "StudentReminderDelivery_courseId_reminderType_idx" ON "StudentReminderDelivery"("courseId", "reminderType");
CREATE INDEX "StudentReminderDelivery_reminderType_idx" ON "StudentReminderDelivery"("reminderType");

ALTER TABLE "CourseLearningSession" ADD CONSTRAINT "CourseLearningSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseLearningSession" ADD CONSTRAINT "CourseLearningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseLearningSession" ADD CONSTRAINT "CourseLearningSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "CourseLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseLearningSession" ADD CONSTRAINT "CourseLearningSession_practiceAttemptId_fkey" FOREIGN KEY ("practiceAttemptId") REFERENCES "CoursePracticeAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StudentReminderPreference" ADD CONSTRAINT "StudentReminderPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentReminderPreference" ADD CONSTRAINT "StudentReminderPreference_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StudentReminderDelivery" ADD CONSTRAINT "StudentReminderDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentReminderDelivery" ADD CONSTRAINT "StudentReminderDelivery_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
