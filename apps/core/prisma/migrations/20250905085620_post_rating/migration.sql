-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "rating_average" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_sum" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "post_ratings" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" SMALLINT NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,

    CONSTRAINT "post_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_ratings_post_id_idx" ON "post_ratings"("post_id");

-- CreateIndex
CREATE INDEX "post_ratings_user_id_idx" ON "post_ratings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_ratings_user_id_post_id_key" ON "post_ratings"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "post_ratings" ADD CONSTRAINT "post_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_ratings" ADD CONSTRAINT "post_ratings_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
