/*
  Warnings:

  - Added the required column `errors` to the `TokenMinting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenMinting" ADD COLUMN     "errors" JSONB NOT NULL;
