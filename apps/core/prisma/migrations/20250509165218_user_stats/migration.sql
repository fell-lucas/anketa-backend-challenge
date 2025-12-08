/*
  Warnings:

  - You are about to drop the column `followees_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `followers_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_token_win` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `total_points` on the `users` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "user_stats" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" INTEGER NOT NULL DEFAULT 0,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "last_token_win" TIMESTAMP(3),
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "followees_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Copy data from users to user_stats
INSERT INTO "user_stats" ("id", "created_at", "updated_at", "points", "total_points", "last_token_win", "followers_count", "followees_count")
SELECT "id", "created_at", "updated_at", "points", "total_points", "last_token_win", "followers_count", "followees_count" FROM "users";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "followees_count",
DROP COLUMN "followers_count",
DROP COLUMN "last_token_win",
DROP COLUMN "points",
DROP COLUMN "total_points";