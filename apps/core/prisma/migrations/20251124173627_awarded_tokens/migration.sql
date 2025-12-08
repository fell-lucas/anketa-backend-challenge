-- CreateTable
CREATE TABLE "user_awarded_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tokens" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_awarded_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_awarded_tokens_user_id_idx" ON "user_awarded_tokens"("user_id");

-- CreateIndex
CREATE INDEX "user_awarded_tokens_created_at_idx" ON "user_awarded_tokens"("created_at");

-- AddForeignKey
ALTER TABLE "user_awarded_tokens" ADD CONSTRAINT "user_awarded_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
