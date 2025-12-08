/*
  Warnings:

  - You are about to drop the column `action_taken` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `admin_notes` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `comment_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `reported_user_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_by_admin_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reported_subject_id` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportedSubjectModerationStatus" AS ENUM ('PENDING_REVIEW', 'PENDING_APPEAL', 'ESCALATED', 'UNDER_REVIEW', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ModerationActionType" AS ENUM ('ESCALATE', 'MARK_AS_SENSITIVE', 'MARK_AS_NOT_SENSITIVE', 'DISMISS', 'SUSPEND_REPORTED_SUBJECT', 'SUSPEND_USER', 'UNSUSPEND_REPORTED_SUBJECT', 'UNSUSPEND_USER', 'REOPEN');

-- CreateEnum
CREATE TYPE "ModerationSuspensionLevel" AS ENUM ('WARNING', 'TEMPORARY_1_DAY', 'TEMPORARY_2_DAYS', 'TEMPORARY_7_DAYS', 'PERMANENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReportedSubjectType" AS ENUM ('USER', 'POST', 'COMMENT');

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_post_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_reported_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_reviewed_by_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_user_id_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "action_taken",
DROP COLUMN "admin_notes",
DROP COLUMN "comment_id",
DROP COLUMN "entityType",
DROP COLUMN "post_id",
DROP COLUMN "reported_user_id",
DROP COLUMN "reviewed_by_admin_id",
DROP COLUMN "status",
ADD COLUMN     "admin_id" UUID,
ADD COLUMN     "has_been_reviewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reported_subject_id" UUID NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- DropTable
DROP TABLE "Test";

-- DropEnum
DROP TYPE "ReportActionTaken";

-- DropEnum
DROP TYPE "ReportEntityType";

-- DropEnum
DROP TYPE "ReportStatus";

-- CreateTable
CREATE TABLE "reported_subject_moderation" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reported_subject_id" UUID NOT NULL,
    "moderator_id" UUID NOT NULL,

    CONSTRAINT "reported_subject_moderation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_action" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ModerationActionType" NOT NULL,
    "reason" TEXT,
    "is_edit" BOOLEAN NOT NULL DEFAULT false,
    "reported_subject_id" UUID NOT NULL,
    "moderation_id" UUID NOT NULL,
    "violation_category" TEXT,
    "violation_subcategory" TEXT,
    "suspension_level" "ModerationSuspensionLevel",
    "notes" TEXT,
    "suspension_starts_at" TIMESTAMP(3),
    "suspension_ends_at" TIMESTAMP(3),

    CONSTRAINT "moderation_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reported_subject" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ReportedSubjectType" NOT NULL,
    "moderation_status" "ReportedSubjectModerationStatus" NOT NULL,
    "user_id" UUID,
    "post_id" UUID,
    "comment_id" UUID,

    CONSTRAINT "reported_subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reported_subject_moderation_reported_subject_id_moderator_i_key" ON "reported_subject_moderation"("reported_subject_id", "moderator_id");

-- CreateIndex
CREATE INDEX "reports_reported_subject_id_idx" ON "reports"("reported_subject_id");

-- AddForeignKey
ALTER TABLE "reported_subject_moderation" ADD CONSTRAINT "reported_subject_moderation_reported_subject_id_fkey" FOREIGN KEY ("reported_subject_id") REFERENCES "reported_subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reported_subject_moderation" ADD CONSTRAINT "reported_subject_moderation_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_action" ADD CONSTRAINT "moderation_action_reported_subject_id_fkey" FOREIGN KEY ("reported_subject_id") REFERENCES "reported_subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_action" ADD CONSTRAINT "moderation_action_moderation_id_fkey" FOREIGN KEY ("moderation_id") REFERENCES "reported_subject_moderation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reported_subject" ADD CONSTRAINT "reported_subject_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reported_subject" ADD CONSTRAINT "reported_subject_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reported_subject" ADD CONSTRAINT "reported_subject_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_subject_id_fkey" FOREIGN KEY ("reported_subject_id") REFERENCES "reported_subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
