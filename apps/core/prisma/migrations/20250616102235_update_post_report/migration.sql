-- CreateEnum
CREATE TYPE "PostReportStatus" AS ENUM ('pending', 'reviewed', 'resolved');

-- CreateEnum
CREATE TYPE "PostActionTaken" AS ENUM ('noAction', 'postDeleted', 'userWarned', 'userBanned', 'userDeleted');

-- AlterTable
ALTER TABLE "post_reports" ADD COLUMN     "action_taken" "PostActionTaken" NOT NULL DEFAULT 'noAction',
ADD COLUMN     "admin_notes" TEXT,
ADD COLUMN     "reviewed_by_admin_id" UUID,
ADD COLUMN     "status" "PostReportStatus" NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_reviewed_by_admin_id_fkey" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
