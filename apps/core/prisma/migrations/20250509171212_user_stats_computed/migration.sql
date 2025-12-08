-- AlterTable
ALTER TABLE "user_stats" ADD COLUMN     "circles_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "draft_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "feed_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "liked_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "published_poll_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "published_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "published_survey_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "purchased_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reposted_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scheduled_posts_count" INTEGER NOT NULL DEFAULT 0;
