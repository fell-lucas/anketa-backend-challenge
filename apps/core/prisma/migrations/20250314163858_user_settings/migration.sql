/*
  Warnings:

  - You are about to drop the column `privacy_tagging_visibility` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the column `privacy_vote_visibility` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SettingsVisibilityEnum" AS ENUM ('EVERYONE', 'FOLLOWERS', 'NONE');

-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_user_id_fkey";

-- AlterTable
ALTER TABLE "follows" DROP COLUMN "privacy_tagging_visibility",
DROP COLUMN "privacy_vote_visibility";

-- DropTable
DROP TABLE "settings";

-- DropEnum
DROP TYPE "FollowPrivacyTaggingVisibility";

-- DropEnum
DROP TYPE "FollowPrivacyVoteVisibility";

-- CreateTable
CREATE TABLE "user_settings" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "who_can_see_votes_on_my_posts" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_see_likes_on_my_posts" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_see_comments_on_my_posts" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_tag_me_in_posts" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_tag_me_in_comments" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_message_me" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_see_my_followers" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "who_can_see_my_followees" "SettingsVisibilityEnum" NOT NULL DEFAULT 'EVERYONE',
    "email_notifications" JSONB NOT NULL DEFAULT '{ "list": [] }',
    "push_notifications" JSONB NOT NULL DEFAULT '{ "list": [] }',
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
