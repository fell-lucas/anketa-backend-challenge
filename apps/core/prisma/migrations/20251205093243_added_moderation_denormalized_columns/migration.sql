/*
  Warnings:

  - A unique constraint covering the columns `[latest_moderation_action_id]` on the table `reported_subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reported_subject" ADD COLUMN     "latest_moderation_action_id" UUID,
ADD COLUMN     "reports_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "reported_subject_latest_moderation_action_id_key" ON "reported_subject"("latest_moderation_action_id");

-- AddForeignKey
ALTER TABLE "reported_subject" ADD CONSTRAINT "reported_subject_latest_moderation_action_id_fkey" FOREIGN KEY ("latest_moderation_action_id") REFERENCES "moderation_action"("id") ON DELETE SET NULL ON UPDATE CASCADE;
