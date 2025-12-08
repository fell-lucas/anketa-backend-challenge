/*
  Warnings:

  - A unique constraint covering the columns `[platform_device_id]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "devices" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "devices_platform_device_id_key" ON "devices"("platform_device_id");
