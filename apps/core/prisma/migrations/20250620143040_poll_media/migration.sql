-- AlterTable
ALTER TABLE "polls" ADD COLUMN     "media_public_id" TEXT;

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_media_public_id_fkey" FOREIGN KEY ("media_public_id") REFERENCES "media"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;
