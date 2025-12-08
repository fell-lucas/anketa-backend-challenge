/*
  Warnings:

  - Changed the type of `question_type` on the `polls` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `answer_type` on the `polls` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multipleChoice', 'twoSided', 'openEnded', 'ranking');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('text', 'imageOrVideo', 'frequency', 'quality', 'agreement', 'familiarity', 'importance', 'satisfaction');

-- AlterTable
ALTER TABLE "polls" DROP COLUMN "question_type",
ADD COLUMN     "question_type" "QuestionType" NOT NULL,
DROP COLUMN "answer_type",
ADD COLUMN     "answer_type" "AnswerType" NOT NULL;
