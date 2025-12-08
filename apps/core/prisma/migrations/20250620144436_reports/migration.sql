/*
  Warnings:

  - You are about to drop the `post_reports` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReportEntityType" AS ENUM ('POST', 'COMMENT', 'USER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'reviewed', 'resolved');

-- CreateEnum
CREATE TYPE "ReportActionTaken" AS ENUM ('noAction', 'postDeleted', 'userWarned', 'userBanned', 'userDeleted');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('flagAsSensitive', 'spam', 'nudity', 'minorSafety', 'bullyingAndHarassment', 'violentAndGraphicContent', 'illegalActivities', 'hateSpeech', 'falseInformation', 'suicideEatingDisorderSelfHarm', 'others');

-- DropForeignKey
ALTER TABLE "post_reports" DROP CONSTRAINT "post_reports_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_reports" DROP CONSTRAINT "post_reports_reviewed_by_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "post_reports" DROP CONSTRAINT "post_reports_user_id_fkey";

-- DropTable
DROP TABLE "post_reports";

-- DropEnum
DROP TYPE "PostActionTaken";

-- DropEnum
DROP TYPE "PostReportStatus";

-- DropEnum
DROP TYPE "PostReportType";

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ReportType" NOT NULL,
    "entityType" "ReportEntityType" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "action_taken" "ReportActionTaken" NOT NULL DEFAULT 'noAction',
    "admin_notes" TEXT,
    "message" TEXT,
    "user_id" UUID NOT NULL,
    "post_id" UUID,
    "comment_id" UUID,
    "reviewed_by_admin_id" UUID,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_admin_id_fkey" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
