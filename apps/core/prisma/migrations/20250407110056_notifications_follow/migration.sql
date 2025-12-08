-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "followId" UUID;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followId_fkey" FOREIGN KEY ("followId") REFERENCES "follows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
