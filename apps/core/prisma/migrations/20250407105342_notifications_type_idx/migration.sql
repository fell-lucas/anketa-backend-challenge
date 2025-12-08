-- DropIndex
DROP INDEX "Notification_recipientId_isRead_idx";

-- CreateIndex
CREATE INDEX "Notification_recipientId_isRead_type_idx" ON "Notification"("recipientId", "isRead", "type");
