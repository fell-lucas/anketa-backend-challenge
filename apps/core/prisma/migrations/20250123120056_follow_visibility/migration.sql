/*
  Warnings:

  - The `privacy_vote_visibility` column on the `follows` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `privacy_tagging_visibility` column on the `follows` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FollowPrivacyVoteVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "FollowPrivacyTaggingVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "follows" DROP COLUMN "privacy_vote_visibility",
ADD COLUMN     "privacy_vote_visibility" "FollowPrivacyVoteVisibility" NOT NULL DEFAULT 'PUBLIC',
DROP COLUMN "privacy_tagging_visibility",
ADD COLUMN     "privacy_tagging_visibility" "FollowPrivacyTaggingVisibility" NOT NULL DEFAULT 'PUBLIC';
