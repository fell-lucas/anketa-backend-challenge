-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'single';

-- CreateTable
CREATE TABLE "poll_results" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "option_ids" TEXT[],
    "poll_id" UUID NOT NULL,

    CONSTRAINT "poll_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "poll_results_poll_id_option_ids_key" ON "poll_results"("poll_id", "option_ids");

-- AddForeignKey
ALTER TABLE "poll_results" ADD CONSTRAINT "poll_results_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
