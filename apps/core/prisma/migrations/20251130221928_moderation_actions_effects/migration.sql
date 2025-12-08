-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "hidden_at" TIMESTAMP(3),
ADD COLUMN     "hidden_until" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "hidden_at" TIMESTAMP(3),
ADD COLUMN     "hidden_until" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "suspended_at" TIMESTAMP(3),
ADD COLUMN     "suspended_until" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "comments_hidden_at_idx" ON "comments"("hidden_at");

-- CreateIndex
CREATE INDEX "posts_hidden_at_idx" ON "posts"("hidden_at");

-- CreateIndex
CREATE INDEX "users_suspended_at_idx" ON "users"("suspended_at");
