-- AlterTable
ALTER TABLE "token_minting" ADD COLUMN     "details" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
