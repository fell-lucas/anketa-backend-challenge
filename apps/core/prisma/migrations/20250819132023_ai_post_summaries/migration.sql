-- CreateTable
CREATE TABLE "ai_post_summaries" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topics" TEXT[],
    "sentiment" TEXT NOT NULL,
    "extractedEntities" JSONB NOT NULL DEFAULT '[]',
    "post_id" UUID NOT NULL,

    CONSTRAINT "ai_post_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_post_summaries_post_id_key" ON "ai_post_summaries"("post_id");

-- AddForeignKey
ALTER TABLE "ai_post_summaries" ADD CONSTRAINT "ai_post_summaries_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
