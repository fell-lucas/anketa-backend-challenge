/*
  Warnings:

  - You are about to drop the column `media_public_id` on the `polls` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "polls" DROP CONSTRAINT "polls_media_public_id_fkey";

-- AlterTable
ALTER TABLE "polls" DROP COLUMN "media_public_id";

-- CreateTable
CREATE TABLE "_PollMedia" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PollMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PollMedia_B_index" ON "_PollMedia"("B");

-- AddForeignKey
ALTER TABLE "_PollMedia" ADD CONSTRAINT "_PollMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollMedia" ADD CONSTRAINT "_PollMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
