/*
  Warnings:

  - A unique constraint covering the columns `[firebase_uid]` on the table `admins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admins_firebase_uid_key" ON "admins"("firebase_uid");
