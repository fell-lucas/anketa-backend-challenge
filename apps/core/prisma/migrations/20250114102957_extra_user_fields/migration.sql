/*
  Warnings:

  - You are about to drop the column `profile_picture_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_picture_url",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "profile_picture_public_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_picture_public_id_fkey" FOREIGN KEY ("profile_picture_public_id") REFERENCES "media"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;
