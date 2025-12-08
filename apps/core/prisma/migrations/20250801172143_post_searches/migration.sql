-- CreateTable
CREATE TABLE "post_searches" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "search_query" VARCHAR(255) NOT NULL,
    "search_filters" JSON NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_searches_user_id_idx" ON "post_searches"("user_id");

-- AddForeignKey
ALTER TABLE "post_searches" ADD CONSTRAINT "post_searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
