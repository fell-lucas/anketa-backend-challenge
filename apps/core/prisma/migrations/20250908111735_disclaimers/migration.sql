-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "disclaimers" JSONB NOT NULL DEFAULT '{}';
