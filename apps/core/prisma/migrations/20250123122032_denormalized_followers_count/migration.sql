-- AlterTable
ALTER TABLE "users" ADD COLUMN     "followees_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followers_count" INTEGER NOT NULL DEFAULT 0;
