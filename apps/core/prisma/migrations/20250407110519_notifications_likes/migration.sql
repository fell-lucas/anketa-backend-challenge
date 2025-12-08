-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "likeId" UUID;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "likes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
