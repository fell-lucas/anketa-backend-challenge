/*
  Warnings:

  - A unique constraint covering the columns `[active_moderation_id]` on the table `reported_subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reported_subject" ADD COLUMN     "active_moderation_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "reported_subject_active_moderation_id_key" ON "reported_subject"("active_moderation_id");

-- AddForeignKey
ALTER TABLE "reported_subject" ADD CONSTRAINT "reported_subject_active_moderation_id_fkey" FOREIGN KEY ("active_moderation_id") REFERENCES "reported_subject_moderation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
