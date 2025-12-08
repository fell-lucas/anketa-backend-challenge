/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "media_public_id_key" ON "media"("public_id");
