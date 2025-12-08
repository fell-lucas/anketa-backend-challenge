/*
  Warnings:

  - You are about to drop the column `image_url` on the `poll_options` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `poll_options` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image_url` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `cover_video_url` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "poll_options" DROP COLUMN "image_url",
DROP COLUMN "video_url",
ADD COLUMN     "image_id" TEXT,
ADD COLUMN     "video_id" TEXT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "cover_image_url",
DROP COLUMN "cover_video_url",
ADD COLUMN     "cover_image_id" TEXT,
ADD COLUMN     "cover_video_id" TEXT;

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "media"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "media"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_video_id_fkey" FOREIGN KEY ("cover_video_id") REFERENCES "media"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;
