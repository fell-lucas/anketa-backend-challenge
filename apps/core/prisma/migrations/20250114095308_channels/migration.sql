/*
  Warnings:

  - You are about to drop the column `is_active` on the `channels` table. All the data in the column will be lost.
  - Added the required column `is_enabled` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channels" DROP COLUMN "is_active",
ADD COLUMN     "icon_url" TEXT,
ADD COLUMN     "is_enabled" BOOLEAN NOT NULL,
ADD COLUMN     "parent_channel_id" UUID;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_parent_channel_id_fkey" FOREIGN KEY ("parent_channel_id") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
