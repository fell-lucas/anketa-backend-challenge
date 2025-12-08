-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "hidden_reason" TEXT;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "hidden_reason" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "suspension_reason" TEXT;
