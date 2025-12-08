-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "fcmSentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Notification_fcmSentAt_idx" ON "Notification"("fcmSentAt");
