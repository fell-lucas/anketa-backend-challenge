/*
  Warnings:

  - You are about to drop the column `activity_type_id` on the `UserActivityLog` table. All the data in the column will be lost.
  - The primary key for the `activity_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `activity_types` table. All the data in the column will be lost.
  - Added the required column `activity` to the `UserActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserActivityLog" DROP CONSTRAINT "UserActivityLog_activity_type_id_fkey";

-- DropIndex
DROP INDEX "activity_types_name_key";

-- AlterTable
ALTER TABLE "UserActivityLog" DROP COLUMN "activity_type_id",
ADD COLUMN     "activity" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "activity_types" DROP CONSTRAINT "activity_types_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "activity_types_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_activity_fkey" FOREIGN KEY ("activity") REFERENCES "activity_types"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
