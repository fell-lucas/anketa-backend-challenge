-- AlterTable
ALTER TABLE "polls" ADD COLUMN     "answer_character_limit" INTEGER,
ADD COLUMN     "answer_suggestion" TEXT,
ADD COLUMN     "answers_count" INTEGER DEFAULT 0;
