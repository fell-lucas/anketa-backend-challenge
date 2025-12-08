/*
  Warnings:

  - The `visibility` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "PostVisibility" NOT NULL DEFAULT 'PUBLIC';
