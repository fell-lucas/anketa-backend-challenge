/*
  Warnings:

  - You are about to drop the column `winner_user_id` on the `TokenMinting` table. All the data in the column will be lost.
  - Added the required column `winners` to the `TokenMinting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TokenMinting" DROP CONSTRAINT "TokenMinting_winner_user_id_fkey";

-- AlterTable
ALTER TABLE "TokenMinting" DROP COLUMN "winner_user_id",
ADD COLUMN     "winners" JSONB NOT NULL;
