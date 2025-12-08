/*
  Warnings:

  - You are about to drop the `TokenMinting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserActivityLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `channels_points` to the `activity_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserActivityLog" DROP CONSTRAINT "UserActivityLog_activity_fkey";

-- DropForeignKey
ALTER TABLE "UserActivityLog" DROP CONSTRAINT "UserActivityLog_user_id_fkey";

-- AlterTable
ALTER TABLE "activity_types" ADD COLUMN     "channels_points" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_stats" ADD COLUMN     "channels_points" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "TokenMinting";

-- DropTable
DROP TABLE "UserActivityLog";

-- CreateTable
CREATE TABLE "user_activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "entity_id" TEXT,
    "activity" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "channels_points" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_minting" (
    "id" UUID NOT NULL,
    "winners" JSONB NOT NULL,
    "errors" JSONB NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_minting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_activity_fkey" FOREIGN KEY ("activity") REFERENCES "activity_types"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
