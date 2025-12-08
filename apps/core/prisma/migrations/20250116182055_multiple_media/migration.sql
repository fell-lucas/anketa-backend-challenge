/*
  Warnings:

  - You are about to drop the column `image_id` on the `poll_options` table. All the data in the column will be lost.
  - You are about to drop the column `video_id` on the `poll_options` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image_id` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `cover_video_id` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "poll_options" DROP CONSTRAINT "poll_options_image_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_options" DROP CONSTRAINT "poll_options_video_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_cover_image_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_cover_video_id_fkey";

-- AlterTable
ALTER TABLE "poll_options" DROP COLUMN "image_id",
DROP COLUMN "video_id";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "cover_image_id",
DROP COLUMN "cover_video_id";

-- CreateTable
CREATE TABLE "_PostMedia" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_PollOptionMedia" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostMedia_AB_unique" ON "_PostMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_PostMedia_B_index" ON "_PostMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PollOptionMedia_AB_unique" ON "_PollOptionMedia"("A", "B");

-- CreateIndex
CREATE INDEX "_PollOptionMedia_B_index" ON "_PollOptionMedia"("B");

-- AddForeignKey
ALTER TABLE "_PostMedia" ADD CONSTRAINT "_PostMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostMedia" ADD CONSTRAINT "_PostMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollOptionMedia" ADD CONSTRAINT "_PollOptionMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollOptionMedia" ADD CONSTRAINT "_PollOptionMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
