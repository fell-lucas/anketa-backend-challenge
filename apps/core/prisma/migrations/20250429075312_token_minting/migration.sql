-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_token_win" TIMESTAMP(3),
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TokenMinting" (
    "id" UUID NOT NULL,
    "winner_user_id" UUID,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenMinting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenMinting" ADD CONSTRAINT "TokenMinting_winner_user_id_fkey" FOREIGN KEY ("winner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
