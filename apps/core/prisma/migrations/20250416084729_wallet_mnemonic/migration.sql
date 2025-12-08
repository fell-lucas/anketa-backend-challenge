/*
  Warnings:

  - Added the required column `mnemonic` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "mnemonic" TEXT NOT NULL;
