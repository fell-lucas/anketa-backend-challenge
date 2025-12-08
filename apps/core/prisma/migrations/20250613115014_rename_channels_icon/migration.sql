/*
  Warnings:

  - You are about to drop the column `icon_url` on the `channels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "channels" DROP COLUMN "icon_url",
ADD COLUMN     "icon_public_id" TEXT;
