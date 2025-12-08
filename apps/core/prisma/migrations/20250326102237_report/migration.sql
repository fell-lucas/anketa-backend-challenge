/*
  Warnings:

  - The values [SPAM,HARASSMENT,SELF_HARM] on the enum `PostReportType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `platform_variables` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostReportType_new" AS ENUM ('flagAsSensitive', 'spam', 'nudity', 'minorSafety', 'bullyingAndHarassment', 'violentAndGraphicContent', 'illegalActivities', 'hateSpeech', 'falseInformation', 'suicideEatingDisorderSelfHarm', 'others');
ALTER TABLE "post_reports" ALTER COLUMN "type" TYPE "PostReportType_new" USING ("type"::text::"PostReportType_new");
ALTER TYPE "PostReportType" RENAME TO "PostReportType_old";
ALTER TYPE "PostReportType_new" RENAME TO "PostReportType";
DROP TYPE "PostReportType_old";
COMMIT;

-- AlterTable
ALTER TABLE "post_reports" ALTER COLUMN "message" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "platform_variables_name_key" ON "platform_variables"("name");
