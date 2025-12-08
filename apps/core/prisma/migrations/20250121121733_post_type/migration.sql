/*
  Warnings:

  - The `type` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('POLL', 'SURVEY');

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type",
ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'POLL';
