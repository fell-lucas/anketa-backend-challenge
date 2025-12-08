-- CreateTable
CREATE TABLE "ai_answer_summaries" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topics" TEXT[],
    "sentiment" TEXT NOT NULL,
    "extractedEntities" JSONB NOT NULL DEFAULT '[]',
    "poll_answer_id" UUID NOT NULL,
    "vote_id" UUID NOT NULL,

    CONSTRAINT "ai_answer_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_answer_summaries_poll_answer_id_vote_id_key" ON "ai_answer_summaries"("poll_answer_id", "vote_id");

-- AddForeignKey
ALTER TABLE "ai_answer_summaries" ADD CONSTRAINT "ai_answer_summaries_poll_answer_id_fkey" FOREIGN KEY ("poll_answer_id") REFERENCES "poll_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_answer_summaries" ADD CONSTRAINT "ai_answer_summaries_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
