-- AlterTable
ALTER TABLE "user_stats" ADD COLUMN     "bookmarked_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "voted_posts_count" INTEGER NOT NULL DEFAULT 0;
