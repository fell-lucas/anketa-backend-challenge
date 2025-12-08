/*
  Warnings:

  - You are about to drop the column `ended_at` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "ended_at",
ADD COLUMN     "expires_at" TIMESTAMP(3);
